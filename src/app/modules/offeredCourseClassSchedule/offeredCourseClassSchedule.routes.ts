import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../../shared/validateRequest';
import auth from '../../middlewares/auth';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';
import { OfferedCourseClassScheduleValidation } from './offeredCourseClassSchedule.validations';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', OfferedCourseClassScheduleController.getAllFromDB);
router.get('/:id', OfferedCourseClassScheduleController.getByIdFromDB);

router.post(
  '/',
  validateRequest(OfferedCourseClassScheduleValidation.create),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  OfferedCourseClassScheduleController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(OfferedCourseClassScheduleValidation.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  OfferedCourseClassScheduleController.updateOneInDB
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  OfferedCourseClassScheduleController.deleteByIdFromDB
);

export const offeredCourseClassScheduleRoutes = router;
