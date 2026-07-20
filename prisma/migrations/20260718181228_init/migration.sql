/*
  Warnings:

  - You are about to drop the column `authors` on the `Blogs` table. All the data in the column will be lost.
  - Added the required column `author` to the `Blogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blogs" DROP COLUMN "authors",
ADD COLUMN     "author" TEXT NOT NULL;
