import express from 'express';
import validateRequest from '../../../shared/validateRequest';
import { AcademicFacultyController } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validations';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', AcademicFacultyController.getAllFromDB);
router.get('/:id', AcademicFacultyController.getByIdFromDB);

router.post(
  '/',
  validateRequest(AcademicFacultyValidation.create),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AcademicFacultyController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(AcademicFacultyValidation.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AcademicFacultyController.updateOneInDB
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AcademicFacultyController.deleteByIdFromDB
);

export const academicFacultyRoutes = router;
