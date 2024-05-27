/*
  Warnings:

  - You are about to drop the column `syncId` on the `academic_departments` table. All the data in the column will be lost.
  - You are about to drop the column `syncId` on the `academic_faculties` table. All the data in the column will be lost.
  - You are about to drop the column `syncId` on the `academic_semesters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "academic_departments" DROP COLUMN "syncId";

-- AlterTable
ALTER TABLE "academic_faculties" DROP COLUMN "syncId";

-- AlterTable
ALTER TABLE "academic_semesters" DROP COLUMN "syncId";
