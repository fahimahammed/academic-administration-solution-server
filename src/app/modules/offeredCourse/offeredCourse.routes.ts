import express from 'express';
import validateRequest from '../../../shared/validateRequest';
import auth from '../../middlewares/auth';
import { OfferedCourseController } from './offeredCourse.controller';
import { OfferedCourseValidation } from './offeredCourse.validations';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', OfferedCourseController.getAllFromDB);
router.get('/:id', OfferedCourseController.getByIdFromDB);

router.post(
  '/',
  validateRequest(OfferedCourseValidation.create),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  OfferedCourseController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(OfferedCourseValidation.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  OfferedCourseController.updateOneInDB
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  OfferedCourseController.deleteByIdFromDB
);

export const offeredCourseRoutes = router;
