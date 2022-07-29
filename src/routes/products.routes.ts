import { Router } from 'express';
import ProductController from '../controllers/products.controller';

const productController = new ProductController();

const router = Router();

router.post('/products', productController.create);

export default router;