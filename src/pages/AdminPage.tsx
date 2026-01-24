import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
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
} from "lucide-react";

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
  category: string;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "products" | "categories" | "gallery"
  >("products");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [featureInput, setFeatureInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMultiple, setUploadingMultiple] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/admin-login");
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
        setGallery(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate("/admin-login");
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFeatureInput("");
    setImageUrlInput("");
    setSpecKey("");
    setSpecValue("");
    if (activeTab === "products") {
      setFormData({
        name: "",
        slug: "",
        category: "",
        description: "",
        features: [],
        imageUrl: "",
        imageUrls: [],
        specifications: {},
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
        type: "photo",
        url: "",
        imageUrl: "",
        category: "general",
      });
    }
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setFeatureInput("");
    setImageUrlInput("");
    setSpecKey("");
    setSpecValue("");
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
        if (editingItem) {
          await api.updateProduct(editingItem.id, formData);
        } else {
          await api.createProduct(formData);
        }
      } else if (activeTab === "categories") {
        await api.createCategory(formData);
      } else if (activeTab === "gallery") {
        await api.createGalleryItem(formData);
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
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Gagal menyimpan data", {
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

      // Get full URL based on environment
      const baseUrl =
        import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "http://localhost:3001";
      const fullUrl = `${baseUrl}${result.url}`;

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

      // Get full URL based on environment
      const baseUrl =
        import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "http://localhost:3001";
      const fullUrl = `${baseUrl}${result.url}`;

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

  const closeModal = () => {
    setShowModal(false);
    setFeatureInput("");
    setImageUrlInput("");
    setSpecKey("");
    setSpecValue("");
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
          <nav className="-mb-px flex space-x-8">
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
          </nav>
        </div>

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
                : "Gallery Item"}
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
                          {item.type} • {item.category}
                        </span>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingItem ? "Edit" : "Tambah"}{" "}
                  {activeTab === "products"
                    ? "Product"
                    : activeTab === "categories"
                      ? "Category"
                      : "Gallery Item"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === "products" && (
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
                        {categories
                          .filter((cat) => !cat.parentId)
                          .map((cat) => (
                            <React.Fragment key={cat.id}>
                              <option value={cat.slug}>{cat.name}</option>
                              {cat.children?.map((child) => (
                                <option key={child.id} value={child.slug}>
                                  &nbsp;&nbsp;↳ {child.name}
                                </option>
                              ))}
                            </React.Fragment>
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
                          type="url"
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
                            type="url"
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

                    {/* Specifications Object */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Specifications
                      </label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={specKey}
                            onChange={(e) => setSpecKey(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Key (e.g., Model)"
                          />
                          <input
                            type="text"
                            value={specValue}
                            onChange={(e) => setSpecValue(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (specKey.trim() && specValue.trim()) {
                                  setFormData({
                                    ...formData,
                                    specifications: {
                                      ...(formData.specifications || {}),
                                      [specKey.trim()]: specValue.trim(),
                                    },
                                  });
                                  setSpecKey("");
                                  setSpecValue("");
                                }
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Value (Enter to add)"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (specKey.trim() && specValue.trim()) {
                                setFormData({
                                  ...formData,
                                  specifications: {
                                    ...(formData.specifications || {}),
                                    [specKey.trim()]: specValue.trim(),
                                  },
                                });
                                setSpecKey("");
                                setSpecValue("");
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {formData.specifications &&
                          Object.keys(formData.specifications).length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-1">
                              {Object.entries(formData.specifications).map(
                                ([key, value], index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                      {key}:
                                    </span>
                                    <span className="flex-1 text-gray-600 dark:text-gray-400">
                                      {String(value)}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newSpecs = {
                                          ...formData.specifications,
                                        };
                                        delete newSpecs[key];
                                        setFormData({
                                          ...formData,
                                          specifications: newSpecs,
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
                            onChange={handleImageUpload}
                          />
                        </label>

                        {/* Alternative: URL Input */}
                        <input
                          type="url"
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
                        {categories
                          .filter(
                            (cat) =>
                              !cat.parentId && cat.id !== editingItem?.id,
                          )
                          .map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
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
                        value={formData.type || "photo"}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {formData.type === "video"
                          ? "Video URL (YouTube)"
                          : "Gallery Image"}
                      </label>

                      {formData.type === "photo" && (
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
                                onChange={handleImageUpload}
                              />
                            </label>

                            {/* Alternative: URL Input */}
                            <input
                              type="url"
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
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category || "general"}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
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
        </div>
      )}
    </div>
  );
};

export default AdminPage;
