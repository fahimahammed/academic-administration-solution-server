import express from 'express';
import validateRequest from '../../../shared/validateRequest';
import auth from '../../middlewares/auth';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validations';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', AcademicSemesterController.getAllFromDB);
router.get('/:id', AcademicSemesterController.getByIdFromDB);

router.post(
  '/',
  validateRequest(AcademicSemesterValidation.create),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AcademicSemesterController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(AcademicSemesterValidation.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AcademicSemesterController.updateOneInDB
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AcademicSemesterController.deleteByIdFromDB
);

export const academicSemesterRoutes = router;
