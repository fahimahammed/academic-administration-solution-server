import { z } from 'zod';
import { FacultyValidation } from './faculty.validations';
import {
  Building,
  Course,
  OfferedCourse,
  OfferedCourseClassSchedule,
  OfferedCourseSection,
  Room
} from '@prisma/client';

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

export type FacultyCreatedEvent = {
  id: string;
  name: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  designation: string;
  email: string;
  contactNo: string;
  profileImage: string;
  academicFaculty: {
    syncId: string;
  };
  academicDepartment: {
    syncId: string;
  };
};

export type FacultyUpdatedEvent = {
  id: string;
  name: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  designation: string;
  email: string;
  contactNo: string;
  profileImage: string;
  academicFaculty: {
    syncId: string;
  };
  academicDepartment: {
    syncId: string;
  };
};
