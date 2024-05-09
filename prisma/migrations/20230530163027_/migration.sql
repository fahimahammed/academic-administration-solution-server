/*
  Warnings:

  - You are about to drop the `course_pre_requisites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "course_pre_requisites" DROP CONSTRAINT "course_pre_requisites_courseId_fkey";

-- DropTable
DROP TABLE "course_pre_requisites";

-- CreateTable
CREATE TABLE "_CourseToCourse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToCourse_AB_unique" ON "_CourseToCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToCourse_B_index" ON "_CourseToCourse"("B");

-- AddForeignKey
ALTER TABLE "_CourseToCourse" ADD CONSTRAINT "_CourseToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourse" ADD CONSTRAINT "_CourseToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
