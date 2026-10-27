// Load .env here: imports run before index.ts calls dotenv.config(), and S3_* are read at import time
import "dotenv/config";
import path from "path";
import fs from "fs";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";

// Where uploaded images live:
// - MinIO / S3 when S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY and S3_SECRET_KEY are set (production),
// - otherwise a local folder (UPLOAD_DIR, or public/uploads) for local development.
// Objects use the key "uploads/<filename>", so stored URLs always contain "/uploads/<filename>".

const { S3_REGION, S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY } = process.env;

// "s3.example.com" → "https://s3.example.com" (a missing scheme would make browsers treat URLs as relative).
// A path such as "/media" is kept as-is: images are then served through this app (see getImage).
const withScheme = (url?: string) =>
  url ? (url.startsWith("/") || /^https?:\/\//i.test(url) ? url : `https://${url}`).replace(/\/+$/, "") : url;
const S3_ENDPOINT = withScheme(process.env.S3_ENDPOINT);
const S3_PUBLIC_URL = withScheme(process.env.S3_PUBLIC_URL);

export const useObjectStorage = Boolean(S3_ENDPOINT && S3_BUCKET && S3_ACCESS_KEY && S3_SECRET_KEY);

const s3 = useObjectStorage
  ? new S3Client({
      endpoint: S3_ENDPOINT,
      region: S3_REGION || "us-east-1",
      credentials: { accessKeyId: S3_ACCESS_KEY!, secretAccessKey: S3_SECRET_KEY! },
      forcePathStyle: true, // MinIO serves buckets as /<bucket>/<key>
    })
  : null;

// Base for stored image URLs. Defaults to "/media": images are served by this app (bucket stays private).
// Set S3_PUBLIC_URL to a full URL only if the bucket itself is publicly readable.
const publicBase = (S3_PUBLIC_URL || "/media").replace(/\/+$/, "");

export const localUploadsDir = (serverDir: string) =>
  process.env.UPLOAD_DIR ? path.resolve(process.env.UPLOAD_DIR) : path.join(serverDir, "../public/uploads");

const objectKey = (filename: string) => `uploads/${path.basename(filename)}`;

/** Stores an image and returns the URL to save in the database. */
export const saveImage = async (
  buffer: Buffer,
  filename: string,
  contentType: string,
  uploadsDir: string,
): Promise<string> => {
  if (s3) {
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: objectKey(filename),
        Body: buffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    return `${publicBase}/${objectKey(filename)}`;
  }

  await fs.promises.writeFile(path.join(uploadsDir, path.basename(filename)), buffer);
  return `/uploads/${path.basename(filename)}`;
};

/** Deletes an uploaded image by file name. Returns false when the local file doesn't exist. */
export const deleteImage = async (filename: string, uploadsDir: string): Promise<boolean> => {
  if (s3) {
    await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: objectKey(filename) }));
    return true;
  }

  const filepath = path.join(uploadsDir, path.basename(filename));
  if (!fs.existsSync(filepath)) return false;
  await fs.promises.unlink(filepath);
  return true;
};

/**
 * Reads an uploaded image from MinIO so the app can serve it under its own domain
 * (S3_PUBLIC_URL=/media). Returns null when the object doesn't exist.
 */
export const getImage = async (
  key: string,
): Promise<{ body: Readable; contentType?: string; contentLength?: number; etag?: string } | null> => {
  if (!s3) return null;
  try {
    const result = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }));
    return {
      body: result.Body as Readable,
      contentType: result.ContentType,
      contentLength: result.ContentLength,
      etag: result.ETag,
    };
  } catch (error) {
    const name = (error as { name?: string }).name;
    if (name === "NoSuchKey" || name === "NotFound") return null;
    throw error;
  }
};

export const storageDescription = () =>
  useObjectStorage ? `MinIO/S3 bucket "${S3_BUCKET}" → ${publicBase}` : "local folder";
