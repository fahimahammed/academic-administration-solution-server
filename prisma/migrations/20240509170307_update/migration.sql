/*
  Warnings:

  - Added the required column `emergencyContactNo` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "emergencyContactNo" TEXT NOT NULL;
