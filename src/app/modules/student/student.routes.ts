import express from 'express';
import validateRequest from '../../../shared/validateRequest';
import auth from '../../middlewares/auth';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validations';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', StudentController.getAllFromDB);

router.get('/my-courses', auth(UserRole.STUDENT), StudentController.getMyCourses);
router.get('/my-academic-infos', auth(UserRole.STUDENT), StudentController.getMyAcademicInfo);
router.get(
  '/my-course-schedules',
  auth(UserRole.STUDENT),
  StudentController.getMyCourseSchedules
);
router.get('/profile/:id', StudentController.getByIdFromDB);

router.post(
  '/',
  validateRequest(StudentValidation.create),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  StudentController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(StudentValidation.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  StudentController.updateOneInDB
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  StudentController.deleteByIdFromDB
);

export const studentRoutes = router;
