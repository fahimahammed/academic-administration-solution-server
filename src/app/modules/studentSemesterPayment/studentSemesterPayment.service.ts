import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
  PrismaClient,
  StudentSemesterPayment,
  StudentSemesterPaymentHistory
} from '@prisma/client';
import { IStudentSemesterPaymentFilterRequest } from './studentSemesterPayment.interfaces';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import {
  studentSemesterPaymentRelationalFields,
  studentSemesterPaymentRelationalFieldsMapper,
  studentSemesterPaymentSearchableFields
} from './studentSemesterPayment.constants';
import prisma from '../../../shared/prisma';
import { IAuthUser } from '../../../interfaces/auth';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';
import { PaymentTypes } from '../../../enums/common';
import axios from 'axios';
import config from '../../../config';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { SslService } from '../ssl/ssl.service';
import { EmailHelper } from '../../../helpers/emailHelper';

const createSemesterPayment = async (
  prismaClient: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
  payload: {
    studentId: string;
    academicSemesterId: string;
    totalPaymentAmount: number;
  }
) => {
  const isExist = await prismaClient.studentSemesterPayment.findFirst({
    where: {
      student: {
        id: payload.studentId
      },
      academicSemester: {
        id: payload.academicSemesterId
      }
    }
  });

  if (!isExist) {
    const dataToInsert = {
      studentId: payload.studentId,
      academicSemesterId: payload.academicSemesterId,
      fullPaymentAmount: payload.totalPaymentAmount,
      partialPaymentAmount: payload.totalPaymentAmount * 0.3,
      totalPaidAmount: 0,
      totalDueAmount: payload.totalPaymentAmount
    };

    await prismaClient.studentSemesterPayment.create({
      data: dataToInsert
    });
  }
};

const getAllFromDB = async (
  filters: IStudentSemesterPaymentFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<StudentSemesterPayment[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: studentSemesterPaymentSearchableFields.map((field) => ({
        student: {
          [field]: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        }
      }))
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (studentSemesterPaymentRelationalFields.includes(key)) {
          return {
            [studentSemesterPaymentRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.StudentSemesterPaymentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.studentSemesterPayment.findMany({
    include: {
      academicSemester: true,
      student: true,
      paymentHistories: true
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
  const total = await prisma.studentSemesterPayment.count({
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

const getMySemesterPayments = async (
  filters: IStudentSemesterPaymentFilterRequest,
  options: IGenericFilterOptions,
  authUser: IAuthUser
): Promise<IGenericResponse<StudentSemesterPayment[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);
  const { searchTerm, ...filterData } = filters;

  const student = await prisma.student.findFirst({
    where: {
      userId: authUser.id
    }
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  filterData.studentId = student.id;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: studentSemesterPaymentSearchableFields.map((field) => ({
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
        if (studentSemesterPaymentRelationalFields.includes(key)) {
          return {
            [studentSemesterPaymentRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.StudentSemesterPaymentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.studentSemesterPayment.findMany({
    include: {
      academicSemester: true,
      student: true
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
  const total = await prisma.studentSemesterPayment.count({
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

const initiatePayment = async (
  payload: {
    paymentType: PaymentTypes;
    academicSemesterId: string;
  },
  authUser: IAuthUser
): Promise<any> => {
  const student = await prisma.student.findFirst({
    where: {
      userId: authUser.id
    }
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const studentSemesterPayment = await prisma.studentSemesterPayment.findFirst({
    where: {
      student: {
        id: student.id
      },
      academicSemester: {
        id: payload.academicSemesterId
      }
    },
    include: {
      academicSemester: true
    }
  });

  if (!studentSemesterPayment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student semester payment not found');
  }

  if (studentSemesterPayment.paymentStatus === PaymentStatus.FULL_PAID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already paid');
  }

  if (
    studentSemesterPayment.paymentStatus === PaymentStatus.PARTIAL_PAID &&
    payload.paymentType !== PaymentTypes.FULL
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already paid partially');
  }

  const isPendingPaymentExist = await prisma.studentSemesterPaymentHistory.findFirst({
    where: {
      studentSemesterPayment: {
        id: studentSemesterPayment.id
      },
      isPaid: false
    }
  });

  if (isPendingPaymentExist) {
    const paymentResponse = await SslService.initPayment({
      transactionId: isPendingPaymentExist.transactionId,
      amount: isPendingPaymentExist.dueAmount,
      customerName: `${student.firstName} ${student.lastName}`,
      customerEmail: student.email,
      customerPhoneNumber: student.contactNo
    });

    return {
      paymentDetails: isPendingPaymentExist,
      paymentUrl: paymentResponse.GatewayPageURL
    };
  }

  let payableAmount = 0;

  if (
    payload.paymentType === PaymentTypes.PARTIAL &&
    studentSemesterPayment.totalPaidAmount === 0
  ) {
    payableAmount = studentSemesterPayment.partialPaymentAmount as number;
  } else {
    payableAmount = studentSemesterPayment.totalDueAmount as number;
  }

  const dataToInsert = {
    studentSemesterPaymentId: studentSemesterPayment.id,
    paidAmount: 0,
    dueAmount: payableAmount,
    paymentMethod: PaymentMethod.ONLINE,
    transactionId: `${student.userId}-${studentSemesterPayment.academicSemester.title
      }-${Date.now()}`
  };

  const studentSemesterPaymentHistory = await prisma.studentSemesterPaymentHistory.create({
    data: dataToInsert
  });

  const paymentResponse = await SslService.initPayment({
    transactionId: studentSemesterPaymentHistory.transactionId,
    amount: studentSemesterPaymentHistory.dueAmount,
    customerName: `${student.firstName} ${student.lastName}`,
    customerEmail: student.email,
    customerPhoneNumber: student.contactNo
  });

  return {
    paymentDetails: studentSemesterPaymentHistory,
    paymentUrl: paymentResponse.GatewayPageURL
  };
};

const completePayment = async (payload: { transactionId: string }): Promise<any> => {
  const paymentDetails = await prisma.studentSemesterPaymentHistory.findUniqueOrThrow({
    where: {
      transactionId: payload.transactionId || ""
    }
  });

  if (!paymentDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment details not found');
  }

  if (paymentDetails.isPaid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already paid');
  }

  const studentSemesterPayment = await prisma.studentSemesterPayment.findFirst({
    where: {
      id: paymentDetails.studentSemesterPaymentId
    }
  });

  if (!studentSemesterPayment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student semester payment not found!');
  }

  await prisma.$transaction(async (prismaTransactionClient) => {

    const dataToUpdate = {
      isPaid: true,
      paidAmount: paymentDetails.dueAmount,
      dueAmount: 0
    };

    await prismaTransactionClient.studentSemesterPaymentHistory.update({
      where: {
        id: paymentDetails.id
      },
      data: dataToUpdate
    });

    await prismaTransactionClient.studentSemesterPayment.update({
      where: {
        id: studentSemesterPayment.id
      },
      data: {
        totalPaidAmount:
          (studentSemesterPayment.totalPaidAmount as number) + paymentDetails.dueAmount,
        totalDueAmount:
          (studentSemesterPayment.totalDueAmount as number) - paymentDetails.dueAmount,
        paymentStatus:
          (studentSemesterPayment.totalDueAmount as number) - paymentDetails.dueAmount === 0
            ? PaymentStatus.FULL_PAID
            : PaymentStatus.PARTIAL_PAID
      }
    });
  });

  const studentSemesterPaymentData = await prisma.studentSemesterPayment.findFirst({
    where: {
      id: studentSemesterPayment.id
    },
    include: {
      student: true
    }
  })

  if (studentSemesterPaymentData) {
    const emailContent = await EmailHelper.createEmailContent(
      {
        userId: studentSemesterPaymentData.student.userId,
        paymentDate: studentSemesterPaymentData.updatedAt,
        transactionId: paymentDetails.transactionId,
        userName: `${studentSemesterPaymentData.student.firstName} ${studentSemesterPaymentData?.student.middleName} ${studentSemesterPaymentData?.student.lastName}`,
        userEmail: studentSemesterPaymentData.student.email,
        amount: paymentDetails.dueAmount,
        paymentType: studentSemesterPaymentData.paymentStatus
      },
      'paymentInvoiceEmail'
    );

    await EmailHelper.sendEmail(studentSemesterPaymentData.student.email, emailContent, "Your Semester Payment Invoice 📑🎓");
  }
  return {
    message: 'Successfully Paid!'
  };
};

const getDataById = async (id: string) => {
  const result = await prisma.studentSemesterPayment.findUniqueOrThrow({
    where: {
      id
    },
    include: {
      student: {
        include: {
          academicDepartment: true,
          academicFaculty: true
        }
      },
      paymentHistories: true,
      academicSemester: true
    }
  })
  return result;
}

export const StudentSemesterPaymentService = {
  createSemesterPayment,
  getAllFromDB,
  getMySemesterPayments,
  initiatePayment,
  completePayment,
  getDataById
};
