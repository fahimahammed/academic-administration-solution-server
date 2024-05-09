export interface ICourseFilterRequest {
  searchTerm?: string | undefined;
}

export interface ICreateOrUpdateCourseRequest {
  title: string;
  code: string;
  credits: number;
  coursePreRequisites?: ICreateCoursePreRequisitesRequest[] | null;
}

export interface ICreateCoursePreRequisitesRequest {
  courseId: string;
  isDeleted?: null;
}

export interface ICourseAssignOrRemoveFacultiesRequest {
  faculties: string[];
}
