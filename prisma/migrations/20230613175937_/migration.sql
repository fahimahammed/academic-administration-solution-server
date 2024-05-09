/*
  Warnings:

  - The primary key for the `student_enrolled_courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `student_enrolled_courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_enrolled_courses" DROP CONSTRAINT "student_enrolled_courses_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "student_enrolled_courses_pkey" PRIMARY KEY ("studentId", "courseId", "academicSemesterId");
