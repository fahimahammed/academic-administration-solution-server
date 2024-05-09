import express, { Request, Response, NextFunction } from 'express';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../../helpers/fileUploader';

const router = express.Router();

router.post(
    "/create-admin",
    //auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return UserController.createAdmin(req, res, next)
    }
);

export const userRoutes = router;
