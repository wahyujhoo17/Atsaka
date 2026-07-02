/*
  Warnings:

  - You are about to drop the column `category` on the `gallery` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "gallery_category_idx";

-- AlterTable
ALTER TABLE "gallery" DROP COLUMN "category",
ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "articles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "image_url" TEXT,
    "author" TEXT NOT NULL DEFAULT 'Admin',
    "category" TEXT NOT NULL DEFAULT 'Umum',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "articles"("slug");
