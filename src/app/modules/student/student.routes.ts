import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../../shared/validateRequest';
import auth from '../../middlewares/auth';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validations';

const router = express.Router();

router.get('/', StudentController.getAllFromDB);

router.get('/my-courses', auth(ENUM_USER_ROLE.STUDENT), StudentController.getMyCourses);
router.get('/my-academic-infos', auth(ENUM_USER_ROLE.STUDENT), StudentController.getMyAcademicInfo);
router.get(
  '/my-course-schedules',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentController.getMyCourseSchedules
);
router.get('/:id', StudentController.getByIdFromDB);

router.post(
  '/',
  validateRequest(StudentValidation.create),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(StudentValidation.update),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentController.deleteByIdFromDB
);

export const studentRoutes = router;
