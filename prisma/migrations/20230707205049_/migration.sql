/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `academic_departments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "academic_departments_title_key" ON "academic_departments"("title");
