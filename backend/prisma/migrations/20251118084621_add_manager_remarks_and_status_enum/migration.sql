/*
  Warnings:

  - You are about to alter the column `status` on the `materialrequisition` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `materialrequisition` ADD COLUMN `managerRemarks` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'PROCUREMENT_PENDING', 'COMPLETED') NOT NULL DEFAULT 'PENDING';
