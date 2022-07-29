import { Router } from 'express';
import ProductController from '../controllers/products.controller';

const productController = new ProductController();

const router = Router();

router.post('/products', productController.create);
router.get('/products', productController.getAll);

export default router;