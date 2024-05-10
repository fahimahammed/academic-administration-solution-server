import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../../shared/validateRequest';
import auth from '../../middlewares/auth';
import { OfferedCourseSectionController } from './offeredCourseSection.controller';
import { OfferedCourseSectionValidation } from './offeredCourseSection.validations';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', OfferedCourseSectionController.getAllFromDB);
router.get('/:id', OfferedCourseSectionController.getByIdFromDB);

router.post(
  '/',
  validateRequest(OfferedCourseSectionValidation.create),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  OfferedCourseSectionController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(OfferedCourseSectionValidation.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  OfferedCourseSectionController.updateOneInDB
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  OfferedCourseSectionController.deleteByIdFromDB
);

export const offeredCourseSectionRoutes = router;
