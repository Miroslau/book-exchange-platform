/*
  Warnings:

  - The primary key for the `BookImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[bookId,hash]` on the table `BookImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `BookImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookImage" DROP CONSTRAINT "BookImage_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BookImage_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BookImage_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "BookImage_bookId_hash_key" ON "BookImage"("bookId", "hash");
