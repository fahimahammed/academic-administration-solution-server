import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/response';
import { facultyFilterableFields } from './faculty.constants';
import { FacultyService } from './faculty.service';

const getMyCourseStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const filters = pick(req.query, ['academicSemesterId', 'courseId', 'offeredCourseSectionId']);
    const options = pick(req.query, ['limit', 'page']);
    const result = await FacultyService.getMyCourseStudents(filters, options, user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty course students fetched successfully',
      meta: result.meta,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

const getMyCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const filters = pick(req.query, ['academicSemesterId', 'courseId']);
    const result = await FacultyService.getMyCourses(filters, user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty courses fetched successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const assignCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await FacultyService.assignCourses(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Courses assigned successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const removeCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await FacultyService.removeCourses(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Courses removed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const insertIntoDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FacultyService.insertIntoDB(req.body);
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
    const filters = pick(req.query, facultyFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await FacultyService.getAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculties fetched successfully',
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
    const result = await FacultyService.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty fetched successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const updateOneInDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await FacultyService.updateOneInDB(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty updated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const deleteByIdFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await FacultyService.deleteByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty deleted successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const FacultyController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  assignCourses,
  removeCourses,
  getMyCourses,
  getMyCourseStudents
};
