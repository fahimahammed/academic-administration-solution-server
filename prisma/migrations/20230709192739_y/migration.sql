/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `academic_departments` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `academic_faculties` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `academic_semesters` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `buildings` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `faculties` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `offered_course_class_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `offered_course_sections` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `offered_courses` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `semester_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `student_enrolled_course_marks` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `student_enrolled_courses` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `student_semester_payment_histories` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `student_semester_payments` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `student_semester_registration_courses` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `student_semester_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `students` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "academic_departments" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "academic_faculties" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "academic_semesters" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "buildings" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "faculties" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "offered_course_class_schedules" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "offered_course_sections" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "offered_courses" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "semester_registrations" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "student_enrolled_course_marks" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "student_enrolled_courses" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "student_semester_payment_histories" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "student_semester_payments" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "student_semester_registration_courses" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "student_semester_registrations" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "deletedAt";
