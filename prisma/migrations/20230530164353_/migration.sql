/*
  Warnings:

  - You are about to drop the `_CourseToCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CourseToCourse" DROP CONSTRAINT "_CourseToCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToCourse" DROP CONSTRAINT "_CourseToCourse_B_fkey";

-- DropTable
DROP TABLE "_CourseToCourse";

-- CreateTable
CREATE TABLE "course_to_prerequisites" (
    "courseId" TEXT NOT NULL,
    "prerequisiteId" TEXT NOT NULL,

    CONSTRAINT "course_to_prerequisites_pkey" PRIMARY KEY ("courseId","prerequisiteId")
);

-- AddForeignKey
ALTER TABLE "course_to_prerequisites" ADD CONSTRAINT "course_to_prerequisites_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_to_prerequisites" ADD CONSTRAINT "course_to_prerequisites_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
