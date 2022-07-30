import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

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