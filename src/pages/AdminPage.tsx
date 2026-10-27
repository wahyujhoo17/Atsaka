import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { galleryCategories } from "../data/galleryCategories";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast, { Toaster } from "react-hot-toast";
import {
  LogOut,
  Package,
  Tag,
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Upload,
  Loader,
  FileText,
  Home,
} from "lucide-react";
import HomepageEditor from "../components/admin/HomepageEditor";
import SpecGroupsEditor from "../components/admin/SpecGroupsEditor";
import ProductDetailsEditor from "../components/admin/ProductDetailsEditor";
import { cleanSpecGroups, toSpecGroups } from "../lib/specGroups";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  features: string[];
  imageUrl: string;
  imageUrls: string[];
  specifications: any;
  subtitle?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  parentId?: string | null;
  parent?: Category;
  children?: Category[];
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  type: string;
  url?: string;
  imageUrl?: string;
  categories: string[];
}

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  category: string;
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "homepage" | "products" | "categories" | "gallery" | "articles"
  >("homepage");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [featureInput, setFeatureInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [selectCategoryValue, setSelectCategoryValue] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMultiple, setUploadingMultiple] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/sn-admin/login");
      return;
    }
    // Fetch categories first for product dropdown
    fetchCategories();
    fetchData();
  }, [navigate, activeTab]);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchData = async () => {
    // The homepage editor loads its own content
    if (activeTab === "homepage") {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      if (activeTab === "products") {
        const data = await api.getProducts();
        setProducts(data);
      } else if (activeTab === "categories") {
        const data = await api.getCategories();
        setCategories(data);
      } else if (activeTab === "gallery") {
        const data = await api.getGallery();
        // Normalize categories for backward compatibility
        const normalized = (data || []).map((item: any) => ({
          ...item,
          categories: item.categories
            ? item.categories
            : item.category
              ? [item.category]
              : [],
        }));
        setGallery(normalized);
      } else if (activeTab === "articles") {
        const data = await api.getArticles();
        setArticles(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate("/sn-admin/login");
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFeatureInput("");
    setImageUrlInput("");
    if (activeTab === "products") {
      setFormData({
        name: "",
        slug: "",
        category: "",
        description: "",
        features: [],
        imageUrl: "",
        imageUrls: [],
        specifications: [{ title: "", items: [{ label: "", value: "" }] }],
        subtitle: "",
        details: {},
      });
    } else if (activeTab === "categories") {
      setFormData({
        name: "",
        slug: "",
        description: "",
        imageUrl: "",
        parentId: null,
      });
    } else if (activeTab === "gallery") {
      setFormData({
        title: "",
        description: "",
        type: "image",
        url: "",
        imageUrl: "",
        categories:
          galleryCategories && galleryCategories.length > 0
            ? [galleryCategories[0].slug]
            : ["general"],
      });
    } else if (activeTab === "articles") {
      setFormData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        imageUrl: "",
        author: "Admin",
        category: "Umum",
      });
    }
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    
    if (activeTab === "gallery") {
      const normalizedCategories = item.categories
        ? item.categories
        : item.category
          ? [item.category]
          : [];
      setFormData({ ...item, categories: normalizedCategories });
    } else if (activeTab === "products") {
      // Hanya ambil field yang sesuai dengan skema Product
      const { categories, ...productData } = item;
      setFormData({ ...productData, specifications: toSpecGroups(productData.specifications) });
    } else {
      // Untuk categories, langsung copy item
      setFormData({ ...item });
    }
    
    setFeatureInput("");
    setImageUrlInput("");
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;

    try {
      // Helper function to extract filename from URL
      const extractFilename = (url: string): string | null => {
        if (!url || !url.includes("/uploads/")) return null;
        const parts = url.split("/uploads/");
        return parts.length > 1 ? parts[1] : null;
      };

      // Delete associated images from storage before deleting the item
      if (activeTab === "products") {
        const product = products.find((p) => p.id === id);
        if (product) {
          // Delete main image
          if (product.imageUrl) {
            const filename = extractFilename(product.imageUrl);
            if (filename) {
              try {
                await api.deleteImage(filename);
              } catch (err) {
                console.warn("Failed to delete main image:", err);
              }
            }
          }
          // Delete additional images
          if (product.imageUrls && Array.isArray(product.imageUrls)) {
            for (const url of product.imageUrls) {
              const filename = extractFilename(url);
              if (filename) {
                try {
                  await api.deleteImage(filename);
                } catch (err) {
                  console.warn("Failed to delete additional image:", err);
                }
              }
            }
          }
        }
        await api.deleteProduct(id);
      } else if (activeTab === "categories") {
        const category = categories.find((c) => c.id === id);
        if (category?.imageUrl) {
          const filename = extractFilename(category.imageUrl);
          if (filename) {
            try {
              await api.deleteImage(filename);
            } catch (err) {
              console.warn("Failed to delete category image:", err);
            }
          }
        }
        await api.deleteCategory(id);
      } else if (activeTab === "gallery") {
        const item = gallery.find((g) => g.id === id);
        if (item?.imageUrl) {
          const filename = extractFilename(item.imageUrl);
          if (filename) {
            try {
              await api.deleteImage(filename);
            } catch (err) {
              console.warn("Failed to delete gallery image:", err);
            }
          }
        }
        await api.deleteGalleryItem(id);
      } else if (activeTab === "articles") {
        const item = articles.find((a) => a.id === id);
        if (item?.imageUrl) {
          const filename = extractFilename(item.imageUrl);
          if (filename) {
            try {
              await api.deleteImage(filename);
            } catch (err) {
              console.warn("Failed to delete article image:", err);
            }
          }
        }
        await api.deleteArticle(id);
      }
      toast.success("Item berhasil dihapus", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#10b981",
          color: "#fff",
          fontWeight: "500",
        },
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Gagal menghapus item", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "500",
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (activeTab === "products") {
        const productData = {
          ...formData,
          specifications: cleanSpecGroups(formData.specifications || []),
        };
        if (editingItem) {
          await api.updateProduct(editingItem.id, productData);
        } else {
          await api.createProduct(productData);
        }
      } else if (activeTab === "categories") {
        await api.createCategory(formData);
      } else if (activeTab === "gallery") {
        if (
          !formData.categories ||
          !Array.isArray(formData.categories) ||
          formData.categories.length === 0
        ) {
          toast.error("Pilih minimal satu kategori gallery", {
            duration: 3000,
            position: "top-right",
            style: { background: "#ef4444", color: "#fff", fontWeight: "500" },
          });
          return;
        }
        // Normalize categories to lowercase slugs
        formData.categories = (formData.categories || []).map((c: string) =>
          String(c).toLowerCase(),
        );
        if (editingItem) {
          await api.updateGalleryItem(editingItem.id, formData);
        } else {
          await api.createGalleryItem(formData);
        }
      } else if (activeTab === "articles") {
        if (editingItem) {
          await api.updateArticle(editingItem.id, formData);
        } else {
          await api.createArticle(formData);
        }
      }

      toast.success(
        editingItem ? "Data berhasil diupdate" : "Data berhasil ditambahkan",
        {
          duration: 3000,
          position: "top-right",
          style: {
            background: "#10b981",
            color: "#fff",
            fontWeight: "500",
          },
        },
      );
      closeModal();
      fetchData();
    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error(error.message || "Gagal menyimpan data", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "500",
        },
      });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const result = await api.uploadImage(file);

      // Store the server's relative path (/uploads/...) so it works on any domain
      const fullUrl = result.url;

      setFormData({ ...formData, imageUrl: fullUrl });
      toast.success(`Gambar berhasil diupload (${result.size}KB)`, {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#10b981",
          color: "#fff",
          fontWeight: "500",
        },
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Gagal upload gambar", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "500",
        },
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMultipleImageUpload = async (file: File) => {
    try {
      setUploadingMultiple(true);
      const result = await api.uploadImage(file);

      // Store the server's relative path (/uploads/...) so it works on any domain
      const fullUrl = result.url;

      setFormData({
        ...formData,
        imageUrls: [...(formData.imageUrls || []), fullUrl],
      });
      toast.success(`Gambar berhasil ditambahkan (${result.size}KB)`, {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#10b981",
          color: "#fff",
          fontWeight: "500",
        },
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Gagal upload gambar", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "500",
        },
      });
    } finally {
      setUploadingMultiple(false);
    }
  };

  // Categories in tree order with their depth (any nesting level).
  // `excludeId` drops that category and its descendants, so a category can't become its own parent.
  const categoryTree = (excludeId?: string) => {
    const result: { category: Category; depth: number }[] = [];
    const walk = (parentId: string | null, depth: number) => {
      categories
        .filter((cat) => (cat.parentId || null) === parentId && cat.id !== excludeId)
        .forEach((cat) => {
          result.push({ category: cat, depth });
          walk(cat.id, depth + 1);
        });
    };
    walk(null, 0);
    return result;
  };

  const drawerLabel =
    activeTab === "products"
      ? "Produk"
      : activeTab === "categories"
        ? "Kategori"
        : activeTab === "gallery"
          ? "Item Gallery"
          : "Artikel";

  useEffect(() => {
    if (!showModal) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && closeModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showModal]);

  const closeModal = () => {
    setShowModal(false);
    setFeatureInput("");
    setImageUrlInput("");
    setFormData({});
    setEditingItem(null);
  };

  if (loading && !showModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster />
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("homepage")}
              className={`${
                activeTab === "homepage"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <Home className="w-5 h-5" />
              Homepage
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`${
                activeTab === "products"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <Package className="w-5 h-5" />
              Products
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`${
                activeTab === "categories"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <Tag className="w-5 h-5" />
              Categories
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`${
                activeTab === "gallery"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <ImageIcon className="w-5 h-5" />
              Gallery
            </button>
            <button
              onClick={() => setActiveTab("articles")}
              className={`${
                activeTab === "articles"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <FileText className="w-5 h-5" />
              Articles
            </button>
          </nav>
        </div>

        {activeTab === "homepage" && <HomepageEditor />}

        {activeTab !== "homepage" && (<>
        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah{" "}
            {activeTab === "products"
              ? "Product"
              : activeTab === "categories"
                ? "Category"
                : activeTab === "gallery"
                  ? "Gallery Item"
                  : "Article"}
          </button>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {activeTab === "products" && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        Belum ada produk. Klik "Tambah Product" untuk menambah.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {product.slug}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-4"
                          >
                            <Edit className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {categories.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        Belum ada kategori. Klik "Tambah Category" untuk
                        menambah.
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr
                        key={category.id}
                        className={
                          category.parentId ? "bg-gray-50 dark:bg-gray-800" : ""
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {category.parentId && (
                            <span className="mr-2 text-gray-400">↳</span>
                          )}
                          {category.name}
                          {category.parent && (
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              (Sub dari: {category.parent.name})
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {category.slug}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {category.description}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {gallery.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                  Belum ada gallery item. Klik "Tambah Gallery Item" untuk
                  menambah.
                </div>
              ) : (
                gallery.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {item.type} • {(item.categories || []).join(", ")}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "articles" && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {articles.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        Belum ada artikel. Klik "Tambah Article" untuk menambah.
                      </td>
                    </tr>
                  ) : (
                    articles.map((article) => (
                      <tr key={article.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {article.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {article.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(article)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-4"
                          >
                            <Edit className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>)}
      </main>

      {/* Edit drawer: slides in from the right so long forms get the full screen height */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-gray-950/50 backdrop-blur-[2px] animate-[fadeIn_0.2s_ease-out]"
            onClick={closeModal}
          />
          <div
            className={`relative h-full w-full ${
              activeTab === "articles" ? "max-w-5xl" : activeTab === "products" ? "max-w-4xl" : "max-w-xl"
            } bg-white dark:bg-gray-800 shadow-2xl flex flex-col animate-[slideInRight_0.3s_cubic-bezier(0.22,1,0.36,1)]`}
          >
            <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {editingItem ? "Edit" : "Tambah"} {drawerLabel}
                </p>
                <h2 className="mt-0.5 text-xl font-bold text-gray-900 dark:text-white truncate">
                  {formData.name || formData.title || `${drawerLabel} baru`}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 -mr-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                {activeTab === "articles" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title || ""}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            title: e.target.value,
                            slug: generateSlug(e.target.value),
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Slug
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Excerpt (Ringkasan Singkat)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.excerpt || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, excerpt: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Featured Image
                      </label>
                      <div className="flex items-center gap-4">
                        {formData.imageUrl && (
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg border border-dashed border-gray-400 flex flex-col items-center justify-center min-w-[150px]">
                          {uploadingImage ? (
                            <Loader className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <Upload className="w-5 h-5 mb-1" />
                              <span className="text-xs">Upload Image</span>
                            </>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0])
                                handleImageUpload(e.target.files[0]);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Content (Isi Artikel)
                      </label>
                      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                        <ReactQuill
                          theme="snow"
                          value={formData.content || ""}
                          onChange={(content) =>
                            setFormData({ ...formData, content })
                          }
                          className="h-[450px] mb-12"
                          modules={{
                            toolbar: [
                              [{ header: [1, 2, 3, 4, 5, 6, false] }],
                              [{ size: ["small", false, "large", "huge"] }],
                              ["bold", "italic", "underline", "strike"],
                              [{ color: [] }, { background: [] }],
                              [{ list: "ordered" }, { list: "bullet" }],
                              [{ align: [] }],
                              ["link", "image"],
                              ["clean"],
                            ],
                          }}
                        />
                      </div>
                      <div className="h-12"></div> {/* Spacer for fixed toolbar */}
                    </div>
                  </>
                )}

                {activeTab === "products" && (
                  <>
                    <div className="pt-2 first:pt-0 border-t first:border-t-0 border-gray-100 dark:border-gray-700/60">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white pt-4">Informasi Dasar</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            name: e.target.value,
                            slug: generateSlug(e.target.value),
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Slug
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sub Judul <span className="font-normal text-gray-400">(opsional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, subtitle: e.target.value })
                        }
                        placeholder="mis. Mini Portable High-Pressure Fire Pump"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Tampil di bawah nama produk pada kartu dan hero homepage.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        required
                        value={formData.category || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Pilih Category</option>
                        {categoryTree().map(({ category, depth }) => (
                          <option key={category.id} value={category.slug}>
                            {"\u00A0\u00A0\u00A0".repeat(depth)}
                            {depth > 0 ? "↳ " : ""}
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="pt-2 first:pt-0 border-t first:border-t-0 border-gray-100 dark:border-gray-700/60">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white pt-4">Gambar Produk</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Gambar utama dipakai di kartu & hero homepage; gunakan PNG/WebP transparan.</p>
                    </div>
                    {/* Main Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Main Image
                      </label>

                      {/* Image Preview */}
                      {formData.imageUrl && (
                        <div className="mb-3 relative inline-block">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, imageUrl: "" })
                            }
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {/* Upload Button */}
                        <label className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            {uploadingImage ? (
                              <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                Upload Image
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingImage}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                          />
                        </label>

                        {/* OR use URL */}
                        <input
                          type="text"
                          value={formData.imageUrl || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              imageUrl: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Or paste image URL"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Upload gambar (auto-compress ke max 200KB) atau paste
                        URL
                      </p>
                    </div>

                    {/* Multiple Images */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Additional Images
                      </label>

                      {/* Image Previews */}
                      {formData.imageUrls && formData.imageUrls.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {formData.imageUrls.map(
                            (url: string, index: number) => (
                              <div
                                key={index}
                                className="relative inline-block"
                              >
                                <img
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      imageUrls: formData.imageUrls.filter(
                                        (_: any, i: number) => i !== index,
                                      ),
                                    });
                                  }}
                                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ),
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex gap-2">
                          {/* Upload Button */}
                          <label className="cursor-pointer">
                            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                              {uploadingMultiple ? (
                                <>
                                  <Loader className="w-4 h-4 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4" />
                                  Upload
                                </>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingMultiple}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleMultipleImageUpload(file);
                              }}
                            />
                          </label>

                          {/* URL Input */}
                          <input
                            type="text"
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (imageUrlInput.trim()) {
                                  setFormData({
                                    ...formData,
                                    imageUrls: [
                                      ...(formData.imageUrls || []),
                                      imageUrlInput.trim(),
                                    ],
                                  });
                                  setImageUrlInput("");
                                }
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="https://example.com/image.jpg (Enter to add)"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (imageUrlInput.trim()) {
                                setFormData({
                                  ...formData,
                                  imageUrls: [
                                    ...(formData.imageUrls || []),
                                    imageUrlInput.trim(),
                                  ],
                                });
                                setImageUrlInput("");
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {formData.imageUrls &&
                          formData.imageUrls.length > 0 && (
                            <div className="space-y-1">
                              {formData.imageUrls.map(
                                (url: string, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <span className="flex-1 text-gray-600 dark:text-gray-400 truncate">
                                      {url}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData({
                                          ...formData,
                                          imageUrls: formData.imageUrls.filter(
                                            (_: any, i: number) => i !== index,
                                          ),
                                        });
                                      }}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="pt-2 first:pt-0 border-t first:border-t-0 border-gray-100 dark:border-gray-700/60">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white pt-4">Fitur Unggulan</h3>
                    </div>
                    {/* Features Array */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Features
                      </label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (featureInput.trim()) {
                                  setFormData({
                                    ...formData,
                                    features: [
                                      ...(formData.features || []),
                                      featureInput.trim(),
                                    ],
                                  });
                                  setFeatureInput("");
                                }
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter feature (Enter to add)"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (featureInput.trim()) {
                                setFormData({
                                  ...formData,
                                  features: [
                                    ...(formData.features || []),
                                    featureInput.trim(),
                                  ],
                                });
                                setFeatureInput("");
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {formData.features && formData.features.length > 0 && (
                          <ul className="space-y-1">
                            {formData.features.map(
                              (feature: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <span className="flex-1 text-gray-600 dark:text-gray-400">
                                    • {feature}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData({
                                        ...formData,
                                        features: formData.features.filter(
                                          (_: any, i: number) => i !== index,
                                        ),
                                      });
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </li>
                              ),
                            )}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 first:pt-0 border-t first:border-t-0 border-gray-100 dark:border-gray-700/60">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white pt-4">Halaman Detail Produk</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Opsional. Bagian yang kosong tidak ditampilkan di halaman detail.</p>
                    </div>
                    <ProductDetailsEditor
                      details={formData.details}
                      onChange={(details) => setFormData({ ...formData, details })}
                    />

                    <div className="pt-2 first:pt-0 border-t first:border-t-0 border-gray-100 dark:border-gray-700/60">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white pt-4">Spesifikasi Teknis</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Kelompokkan bebas dengan sub judul. Beri ★ pada baris yang ditonjolkan di kartu & hero. Enter di kolom nilai terakhir menambah baris.</p>
                    </div>
                    <SpecGroupsEditor
                      groups={formData.specifications || []}
                      onChange={(specifications) =>
                        setFormData({ ...formData, specifications })
                      }
                    />
                  </>
                )}

                {activeTab === "categories" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            name: e.target.value,
                            slug: generateSlug(e.target.value),
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Slug
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    {/* Category Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category Image (Optional)
                      </label>

                      {/* Image Preview */}
                      {formData.imageUrl && (
                        <div className="mb-3 relative inline-block">
                          <img
                            src={formData.imageUrl}
                            alt="Category Preview"
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, imageUrl: "" })
                            }
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {/* Upload Button */}
                        <label className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            {uploadingImage ? (
                              <>
                                <Loader className="w-4 h-4 animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                <span>Upload Image</span>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingImage}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                          />
                        </label>

                        {/* Alternative: URL Input */}
                        <input
                          type="text"
                          value={formData.imageUrl || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              imageUrl: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Or paste image URL"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Upload gambar (auto-compress ke max 200KB) atau paste
                        URL
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Parent Category (Optional)
                      </label>
                      <select
                        value={formData.parentId || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentId: e.target.value || null,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">
                          -- Tidak ada parent (Top Level) --
                        </option>
                        {categoryTree(editingItem?.id).map(({ category, depth }) => (
                          <option key={category.id} value={category.id}>
                            {"\u00A0\u00A0\u00A0".repeat(depth)}
                            {depth > 0 ? "↳ " : ""}
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Pilih category parent jika ini adalah sub-category
                      </p>
                    </div>
                  </>
                )}

                {activeTab === "gallery" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type
                      </label>
                      <select
                        required
                        value={formData.type || "image"}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {formData.type === "video"
                          ? "Video URL (YouTube)"
                          : "Gallery Image"}
                      </label>

                      {formData.type === "image" && (
                        <>
                          {/* Image Preview */}
                          {formData.imageUrl && (
                            <div className="mb-3 relative inline-block">
                              <img
                                src={formData.imageUrl}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData({ ...formData, imageUrl: "" })
                                }
                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          <div className="flex gap-2">
                            {/* Upload Button */}
                            <label className="flex-1 cursor-pointer">
                              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                {uploadingImage ? (
                                  <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    <span>Uploading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Image</span>
                                  </>
                                )}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingImage}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(file);
                                }}
                              />
                            </label>

                            {/* Alternative: URL Input */}
                            <input
                              type="text"
                              value={formData.imageUrl || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  imageUrl: e.target.value,
                                })
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Or paste image URL"
                            />
                          </div>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Upload gambar (auto-compress ke max 200KB) atau
                            paste URL
                          </p>
                        </>
                      )}

                      {formData.type === "video" && (
                        <input
                          type="url"
                          value={formData.url || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, url: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Paste YouTube URL"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categories
                      </label>

                      {/* Selected categories chips */}
                      <div className="mb-2 flex flex-wrap gap-2">
                        {(formData.categories || []).map((cat: string) => (
                          <div
                            key={cat}
                            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-200">
                              {galleryCategories.find((c) => c.slug === cat)
                                ?.name || cat}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  categories: formData.categories.filter(
                                    (c: string) => c !== cat,
                                  ),
                                })
                              }
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        {/* Dropdown to add from predefined galleryCategories */}
                        <select
                          value={selectCategoryValue}
                          onChange={(e) => {
                            const v = e.target.value;
                            setSelectCategoryValue("");
                            if (!v) return;
                            const current = formData.categories || [];
                            if (!current.includes(v)) {
                              setFormData({
                                ...formData,
                                categories: [...current, v],
                              });
                            }
                          }}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Tambah dari daftar...</option>
                          {galleryCategories.map((cat) => (
                            <option key={cat.slug} value={cat.slug}>
                              {cat.name}
                            </option>
                          ))}
                        </select>

                        {/* Input to add custom category */}
                        <input
                          type="text"
                          value={newCategoryInput}
                          onChange={(e) => setNewCategoryInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const v = newCategoryInput.trim().toLowerCase();
                              if (!v) return;
                              const current = formData.categories || [];
                              if (!current.includes(v)) {
                                setFormData({
                                  ...formData,
                                  categories: [...current, v],
                                });
                              }
                              setNewCategoryInput("");
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Ketik kategori baru lalu tekan Enter"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const v = newCategoryInput.trim().toLowerCase();
                            if (!v) return;
                            const current = formData.categories || [];
                            if (!current.includes(v)) {
                              setFormData({
                                ...formData,
                                categories: [...current, v],
                              });
                            }
                            setNewCategoryInput("");
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Pilih atau tambahkan beberapa kategori. Tekan Enter
                        untuk menambah kategori kustom.
                      </p>
                    </div>
                  </>
                )}

              </div>

              <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
