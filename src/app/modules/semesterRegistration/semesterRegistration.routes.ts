import express from 'express';
import validateRequest from '../../../shared/validateRequest';
import auth from '../../middlewares/auth';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validations';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', SemesterRegistrationController.getAllFromDB);

router.get(
  '/my-registration',
  auth(UserRole.STUDENT),
  SemesterRegistrationController.getMyRegistration
);

router.get(
  '/my-semester-registration-courses',
  auth(UserRole.STUDENT),
  SemesterRegistrationController.getMySemesterRegistrationCourses
);

router.get('/:id', SemesterRegistrationController.getByIdFromDB);

router.post(
  '/start-registration',
  auth(UserRole.STUDENT),
  SemesterRegistrationController.startMyRegistration
);

router.post(
  '/confirm-registration',
  auth(UserRole.STUDENT),
  SemesterRegistrationController.confirmMyRegistration
);

router.post(
  '/enroll-into-course',
  validateRequest(SemesterRegistrationValidation.enrollIntoCourse),
  auth(UserRole.STUDENT),
  SemesterRegistrationController.enrollIntoCourse
);

router.post(
  '/withdraw-from-course',
  validateRequest(SemesterRegistrationValidation.withdrawFromCourse),
  auth(UserRole.STUDENT),
  SemesterRegistrationController.withdrawFromCourse
);

router.post(
  '/',
  validateRequest(SemesterRegistrationValidation.create),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SemesterRegistrationController.insertIntoDB
);

router.post(
  '/:id/start-new-semester',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SemesterRegistrationController.startNewSemester
);

router.patch(
  '/:id',
  validateRequest(SemesterRegistrationValidation.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SemesterRegistrationController.updateOneInDB
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SemesterRegistrationController.deleteByIdFromDB
);

export const semesterRegistrationRoutes = router;
