import { supabase } from "./supabase";

export interface UploadResult {
  url: string;
  path: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload single image to Supabase Storage
 */
export const uploadImage = async (
  file: File,
  bucket = "product-images",
  folder = "products"
): Promise<UploadResult> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Upload multiple images to Supabase Storage
 */
export const uploadImages = async (
  files: File[],
  bucket = "product-images",
  folder = "products",
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];
  let loaded = 0;
  const total = files.length;

  for (let i = 0; i < files.length; i++) {
    try {
      const result = await uploadImage(files[i], bucket, folder);
      results.push(result);
      loaded++;

      if (onProgress) {
        onProgress({
          loaded,
          total,
          percentage: (loaded / total) * 100,
        });
      }
    } catch (error) {
      console.error(`Error uploading image ${i + 1}:`, error);
      // Continue with other uploads even if one fails
    }
  }

  return results;
};

/**
 * Delete image from Supabase Storage
 */
export const deleteImage = async (
  path: string,
  bucket = "product-images"
): Promise<void> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

/**
 * Delete multiple images from Supabase Storage
 */
export const deleteImages = async (
  paths: string[],
  bucket = "product-images"
): Promise<void> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
};

/**
 * Validate image file
 */
export const validateImageFile = (
  file: File
): { valid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "File type not allowed. Please upload JPEG, PNG, or WebP images.",
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size too large. Maximum size is 5MB.",
    };
  }

  return { valid: true };
};

/**
 * Generate thumbnail URL from original image URL
 */
export const getThumbnailUrl = (
  url: string,
  width = 300,
  height = 300
): string => {
  // For Supabase Storage, we can use transform parameters
  const urlObj = new URL(url);
  urlObj.searchParams.set("width", width.toString());
  urlObj.searchParams.set("height", height.toString());
  urlObj.searchParams.set("resize", "cover");
  return urlObj.toString();
};
