/*
  Warnings:

  - You are about to drop the column `academicSemesterId` on the `faculties` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "faculties" DROP CONSTRAINT "faculties_academicSemesterId_fkey";

-- AlterTable
ALTER TABLE "faculties" DROP COLUMN "academicSemesterId";
