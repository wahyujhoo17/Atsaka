import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const isProduction = process.env.NODE_ENV === "production";

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Only accept images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Middleware
app.use(
  cors({
    origin: isProduction
      ? process.env.FRONTEND_URL || "*"
      : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Auth Middleware
const authenticateToken = (req: any, res: Response, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is running" });
});

// ============= AUTH ENDPOINTS =============

// Admin Login
app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Return user data without password
    res.json({
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Verify Token
app.get("/api/auth/me", authenticateToken, async (req: any, res: Response) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!admin) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(admin);
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ error: "Failed to verify token" });
  }
});

// Change Password
app.post(
  "/api/auth/change-password",
  authenticateToken,
  async (req: any, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .json({ error: "Old and new password are required" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });
      }

      // Get admin
      const admin = await prisma.admin.findUnique({
        where: { id: req.user.id },
      });

      if (!admin) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify old password
      const isValidPassword = await bcrypt.compare(oldPassword, admin.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: "Old password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await prisma.admin.update({
        where: { id: req.user.id },
        data: { password: hashedPassword },
      });

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  },
);

// ============= IMAGE UPLOAD ENDPOINT =============

// Upload single image with auto-compress
app.post(
  "/api/upload",
  authenticateToken,
  upload.single("image"),
  async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const filepath = path.join(uploadsDir, filename);

      // Compress image to max 200KB using sharp
      let quality = 80;
      let compressed;

      // Try different quality levels until file size <= 200KB
      do {
        compressed = await sharp(req.file.buffer)
          .resize(1200, 1200, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality })
          .toBuffer();

        if (compressed.length <= 200 * 1024) {
          break;
        }

        quality -= 10;
      } while (quality > 20);

      // Save compressed image
      await fs.promises.writeFile(filepath, compressed);

      const imageUrl = `/uploads/${filename}`;
      const fileSize = Math.round(compressed.length / 1024); // KB

      res.json({
        success: true,
        url: imageUrl,
        filename,
        size: fileSize,
        message: `Image uploaded and compressed to ${fileSize}KB`,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  },
);

// Delete uploaded image
app.delete(
  "/api/upload/:filename",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { filename } = req.params;
      const filepath = path.join(uploadsDir, filename);

      if (fs.existsSync(filepath)) {
        await fs.promises.unlink(filepath);
        res.json({ message: "Image deleted successfully" });
      } else {
        res.status(404).json({ error: "Image not found" });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  },
);

// ============= PRODUCTS ENDPOINTS =============

// Get all products
app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    const products = await prisma.product.findMany({
      where: {
        ...(category && { category: category as string }),
        ...(search && {
          OR: [
            { name: { contains: search as string, mode: "insensitive" } },
            {
              description: { contains: search as string, mode: "insensitive" },
            },
          ],
        }),
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by slug
app.get("/api/products/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Create product
app.post("/api/products", async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.create({
      data: req.body,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update product
app.put("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product
app.delete("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// ============= CATEGORIES ENDPOINTS =============

// Get all categories
app.get("/api/categories", async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: true,
        parent: true,
      },
      orderBy: { name: "asc" },
    });

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Get category by slug
app.get("/api/categories/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        parent: true,
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// Create category
app.post("/api/categories", async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.create({
      data: req.body,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

// Delete category
app.delete("/api/categories/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category has children
    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });

    if (category?.children && category.children.length > 0) {
      return res.status(400).json({
        error: "Tidak dapat menghapus category yang memiliki sub-category",
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// ============= GALLERY ENDPOINTS =============

// Get all gallery items
app.get("/api/gallery", async (req: Request, res: Response) => {
  try {
    const { type, category } = req.query;

    const gallery = await prisma.gallery.findMany({
      where: {
        ...(type && { type: type as string }),
        ...(category && { categories: { has: category as string } }),
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(gallery);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

// Create gallery item
app.post("/api/gallery", async (req: Request, res: Response) => {
  try {
    const gallery = await prisma.gallery.create({
      data: req.body,
    });

    res.status(201).json(gallery);
  } catch (error) {
    console.error("Error creating gallery item:", error);
    res.status(500).json({ error: "Failed to create gallery item" });
  }
});

// Update gallery item
app.put("/api/gallery/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const gallery = await prisma.gallery.update({
      where: { id },
      data: req.body,
    });

    res.json(gallery);
  } catch (error) {
    console.error("Error updating gallery item:", error);
    res.status(500).json({ error: "Failed to update gallery item" });
  }
});

// Delete gallery item
app.delete("/api/gallery/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.gallery.delete({
      where: { id },
    });

    res.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    res.status(500).json({ error: "Failed to delete gallery item" });
  }
});

// Serve static files in production
if (isProduction) {
  // Serve static files from dist folder
  app.use(express.static(path.join(__dirname, "../dist")));

  // Handle client-side routing - return index.html for all non-API routes
  app.use((req: Request, res: Response, next) => {
    // Skip API routes
    if (req.path.startsWith("/api")) {
      return next();
    }
    // Serve index.html for all other routes (SPA routing)
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Mode: ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}`);
  if (isProduction) {
    console.log(`🌐 Serving static files from dist/`);
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
