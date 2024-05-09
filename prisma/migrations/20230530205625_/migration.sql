/*
  Warnings:

  - You are about to drop the column `academicDepartmentId` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `rooms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_academicDepartmentId_fkey";

-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_courseId_fkey";

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "academicDepartmentId",
DROP COLUMN "courseId";
