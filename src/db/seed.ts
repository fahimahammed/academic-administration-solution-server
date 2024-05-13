import { UserRole } from '@prisma/client';
import config from '../config';
import prisma from '../shared/prisma';
import * as bcrypt from 'bcryptjs';

const seedSuperAdmin = async () => {
    const isSeeded = await prisma.user.findFirst({
        where: {
            role: UserRole.SUPER_ADMIN
        }
    })

    const hashPass = await bcrypt.hash(config.superAdminPassword as string, 12);

    if (!isSeeded) {
        await prisma.user.create({
            data: {
                userId: '00001',
                role: UserRole.SUPER_ADMIN,
                password: hashPass,
                needsPasswordChange: false
            }
        });
    }
};

export const SeedDB = {
    seedSuperAdmin
};
