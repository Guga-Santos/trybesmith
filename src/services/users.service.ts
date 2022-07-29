import connection from '../models/connection';
import UserModel from '../models/users.model';

export default class UserService {
  public model: UserModel;

  constructor() {
    this.model = new UserModel(connection);
  }

  public async create(
    username: string,
    classe: string,
    level: number,
    password: string,
  ): Promise<string> {
    const newUser = await this.model.create(username, classe, level, password);
    return newUser;
  }
}