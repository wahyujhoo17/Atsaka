import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  uploadImages,
  deleteImage,
  validateImageFile,
} from "../lib/imageUpload";
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  Package,
  Tag,
  Upload,
  X,
} from "lucide-react";
import { Product, Category } from "../types";

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  features: string[];
  imageUrl: string;
  imageUrls: string[];
  specifications: { [key: string]: string };
}

interface CategoryFormData {
  name: string;
  description: string;
  imageUrl: string;
}

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "products"
  );
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    description: "",
    features: [],
    imageUrl: "",
    imageUrls: [],
    specifications: {},
  });
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">(
    "upload"
  );
  const [imageUrlsText, setImageUrlsText] = useState("");
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data from database format to TypeScript interface
      const transformedProducts = (data || []).map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        description: product.description || "",
        features: product.features || [],
        imageUrl: product.image_url || "",
        imageUrls: product.image_urls || [],
        specifications: product.specifications || {},
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  // Image upload functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const previewUrls: string[] = [];

    files.forEach((file) => {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
        const url = URL.createObjectURL(file);
        previewUrls.push(url);
      } else {
        alert(`File ${file.name}: ${validation.error}`);
      }
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setImagePreviewUrls((prev) => [...prev, ...previewUrls]);
  };

  const handleImageUpload = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadResults = await uploadImages(
        selectedFiles,
        "product-images",
        "products",
        (progress) => {
          setUploadProgress(progress.percentage);
        }
      );

      const urls = uploadResults.map((result) => result.url);
      return urls;
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload images. Please try again.");
      return [];
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImagePreview = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      return newUrls.filter((_, i) => i !== index);
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles: File[] = [];
    const previewUrls: string[] = [];

    files.forEach((file) => {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
        const url = URL.createObjectURL(file);
        previewUrls.push(url);
      } else {
        alert(`File ${file.name}: ${validation.error}`);
      }
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setImagePreviewUrls((prev) => [...prev, ...previewUrls]);
  };

  // Category CRUD functions
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = categoryFormData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update({
            name: categoryFormData.name,
            slug,
            description: categoryFormData.description,
            image_url: categoryFormData.imageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingCategory.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert({
          name: categoryFormData.name,
          slug,
          description: categoryFormData.description,
          image_url: categoryFormData.imageUrl,
        });

        if (error) throw error;
      }

      setShowCategoryForm(false);
      setEditingCategory(null);
      resetCategoryForm();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || "",
      imageUrl: category.imageUrl || "",
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", id);

        if (error) throw error;
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      description: "",
      imageUrl: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Upload images first if any files are selected
      let uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        uploadedUrls = await handleImageUpload();
      }

      // Use uploaded URLs or existing URLs
      let mainImageUrl: string;
      let allImageUrls: string[];

      if (uploadedUrls.length > 0) {
        // When uploading new images, use all uploaded URLs
        mainImageUrl = uploadedUrls[0];
        allImageUrls = uploadedUrls;
      } else if (editingProduct) {
        // When editing without new uploads, check if new URLs were added via form
        if (formData.imageUrls && formData.imageUrls.length > 0) {
          // User added new URLs via "Add Image URLs" feature
          mainImageUrl = formData.imageUrls[0];
          allImageUrls = formData.imageUrls;
        } else {
          // Use existing images from the product being edited
          mainImageUrl = editingProduct.imageUrl;
          allImageUrls = editingProduct.imageUrl
            ? [editingProduct.imageUrl, ...(editingProduct.imageUrls || [])]
            : [];
        }
      } else {
        // When creating without uploads, use form data (including manually added URLs)
        mainImageUrl =
          formData.imageUrl ||
          (formData.imageUrls && formData.imageUrls.length > 0
            ? formData.imageUrls[0]
            : "");
        allImageUrls =
          formData.imageUrls && formData.imageUrls.length > 0
            ? formData.imageUrls
            : formData.imageUrl
            ? [formData.imageUrl]
            : [];
      }

      const slug = formData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update({
            name: formData.name,
            slug,
            category: formData.category,
            description: formData.description,
            features: formData.features,
            image_url: mainImageUrl,
            image_urls: allImageUrls,
            specifications: formData.specifications,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingProduct.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert({
          name: formData.name,
          slug,
          category: formData.category,
          description: formData.description,
          features: formData.features,
          image_url: mainImageUrl,
          image_urls: allImageUrls,
          specifications: formData.specifications,
        });

        if (error) throw error;
      }

      // Clean up old images from storage if editing and new images were uploaded
      if (editingProduct && uploadedUrls.length > 0) {
        await cleanupOldImages(editingProduct, allImageUrls);
      }

      // Clean up preview URLs
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      setSelectedFiles([]);
      setImagePreviewUrls([]);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      features: product.features,
      imageUrl: product.imageUrl,
      imageUrls: product.imageUrls,
      specifications: product.specifications,
    });
    setImageInputMode("upload");
    setImageUrlsText("");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await supabase.from("products").delete().eq("id", id);

        if (error) throw error;
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const cleanupOldImages = async (
    oldProduct: Product,
    newImageUrls: string[]
  ) => {
    try {
      // Get all old image URLs
      const oldImageUrls = oldProduct.imageUrl
        ? [oldProduct.imageUrl, ...(oldProduct.imageUrls || [])]
        : oldProduct.imageUrls || [];

      // Find images that are in old but not in new
      const imagesToDelete = oldImageUrls.filter(
        (oldUrl) => !newImageUrls.includes(oldUrl)
      );

      if (imagesToDelete.length > 0) {
        console.log("Deleting old images:", imagesToDelete);

        // Extract file paths from URLs and delete from storage
        const deletePromises = imagesToDelete.map(async (url) => {
          try {
            // Extract path from Supabase URL
            // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
            const urlParts = url.split("/storage/v1/object/public/");
            if (urlParts.length === 2) {
              const pathParts = urlParts[1].split("/");
              if (pathParts.length >= 2) {
                const bucket = pathParts[0];
                const filePath = pathParts.slice(1).join("/");
                await deleteImage(filePath, bucket);
              }
            }
          } catch (error) {
            console.error("Error deleting image:", url, error);
          }
        });

        await Promise.all(deletePromises);
        console.log(`Successfully deleted ${imagesToDelete.length} old images`);
      }
    } catch (error) {
      console.error("Error cleaning up old images:", error);
      // Don't throw error here as it's not critical for the main operation
    }
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? value : feature
      ),
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        "": "",
      },
    }));
  };

  const updateSpecificationKey = (index: number, newKey: string) => {
    const entries = Object.entries(formData.specifications);
    const [oldKey] = entries[index];
    const newSpecs = { ...formData.specifications };
    delete newSpecs[oldKey];
    newSpecs[newKey] = entries[index][1];
    setFormData((prev) => ({
      ...prev,
      specifications: newSpecs,
    }));
  };

  const updateSpecificationValue = (index: number, value: string) => {
    const entries = Object.entries(formData.specifications);
    const [key] = entries[index];
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  };

  const removeSpecification = (index: number) => {
    const entries = Object.entries(formData.specifications);
    const [keyToRemove] = entries[index];
    const newSpecs = { ...formData.specifications };
    delete newSpecs[keyToRemove];
    setFormData((prev) => ({
      ...prev,
      specifications: newSpecs,
    }));
  };

  const handleAddImageUrls = () => {
    console.log("handleAddImageUrls called");
    console.log("imageUrlsText:", imageUrlsText);

    // Parse URLs from text area (one per line)
    const urls = imageUrlsText
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0 && url.startsWith("http"));

    console.log("Parsed URLs:", urls);

    if (urls.length === 0) {
      alert("Please enter at least one valid image URL");
      return;
    }

    // More permissive validation - just check if URLs look reasonable
    const invalidUrls = urls.filter((url) => {
      // Basic URL validation
      try {
        new URL(url);
        return false; // Valid URL
      } catch {
        return true; // Invalid URL
      }
    });

    if (invalidUrls.length > 0) {
      alert(`Some URLs are invalid: ${invalidUrls.join(", ")}`);
      return;
    }

    // Update form data
    setFormData((prev) => ({
      ...prev,
      imageUrl: urls[0] || "",
      imageUrls: urls,
    }));

    // Add URLs to preview for display
    setImagePreviewUrls(urls);

    console.log("Updated formData with URLs:", urls);
    console.log("Set imagePreviewUrls:", urls);

    // Clear the text area
    setImageUrlsText("");

    // Show success message
    alert(`Successfully added ${urls.length} image URL(s)!`);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      features: [],
      imageUrl: "",
      imageUrls: [],
      specifications: {},
    });
    // Reset image upload state
    setSelectedFiles([]);
    setImagePreviewUrls([]);
    setUploadProgress(0);
    setIsUploading(false);
    setImageInputMode("upload");
    setImageUrlsText("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-red-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "products"
                  ? "border-red-500 text-red-600 dark:text-red-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <Package className="h-4 w-4 inline mr-2" />
              Products
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "categories"
                  ? "border-red-500 text-red-600 dark:text-red-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <Tag className="h-4 w-4 inline mr-2" />
              Categories
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "products" ? (
          <>
            {/* Products Actions */}
            <div className="mb-8">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.slug}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Features
                    </label>
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                          placeholder="Feature description"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Add Feature
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Technical Specifications
                    </label>
                    {Object.entries(formData.specifications).map(
                      ([key, value], index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={key}
                            onChange={(e) =>
                              updateSpecificationKey(index, e.target.value)
                            }
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                            placeholder="Specification name (e.g., Model, Engine Type)"
                          />
                          <input
                            type="text"
                            value={value}
                            onChange={(e) =>
                              updateSpecificationValue(index, e.target.value)
                            }
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                            placeholder="Specification value"
                          />
                          <button
                            type="button"
                            onClick={() => removeSpecification(index)}
                            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    )}
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Add Specification
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Product Images
                    </label>

                    {/* Image Input Mode Toggle */}
                    <div className="mb-4">
                      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setImageInputMode("upload")}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            imageInputMode === "upload"
                              ? "bg-white dark:bg-gray-600 text-red-600 dark:text-red-400 shadow-sm"
                              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          Upload Images
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMode("url")}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            imageInputMode === "url"
                              ? "bg-white dark:bg-gray-600 text-red-600 dark:text-red-400 shadow-sm"
                              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          Add URLs
                        </button>
                      </div>
                    </div>

                    {imageInputMode === "upload" ? (
                      /* File Input */
                      <div
                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                          isDragOver
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="space-y-1 text-center">
                          <Upload
                            className={`mx-auto h-12 w-12 ${
                              isDragOver ? "text-red-500" : "text-gray-400"
                            }`}
                          />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500"
                            >
                              <span>Upload images</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, JPEG, WebP up to 5MB each
                          </p>
                          {isDragOver && (
                            <p className="text-sm text-red-600 font-medium">
                              Drop images here to upload
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* URL Input */
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Image URLs
                          </label>
                          <textarea
                            value={imageUrlsText}
                            onChange={(e) => setImageUrlsText(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                            rows={4}
                            placeholder="Enter image URLs, one per line:&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Enter one image URL per line. The first URL will be
                            used as the main image.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddImageUrls}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Add Image URLs
                        </button>
                      </div>
                    )}

                    {/* Upload Progress */}
                    {isUploading && (
                      <div className="mt-4">
                        <div className="bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Uploading... {Math.round(uploadProgress)}%
                        </p>
                      </div>
                    )}

                    {/* Image Previews */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Selected Images ({imagePreviewUrls.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {imagePreviewUrls.map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                              />
                              <button
                                type="button"
                                onClick={() => removeImagePreview(index)}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              {index === 0 && (
                                <span className="absolute bottom-1 left-1 bg-red-600 text-white text-xs px-2 py-1 rounded">
                                  Main
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Existing Images (when editing) */}
                    {editingProduct &&
                      editingProduct.imageUrls &&
                      editingProduct.imageUrls.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Images
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {editingProduct.imageUrls.map((url, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={url}
                                  alt={`Current ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                                />
                                {index === 0 && (
                                  <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                    Main
                                  </span>
                                )}
                                {index > 0 && (
                                  <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                    Additional
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      {editingProduct ? "Update" : "Create"} Product
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingProduct(null);
                        resetForm();
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">
                  Products ({products.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Categories Actions */}
            <div className="mb-8">
              <button
                onClick={() => {
                  setEditingCategory(null);
                  resetCategoryForm();
                  setShowCategoryForm(true);
                }}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </button>
            </div>

            {/* Categories Form */}
            {showCategoryForm && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.name}
                      onChange={(e) =>
                        setCategoryFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={categoryFormData.description}
                      onChange={(e) =>
                        setCategoryFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={categoryFormData.imageUrl}
                      onChange={(e) =>
                        setCategoryFormData((prev) => ({
                          ...prev,
                          imageUrl: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      {editingCategory ? "Update" : "Create"} Category
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoryForm(false);
                        setEditingCategory(null);
                        resetCategoryForm();
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Categories Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">
                  Categories ({categories.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {category.slug}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                            {category.description || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
