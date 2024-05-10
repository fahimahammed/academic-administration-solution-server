import express from 'express';
import auth from '../../middlewares/auth';
import { StudentEnrolledCourseMarkController } from './studentEnrolledCourseMark.controller';
import validateRequest from '../../../shared/validateRequest';
import { StudentEnrolledCourseMarkValidation } from './studentEnrolledCourseMark.validations';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.FACULTY),
  StudentEnrolledCourseMarkController.getAllFromDB
);

router.get(
  '/my-marks',
  auth(UserRole.STUDENT),
  StudentEnrolledCourseMarkController.getMyCourseMarks
);

router.post(
  '/update-marks',
  auth(UserRole.ADMIN, UserRole.FACULTY),
  validateRequest(StudentEnrolledCourseMarkValidation.updateStudentMarks),
  StudentEnrolledCourseMarkController.updateStudentMarks
);

router.post(
  '/update-course-final-marks',
  auth(UserRole.ADMIN, UserRole.FACULTY),
  validateRequest(StudentEnrolledCourseMarkValidation.updateStudentCourseFinalMarks),
  StudentEnrolledCourseMarkController.updateStudentCourseFinalMarks
);

export const studentEnrolledCourseMarkRoutes = router;
