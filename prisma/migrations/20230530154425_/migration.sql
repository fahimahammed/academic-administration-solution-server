/*
  Warnings:

  - You are about to drop the column `code` on the `course_pre_requisites` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `course_pre_requisites` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "course_pre_requisites" DROP COLUMN "code",
DROP COLUMN "title";
