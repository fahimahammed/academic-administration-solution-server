/*
  Warnings:

  - You are about to drop the column `roomId` on the `offered_course_sections` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `offered_course_sections` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "WeekDays" AS ENUM ('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- DropForeignKey
ALTER TABLE "offered_course_sections" DROP CONSTRAINT "offered_course_sections_roomId_fkey";

-- AlterTable
ALTER TABLE "offered_course_sections" DROP COLUMN "roomId",
DROP COLUMN "title";

-- CreateTable
CREATE TABLE "offered_course_class_schedules" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "WeekDays" NOT NULL DEFAULT 'SATURDAY',
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "offeredCourseSectionId" TEXT NOT NULL,
    "roomId" TEXT,
    "facultyId" TEXT,

    CONSTRAINT "offered_course_class_schedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "offered_course_class_schedules" ADD CONSTRAINT "offered_course_class_schedules_offeredCourseSectionId_fkey" FOREIGN KEY ("offeredCourseSectionId") REFERENCES "offered_course_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offered_course_class_schedules" ADD CONSTRAINT "offered_course_class_schedules_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offered_course_class_schedules" ADD CONSTRAINT "offered_course_class_schedules_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
