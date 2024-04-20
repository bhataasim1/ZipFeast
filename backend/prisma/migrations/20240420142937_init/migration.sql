/*
  Warnings:

  - A unique constraint covering the columns `[storeName]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Merchant` ADD COLUMN `storeName` VARCHAR(191) NOT NULL DEFAULT 'ZipFeast Store';

-- CreateIndex
CREATE UNIQUE INDEX `Merchant_storeName_key` ON `Merchant`(`storeName`);
