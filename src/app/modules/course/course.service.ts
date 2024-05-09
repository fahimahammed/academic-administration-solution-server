import { Course, CourseFaculty, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { courseSearchableFields } from './course.constants';
import {
  ICourseAssignOrRemoveFacultiesRequest,
  ICourseFilterRequest,
  ICreateCoursePreRequisitesRequest,
  ICreateOrUpdateCourseRequest
} from './course.interfaces';

const assignFaculties = async (
  id: string,
  data: ICourseAssignOrRemoveFacultiesRequest
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: data.faculties.map((facultyId) => ({
      courseId: id,
      facultyId
    }))
  });

  const assignedFaculties = await prisma.courseFaculty.findMany({
    where: {
      courseId: id
    },
    include: {
      faculty: true
    }
  });
  return assignedFaculties;
};

const removeFaculties = async (
  id: string,
  data: ICourseAssignOrRemoveFacultiesRequest
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      courseId: id,
      facultyId: {
        in: data.faculties
      }
    }
  });

  const assignedFaculties = await prisma.courseFaculty.findMany({
    where: {
      courseId: id
    },
    include: {
      faculty: true
    }
  });
  return assignedFaculties;
};

const insertIntoDB = async (data: ICreateOrUpdateCourseRequest): Promise<any> => {
  const { coursePreRequisites, ...courseData } = data;

  const newCourse = await prisma.$transaction(async (transactionClient) => {
    const createdCourse = await transactionClient.course.create({
      data: courseData
    });

    if (!createdCourse) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
    }

    if (coursePreRequisites && coursePreRequisites.length > 0) {
      await asyncForEach(
        coursePreRequisites,
        async (coursePreRequisite: ICreateCoursePreRequisitesRequest) => {
          await transactionClient.courseToPrerequisite.create({
            data: {
              courseId: createdCourse.id,
              prerequisiteId: coursePreRequisite.courseId
            }
          });
        }
      );
    }

    return createdCourse;
  });

  if (newCourse) {
    return prisma.course.findUnique({
      where: {
        id: newCourse.id
      },
      include: {
        prerequisites: {
          include: {
            prerequisite: true
          }
        },
        prerequisiteFor: {
          include: {
            course: true
          }
        }
      }
    });
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
};

const getAllFromDB = async (
  filters: ICourseFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<Course[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: courseSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.CourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.course.findMany({
    include: {
      prerequisites: {
        include: {
          prerequisite: true
        }
      },
      prerequisiteFor: {
        include: {
          course: true
        }
      }
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
  const total = await prisma.course.count({
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

const getByIdFromDB = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.findUnique({
    where: {
      id
    },
    include: {
      prerequisites: {
        include: {
          prerequisite: true
        }
      },
      prerequisiteFor: {
        include: {
          course: true
        }
      }
    }
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: ICreateOrUpdateCourseRequest
): Promise<Course | null> => {
  const { coursePreRequisites, ...courseData } = payload;

  await prisma.$transaction(async (transactionClient) => {
    const updatedCourse = await transactionClient.course.update({
      where: {
        id
      },
      data: courseData
    });

    if (!updatedCourse) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update course');
    }

    if (coursePreRequisites && coursePreRequisites.length > 0) {
      const deletedPreRequisites = coursePreRequisites.filter(
        (coursePreRequisite) => coursePreRequisite.courseId && coursePreRequisite.isDeleted
      );

      const newPreRequisites = coursePreRequisites.filter(
        (coursePreRequisite) => coursePreRequisite.courseId && !coursePreRequisite.isDeleted
      );

      await asyncForEach(
        deletedPreRequisites,
        async (coursePreRequisite: ICreateCoursePreRequisitesRequest) => {
          await transactionClient.courseToPrerequisite.deleteMany({
            where: {
              AND: [
                {
                  courseId: id
                },
                {
                  prerequisiteId: coursePreRequisite.courseId
                }
              ]
            }
          });
        }
      );

      await asyncForEach(
        newPreRequisites,
        async (coursePreRequisite: ICreateCoursePreRequisitesRequest) => {
          await transactionClient.courseToPrerequisite.create({
            data: {
              courseId: id,
              prerequisiteId: coursePreRequisite.courseId
            }
          });
        }
      );
    }

    return updatedCourse;
  });

  const result = await prisma.course.findUnique({
    where: {
      id
    },
    include: {
      prerequisites: {
        include: {
          prerequisite: true
        }
      },
      prerequisiteFor: {
        include: {
          course: true
        }
      }
    }
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Course> => {
  await prisma.courseToPrerequisite.deleteMany({
    where: {
      OR: [
        {
          courseId: id
        },
        {
          prerequisiteId: id
        }
      ]
    }
  });

  const result = await prisma.course.delete({
    where: {
      id
    }
  });
  return result;
};

export const CourseService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  assignFaculties,
  removeFaculties
};
