import jwt, { SignOptions } from 'jsonwebtoken';

const options: SignOptions = {
  algorithm: 'HS256',
  expiresIn: '2d',
};

const secret = 'o mercado de TI está desaquecendo';

export default function newToken(username: string, password: string) {
  return jwt.sign({ username, password }, secret, options);
}