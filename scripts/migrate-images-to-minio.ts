// One-off: move every image the database points at into MinIO and rewrite the URLs.
//   - "/img/..."     files from this repo's public/ folder (uploaded as-is)
//   - "/uploads/..." files still present in the local uploads folder (uploaded as-is)
//   - external links (marketplaces, Wikimedia, …) are downloaded and re-encoded to WebP
// Usage (S3_* settings must be filled in .env):
//   npx tsx scripts/migrate-images-to-minio.ts            dry run, changes nothing
//   npx tsx scripts/migrate-images-to-minio.ts --apply    backs up the tables, uploads, rewrites URLs
import "dotenv/config";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import sharp from "sharp";
import { localUploadsDir, saveImage, storageDescription, useObjectStorage } from "../server/storage";

const apply = process.argv.includes("--apply");
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const uploadsDir = localUploadsDir(path.join(root, "server"));
const publicBase = (process.env.S3_PUBLIC_URL || "").replace(/\/+$/, "");

const contentTypes: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

// Video links (YouTube etc.) in the gallery are not images and stay as they are
const isVideoUrl = (value: string) => /youtu\.?be|vimeo\.com/i.test(value);
const isImageUrl = (value: string) =>
  /^\/(img|uploads)\//.test(value) ||
  (/^https?:\/\//.test(value) && !value.startsWith(publicBase) && !isVideoUrl(value));

// Every place an image URL can live
const tables = ["products", "categories", "gallery", "articles", "site_content"];

const collectUrls = (value: unknown, found: Set<string>) => {
  if (typeof value === "string") {
    if (isImageUrl(value)) found.add(value);
    for (const match of value.matchAll(/src="([^"]+)"/g)) if (isImageUrl(match[1])) found.add(match[1]);
  } else if (Array.isArray(value)) value.forEach((item) => collectUrls(item, found));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectUrls(item, found));
};

// Turns any source into the bytes + name to store
const resolveSource = async (url: string): Promise<{ buffer: Buffer; name: string; type: string }> => {
  if (url.startsWith("/img/")) {
    const file = path.join(root, "public", url);
    const name = url.replace(/^\/img\//, "").replace(/\//g, "-");
    return { buffer: await fs.promises.readFile(file), name, type: contentTypes[path.extname(file).toLowerCase()] || "application/octet-stream" };
  }
  if (url.startsWith("/uploads/")) {
    const file = path.join(uploadsDir, path.basename(url));
    if (!fs.existsSync(file)) throw new Error("file no longer exists");
    return { buffer: await fs.promises.readFile(file), name: path.basename(file), type: contentTypes[path.extname(file).toLowerCase()] || "image/webp" };
  }
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (ATSAKA image migration)" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const source = Buffer.from(await response.arrayBuffer());
  const buffer = await sharp(source, { density: 300 })
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
  const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 10);
  return { buffer, name: `ext-${hash}.webp`, type: "image/webp" };
};

// Replaces whole-value matches only, so a URL that merely contains another URL is never touched
const replaceDeep = (value: unknown, map: Map<string, string>): unknown => {
  if (typeof value === "string") {
    if (map.has(value)) return map.get(value);
    return value.replace(/src="([^"]+)"/g, (whole, src) => (map.has(src) ? `src="${map.get(src)}"` : whole));
  }
  if (value instanceof Date || Buffer.isBuffer(value)) return value;
  if (Array.isArray(value)) return value.map((item) => replaceDeep(item, map));
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceDeep(item, map)]));
  return value;
};

const main = async () => {
  if (!useObjectStorage || !publicBase) {
    console.error("Fill S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY and S3_PUBLIC_URL in .env first.");
    process.exit(1);
  }

  const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  const rows: Record<string, Record<string, unknown>[]> = {};
  const urls = new Set<string>();
  for (const table of tables) {
    rows[table] = (await db.query(`select * from ${table}`)).rows;
    rows[table].forEach((row) => collectUrls(row, urls));
  }

  console.log(`${apply ? "APPLY" : "DRY RUN"} · ${urls.size} image URL(s) → ${storageDescription()}\n`);
  const map = new Map<string, string>();
  for (const url of urls) {
    try {
      const { buffer, name, type } = await resolveSource(url);
      const target = apply ? await saveImage(buffer, name, type, uploadsDir) : `${publicBase}/uploads/${name}`;
      map.set(url, target);
      console.log(`✅ ${url.slice(0, 80)}\n   → ${target} (${Math.round(buffer.length / 1024)} KB)`);
    } catch (error) {
      console.log(`❌ ${url.slice(0, 80)}\n   ${(error as Error).message} — re-upload this image in the admin`);
    }
  }

  if (!apply) {
    console.log(`\nDry run: ${map.size}/${urls.size} would move. Nothing changed; re-run with --apply.`);
    await db.end();
    return;
  }

  // Backup before rewriting
  const backup = path.join(root, `images-migration-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(backup, JSON.stringify(rows, null, 1));
  console.log(`\nBackup: ${backup}`);

  let updated = 0;
  await db.query("begin");
  try {
    for (const table of tables) {
      const idColumn = table === "site_content" ? "key" : "id";
      for (const row of rows[table]) {
        const next = replaceDeep(row, map) as Record<string, unknown>;
        const changed = Object.keys(row).filter((col) => JSON.stringify(row[col]) !== JSON.stringify(next[col]));
        if (changed.length === 0) continue;
        const sets = changed.map((col, i) => `${col} = $${i + 2}`).join(", ");
        const values = changed.map((col) =>
          next[col] !== null && typeof next[col] === "object" && !Array.isArray(next[col]) ? JSON.stringify(next[col]) : next[col],
        );
        await db.query(`update ${table} set ${sets} where ${idColumn} = $1`, [row[idColumn], ...values]);
        updated += 1;
      }
    }
    await db.query("commit");
  } catch (error) {
    await db.query("rollback");
    throw error;
  }
  console.log(`Updated ${updated} row(s). Images moved: ${map.size}/${urls.size}.`);
  await db.end();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
