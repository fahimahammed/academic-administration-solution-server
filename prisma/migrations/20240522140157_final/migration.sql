/*
  Warnings:

  - Added the required column `semesterRegistrationId` to the `offered_course_class_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offered_course_class_schedules" ADD COLUMN     "semesterRegistrationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "offered_course_class_schedules" ADD CONSTRAINT "offered_course_class_schedules_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
