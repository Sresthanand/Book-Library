-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "image" TEXT NOT NULL DEFAULT 'https://example.com/default-image.png',
ADD COLUMN     "pdf" TEXT NOT NULL DEFAULT '';
