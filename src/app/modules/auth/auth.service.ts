import prisma from "../../../shared/prisma";
import * as bcrypt from 'bcrypt'
import { UserStatus } from "@prisma/client";
import { JwtHelper } from "../../../helpers/jwtHelper";

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

// const forgotPassword = async (payload: { email: string }) => {
//     const userData = await prisma.user.findUniqueOrThrow({
//         where: {
//             email: payload.email,
//             status: UserStatus.ACTIVE
//         }
//     });

//     const resetPassToken = jwtHelpers.generateToken(
//         { email: userData.email, role: userData.role },
//         config.jwt.reset_pass_secret as Secret,
//         config.jwt.reset_pass_token_expires_in as string
//     )
//     //console.log(resetPassToken)

//     const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`

//     await emailSender(
//         userData.email,
//         `
//         <div>
//             <p>Dear User,</p>
//             <p>Your password reset link 
//                 <a href=${resetPassLink}>
//                     <button>
//                         Reset Password
//                     </button>
//                 </a>
//             </p>

//         </div>
//         `
//     )
//     //console.log(resetPassLink)
// };

// const resetPassword = async (token: string, payload: { id: string, password: string }) => {
//     console.log({ token, payload })

//     const userData = await prisma.user.findUniqueOrThrow({
//         where: {
//             id: payload.id,
//             status: UserStatus.ACTIVE
//         }
//     });

//     const isValidToken = jwtHelpers.verifyToken(token, config.jwt.reset_pass_secret as Secret)

//     if (!isValidToken) {
//         throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!")
//     }

//     // hash password
//     const password = await bcrypt.hash(payload.password, 12);

//     // update into database
//     await prisma.user.update({
//         where: {
//             id: payload.id
//         },
//         data: {
//             password
//         }
//     })
// };

export const AuthServices = {
    loginUser,
    refreshToken,
    changePassword
}