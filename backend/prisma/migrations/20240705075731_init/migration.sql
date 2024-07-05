/*
  Warnings:

  - Added the required column `price` to the `ServiceBooking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ServiceBooking` ADD COLUMN `price` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ServiceProvider` ADD COLUMN `price` VARCHAR(191) NOT NULL DEFAULT '0';
