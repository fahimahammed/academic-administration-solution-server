import { SemesterRegistrationStatus } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import prisma from '../../../shared/prisma';
import { EnrollOrWithdrawCoursePayload } from '../semesterRegistration/semesterRegistration.interfaces';

const enrollIntoCourse = async (
  authUserId: string,
  payload: EnrollOrWithdrawCoursePayload
): Promise<{
  message: string;
}> => {
  const student = await prisma.student.findFirst({
    where: {
      userId: authUserId
    }
  });

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING
    },
    include: {
      academicSemester: true
    }
  });

  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      id: payload.offeredCourseSectionId
    }
  });

  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId
    },
    include: {
      course: true
    }
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester registration not found');
  }

  if (!offeredCourseSection) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offered course section not found');
  }

  if (
    offeredCourseSection?.currentlyEnrolledStudent &&
    offeredCourseSection?.maxCapacity &&
    offeredCourseSection?.currentlyEnrolledStudent >= offeredCourseSection?.maxCapacity
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course section is full');
  }

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.studentSemesterRegistrationCourse.create({
      data: {
        semesterRegistrationId: semesterRegistration.id,
        studentId: student.id,
        offeredCourseId: payload.offeredCourseId,
        offeredCourseSectionId: payload.offeredCourseSectionId
      }
    });

    await transactionClient.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId
      },
      data: {
        currentlyEnrolledStudent: {
          increment: 1
        }
      }
    });

    await prisma.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id
        },
        semesterRegistration: {
          id: semesterRegistration.id
        }
      },
      data: {
        totalCreditsTaken: {
          increment: offeredCourse?.course?.credits || 0
        }
      }
    });
  });

  return {
    message: 'Successfully enrolled into course'
  };
};

const withdrawFromCourse = async (
  authUserId: string,
  payload: EnrollOrWithdrawCoursePayload
): Promise<{
  message: string;
}> => {
  const student = await prisma.student.findFirst({
    where: {
      userId: authUserId
    }
  });

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING
    },
    include: {
      academicSemester: true
    }
  });

  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      id: payload.offeredCourseSectionId
    }
  });

  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId
    },
    include: {
      course: true
    }
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester registration not found');
  }

  if (!offeredCourseSection) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offered course section not found');
  }

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.studentSemesterRegistrationCourse.delete({
      where: {
        semesterRegistrationId_studentId_offeredCourseId: {
          semesterRegistrationId: semesterRegistration.id,
          studentId: student.id,
          offeredCourseId: payload.offeredCourseId
        }
      }
    });

    await transactionClient.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId
      },
      data: {
        currentlyEnrolledStudent: {
          decrement: 1
        }
      }
    });

    await prisma.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id
        },
        semesterRegistration: {
          id: semesterRegistration.id
        }
      },
      data: {
        totalCreditsTaken: {
          decrement: offeredCourse?.course?.credits || 0
        }
      }
    });
  });

  return {
    message: 'Successfully withdrawn from course'
  };
};

export const StudentSemesterRegistrationCourseService = {
  enrollIntoCourse,
  withdrawFromCourse
};
