-- CreateEnum
CREATE TYPE "SemesterRegistrationStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED');

-- AlterTable
ALTER TABLE "semester_registrations" ADD COLUMN     "status" "SemesterRegistrationStatus" NOT NULL DEFAULT 'UPCOMING';
