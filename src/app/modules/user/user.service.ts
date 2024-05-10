import * as bcrypt from 'bcryptjs';
import config from '../../../config';
import { Admin, Faculty, Prisma, PrismaClient, Student, User, UserRole } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { generateAdminId, generateFacultyId, generateStudentId } from './user.utils';
import { Request } from 'express';
import { IFile } from '../../../interfaces/file';
import { fileUploader } from '../../../helpers/fileUploader';
import { IUserFilterRequest } from './user.interface';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { userSearchableFields } from './user.constants';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';
import { EmailHelper } from '../../../helpers/emailHelper';

// create admin
const createAdmin = async (req: Request): Promise<Admin | null> => {

    const file = req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.admin.profileImage = uploadToCloudinary?.secure_url;
    }

    return await prisma.$transaction(async (transactionClient) => {
        const userId = await generateAdminId();

        const hashPassword = await bcrypt.hash(req.body.password, 12);

        await transactionClient.user.create({
            data: {
                userId,
                role: UserRole.ADMIN,
                password: hashPassword
            }
        });

        const createdAdmin = await transactionClient.admin.create({
            data: {
                ...req.body.admin,
                userId
            }
        });

        const emailContent = await EmailHelper.createEmailContent(
            { userName: createdAdmin.firstName, userId: createdAdmin.userId, userPassword: req.body.password },
            'accountConfirmationEmail'
        );

        await EmailHelper.sendEmail(createdAdmin.email, emailContent, "Welcome to Academic Administration Solution - Your Account Details 🚀");

        return createdAdmin;
    });
};

const createStudent = async (req: Request): Promise<Student | null> => {
    const file = req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.student.profileImage = uploadToCloudinary?.secure_url;
    }

    const { academicSemesterId, academicDepartmentId, academicFacultyId } = req.body.student;

    const academicSemester = await prisma.academicSemester.findUniqueOrThrow({
        where: {
            id: academicSemesterId
        }
    });

    const academicDepartment = await prisma.academicDepartment.findUniqueOrThrow({
        where: {
            id: academicDepartmentId
        }
    });

    const academicFaculty = await prisma.academicFaculty.findUniqueOrThrow({
        where: {
            id: academicFacultyId
        }
    });

    return await prisma.$transaction(async (transactionClient) => {
        const userId = await generateStudentId(academicSemester);

        const hashPassword = await bcrypt.hash(req.body.password, 12);

        const userdata = await transactionClient.user.create({
            data: {
                userId,
                password: hashPassword
            }
        });


        const createdStudent = await transactionClient.student.create({
            data: {
                ...req.body.student,
                userId
            }
        });

        const emailContent = await EmailHelper.createEmailContent(
            { userName: createdStudent.firstName, userId: createdStudent.userId, userPassword: req.body.password },
            'accountConfirmationEmail'
        );

        await EmailHelper.sendEmail(createdStudent.email, emailContent, "Welcome to Academic Administration Solution - Your Account Details 🚀");

        return createdStudent;
    });
};

const createFaculty = async (req: Request): Promise<Faculty | null> => {
    const file = req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.faculty.profileImage = uploadToCloudinary?.secure_url;
    }

    const { academicDepartmentId, academicFacultyId } = req.body.faculty;

    const academicDepartment = await prisma.academicDepartment.findUniqueOrThrow({
        where: {
            id: academicDepartmentId
        }
    });

    const academicFaculty = await prisma.academicFaculty.findUniqueOrThrow({
        where: {
            id: academicFacultyId
        }
    });

    return await prisma.$transaction(async (transactionClient) => {
        const userId = await generateFacultyId();

        const hashPassword = await bcrypt.hash(req.body.password, 12);

        const userdata = await transactionClient.user.create({
            data: {
                userId,
                role: UserRole.FACULTY,
                password: hashPassword
            }
        });


        const createdFaculty = await transactionClient.faculty.create({
            data: {
                ...req.body.faculty,
                userId
            }
        });

        const emailContent = await EmailHelper.createEmailContent(
            { userName: createdFaculty.firstName, userId: createdFaculty.userId, userPassword: req.body.password },
            'accountConfirmationEmail'
        );

        await EmailHelper.sendEmail(createdFaculty.email, emailContent, "Welcome to Academic Administration Solution - Your Account Details 🚀");


        return createdFaculty;
    });
};

const getAllFromDB = async (
    filters: IUserFilterRequest, // Input filters for querying users
    options: IGenericFilterOptions
): Promise<IGenericResponse<Partial<User> | Partial<User>[]>> => {
    const { limit, page, skip } = PaginationHelper.getPaginationOptions(options); // Extract limit, page, and skip values for pagination

    const { searchTerm, ...filterData } = filters; // Extract searchTerm and other filter data
    const andConditions = [];

    if (searchTerm) {
        // Add search conditions if searchTerm is provided
        andConditions.push({
            OR: userSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }

    if (Object.keys(filterData).length > 0) {
        // Add filter conditions if filterData has any keys
        andConditions.push({
            AND: Object.keys(filterData).map((k) => ({
                [k]: (filterData as any)[k]
            }))
        });
    }

    const whereConditions: Prisma.UserWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {}; // Combine all conditions using $and operator

    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            userId: true,
            role: true,
            needsPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true
        }
    })


    const total = await prisma.user.count({
        where: whereConditions
    })
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result // Return the paginated user results
    };
};

const getByIdFromDB = async (id: string): Promise<Partial<User> | null> => {
    const result = await prisma.user.findUnique({
        where: {
            userId: id
        },
        include: {
            student: true,
            faculty: true,
            admin: true
        }
    })
    return result;
};

const updateOneInDB = async (id: string, payload: Partial<User>): Promise<Partial<User> | null> => {
    const result = await prisma.user.update({
        where: {
            userId: id
        },
        data: payload
    })
    return result;
};

const deleteByIdFromDB = async (id: string): Promise<User | null> => {

    const result = await prisma.user.findUnique({
        where: {
            userId: id
        }
    });

    if (result) {
        await prisma.$transaction(async (tx) => {
            if (result.role === UserRole.STUDENT) {
                await tx.student.delete({
                    where: {
                        userId: result.userId
                    }
                })
            } else if (result.role === UserRole.FACULTY) {
                await tx.faculty.delete({
                    where: {
                        userId: result.userId
                    }
                })
            } else if (result.role === UserRole.ADMIN) {
                await tx.admin.delete({
                    where: {
                        userId: result.userId
                    }
                })
            }

            await tx.user.delete({
                where: {
                    userId: id
                }
            });
        })
    }

    return result;
};

const getMyProfile = async (id: string): Promise<Student | Admin | Faculty | null> => {
    const user = await prisma.user.findFirstOrThrow({
        where: {
            userId: id
        }
    })

    let profile = null;

    if (user.role === UserRole.STUDENT) {
        profile = await prisma.student.findFirst({
            where: {
                userId: user.userId
            },
            include: {
                academicSemester: true,
                academicDepartment: true,
                academicFaculty: true
            }
        })

    } else if (user.role === UserRole.FACULTY) {
        profile = await prisma.faculty.findFirst({
            where: {
                userId: user.userId
            },
            include: {
                academicDepartment: true,
                academicFaculty: true
            }
        })

    } else if (user.role === UserRole.ADMIN) {
        profile = await prisma.admin.findFirst({
            where: {
                userId: user.userId
            }
        })
    }

    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
    }
    return profile;
};

export const UserService = {
    createAdmin,
    createStudent,
    createFaculty,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    getMyProfile
};
