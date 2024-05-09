/*
  Warnings:

  - Added the required column `title` to the `offered_course_sections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offered_course_sections" ADD COLUMN     "title" TEXT NOT NULL;
