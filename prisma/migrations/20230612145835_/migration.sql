-- AlterTable
ALTER TABLE "semester_registrations" ADD COLUMN     "maxCredit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "minCredit" INTEGER NOT NULL DEFAULT 0;
