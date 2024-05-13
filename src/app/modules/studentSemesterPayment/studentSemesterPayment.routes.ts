import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { StudentSemesterPaymentController } from './studentSemesterPayment.controller';
import validateRequest from '../../../shared/validateRequest';
import { StudentSemesterPaymentValidation } from './studentSemesterPayment.validations';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.FACULTY),
  StudentSemesterPaymentController.getAllFromDB
);

router.get(
  '/my-semester-payments',
  auth(UserRole.STUDENT),
  StudentSemesterPaymentController.getMySemesterPayments
);

router.get(
  '/complete-payment',
  auth(UserRole.STUDENT),
  StudentSemesterPaymentController.completePayment
);

router.post(
  '/initiate-payment',
  auth(UserRole.STUDENT),
  validateRequest(StudentSemesterPaymentValidation.initiatePayment),
  StudentSemesterPaymentController.initiatePayment
);


// router.post(
//   '/update-course-final-marks',
//   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
//   validateRequest(StudentEnrolledCourseMarkValidation.updateStudentCourseFinalMarks),
//   StudentEnrolledCourseMarkController.updateStudentCourseFinalMarks
// );

export const studentSemesterPaymentRoutes = router;
