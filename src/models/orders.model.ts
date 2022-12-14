import { OkPacket, Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import IOrder from '../interfaces/order.interface';

export default class OrderModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async getAll(): Promise<IOrder[]> {
    const [orders] = await this.connection.execute<ResultSetHeader>(
      `SELECT Orders.id, Orders.userId, JSON_ARRAYAGG(Products.id) AS productsIds
      FROM Trybesmith.Orders AS Orders
      INNER JOIN Trybesmith.Products AS Products 
      ON Products.orderId = Orders.id
      GROUP BY Orders.id
      ORDER BY Orders.userId;`,
    );

    return orders as unknown as IOrder[];
  }

  public async getByUserId(userId:number, orderId:number) {
    const [[orders]] = await this.connection
      .execute<RowDataPacket[]>(`SELECT Orders.userId, JSON_ARRAYAGG(Products.id) 
      AS productsIds
      FROM Trybesmith.Orders AS Orders
      INNER JOIN Trybesmith.Products AS Products
      ON Products.orderId = Orders.id
      WHERE Orders.userId = ?
      AND Products.orderId = ?
      GROUP BY Orders.userId;`, [userId, orderId]);
    return orders;
  }

  public async create(userId: number): Promise<number> {
    const [{ insertId }] = await this.connection
      .execute<OkPacket>('INSERT INTO Trybesmith.Orders (userId) VALUES (?);', [userId]);
    return insertId;
  }
}