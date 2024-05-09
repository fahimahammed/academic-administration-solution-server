import {
  Admin,
  Prisma,
  Student,
  StudentEnrolledCourse,
  StudentEnrolledCourseStatus,
  StudentSemesterRegistrationCourse
} from '@prisma/client';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IAuthUser } from '../../../interfaces/auth';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import {
  adminSearchableFields,
} from './admin.constants';
import {
  IAdminFilterRequest,
  IStudentMyCourseSchedulesRequest,
  IStudentMyCoursesRequest,
} from './admin.interfaces';
import { StudentUtils } from './admin.utils';

const getAllFromDB = async (
  filters: IAdminFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<Admin[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      }))
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key]
        }
      }))
    });
  }


  const whereConditions: Prisma.AdminWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
          createdAt: 'desc'
        }
  });
  const total = await prisma.admin.count({
    where: whereConditions
  });

  return {
    meta: {
      total,
      page,
      limit
    },
    data: result
  };
};

const getMyCourses = async (
  filters: IStudentMyCoursesRequest,
  authUser: IAuthUser
): Promise<StudentEnrolledCourse[]> => {
  if (!filters.academicSemesterId) {
    const currentAcademicSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true
      }
    });

    if (currentAcademicSemester) {
      filters.academicSemesterId = currentAcademicSemester.id;
    }
  }

  const result = await prisma.studentEnrolledCourse.findMany({
    where: {
      ...filters,
      student: {
        userId: authUser.id
      }
    },
    include: {
      course: true
    }
  });
  return result;
};

const getMyCourseSchedules = async (
  filters: IStudentMyCourseSchedulesRequest,
  authUser: IAuthUser
): Promise<StudentSemesterRegistrationCourse[]> => {
  if (!filters.academicSemesterId) {
    const currentAcademicSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true
      }
    });

    if (currentAcademicSemester) {
      filters.academicSemesterId = currentAcademicSemester.id;
    }
  }

  const studentEnrolledCourses = await getMyCourses(filters, authUser);
  const studentEnrolledCourseIds = studentEnrolledCourses.map((item) => item.courseId);

  const result = await prisma.studentSemesterRegistrationCourse.findMany({
    where: {
      student: {
        userId: authUser.id
      },
      semesterRegistration: {
        academicSemester: {
          id: filters.academicSemesterId
        }
      },
      offeredCourse: {
        course: {
          id: {
            in: studentEnrolledCourseIds
          }
        }
      }
    },
    include: {
      // semesterRegistration: true,
      offeredCourse: {
        include: {
          course: true
        }
      },
      offeredCourseSection: {
        include: {
          offeredCourseClassSchedules: {
            include: {
              room: {
                include: {
                  building: true
                }
              },
              faculty: true
            }
          }
        }
      }
    }
  });
  return result;
};

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      userId: id
    }
  });
  return result;
};

const updateOneInDB = async (id: string, payload: Partial<Admin>): Promise<Admin> => {
  const result = await prisma.admin.update({
    where: {
      userId: id
    },
    data: payload
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Admin> => {
  const result = await prisma.admin.delete({
    where: {
      userId: id
    }
  });
  return result;
};

const getMyAcademicInfo = async (authUser: IAuthUser): Promise<any> => {
  const academicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      student: {
        userId: authUser.id
      }
    }
  });

  const enrolledCourses = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        userId: authUser.id
      },
      status: StudentEnrolledCourseStatus.COMPLETED
    },
    include: {
      course: true,
      academicSemester: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  const groupedData = StudentUtils.groupByAcademicSemester(enrolledCourses);

  return { academicInfo, courses: groupedData };
};


export const AdminService = {
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getMyCourses,
  getMyCourseSchedules,
  getMyAcademicInfo,
};
