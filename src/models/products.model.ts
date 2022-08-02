import { Pool, ResultSetHeader } from 'mysql2/promise';
import { IProduct } from '../interfaces/product.interface';

export default class ProductModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async create(name: string, amount: string): Promise<IProduct> {
    const [result] = await this.connection.execute<ResultSetHeader>(
      'INSERT INTO Trybesmith.Products (name, amount) VALUES (?, ?)',
      [name, amount],
    );

    return { id: result.insertId, name, amount };
  }

  public async getAll(): Promise<IProduct[]> {
    const products = await this.connection.execute(
      'SELECT * FROM Trybesmith.Products',
    );
    const [rows] = products;
    return rows as IProduct[];
  }

  public async update(orderId: number, productId: number) {
    const updated = await this.connection
      .execute('UPDATE Trybesmith.Products SET orderId = ? WHERE id = ?;', [orderId, productId]);
    return updated;
  }
}