import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import verifyToken from '../authentication/validateToken';

export default function ProductErrors(req:Request, res:Response, next:NextFunction) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    amount: Joi.string().min(3).required(),
  });

  const validate = schema.validate(req.body);
  if (!req.body.name) return res.status(400).json({ message: '"name" is required' });
  if (!req.body.amount) return res.status(400).json({ message: '"amount" is required' });
  if (validate.error) return res.status(422).json({ message: validate.error.message });

  next();
}

export async function ValidateToken(req:Request, res:Response, next:NextFunction) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Token not found' });

  const user = verifyToken(token);
  if (user.message) {
    return res.status(user.code).json(user.message);
  }

  next();
}

export function ValidateNewOrder(req:Request, res:Response, next:NextFunction) {
  const schema = Joi.object({
    productsIds: Joi.array().items(Joi.number()).required(),
  });

  const validate = schema.validate(req.body);
  if (!req.body.productsIds) return res.status(400).json({ message: '"productsIds" is required' });
  if (req.body.productsIds.length < 1) {
    return res.status(422)
      .json({ message: '"productsIds" must include only numbers' });
  }
  if (validate.error) return res.status(422).json({ message: validate.error.message });

  next();
}