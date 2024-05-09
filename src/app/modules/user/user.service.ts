import * as bcrypt from 'bcryptjs';
import config from '../../../config';
import { Admin, User } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { generateAdminId } from './user.utils';

// create admin
const createAdmin = async (user: User, admin: Admin): Promise<User | null> => {
    if (!user.password) {
        user.password = config.userDefaultPassword;
    }

    let newUser = null;

    const result = await prisma.$transaction(async (transactionClient) => {
        const id = await generateAdminId();
    })

    return newUser;
};

export const UserService = {
    createAdmin
};
