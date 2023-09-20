import {
  ExamType,
  PrismaClient,
  StudentEnrolledCourse,
  StudentEnrolledCourseMark,
  StudentEnrolledCourseStatus
} from '@prisma/client';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import {
  IStudentEnrolledCourseMarkFilterRequest,
  IUpdateStudentCourseFinalMarksPayload,
  IUpdateStudentMarksPayload
} from './studentEnrolledCourseMark.interfaces';
import { IAuthUser } from '../../../interfaces/auth';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';
import { StudentEnrolledCourseMarkUtils } from './studentEnrolledCourseMark.utils';

const createStudentEnrolledCourseDefaultMarks = async (
  prismaClient: Omit<
    PrismaClient<
      {
        errorFormat: 'minimal';
      },
      never,
      false
    >,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
  >,
  payload: {
    studentId: string;
    studentEnrolledCourseId: string;
    academicSemesterId: string;
  }
) => {
  const { studentId, studentEnrolledCourseId, academicSemesterId } = payload;

  const studentEnrolledCourseMarkMidterm = await prismaClient.studentEnrolledCourseMark.findFirst({
    where: {
      student: {
        id: studentId
      },
      studentEnrolledCourse: {
        id: studentEnrolledCourseId
      },
      academicSemester: {
        id: academicSemesterId
      },
      examType: ExamType.MIDTERM
    }
  });

  if (!studentEnrolledCourseMarkMidterm) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: studentId
          }
        },
        studentEnrolledCourse: {
          connect: {
            id: studentEnrolledCourseId
          }
        },
        academicSemester: {
          connect: {
            id: academicSemesterId
          }
        },
        examType: ExamType.MIDTERM
      }
    });
  }

  const studentEnrolledCourseMarkFinalTerm = await prismaClient.studentEnrolledCourseMark.findFirst(
    {
      where: {
        student: {
          id: studentId
        },
        studentEnrolledCourse: {
          id: studentEnrolledCourseId
        },
        academicSemester: {
          id: academicSemesterId
        },
        examType: ExamType.FINAL
      }
    }
  );

  if (!studentEnrolledCourseMarkFinalTerm) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: studentId
          }
        },
        studentEnrolledCourse: {
          connect: {
            id: studentEnrolledCourseId
          }
        },
        academicSemester: {
          connect: {
            id: academicSemesterId
          }
        },
        examType: ExamType.FINAL
      }
    });
  }
};

const getAllFromDB = async (
  filters: IStudentEnrolledCourseMarkFilterRequest,
  options: IGenericFilterOptions
  // authUser: IAuthUser
): Promise<IGenericResponse<StudentEnrolledCourseMark[]>> => {
  const { limit, page } = PaginationHelper.getPaginationOptions(options);

  const marks = await prisma.studentEnrolledCourseMark.findMany({
    where: {
      student: {
        id: filters.studentId
      },
      academicSemester: {
        id: filters.academicSemesterId
      },
      studentEnrolledCourse: {
        course: {
          id: filters.courseId
        }
      }
    },
    include: {
      studentEnrolledCourse: {
        include: {
          course: true
        }
      },
      student: true
    }
  });

  return {
    meta: {
      total: marks.length,
      page,
      limit
    },
    data: marks
  };

};

const getMyCourseMarks = async (
  filters: IStudentEnrolledCourseMarkFilterRequest,
  options: IGenericFilterOptions,
  authUser: IAuthUser
): Promise<IGenericResponse<StudentEnrolledCourseMark[]>> => {
  const { limit, page } = PaginationHelper.getPaginationOptions(options);
  // const { searchTerm, ...filterData } = filters;

  const student = await prisma.student.findFirst({
    where: {
      studentId: authUser.id
    }
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const marks = await prisma.studentEnrolledCourseMark.findMany({
    where: {
      student: {
        id: student.id
      },
      academicSemester: {
        id: filters.academicSemesterId
      },
      studentEnrolledCourse: {
        course: {
          id: filters.courseId
        }
      }
    },
    include: {
      studentEnrolledCourse: {
        include: {
          course: true
        }
      }
    }
  });

  return {
    meta: {
      total: marks.length,
      page,
      limit
    },
    data: marks
  };
};

const updateStudentMarks = async (
  payload: IUpdateStudentMarksPayload
): Promise<StudentEnrolledCourseMark> => {
  const { academicSemesterId, studentId, courseId, examType, marks } = payload;

  const studentEnrolledCourseMark = await prisma.studentEnrolledCourseMark.findFirst({
    where: {
      student: {
        id: studentId
      },
      studentEnrolledCourse: {
        course: {
          id: courseId
        }
      },
      academicSemester: {
        id: academicSemesterId
      },
      examType
    }
  });

  if (!studentEnrolledCourseMark) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student enrolled course marks not found');
  }

  const gradeAndPoints = StudentEnrolledCourseMarkUtils.getGradeFromMarksAndPoints(marks);

  const updatedMarks = await prisma.studentEnrolledCourseMark.update({
    where: {
      id: studentEnrolledCourseMark.id
    },
    data: {
      marks,
      grade: gradeAndPoints.grade
    }
  });

  return updatedMarks;
};

const updateStudentCourseFinalMarks = async (
  payload: IUpdateStudentCourseFinalMarksPayload
): Promise<StudentEnrolledCourse | null> => {
  const { academicSemesterId, studentId, courseId } = payload;

  let studentEnrolledCourse = await prisma.studentEnrolledCourse.findFirst({
    where: {
      student: {
        id: studentId
      },
      course: {
        id: courseId
      },
      academicSemester: {
        id: academicSemesterId
      }
    }
  });

  if (
    studentEnrolledCourse &&
    studentEnrolledCourse.status === StudentEnrolledCourseStatus.COMPLETED
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Final marks already updated');
  }

  const studentEnrolledCourseMarks = await prisma.studentEnrolledCourseMark.findMany({
    where: {
      student: {
        id: studentId
      },
      studentEnrolledCourse: {
        course: {
          id: courseId
        }
      },
      academicSemester: {
        id: academicSemesterId
      }
    }
  });

  if (!studentEnrolledCourseMarks.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student enrolled course marks not found');
  }

  const midtermMarks =
    studentEnrolledCourseMarks.find((item) => item.examType === ExamType.MIDTERM)?.marks || 0;
  const finalMarks =
    studentEnrolledCourseMarks.find((item) => item.examType === ExamType.FINAL)?.marks || 0;

  const totalFinalMarks = Math.ceil(0.4 * midtermMarks + 0.6 * finalMarks);

  const finalGradeAndPoints =
    StudentEnrolledCourseMarkUtils.getGradeFromMarksAndPoints(totalFinalMarks);

  await prisma.studentEnrolledCourse.updateMany({
    where: {
      student: {
        id: studentId
      },
      course: {
        id: courseId
      },
      academicSemester: {
        id: academicSemesterId
      }
    },
    data: {
      grade: finalGradeAndPoints.grade,
      point: finalGradeAndPoints.points,
      totalMarks: totalFinalMarks,
      status: StudentEnrolledCourseStatus.COMPLETED
    }
  });

  studentEnrolledCourse = await prisma.studentEnrolledCourse.findFirst({
    where: {
      student: {
        id: studentId
      },
      course: {
        id: courseId
      },
      academicSemester: {
        id: academicSemesterId
      }
    }
  });

  const grades = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        id: studentId
      },
      status: StudentEnrolledCourseStatus.COMPLETED
    },
    include: {
      course: true
    }
  });

  const calculatedData = StudentEnrolledCourseMarkUtils.calculateTotalCGPAAndCredit(grades);

  const studentAcademicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      student: {
        id: studentId
      }
    }
  });

  if (studentAcademicInfo) {
    await prisma.studentAcademicInfo.update({
      where: {
        id: studentAcademicInfo.id
      },
      data: {
        cgpa: calculatedData.cgpa,
        totalCompletedCredit: calculatedData.totalCompletedCredit
      }
    });
  } else {
    await prisma.studentAcademicInfo.create({
      data: {
        student: {
          connect: {
            id: studentId
          }
        },
        cgpa: calculatedData.cgpa,
        totalCompletedCredit: calculatedData.totalCompletedCredit
      }
    });
  }

  return studentEnrolledCourse;
};

export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMarks,
  getAllFromDB,
  getMyCourseMarks,
  updateStudentMarks,
  updateStudentCourseFinalMarks
};
