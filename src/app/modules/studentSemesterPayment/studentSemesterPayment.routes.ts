import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { StudentSemesterPaymentController } from './studentSemesterPayment.controller';
import validateRequest from '../../../shared/validateRequest';
import { StudentSemesterPaymentValidation } from './studentSemesterPayment.validations';

const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
  StudentSemesterPaymentController.getAllFromDB
);

router.get(
  '/my-semester-payments',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentSemesterPaymentController.getMySemesterPayments
);

router.post(
  '/initiate-payment',
  auth(ENUM_USER_ROLE.STUDENT),
  validateRequest(StudentSemesterPaymentValidation.initiatePayment),
  StudentSemesterPaymentController.initiatePayment
);

router.post(
  '/complete-payment',
  // auth(ENUM_USER_ROLE.STUDENT),
  validateRequest(StudentSemesterPaymentValidation.completePayment),
  StudentSemesterPaymentController.completePayment
);

// router.post(
//   '/update-course-final-marks',
//   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
//   validateRequest(StudentEnrolledCourseMarkValidation.updateStudentCourseFinalMarks),
//   StudentEnrolledCourseMarkController.updateStudentCourseFinalMarks
// );

export const studentSemesterPaymentRoutes = router;
