/*
  Warnings:

  - Made the column `requestedBy` on table `materialrequisition` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `materialrequisition` DROP FOREIGN KEY `MaterialRequisition_requestedBy_fkey`;

-- DropIndex
DROP INDEX `MaterialRequisition_requestedBy_fkey` ON `materialrequisition`;

-- AlterTable
ALTER TABLE `materialrequisition` MODIFY `requestedBy` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `MaterialRequisition` ADD CONSTRAINT `MaterialRequisition_requestedBy_fkey` FOREIGN KEY (`requestedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
