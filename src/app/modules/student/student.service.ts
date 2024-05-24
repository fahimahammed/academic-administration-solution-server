import {
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
  studentRelationalFields,
  studentRelationalFieldsMapper,
  studentSearchableFields
} from './student.constants';
import {
  IStudentFilterRequest,
  IStudentMyCourseSchedulesRequest,
  IStudentMyCoursesRequest,
  StudentCreatedEvent,
  StudentUpdatedEvent
} from './student.interfaces';
import { StudentUtils } from './student.utils';

const insertIntoDB = async (data: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true
    }
  });
  return result;
};

const getAllFromDB = async (
  filters: IStudentFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<Student[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: studentSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      }))
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (studentRelationalFields.includes(key)) {
          return {
            [studentRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key]
            }
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key]
            }
          };
        }
      })
    });
  }

  const whereConditions: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.student.findMany({
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true
    },
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
  const total = await prisma.student.count({
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

const getByIdFromDB = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: {
      userId: id
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true
    }
  });
  return result;
};

const updateOneInDB = async (id: string, payload: Partial<Student>): Promise<Student> => {
  const result = await prisma.student.update({
    where: {
      userId: id
    },
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true
    }
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Student> => {
  const result = await prisma.$transaction(async (tx) => {
    const deletedUser = await tx.student.delete({
      where: {
        userId: id
      },
      include: {
        academicFaculty: true,
        academicDepartment: true,
        academicSemester: true
      }
    });

    await tx.user.delete({
      where: {
        userId: deletedUser.userId
      }
    })
    return deletedUser;
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
      OR: [
        {
          status: StudentEnrolledCourseStatus.COMPLETED
        },
        {
          status: StudentEnrolledCourseStatus.FAILED
        }
      ]
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


export const StudentService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getMyCourses,
  getMyCourseSchedules,
  getMyAcademicInfo,
};
