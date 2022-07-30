import { Pool } from 'mysql2/promise';
import { ILogin } from '../interfaces/login.interface';
import { IUser } from '../interfaces/user.interface';

export default class LoginModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async login(user: ILogin): Promise<IUser> {
    const { username, password } = user;

    const [result] = await this.connection
      .execute(`SELECT * FROM Trybesmith.Users 
    WHERE username=? AND password=?`, [username, password]);
    const [logged] = result as IUser[];
    
    return logged;
  }
}