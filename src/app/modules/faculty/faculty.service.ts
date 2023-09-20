import { CourseFaculty, Faculty, Prisma, Student } from '@prisma/client';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IAuthUser } from '../../../interfaces/auth';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import {
  facultyRelationalFields,
  facultyRelationalFieldsMapper,
  facultySearchableFields
} from './faculty.constants';
import {
  IFacultyAssignOrRemoveCoursesRequest,
  IFacultyFilterRequest,
  IFacultyMyCourseStudentsRequest,
  IFacultyMyCoursesRequest
} from './faculty.interfaces';

const getMyCourseStudents = async (
  filters: IFacultyMyCourseStudentsRequest,
  options: IGenericFilterOptions,
  // eslint-disable-next-line no-unused-vars
  authUser: IAuthUser
): Promise<IGenericResponse<Student[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);

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

  const offeredCourseSections = await prisma.studentSemesterRegistrationCourse.findMany({
    where: {
      offeredCourse: {
        course: {
          id: filters.courseId
        }
      },
      offeredCourseSection: {
        offeredCourse: {
          semesterRegistration: {
            academicSemester: {
              id: filters.academicSemesterId
            }
          }
        },
        id: filters.offeredCourseSectionId
      }
    },
    include: {
      student: true
    },
    take: limit,
    skip
  });

  const students = offeredCourseSections.map(
    (offeredCourseSection) => offeredCourseSection.student
  );

  const total = await prisma.studentSemesterRegistrationCourse.count({
    where: {
      offeredCourse: {
        course: {
          id: filters.courseId
        }
      },
      offeredCourseSection: {
        offeredCourse: {
          semesterRegistration: {
            academicSemester: {
              id: filters.academicSemesterId
            }
          }
        },
        id: filters.offeredCourseSectionId
      }
    }
  });

  return {
    meta: {
      total,
      page,
      limit
    },
    data: students
  };
};

const getMyCourses = async (
  filters: IFacultyMyCoursesRequest,
  authUser: IAuthUser
): Promise<any> => {
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

  const offeredCourseSections = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        some: {
          faculty: {
            facultyId: authUser.id
          }
        }
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemester: {
            id: filters.academicSemesterId
          }
        }
      }
    },
    include: {
      offeredCourse: {
        include: {
          course: true
        }
      },
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true
            }
          }
        }
      }
    }
  });

  const courseAndClassSchedules = offeredCourseSections.reduce((acc: any, obj: any) => {
    const course = obj.offeredCourse.course;
    const classSchedules = obj.offeredCourseClassSchedules;

    // Check if the course already exists in the accumulator
    const existingCourse = acc.find((item: any) => item.course.id === course.id);

    if (existingCourse) {
      // If the course exists, add the section object with class schedules to its existing array
      existingCourse.sections.push({
        section: obj,
        classSchedules
      });
    } else {
      // If the course doesn't exist, create a new entry in the accumulator
      acc.push({
        course,
        sections: [
          {
            section: obj,
            classSchedules
          }
        ]
      });
    }

    return acc;
  }, []);
  return courseAndClassSchedules;
};

const assignCourses = async (
  id: string,
  data: IFacultyAssignOrRemoveCoursesRequest
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: data.courses.map((courseId) => ({
      courseId,
      facultyId: id
    }))
  });

  const assignedCourses = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id
    },
    include: {
      course: true
    }
  });
  return assignedCourses;
};

const removeCourses = async (
  id: string,
  data: IFacultyAssignOrRemoveCoursesRequest
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      facultyId: id,
      courseId: {
        in: data.courses
      }
    }
  });

  const assignedCourses = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id
    },
    include: {
      course: true
    }
  });
  return assignedCourses;
};

const insertIntoDB = async (data: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data,
    include: {
      academicFaculty: true,
      academicDepartment: true
    }
  });
  return result;
};

const getAllFromDB = async (
  filters: IFacultyFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<Faculty[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: facultySearchableFields.map((field) => ({
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
        if (facultyRelationalFields.includes(key)) {
          return {
            [facultyRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.FacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.faculty.findMany({
    include: {
      academicFaculty: true,
      academicDepartment: true
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
  const total = await prisma.faculty.count({
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

const getByIdFromDB = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: {
      id
    },
    include: {
      academicFaculty: true,
      academicDepartment: true
    }
  });
  return result;
};

const updateOneInDB = async (id: string, payload: Partial<Faculty>): Promise<Faculty> => {
  const result = await prisma.faculty.update({
    where: {
      id
    },
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true
    }
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Faculty> => {
  const result = await prisma.faculty.delete({
    where: {
      id
    },
    include: {
      academicFaculty: true,
      academicDepartment: true
    }
  });
  return result;
};


export const FacultyService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  assignCourses,
  removeCourses,
  getMyCourses,
  getMyCourseStudents
};
