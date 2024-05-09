import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/response';
import { CourseService } from './course.service';
import pick from '../../../shared/pick';
import { courseFilterableFields } from './course.constants';

const assignFaculties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await CourseService.assignFaculties(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculties assigned successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const removeFaculties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await CourseService.removeFaculties(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculties removed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const insertIntoDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CourseService.insertIntoDB(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getAllFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, courseFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await CourseService.getAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Courses fetched successfully',
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
    const result = await CourseService.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course fetched successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const updateOneInDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await CourseService.updateOneInDB(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course updated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const deleteByIdFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await CourseService.deleteByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course deleted successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const CourseController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  assignFaculties,
  removeFaculties
};
