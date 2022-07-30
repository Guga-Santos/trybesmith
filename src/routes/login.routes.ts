import { Router } from 'express';
import LoginController from '../controllers/login.controller';

const loginController = new LoginController();

const router = Router();

router.post('/login', loginController.login);

export default router;