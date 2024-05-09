/*
  Warnings:

  - Added the required column `academicSemesterId` to the `student_completed_courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student_completed_courses" ADD COLUMN     "academicSemesterId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "student_completed_courses" ADD CONSTRAINT "student_completed_courses_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
