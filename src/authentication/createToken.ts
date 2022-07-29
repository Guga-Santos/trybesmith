import jwt, { SignOptions } from 'jsonwebtoken';

const options: SignOptions = {
  algorithm: 'HS256',
  expiresIn: '2d',
};

const secret = 'o mercado de TI está desaquecendo';

export default function createToken(username: string, classe: string, level:number) {
  return jwt.sign({ username, classe, level }, secret, options);
}