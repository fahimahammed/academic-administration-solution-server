import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/response';
import { UserService } from './user.service';
import pick from '../../../shared/pick';
import { userFilterableFields } from './user.constants';


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

const createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserService.createStudent(req);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Student created successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const createFaculty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserService.createFaculty(req);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Faculty created successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getAllFromDB = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = pick(req.query, userFilterableFields);
        const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
        const result = await UserService.getAllFromDB(filters, options);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Users fetched successfully',
            meta: result.meta,
            data: result.data
        });
    } catch (error) {
        next(error);
    }
};

const getByIdFromDB = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await UserService.getByIdFromDB(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User fetched successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const updateOneInDB = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await UserService.updateOneInDB(id, req.body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User updated successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const deleteByIdFromDB = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await UserService.deleteByIdFromDB(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User deleted successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        const result = await UserService.getMyProfile(user.id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Profile fetched successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};


export const UserController = {
    createAdmin,
    createStudent,
    createFaculty,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    getMyProfile
};
