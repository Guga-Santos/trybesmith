import jwt from 'jsonwebtoken';

const secret = 'o mercado de TI está desaquecendo';

export default function verifyToken(token: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const verified: any = jwt.verify(token, secret);
  
    return verified;
  } catch (err) {
    return { code: 401, message: { message: 'Invalid token' } };
  }
}
