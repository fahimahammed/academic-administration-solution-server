import { ExamType } from '@prisma/client';

export interface IStudentEnrolledCourseMarkFilterRequest {
  searchTerm?: string | undefined;
  academicSemesterId?: string | undefined;
  studentId?: string | undefined;
  studentEnrolledCourseId?: string | undefined;
  courseId?: string | undefined;
}

export interface IUpdateStudentMarksPayload {
  academicSemesterId: string;
  studentId: string;
  courseId: string;
  examType: ExamType;
  marks: number;
}

export interface IUpdateStudentCourseFinalMarksPayload {
  academicSemesterId: string;
  studentId: string;
  courseId: string;
}
