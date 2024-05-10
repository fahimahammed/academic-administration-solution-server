/*
  Warnings:

  - You are about to drop the column `semesterRegistrationId` on the `offered_course_class_schedules` table. All the data in the column will be lost.
  - Made the column `semesterRegistrationId` on table `offered_courses` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "offered_course_class_schedules" DROP CONSTRAINT "offered_course_class_schedules_semesterRegistrationId_fkey";

-- DropForeignKey
ALTER TABLE "offered_courses" DROP CONSTRAINT "offered_courses_semesterRegistrationId_fkey";

-- AlterTable
ALTER TABLE "offered_course_class_schedules" DROP COLUMN "semesterRegistrationId";

-- AlterTable
ALTER TABLE "offered_courses" ALTER COLUMN "semesterRegistrationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "offered_courses" ADD CONSTRAINT "offered_courses_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
