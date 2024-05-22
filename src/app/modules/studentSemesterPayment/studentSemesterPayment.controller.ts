import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/response';
import { studentSemesterPaymentFilterableFields } from './studentSemesterPayment.constants';
import { StudentSemesterPaymentService } from './studentSemesterPayment.service';

const getAllFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, studentSemesterPaymentFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await StudentSemesterPaymentService.getAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student semester payment fetched successfully',
      meta: result.meta,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

const getDataById = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { id } = req.params;
    const result = await StudentSemesterPaymentService.getDataById(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student semester payment fetched successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getMySemesterPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, studentSemesterPaymentFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const user = (req as any).user;

    const result = await StudentSemesterPaymentService.getMySemesterPayments(
      filters,
      options,
      user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student semester payment fetched successfully',
      meta: result.meta,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

const initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const result = await StudentSemesterPaymentService.initiatePayment(req.body, user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment initiated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const completePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transactionId } = req.query;
    const result = await StudentSemesterPaymentService.completePayment({ transactionId } as { transactionId: string });
    //res.redirect("http://localhost:3000/student/payment")
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment completed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const StudentSemesterPaymentController = {
  getAllFromDB,
  getMySemesterPayments,
  initiatePayment,
  completePayment,
  getDataById
};
