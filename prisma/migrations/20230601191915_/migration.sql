/*
  Warnings:

  - The primary key for the `course_faculties` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `course_faculties` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `course_faculties` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `course_faculties` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `course_faculties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "course_faculties" DROP CONSTRAINT "course_faculties_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD CONSTRAINT "course_faculties_pkey" PRIMARY KEY ("courseId", "facultyId");
