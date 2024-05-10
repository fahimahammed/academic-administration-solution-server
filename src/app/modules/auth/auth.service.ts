import prisma from "../../../shared/prisma";
import * as bcrypt from 'bcrypt'
import { UserRole, UserStatus } from "@prisma/client";
import { JwtHelper } from "../../../helpers/jwtHelper";
import ApiError from "../../../errors/apiError";
import httpStatus from "http-status";
import config from "../../../config";
import { EmailHelper } from "../../../helpers/emailHelper";
import { hideEmail } from "../../../shared/utils";
import { IResetPasswordRequest } from "./auth.interface";

const loginUser = async (payload: {
    id: string,
    password: string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            userId: payload.id,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    };

    const accessToken = JwtHelper.createToken({
        id: userData.userId,
        role: userData.role
    });

    const refreshToken = JwtHelper.createRefreshToken({
        id: userData.userId,
        role: userData.role
    });

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: userData.needsPasswordChange
    };
};

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = JwtHelper.verifyRefreshToken(token);
    }
    catch (err) {
        throw new Error("You are not authorized!")
    }

    if (!decodedData) {
        throw new Error("You are not authorized!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            userId: decodedData.id,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = JwtHelper.createToken({
        id: userData.userId,
        role: userData.role
    });

    return {
        accessToken,
        needsPasswordChange: userData.needsPasswordChange
    };

};

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            userId: user.id,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            userId: userData.userId
        },
        data: {
            password: hashedPassword,
            needsPasswordChange: false
        }
    })

    return {
        message: "Password changed successfully!"
    }
};

const forgotPassword = async (payload: { userId: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            userId: payload.userId,
            status: UserStatus.ACTIVE
        }
    });

    if (userData.needsPasswordChange) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'First login with your default password and then change password'
        );
    }

    let profile = null;

    if (userData.role === UserRole.STUDENT) {
        profile = await prisma.student.findUnique({
            where: {
                userId: userData.userId
            }
        })
    } else if (userData.role === UserRole.FACULTY) {
        profile = await prisma.faculty.findUnique({
            where: {
                userId: userData.userId
            }
        })
    } else if (userData.role === UserRole.ADMIN) {
        profile = await prisma.admin.findUnique({
            where: {
                userId: userData.userId
            }
        })
    }

    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
    }

    if (!profile.email) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found in profile');
    }


    const passwordResetToken = await JwtHelper.createPasswordResetToken({
        id: userData.userId
    });
    //console.log(resetPassToken)

    const passwordResetLink = `${config.forgotPasswordResetUiLink}id=${userData.userId}&token=${passwordResetToken}`;

    const emailContent = await EmailHelper.createEmailContent(
        { resetLink: passwordResetLink, userName: profile.firstName },
        'sendForgotPasswordEmail'
    );

    await EmailHelper.sendEmail(profile.email, emailContent);

    await prisma.user.update({
        where: {
            userId: userData.userId
        },
        data: {
            passwordResetToken
        }
    });

    const message = `Password reset link is sent to ${hideEmail(profile.email)}`

    return {
        message
    }
};

const resetPassword = async (
    payload: IResetPasswordRequest
): Promise<{
    message: string;
}> => {
    const { userId, newPassword } = payload;

    const user = await prisma.user.findUnique({
        where: {
            userId
        },
        select: {
            passwordResetToken: true
        }
    })

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }

    if (!user.passwordResetToken) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Password reset token not found');
    }

    const verifiedToken = await JwtHelper.verifyPasswordResetToken(user.passwordResetToken);

    const newHashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
        where: {
            userId
        },
        data: {
            password: newHashedPassword,
            passwordResetToken: null
        }
    })

    return {
        message: 'Password reset successfully. Please login with new password'
    };
};

export const AuthServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}