import express from 'express';
import validateRequest from '../../../shared/validateRequest';
import auth from '../../middlewares/auth';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validations';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', CourseController.getAllFromDB);
router.get('/:id', CourseController.getByIdFromDB);

router.post(
  '/:id/assign-faculties',
  validateRequest(CourseValidation.assignOrRemoveFaculties),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CourseController.assignFaculties
);

router.post(
  '/:id/remove-faculties',
  validateRequest(CourseValidation.assignOrRemoveFaculties),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CourseController.removeFaculties
);

router.post(
  '/',
  validateRequest(CourseValidation.create),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CourseController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(CourseValidation.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CourseController.updateOneInDB
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CourseController.deleteByIdFromDB
);

export const courseRoutes = router;
