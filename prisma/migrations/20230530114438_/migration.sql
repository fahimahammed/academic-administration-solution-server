-- AlterTable
ALTER TABLE "academic_departments" ADD COLUMN     "academicFacultyId" TEXT;

-- CreateTable
CREATE TABLE "academic_faculties" (
    "id" TEXT NOT NULL,
    "syncId" TEXT,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "academic_faculties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "academic_departments" ADD CONSTRAINT "academic_departments_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES "academic_faculties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
