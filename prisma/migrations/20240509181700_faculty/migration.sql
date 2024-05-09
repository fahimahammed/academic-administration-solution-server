/*
  Warnings:

  - Added the required column `emergencyContactNo` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permanentAddress` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presentAddress` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `faculties` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `faculties` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "faculties" ADD COLUMN     "emergencyContactNo" TEXT NOT NULL,
ADD COLUMN     "permanentAddress" TEXT NOT NULL,
ADD COLUMN     "presentAddress" TEXT NOT NULL,
ALTER COLUMN "middleName" DROP NOT NULL,
ALTER COLUMN "profileImage" DROP NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
