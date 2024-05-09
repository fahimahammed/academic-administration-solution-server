-- CreateTable
CREATE TABLE "semester_course_sections" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "totalStudents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "courseId" TEXT NOT NULL,
    "academicSemesterId" TEXT NOT NULL,

    CONSTRAINT "semester_course_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semester_course_class_schedules" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "WeekDays" NOT NULL DEFAULT 'SATURDAY',
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "courseId" TEXT NOT NULL,
    "semesterCourseSectionId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,

    CONSTRAINT "semester_course_class_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semester_course_faculties" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "courseId" TEXT NOT NULL,
    "academicSemesterId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "semesterCourseSectionId" TEXT NOT NULL,
    "semesterCourseClassScheduleId" TEXT NOT NULL,

    CONSTRAINT "semester_course_faculties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "semester_course_sections" ADD CONSTRAINT "semester_course_sections_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester_course_sections" ADD CONSTRAINT "semester_course_sections_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester_course_class_schedules" ADD CONSTRAINT "semester_course_class_schedules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester_course_class_schedules" ADD CONSTRAINT "semester_course_class_schedules_semesterCourseSectionId_fkey" FOREIGN KEY ("semesterCourseSectionId") REFERENCES "semester_course_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester_course_class_schedules" ADD CONSTRAINT "semester_course_class_schedules_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester_course_class_schedules" ADD CONSTRAINT "semester_course_class_schedules_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester_course_faculties" ADD CONSTRAINT "semester_course_faculties_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester_course_faculties" ADD CONSTRAINT "semester_course_faculties_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester_course_faculties" ADD CONSTRAINT "semester_course_faculties_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester_course_faculties" ADD CONSTRAINT "semester_course_faculties_semesterCourseSectionId_fkey" FOREIGN KEY ("semesterCourseSectionId") REFERENCES "semester_course_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester_course_faculties" ADD CONSTRAINT "semester_course_faculties_semesterCourseClassScheduleId_fkey" FOREIGN KEY ("semesterCourseClassScheduleId") REFERENCES "semester_course_class_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
