-- DropForeignKey
ALTER TABLE "offered_courses" DROP CONSTRAINT "offered_courses_semesterRegistrationId_fkey";

-- AlterTable
ALTER TABLE "offered_courses" ALTER COLUMN "semesterRegistrationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "offered_courses" ADD CONSTRAINT "offered_courses_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
