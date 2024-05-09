-- AlterTable
ALTER TABLE "offered_course_sections" ALTER COLUMN "currentlyEnrolledStudent" DROP NOT NULL,
ALTER COLUMN "currentlyEnrolledStudent" SET DEFAULT 0;
