import express from 'express';
import validateRequest from '../../../shared/validateRequest';
import auth from '../../middlewares/auth';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validations';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', AcademicDepartmentController.getAllFromDB);
router.get('/:id', AcademicDepartmentController.getByIdFromDB);

router.post(
  '/',
  validateRequest(AcademicDepartmentValidation.create),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AcademicDepartmentController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(AcademicDepartmentValidation.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AcademicDepartmentController.updateOneInDB
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AcademicDepartmentController.deleteByIdFromDB
);

export const academicDepartmentRoutes = router;
