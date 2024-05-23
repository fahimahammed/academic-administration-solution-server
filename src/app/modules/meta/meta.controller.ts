import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/response';
import { MetaServices } from './meta.service';


const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await MetaServices.getDashboardData()
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Meta data fetched successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};


export const MetaController = {
    getDashboardData
};
