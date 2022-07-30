import { Router } from 'express';
import UserController from '../controllers/users.controller';
import { UserErrors, UserJoiValidation } from '../middlewares/userErrors';

const userController = new UserController();

const router = Router();

router.post('/users', UserErrors, UserJoiValidation, userController.create);

export default router;