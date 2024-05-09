import express from 'express';
import validateRequest from '../../../shared/validateRequest';
import { BuildingController } from './building.controller';
import { BuildingValidation } from './building.validations';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', BuildingController.getAllFromDB);
router.get('/:id', BuildingController.getByIdFromDB);

router.post(
  '/',
  validateRequest(BuildingValidation.create),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  BuildingController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(BuildingValidation.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  BuildingController.updateOneInDB
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  BuildingController.deleteByIdFromDB
);

export const buildingRoutes = router;
