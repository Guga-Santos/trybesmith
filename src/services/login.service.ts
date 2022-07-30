import newToken from '../authentication/loginToken';
import { ILogin, IResponse } from '../interfaces/login.interface';
import connection from '../models/connection';
import LoginModel from '../models/login.model';

export default class LoginService {
  public model: LoginModel;

  constructor() {
    this.model = new LoginModel(connection);
  }

  public async login(user: ILogin): Promise<IResponse> {
    // const schema = Joi.object({
    //   username: Joi.string().required(),
    //   password: Joi.string().required(),
    // });

    // const validate = schema.validate(user);

    if (!user.username) {
      return { code: 400, message: { message: '"username" is required' } };
    }

    if (!user.password) {
      return { code: 400, message: { message: '"password" is required' } };
    }

    const logged = await this.model.login(user);

    if (!logged) {
      return { code: 401, message: { message: 'Username or password invalid' } };
    }

    const token = newToken(user.username, user.password);

    return { code: 200, message: { token } };
  }
}