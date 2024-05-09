/*
  Warnings:

  - You are about to drop the column `facultyId` on the `faculties` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `students` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `faculties` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "faculties" DROP COLUMN "facultyId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "studentId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "faculties_userId_key" ON "faculties"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculties" ADD CONSTRAINT "faculties_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
