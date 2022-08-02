import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import verifyToken from '../authentication/validateToken';
import OrderService from '../services/orders.service';
import ProductService from '../services/products.service';
import UserService from '../services/users.service';

export default class OrderController {
  constructor(
    private orderService = new OrderService(),
    private userService = new UserService(),
    private productService = new ProductService(),
  ) {}

  public getAll = async (_req:Request, res:Response) => {
    const orders = await this.orderService.getAll();
    res.status(StatusCodes.OK).json(orders);
  };

  // https://bobbyhadz.com/blog/typescript-type-undefined-is-not-assignable-to-type-string

  public create = async (req:Request, res:Response) => {
    const { productsIds } = req.body;
    const user = verifyToken(req.headers.authorization 
      !== undefined ? req.headers.authorization : '');

    const getUser = await this.userService.getUser(user);
    const newOrder = await this.orderService.create(getUser);
    await Promise
      .all(productsIds.map((prod:number) => this.productService.update(newOrder, prod)));
    const orders = await this.orderService.getByUserId(getUser, newOrder);
    
    res.status(201).json(orders);
  };
}