import { OfferedCourse, Prisma } from '@prisma/client';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import {
  offeredCourseRelationalFields,
  offeredCourseRelationalFieldsMapper,
  offeredCourseSearchableFields
} from './offeredCourse.constants';
import {
  CreateOfferedCoursesPayload,
  IOfferedCourseFilterRequest
} from './offeredCourse.interfaces';

const insertIntoDB = async (payload: CreateOfferedCoursesPayload): Promise<OfferedCourse[]> => {
  const { semesterRegistrationId, courseIds, academicDepartmentId } = payload;
  const insertedOfferedCourses: OfferedCourse[] = [];

  await asyncForEach(courseIds, async (courseId: string) => {
    const isAlreadyExist = await prisma.offeredCourse.findFirst({
      where: {
        semesterRegistrationId,
        courseId,
        academicDepartmentId
      }
    });

    if (!isAlreadyExist) {
      const insertedOfferedCourse = await prisma.offeredCourse.create({
        data: {
          semesterRegistrationId,
          courseId,
          academicDepartmentId
        },
        include: {
          semesterRegistration: true,
          course: true,
          academicDepartment: true
        }
      });
      insertedOfferedCourses.push(insertedOfferedCourse);
    }
  });
  return insertedOfferedCourses;
};

const getAllFromDB = async (
  filters: IOfferedCourseFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<OfferedCourse[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: offeredCourseSearchableFields.map((field) => ({
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
        if (offeredCourseRelationalFields.includes(key)) {
          return {
            [offeredCourseRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.OfferedCourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.offeredCourse.findMany({
    include: {
      semesterRegistration: {
        include: {
          academicSemester: true
        }
      },
      course: true,
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
  const total = await prisma.offeredCourse.count({
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

const getByIdFromDB = async (id: string): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.findUnique({
    where: {
      id
    },
    include: {
      semesterRegistration: {
        include: {
          academicSemester: true
        }
      },
      course: true,
      academicDepartment: true
    }
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<OfferedCourse>
): Promise<OfferedCourse> => {
  const result = await prisma.offeredCourse.update({
    where: {
      id
    },
    data: payload,
    include: {
      semesterRegistration: true,
      course: true,
      academicDepartment: true
    }
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<OfferedCourse> => {
  const result = await prisma.offeredCourse.delete({
    where: {
      id
    },
    include: {
      semesterRegistration: true,
      course: true,
      academicDepartment: true
    }
  });
  return result;
};

export const OfferedCourseService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB
};
