import express from 'express';
import validateRequest from '../../../shared/validateRequest';
import auth from '../../middlewares/auth';
import { AdminController } from './admin.controller';
import { StudentValidation } from './admin.validations';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', AdminController.getAllFromDB);

// router.get('/my-courses', auth(UserRole.STUDENT), StudentController.getMyCourses);
// router.get('/my-academic-infos', auth(UserRole.STUDENT), StudentController.getMyAcademicInfo);
// router.get(
//   '/my-course-schedules',
//   auth(UserRole.STUDENT),
//   StudentController.getMyCourseSchedules
// );
router.get('/:id', AdminController.getByIdFromDB);

router.patch(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.updateOneInDB
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.deleteByIdFromDB
);

export const adminsRoutes = router;
