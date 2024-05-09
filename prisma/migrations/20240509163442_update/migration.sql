/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fatherContactNo` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fatherName` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fatherOccupation` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localGuardianAddress` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localGuardianContactNo` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localGuardianName` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localGuardianOccupation` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motherContactNo` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motherName` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motherOccupation` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permanentAddress` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presentAddress` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "fatherContactNo" TEXT NOT NULL,
ADD COLUMN     "fatherName" TEXT NOT NULL,
ADD COLUMN     "fatherOccupation" TEXT NOT NULL,
ADD COLUMN     "localGuardianAddress" TEXT NOT NULL,
ADD COLUMN     "localGuardianContactNo" TEXT NOT NULL,
ADD COLUMN     "localGuardianName" TEXT NOT NULL,
ADD COLUMN     "localGuardianOccupation" TEXT NOT NULL,
ADD COLUMN     "motherContactNo" TEXT NOT NULL,
ADD COLUMN     "motherName" TEXT NOT NULL,
ADD COLUMN     "motherOccupation" TEXT NOT NULL,
ADD COLUMN     "permanentAddress" TEXT NOT NULL,
ADD COLUMN     "presentAddress" TEXT NOT NULL,
ALTER COLUMN "profileImage" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
