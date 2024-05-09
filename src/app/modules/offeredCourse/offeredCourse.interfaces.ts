export interface IOfferedCourseFilterRequest {
  searchTerm?: string | undefined;
  semesterRegistrationId?: string | undefined;
  courseId?: string | undefined;
  academicDepartmentId?: string | undefined;
}

export type CreateOfferedCoursesPayload = {
  semesterRegistrationId: string;
  courseIds: string[];
  academicDepartmentId: string;
};
