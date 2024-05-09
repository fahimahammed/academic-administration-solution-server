/*
  Warnings:

  - The primary key for the `student_semester_registration_courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `student_semester_registration_courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_semester_registration_courses" DROP CONSTRAINT "student_semester_registration_courses_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "student_semester_registration_courses_pkey" PRIMARY KEY ("semesterRegistrationId", "studentId", "offeredCourseId", "offeredCourseSectionId");
