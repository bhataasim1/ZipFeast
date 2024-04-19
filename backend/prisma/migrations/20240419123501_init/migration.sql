/*
  Warnings:

  - You are about to drop the column `merchantId` on the `AccessToken` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `AccessToken` DROP FOREIGN KEY `AccessToken_merchantId_fkey`;

-- AlterTable
ALTER TABLE `AccessToken` DROP COLUMN `merchantId`;
