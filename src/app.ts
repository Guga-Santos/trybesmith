import express from 'express';
import ProductsRoutes from './routes/products.routes';

const app = express();

app.use(express.json());

app.use(ProductsRoutes);

export default app;

// Initial commit!
