import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import createToken from '../authentication/createToken';
import { IUser } from '../interfaces/user.interface';

export default class UserModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async create(
    username: string,
    classe: string,
    level: number,
    password: string,
  ) : Promise<string> {
    await this.connection.execute<ResultSetHeader>(
      `INSERT INTO Trybesmith.Users 
                (username, classe, level, password) VALUES (?, ?, ?, ?)`,
      [username, classe, level, password],
    );

    const token = createToken(username, classe, level);
    return token;
  }

  public async getUser(data: Omit<IUser, 'classe' | 'level'>) : Promise<number> {
    const { username, password } = data;
    const [[user]] = await this.connection.execute<RowDataPacket[]>(`SELECT id 
      FROM Trybesmith.Users
      WHERE username = ? 
      AND password = ?;`, [username, password]);
    console.log(user);
    return user.id;
  }
}
