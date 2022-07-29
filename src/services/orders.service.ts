import IOrder from '../interfaces/order.interface';
import connection from '../models/connection';
import OrderModel from '../models/orders.model';

export default class OrderService {
  public model: OrderModel;

  constructor() {
    this.model = new OrderModel(connection);
  }

  public async getAll(): Promise<IOrder[]> {
    const orders = await this.model.getAll();
    return orders;
  }
}