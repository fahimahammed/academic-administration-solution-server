import express, { Request, Response, NextFunction } from 'express';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../../helpers/fileUploader';

const router = express.Router();

router.get('/', UserController.getAllFromDB);

router.get(
    '/my-profile',
    auth(
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.FACULTY,
        UserRole.STUDENT
    ),
    UserController.getMyProfile
);

router.get('/:id', UserController.getByIdFromDB);

router.post(
    "/create-admin",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return UserController.createAdmin(req, res, next)
    }
);

router.post(
    "/create-student",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return UserController.createAdmin(req, res, next)
    }
);

router.patch(
    '/:id',
    //validateRequest(UserValidation.updateUser),
    auth(
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.FACULTY,
        UserRole.STUDENT
    ),
    UserController.updateOneInDB
);

router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    UserController.deleteByIdFromDB
);

export const userRoutes = router;
