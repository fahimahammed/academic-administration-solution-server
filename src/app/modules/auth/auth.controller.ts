import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status";
import sendResponse from "../../../shared/response";

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await AuthServices.loginUser(req.body);

        const { refreshToken } = result;

        res.cookie('refreshToken', refreshToken, {
            secure: false,
            httpOnly: true
        });

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Logged in successfully!",
            data: result
        })
    }
    catch (err) {
        next(err)
    }
};

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.cookies;

        //console.log(refreshToken)

        const result = await AuthServices.refreshToken(refreshToken);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Access token genereated successfully!",
            data: result
            // data: {
            //     accessToken: result.accessToken,
            //     needPasswordChange: result.needPasswordChange
            // }
        })
    }
    catch (err) {
        next(err)
    }
};

const changePassword = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        const result = await AuthServices.changePassword(user, req.body);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Password Changed successfully",
            data: result
        })
    }
    catch (err) {
        next(err)
    }
};

// const forgotPassword = catchAsync(async (req: Request, res: Response) => {

//     await AuthServices.forgotPassword(req.body);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Check your email!",
//         data: null
//     })
// });

// const resetPassword = catchAsync(async (req: Request, res: Response) => {

//     const token = req.headers.authorization || "";

//     await AuthServices.resetPassword(token, req.body);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Password Reset!",
//         data: null
//     })
// });


export const AuthController = {
    loginUser,
    refreshToken,
    changePassword
};