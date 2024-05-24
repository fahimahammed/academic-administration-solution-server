import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { MetaController } from './meta.controller';

const router = express.Router();

router.get(
    '/',
    // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    MetaController.getDashboardData
);

export const metaRoutes = router;
