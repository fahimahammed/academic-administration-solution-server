import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/response';
import { UserService } from './user.service';


const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserService.createAdmin(req);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Admin created successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};


export const UserController = {
    createAdmin
};
