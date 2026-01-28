const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Auth
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();
    // Save token to localStorage
    localStorage.setItem("auth_token", data.token);
    return data;
  },

  async verifyToken() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Invalid token");
    }

    return response.json();
  },

  async changePassword(oldPassword: string, newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to change password");
    }

    return response.json();
  },

  logout() {
    localStorage.removeItem("auth_token");
  },
  // Products
  async getProducts(params?: { category?: string; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.search) queryParams.append("search", params.search);

    const url = `${API_BASE_URL}/products${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  },

  async getProductBySlug(slug: string) {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`);

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return response.json();
  },

  async createProduct(data: any) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    return response.json();
  },

  async updateProduct(id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    return response.json();
  },

  async deleteProduct(id: string) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    return response.json();
  },

  // Categories
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return response.json();
  },

  async getCategoryBySlug(slug: string) {
    const response = await fetch(`${API_BASE_URL}/categories/${slug}`);

    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }

    return response.json();
  },

  async createCategory(data: any) {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create category");
    }

    return response.json();
  },

  async deleteCategory(id: string) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete category");
    }

    return response.json();
  },

  // Gallery
  async getGallery(params?: { type?: string; category?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append("type", params.type);
    if (params?.category) queryParams.append("category", params.category);

    const url = `${API_BASE_URL}/gallery${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch gallery");
    }

    return response.json();
  },

  async createGalleryItem(data: any) {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create gallery item");
    }

    return response.json();
  },

  async deleteGalleryItem(id: string) {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete gallery item");
    }

    return response.json();
  },

  async updateGalleryItem(id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update gallery item");
    }

    return response.json();
  },

  // Image Upload
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload image");
    }

    return response.json();
  },

  async deleteImage(filename: string) {
    const response = await fetch(`${API_BASE_URL}/upload/${filename}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete image");
    }

    return response.json();
  },
};
