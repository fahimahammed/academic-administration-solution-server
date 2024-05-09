/*
  Warnings:

  - You are about to drop the column `endDate` on the `offered_courses` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `offered_courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "offered_courses" DROP COLUMN "endDate",
DROP COLUMN "startDate";
