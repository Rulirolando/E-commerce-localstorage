/*
  Warnings:

  - You are about to drop the column `total` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `buyerId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gambar` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `harga` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jumlah` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `produkId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stok` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ukuran` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warna` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_variantId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "total",
DROP COLUMN "userId",
DROP COLUMN "variantId",
ADD COLUMN     "buyerId" INTEGER NOT NULL,
ADD COLUMN     "gambar" TEXT NOT NULL,
ADD COLUMN     "harga" INTEGER NOT NULL,
ADD COLUMN     "jumlah" INTEGER NOT NULL,
ADD COLUMN     "produkId" INTEGER NOT NULL,
ADD COLUMN     "stok" INTEGER NOT NULL,
ADD COLUMN     "ukuran" TEXT NOT NULL,
ADD COLUMN     "warna" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Variation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
