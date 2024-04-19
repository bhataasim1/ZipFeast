/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `AccessToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `AccessToken` DROP COLUMN `expiresAt`,
    ADD COLUMN `merchantId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `AccessToken` ADD CONSTRAINT `AccessToken_merchantId_fkey` FOREIGN KEY (`merchantId`) REFERENCES `Merchant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
