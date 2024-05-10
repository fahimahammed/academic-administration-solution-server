import { OfferedCourseSection, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import {
  offeredCourseSectionRelationalFields,
  offeredCourseSectionRelationalFieldsMapper,
  offeredCourseSectionSearchableFields
} from './offeredCourseSection.constants';
import {
  CreateClassSchedulePayload,
  CreateOfferedCourseSectionPayload,
  IOfferedCourseSectionFilterRequest
} from './offeredCourseSection.interfaces';
import { OfferedCourseSectionUtils } from './offeredCourseSection.utils';

const insertIntoDB = async (
  payload: CreateOfferedCourseSectionPayload
): Promise<OfferedCourseSection | null> => {
  const { offeredCourseId, title, classSchedules } = payload;

  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: offeredCourseId
    }
  });

  if (!offeredCourse || !offeredCourse.semesterRegistrationId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offered Course not found');
  }

  await asyncForEach(classSchedules, async (classSchedule: CreateClassSchedulePayload) => {
    await OfferedCourseSectionUtils.checkIfRoomIsAvailable(classSchedule, offeredCourse);
    await OfferedCourseSectionUtils.checkIfFacultyIsAvailable(classSchedule, offeredCourse);
  });

  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      offeredCourse: { id: offeredCourseId },
      title: title
    }
  });

  if (offeredCourseSection) {
    throw new ApiError(httpStatus.CONFLICT, 'Offered Course Section already exists');
  }

  const createdSection = await prisma.$transaction(async (transactionPrismaClient) => {
    const offeredCourseSection = await transactionPrismaClient.offeredCourseSection.create({
      data: {
        offeredCourseId: offeredCourseId,
        title,
        maxCapacity: payload.maxCapacity,
        semesterRegistrationId: offeredCourse.semesterRegistrationId
      }
    });

    const classSchedulesData = classSchedules.map((classSchedule) => ({
      dayOfWeek: classSchedule.dayOfWeek,
      startTime: classSchedule.startTime,
      endTime: classSchedule.endTime,
      roomId: classSchedule.roomId,
      facultyId: classSchedule.facultyId,
      offeredCourseSectionId: offeredCourseSection.id,
      semesterRegistrationId: offeredCourse.semesterRegistrationId
    }));

    const classSchedulesResult =
      await transactionPrismaClient.offeredCourseClassSchedule.createMany({
        data: classSchedulesData
      });

    return offeredCourseSection;
  });

  const result = await prisma.offeredCourseSection.findFirst({
    where: {
      id: createdSection.id
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
          },
          faculty: true
        }
      }
    }
  });
  return result;
};

const getAllFromDB = async (
  filters: IOfferedCourseSectionFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<OfferedCourseSection[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: offeredCourseSectionSearchableFields.map((field) => ({
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
        if (offeredCourseSectionRelationalFields.includes(key)) {
          return {
            [offeredCourseSectionRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.OfferedCourseSectionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.offeredCourseSection.findMany({
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
          },
          faculty: true
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
  const total = await prisma.offeredCourseSection.count({
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

const getByIdFromDB = async (id: string): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.findUnique({
    where: {
      id
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
          },
          faculty: true
        }
      }
    }
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<OfferedCourseSection>
): Promise<OfferedCourseSection> => {
  const { offeredCourseId, title } = payload;

  const offeredCourse = await prisma.offeredCourseSection.findFirst({
    where: {
      offeredCourse: { id: offeredCourseId },
      title: title
    }
  });

  if (offeredCourse) {
    throw new ApiError(httpStatus.CONFLICT, 'Offered Course Section already exists');
  }

  const result = await prisma.offeredCourseSection.update({
    where: {
      id
    },
    data: payload,
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
          },
          faculty: true
        }
      }
    }
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<OfferedCourseSection> => {
  const result = await prisma.offeredCourseSection.delete({
    where: {
      id
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
          },
          faculty: true
        }
      }
    }
  });
  return result;
};

export const OfferedCourseSectionService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB
};
