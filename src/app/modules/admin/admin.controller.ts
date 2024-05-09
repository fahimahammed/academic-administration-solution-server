import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/response';
import { AdminService } from './admin.service';
import { adminFilterableFields } from './admin.constants';

const getAllFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await AdminService.getAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admins fetched successfully',
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
    console.log("id: ", id)
    const result = await AdminService.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin fetched successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// const getMyCourses = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = (req as any).user;
//     const filters = pick(req.query, ['academicSemesterId', 'courseId']);
//     const result = await StudentService.getMyCourses(filters, user);
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Student courses fetched successfully',
//       data: result
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getMyAcademicInfo = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = (req as any).user;
//     // const filters = pick(req.query, ['academicSemesterId', 'courseId']);
//     const result = await StudentService.getMyAcademicInfo(user);
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Student academic info fetched successfully',
//       data: result
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getMyCourseSchedules = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = (req as any).user;
//     const filters = pick(req.query, ['academicSemesterId', 'courseId']);
//     const result = await StudentService.getMyCourseSchedules(filters, user);
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Student course schedules fetched successfully',
//       data: result
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const updateOneInDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await AdminService.updateOneInDB(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin updated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const deleteByIdFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await AdminService.deleteByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin deleted successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  // getMyCourses,
  // getMyCourseSchedules,
  // getMyAcademicInfo
};
