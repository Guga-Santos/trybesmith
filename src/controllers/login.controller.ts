import { Request, Response } from 'express';
import LoginService from '../services/login.service';

export default class LoginController {
  constructor(private loginService = new LoginService()) {}

  public login = async (req:Request, res:Response) => {
    const logged = await this.loginService.login(req.body);

    const { code, message } = logged;

    return res.status(code).json(message);
  };
}