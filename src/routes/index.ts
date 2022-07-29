import { Router } from 'express';
import ProductsRoute from './products.routes';
import UsersRoute from './users.routes';

const router = Router();

router.use('/products', ProductsRoute);
router.use('/users', UsersRoute);

export default router;