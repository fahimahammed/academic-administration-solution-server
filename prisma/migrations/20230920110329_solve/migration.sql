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
  - A unique constraint covering the columns `[title]` on the table `academic_departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `academic_faculties` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `semesterRegistrationId` to the `offered_course_class_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semesterRegistrationId` to the `offered_course_sections` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE "offered_course_class_schedules" DROP COLUMN "deletedAt",
ADD COLUMN     "semesterRegistrationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "offered_course_sections" DROP COLUMN "deletedAt",
ADD COLUMN     "semesterRegistrationId" TEXT NOT NULL;

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

-- CreateTable
CREATE TABLE "student_academic_infos" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "studentId" TEXT NOT NULL,
    "totalCompletedCredit" INTEGER DEFAULT 0,
    "cgpa" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "student_academic_infos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "academic_departments_title_key" ON "academic_departments"("title");

-- CreateIndex
CREATE UNIQUE INDEX "academic_faculties_title_key" ON "academic_faculties"("title");

-- AddForeignKey
ALTER TABLE "offered_course_sections" ADD CONSTRAINT "offered_course_sections_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offered_course_class_schedules" ADD CONSTRAINT "offered_course_class_schedules_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_academic_infos" ADD CONSTRAINT "student_academic_infos_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
