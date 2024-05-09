/*
  Warnings:

  - You are about to drop the `semester_course_class_schedules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `semester_course_faculties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `semester_course_sections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "semester_course_class_schedules" DROP CONSTRAINT "semester_course_class_schedules_courseId_fkey";

-- DropForeignKey
ALTER TABLE "semester_course_class_schedules" DROP CONSTRAINT "semester_course_class_schedules_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "semester_course_class_schedules" DROP CONSTRAINT "semester_course_class_schedules_roomId_fkey";

-- DropForeignKey
ALTER TABLE "semester_course_class_schedules" DROP CONSTRAINT "semester_course_class_schedules_semesterCourseSectionId_fkey";

-- DropForeignKey
ALTER TABLE "semester_course_faculties" DROP CONSTRAINT "semester_course_faculties_academicSemesterId_fkey";

-- DropForeignKey
ALTER TABLE "semester_course_faculties" DROP CONSTRAINT "semester_course_faculties_courseId_fkey";

-- DropForeignKey
ALTER TABLE "semester_course_faculties" DROP CONSTRAINT "semester_course_faculties_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "semester_course_faculties" DROP CONSTRAINT "semester_course_faculties_semesterCourseClassScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "semester_course_faculties" DROP CONSTRAINT "semester_course_faculties_semesterCourseSectionId_fkey";

-- DropForeignKey
ALTER TABLE "semester_course_sections" DROP CONSTRAINT "semester_course_sections_academicSemesterId_fkey";

-- DropForeignKey
ALTER TABLE "semester_course_sections" DROP CONSTRAINT "semester_course_sections_courseId_fkey";

-- DropTable
DROP TABLE "semester_course_class_schedules";

-- DropTable
DROP TABLE "semester_course_faculties";

-- DropTable
DROP TABLE "semester_course_sections";
