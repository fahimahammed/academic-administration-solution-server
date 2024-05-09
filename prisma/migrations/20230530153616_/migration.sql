/*
  Warnings:

  - You are about to drop the column `academicDepartmentId` on the `courses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_academicDepartmentId_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "academicDepartmentId";
