import { Router } from 'express';
import OrderController from '../controllers/orders.controller';
import { ValidateNewOrder, ValidateToken } from '../middlewares/productErrors';

const orderController = new OrderController();

const router = Router();

router.get('/orders', orderController.getAll);
router.post('/orders', ValidateToken, ValidateNewOrder, orderController.create);

export default router;