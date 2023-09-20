import {
  OfferedCourse,
  Course,
  CourseToPrerequisite,
  OfferedCourseSection,
  StudentSemesterRegistrationCourse
} from '@prisma/client';

export interface ISemesterRegistrationFilterRequest {
  searchTerm?: string | undefined;
  academicSemesterId?: string | undefined;
}

export type EnrollOrWithdrawCoursePayload = {
  offeredCourseId: string;
  offeredCourseSectionId: string;
};

export type AvailableCourseResult = (OfferedCourse & {
  course: Course & {
    prerequisites: (CourseToPrerequisite & {
      prerequisite: Course;
    })[];
  };
} & {
  isTaken?: boolean;
})[];

export type SemesterOfferedCourses = (OfferedCourse & {
  course: Course & {
    prerequisites: (CourseToPrerequisite & {
      prerequisite: Course;
    })[];
  };
  offeredCourseSections: (OfferedCourseSection & { isTaken?: boolean })[];
})[];

export type AlreadyTakenCoursesInSemester = (StudentSemesterRegistrationCourse & {
  offeredCourse: OfferedCourse;
  offeredCourseSection: OfferedCourseSection;
})[];
