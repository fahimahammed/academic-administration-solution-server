/*
  Warnings:

  - Added the required column `facultyId` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "faculties" ADD COLUMN     "facultyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "studentId" TEXT NOT NULL;
