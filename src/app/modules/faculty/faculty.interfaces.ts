export interface IFacultyFilterRequest {
  searchTerm?: string | undefined;
  academicFacultyId?: string | undefined;
  academicDepartmentId?: string | undefined;
  studentId?: string | undefined;
  email?: string | undefined;
  contactNo?: string | undefined;
  gender?: string | undefined;
  bloodGroup?: string | undefined;
}

export interface IFacultyAssignOrRemoveCoursesRequest {
  courses: string[];
}

export interface IFacultyMyCoursesRequest {
  academicSemesterId?: string | undefined;
  courseId?: string | undefined;
}

export interface IFacultyMyCourseSchedulesRequest {
  academicSemesterId?: string | undefined;
  courseId?: string | undefined;
}

export interface IFacultyMyCourseStudentsRequest {
  academicSemesterId?: string | undefined;
  courseId?: string | undefined;
  offeredCourseSectionId?: string | undefined;
}
