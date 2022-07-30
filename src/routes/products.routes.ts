import { Router } from 'express';
import ProductController from '../controllers/products.controller';
import ProductErrors from '../middlewares/productErrors';

const productController = new ProductController();

const router = Router();

router.post('/products', ProductErrors, productController.create);
router.get('/products', productController.getAll);

export default router;