import express from 'express';
import validateRequest from '../../../shared/validateRequest';
import auth from '../../middlewares/auth';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validations';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', FacultyController.getAllFromDB);

router.get('/my-courses', auth(UserRole.FACULTY), FacultyController.getMyCourses);
router.get(
  '/my-course-students',
  auth(UserRole.FACULTY),
  FacultyController.getMyCourseStudents
);

router.get('/profile/:id', FacultyController.getByIdFromDB);

router.post(
  '/:id/assign-courses',
  validateRequest(FacultyValidation.assignOrRemoveCourses),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  FacultyController.assignCourses
);

router.post(
  '/:id/remove-courses',
  validateRequest(FacultyValidation.assignOrRemoveCourses),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  FacultyController.removeCourses
);

router.post(
  '/',
  validateRequest(FacultyValidation.create),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  FacultyController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(FacultyValidation.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  FacultyController.updateOneInDB
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  FacultyController.deleteByIdFromDB
);

export const facultyRoutes = router;
