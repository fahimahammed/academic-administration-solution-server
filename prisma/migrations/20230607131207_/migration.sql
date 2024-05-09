/*
  Warnings:

  - Made the column `roomId` on table `offered_course_class_schedules` required. This step will fail if there are existing NULL values in that column.
  - Made the column `facultyId` on table `offered_course_class_schedules` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "offered_course_class_schedules" DROP CONSTRAINT "offered_course_class_schedules_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "offered_course_class_schedules" DROP CONSTRAINT "offered_course_class_schedules_roomId_fkey";

-- AlterTable
ALTER TABLE "offered_course_class_schedules" ALTER COLUMN "roomId" SET NOT NULL,
ALTER COLUMN "facultyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "offered_course_class_schedules" ADD CONSTRAINT "offered_course_class_schedules_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offered_course_class_schedules" ADD CONSTRAINT "offered_course_class_schedules_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
