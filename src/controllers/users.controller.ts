import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../services/users.service';

export default class UserController {
  constructor(private userService = new UserService()) {}

  public create = async (req:Request, res:Response) => {
    const { username, classe, level, password } = req.body;
    const newProduct = await this.userService.create(username, classe, level, password);
    res.status(StatusCodes.CREATED).json({ token: newProduct });
  };
}