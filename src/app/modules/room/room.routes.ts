import express from 'express';
import validateRequest from '../../../shared/validateRequest';
import auth from '../../middlewares/auth';
import { RoomController } from './room.controller';
import { RoomValidation } from './room.validations';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', RoomController.getAllFromDB);
router.get('/:id', RoomController.getByIdFromDB);

router.post(
  '/',
  validateRequest(RoomValidation.create),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  RoomController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(RoomValidation.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  RoomController.updateOneInDB
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  RoomController.deleteByIdFromDB
);

export const roomRoutes = router;
