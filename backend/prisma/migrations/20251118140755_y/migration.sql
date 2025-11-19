/*
  Warnings:

  - Added the required column `itemId` to the `SupplierQuote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `supplierquote` ADD COLUMN `itemId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `SupplierQuote` ADD CONSTRAINT `SupplierQuote_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `MRItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
