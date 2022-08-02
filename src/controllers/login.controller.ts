import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import LoginService from '../services/login.service';

const secret = 'o mercado de TI está desaquecendo';

export default class LoginController {
  constructor(private loginService = new LoginService()) {}

  public login = async (req:Request, res:Response) => {
    const logged = await this.loginService.login(req.body);

    const { code, message } = logged;

    const { token } = message;
    if (token) {
      console.log(jwt.verify(token, secret));
    }

    return res.status(code).json(message);
  };
}