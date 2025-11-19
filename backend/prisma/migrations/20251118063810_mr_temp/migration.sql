/*
  Warnings:

  - You are about to drop the column `requesterId` on the `materialrequisition` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `materialrequisition` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- DropForeignKey
ALTER TABLE `materialrequisition` DROP FOREIGN KEY `MaterialRequisition_requesterId_fkey`;

-- DropIndex
DROP INDEX `MaterialRequisition_requesterId_fkey` ON `materialrequisition`;

-- AlterTable
ALTER TABLE `materialrequisition` DROP COLUMN `requesterId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `remarks` VARCHAR(191) NULL,
    ADD COLUMN `requestedBy` INTEGER NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE `MaterialRequisition` ADD CONSTRAINT `MaterialRequisition_requestedBy_fkey` FOREIGN KEY (`requestedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
