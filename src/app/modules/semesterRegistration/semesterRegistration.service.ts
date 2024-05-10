import {
  Course,
  OfferedCourse,
  Prisma,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentEnrolledCourseStatus,
  StudentSemesterRegistration,
  StudentSemesterRegistrationCourse
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { StudentSemesterRegistrationCourseService } from '../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.service';
import {
  semesterRegistrationRelationalFields,
  semesterRegistrationRelationalFieldsMapper,
  semesterRegistrationSearchableFields
} from './semesterRegistration.constants';
import {
  AvailableCourseResult,
  EnrollOrWithdrawCoursePayload,
  ISemesterRegistrationFilterRequest
} from './semesterRegistration.interfaces';
import { SemesterRegistrationUtils } from './semesterRegistration.utils';
import { StudentEnrolledCourseMarkService } from '../studentEnrolledCourseMark/studentEnrolledCourseMark.service';
import { StudentSemesterPaymentService } from '../studentSemesterPayment/studentSemesterPayment.service';

const startNewSemester = async (
  id: string
): Promise<{
  message: string;
}> => {
  const semesterRegistration = await prisma.semesterRegistration.findUnique({
    where: {
      id
    },
    include: {
      academicSemester: true
    }
  });

  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester Registration not found');
  }

  if (semesterRegistration.status !== SemesterRegistrationStatus.ENDED) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Semester Registration is not ended yet');
  }

  if (semesterRegistration.academicSemester?.isCurrent) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Semester is already started');
  }

  await prisma.$transaction(async (prismaTransactionClient) => {
    await prismaTransactionClient.academicSemester.updateMany({
      where: {
        isCurrent: true
      },
      data: {
        isCurrent: false
      }
    });

    await prismaTransactionClient.academicSemester.update({
      where: {
        id: semesterRegistration.academicSemesterId
      },
      data: {
        isCurrent: true
      }
    });

    const studentSemesterRegistrations = await prisma.studentSemesterRegistration.findMany({
      where: {
        semesterRegistration: {
          id
        },
        isConfirmed: true
      }
    });

    await asyncForEach(
      studentSemesterRegistrations,
      async (studentSemReg: StudentSemesterRegistration) => {
        if (studentSemReg.totalCreditsTaken) {
          const totalSemesterPaymentAmount = studentSemReg.totalCreditsTaken * 5000;

          await StudentSemesterPaymentService.createSemesterPayment(prismaTransactionClient, {
            studentId: studentSemReg.studentId,
            academicSemesterId: semesterRegistration.academicSemesterId,
            totalPaymentAmount: totalSemesterPaymentAmount
          });
        }

        const studentSemesterRegistrationCourses =
          await prismaTransactionClient.studentSemesterRegistrationCourse.findMany({
            where: {
              semesterRegistration: {
                id
              },
              student: {
                id: studentSemReg.studentId
              }
            },
            include: {
              offeredCourse: {
                include: {
                  course: true
                }
              }
            }
          });

        await asyncForEach(
          studentSemesterRegistrationCourses,
          async (
            item: StudentSemesterRegistrationCourse & {
              offeredCourse: OfferedCourse & {
                course: Course;
              };
            }
          ) => {
            const isEnrolledCourseExist =
              await prismaTransactionClient.studentEnrolledCourse.findFirst({
                where: {
                  student: { id: item.studentId },
                  course: { id: item.offeredCourse.courseId },
                  academicSemester: { id: semesterRegistration.academicSemesterId }
                }
              });

            if (!isEnrolledCourseExist) {
              const enrolledCourseData = {
                studentId: item.studentId,
                courseId: item.offeredCourse.courseId,
                academicSemesterId: semesterRegistration.academicSemesterId
              };

              const createdStudentEnrolledCourse =
                await prismaTransactionClient.studentEnrolledCourse.create({
                  data: enrolledCourseData
                });

              await StudentEnrolledCourseMarkService.createStudentEnrolledCourseDefaultMarks(
                prismaTransactionClient,
                {
                  studentId: item.studentId,
                  studentEnrolledCourseId: createdStudentEnrolledCourse.id,
                  academicSemesterId: semesterRegistration.academicSemesterId
                }
              );
            }
          }
        );
      }
    );
  });

  return {
    message: 'Semester started successfully'
  };
};

const insertIntoDB = async (data: SemesterRegistration): Promise<SemesterRegistration> => {
  const isAnyRegUpcomingOrOnGoing = await prisma.semesterRegistration.findFirst({
    where: {
      OR: [
        {
          status: SemesterRegistrationStatus.ONGOING
        },
        {
          status: SemesterRegistrationStatus.UPCOMING
        }
      ]
    }
  });

  if (isAnyRegUpcomingOrOnGoing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isAnyRegUpcomingOrOnGoing.status?.toLowerCase()} registration`
    );
  }

  const result = await prisma.semesterRegistration.create({
    data,
    include: {
      academicSemester: true
    }
  });
  return result;
};

const confirmMyRegistration = async (
  authUserId: string
): Promise<{
  message: string;
}> => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING
    }
  });

  const studentSemesterRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      semesterRegistration: {
        id: semesterRegistration?.id
      },
      student: {
        userId: authUserId
      }
    }
  });

  if (!studentSemesterRegistration) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not registered for this semester');
  }

  if (
    studentSemesterRegistration.totalCreditsTaken &&
    semesterRegistration?.minCredit &&
    semesterRegistration?.maxCredit &&
    (studentSemesterRegistration.totalCreditsTaken < semesterRegistration.minCredit ||
      studentSemesterRegistration.totalCreditsTaken > semesterRegistration.maxCredit)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can only take ${semesterRegistration.minCredit} to ${semesterRegistration.maxCredit} credits`
    );
  }

  await prisma.studentSemesterRegistration.update({
    where: {
      id: studentSemesterRegistration.id
    },
    data: {
      isConfirmed: true
    }
  });

  return { message: 'Registration confirmed' };
};

const getMyRegistration = async (
  authUserId: string
): Promise<{
  semesterRegistration: SemesterRegistration | null;
  studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [SemesterRegistrationStatus.ONGOING, SemesterRegistrationStatus.UPCOMING]
      }
    },
    include: {
      academicSemester: true
    }
  });

  const studentSemesterRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      semesterRegistration: {
        id: semesterRegistration?.id
      },
      student: {
        userId: authUserId
      }
    }
  });

  return { semesterRegistration, studentSemesterRegistration };
};

const getMySemesterRegistrationCourses = async (
  authUserId: string
): Promise<AvailableCourseResult> => {
  const student = await prisma.student.findFirst({
    where: {
      userId: authUserId
    }
  });

  const studentCompletedCourses = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        id: student?.id
      },
      status: StudentEnrolledCourseStatus.COMPLETED
    },
    include: {
      course: true
    }
  });

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [SemesterRegistrationStatus.ONGOING, SemesterRegistrationStatus.UPCOMING]
      }
    },
    include: {
      academicSemester: true
    }
  });

  if (!semesterRegistration) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No semester registration found');
  }

  const studentCurrentSemesterTakenCourses =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        student: {
          id: student?.id
        },
        semesterRegistration: {
          id: semesterRegistration?.id
        }
      },
      include: {
        offeredCourse: true,
        offeredCourseSection: true
      }
    });

  const offeredCourses = await prisma.offeredCourse.findMany({
    where: {
      semesterRegistration: {
        id: semesterRegistration?.id
      },
      academicDepartment: {
        id: student?.academicDepartmentId
      }
    },
    include: {
      course: {
        include: {
          prerequisites: {
            include: {
              prerequisite: true
            }
          }
        }
      },
      offeredCourseSections: {
        include: {
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
      }
    }
  });

  const availableCourses = SemesterRegistrationUtils.getAvailableCourses(
    offeredCourses,
    studentCompletedCourses,
    studentCurrentSemesterTakenCourses
  );

  return availableCourses;
};

const startMyRegistration = async (
  authUserId: string
): Promise<{
  semesterRegistration: SemesterRegistration | null;
  studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
  const student = await prisma.student.findFirst({
    where: {
      userId: authUserId
    }
  });

  if (!student) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student not found');
  }

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [SemesterRegistrationStatus.ONGOING, SemesterRegistrationStatus.UPCOMING]
      }
    },
    include: {
      academicSemester: true
    }
  });

  if (semesterRegistration?.status === SemesterRegistrationStatus.UPCOMING) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Registration is not started yet');
  }

  let studentSemesterRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      semesterRegistration: {
        id: semesterRegistration?.id
      },
      student: {
        id: student?.id
      }
    }
  });

  if (!studentSemesterRegistration) {
    studentSemesterRegistration = await prisma.studentSemesterRegistration.create({
      data: {
        student: {
          connect: {
            id: student?.id
          }
        },
        semesterRegistration: {
          connect: {
            id: semesterRegistration?.id
          }
        }
      }
    });
  }

  return { semesterRegistration, studentSemesterRegistration };
};

const enrollIntoCourse = async (
  authUserId: string,
  payload: EnrollOrWithdrawCoursePayload
): Promise<{
  message: string;
}> => {
  return StudentSemesterRegistrationCourseService.enrollIntoCourse(authUserId, payload);
};

const withdrawFromCourse = async (
  authUserId: string,
  payload: EnrollOrWithdrawCoursePayload
): Promise<{
  message: string;
}> => {
  return StudentSemesterRegistrationCourseService.withdrawFromCourse(authUserId, payload);
};

const getAllFromDB = async (
  filters: ISemesterRegistrationFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: semesterRegistrationSearchableFields.map((field) => ({
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
        if (semesterRegistrationRelationalFields.includes(key)) {
          return {
            [semesterRegistrationRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.SemesterRegistrationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.semesterRegistration.findMany({
    include: {
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
  const total = await prisma.semesterRegistration.count({
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

const getByIdFromDB = async (id: string): Promise<SemesterRegistration | null> => {
  const result = await prisma.semesterRegistration.findUnique({
    where: {
      id
    },
    include: {
      academicSemester: true
    }
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration> => {
  const semesterRegistration = await getByIdFromDB(id);

  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester Registration not found');
  }

  if (
    payload.status &&
    semesterRegistration.status === SemesterRegistrationStatus.UPCOMING &&
    payload.status !== SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can only move from UPCOMING to ONGOING');
  }

  if (
    payload.status &&
    semesterRegistration.status === SemesterRegistrationStatus.ONGOING &&
    payload.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can only move from ONGOING to ENDED');
  }

  const result = await prisma.semesterRegistration.update({
    where: {
      id
    },
    data: payload,
    include: {
      academicSemester: true
    }
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<SemesterRegistration> => {
  const result = await prisma.semesterRegistration.delete({
    where: {
      id
    },
    include: {
      academicSemester: true
    }
  });
  return result;
};

export const SemesterRegistrationService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getMyRegistration,
  startMyRegistration,
  getMySemesterRegistrationCourses,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  startNewSemester
};
