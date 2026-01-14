/*
  Warnings:

  - The primary key for the `Variation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Variation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Variation" DROP CONSTRAINT "Variation_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Variation_pkey" PRIMARY KEY ("id");
