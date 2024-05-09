import * as bcrypt from 'bcryptjs';
import config from '../../../config';
import { Admin, User, UserRole } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { generateAdminId } from './user.utils';
import { Request } from 'express';
import { IFile } from '../../../interfaces/file';
import { fileUploader } from '../../../helpers/fileUploader';

// create admin
const createAdmin = async (req: Request): Promise<Admin | null> => {
    console.log(req.body)
    // if (!req.body.password) {
    //     user.password = config.userDefaultPassword;
    // }

    return await prisma.$transaction(async (transactionClient) => {
        const userId = await generateAdminId();

        const file = req.file as IFile;

        const hashPassword = await bcrypt.hash(req.body.password, 12);

        await transactionClient.user.create({
            data: {
                userId,
                role: UserRole.ADMIN,
                password: hashPassword
            }
        });

        if (file) {
            const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
            req.body.admin.profileImage = uploadToCloudinary?.secure_url;
        }

        const createdAdmin = await transactionClient.admin.create({
            data: {
                ...req.body.admin,
                userId
            }
        });

        return createdAdmin;
    });
};

export const UserService = {
    createAdmin
};
