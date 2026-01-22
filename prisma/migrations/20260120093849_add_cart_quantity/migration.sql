/*
  Warnings:

  - A unique constraint covering the columns `[cartId,variantId,ukuran]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jumlah` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ukuran` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "jumlah" INTEGER NOT NULL,
ADD COLUMN     "ukuran" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_variantId_ukuran_key" ON "CartItem"("cartId", "variantId", "ukuran");
