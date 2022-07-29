import { IProduct } from '../interfaces/product.interface';
import connection from '../models/connection';
import ProductModel from '../models/products.model';

export default class ProductService {
  public model: ProductModel;

  constructor() {
    this.model = new ProductModel(connection);
  }

  public async create(name: string, amount: string): Promise<IProduct> {
    const newProduct = await this.model.create(name, amount);
    return newProduct;
  }
}