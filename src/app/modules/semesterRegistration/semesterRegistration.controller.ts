import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/response';
import { SemesterRegistrationService } from './semesterRegistration.service';
import pick from '../../../shared/pick';
import { semesterRegistrationFilterableFields } from './semesterRegistration.constants';

const startNewSemester = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await SemesterRegistrationService.startNewSemester(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'New Semester started successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const insertIntoDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SemesterRegistrationService.insertIntoDB(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getMyRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const result = await SemesterRegistrationService.getMyRegistration(user.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Successfully fetched my registration',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getMySemesterRegistrationCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const result = await SemesterRegistrationService.getMySemesterRegistrationCourses(user.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Successfully fetched my semester registration courses',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const startMyRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const result = await SemesterRegistrationService.startMyRegistration(user.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Successfully started my registration',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const confirmMyRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const result = await SemesterRegistrationService.confirmMyRegistration(user.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Successfully started my registration',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const enrollIntoCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const result = await SemesterRegistrationService.enrollIntoCourse(user.id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const withdrawFromCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const result = await SemesterRegistrationService.withdrawFromCourse(user.id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const getAllFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, semesterRegistrationFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await SemesterRegistrationService.getAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistrations fetched successfully',
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
    const result = await SemesterRegistrationService.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration fetched successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const updateOneInDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await SemesterRegistrationService.updateOneInDB(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration updated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const deleteByIdFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await SemesterRegistrationService.deleteByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration deleted successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const SemesterRegistrationController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getMyRegistration,
  startMyRegistration,
  getMySemesterRegistrationCourses,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  startNewSemester
};
