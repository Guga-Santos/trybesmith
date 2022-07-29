import { Router } from 'express';
import OrderController from '../controllers/orders.controller';

const orderController = new OrderController();

const router = Router();

router.get('/orders', orderController.getAll);

export default router;