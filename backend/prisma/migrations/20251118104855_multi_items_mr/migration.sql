/*
  Warnings:

  - You are about to drop the column `boqItemId` on the `materialrequisition` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `materialrequisition` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `materialrequisition` DROP FOREIGN KEY `MaterialRequisition_boqItemId_fkey`;

-- DropIndex
DROP INDEX `MaterialRequisition_boqItemId_fkey` ON `materialrequisition`;

-- AlterTable
ALTER TABLE `materialrequisition` DROP COLUMN `boqItemId`,
    DROP COLUMN `quantity`;

-- CreateTable
CREATE TABLE `MRItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mrId` INTEGER NOT NULL,
    `boqItemId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MRItem` ADD CONSTRAINT `MRItem_mrId_fkey` FOREIGN KEY (`mrId`) REFERENCES `MaterialRequisition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MRItem` ADD CONSTRAINT `MRItem_boqItemId_fkey` FOREIGN KEY (`boqItemId`) REFERENCES `BOQItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
