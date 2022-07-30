import express from 'express';
import LoginRoutes from './routes/login.routes';
import OrdersRoutes from './routes/orders.routes';
import ProductsRoutes from './routes/products.routes';
import UsersRoutes from './routes/users.routes';

const app = express();

app.use(express.json());

app.use(ProductsRoutes);
app.use(UsersRoutes);
app.use(OrdersRoutes);
app.use(LoginRoutes);

export default app;

// Initial commit!
