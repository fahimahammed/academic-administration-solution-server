import * as bcrypt from 'bcryptjs';
import config from '../../../config';
import { Admin, Faculty, Prisma, PrismaClient, Student, User, UserRole } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { generateAdminId } from './user.utils';
import { Request } from 'express';
import { IFile } from '../../../interfaces/file';
import { fileUploader } from '../../../helpers/fileUploader';
import { IUserFilterRequest } from './user.interface';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { userSearchableFields } from './user.constants';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';

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

        return createdAdmin;
    });
};

const createStudent = async (req: Request): Promise<Student | null> => {

    // 
    return null;
};

const getAllFromDB = async (
    filters: IUserFilterRequest, // Input filters for querying users
    options: IGenericFilterOptions
): Promise<IGenericResponse<Partial<User> | Partial<User>[]>> => {
    const { limit, page, skip } = PaginationHelper.getPaginationOptions(options); // Extract limit, page, and skip values for pagination

    const { searchTerm, ...filterData } = filters; // Extract searchTerm and other filter data

    const andConditions = [];

    console.log("searchTerm  ", searchTerm)

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
    const result = await prisma.user.delete({
        where: {
            userId: id
        }
    });

    if (result) {
        if (result.role === UserRole.STUDENT) {
            await prisma.student.delete({
                where: {
                    userId: result.userId
                }
            })
        } else if (result.role === UserRole.FACULTY) {
            await prisma.faculty.delete({
                where: {
                    userId: result.userId
                }
            })
        } else if (result.role === UserRole.ADMIN) {
            await prisma.admin.delete({
                where: {
                    userId: result.userId
                }
            })
        }
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
            }
        })

    } else if (user.role === UserRole.FACULTY) {
        profile = await prisma.faculty.findFirst({
            where: {
                userId: user.userId
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

    console.log(profile)
    return profile;
};

export const UserService = {
    createAdmin,
    createStudent,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    getMyProfile
};
