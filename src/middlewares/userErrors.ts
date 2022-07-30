import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export function UserErrors(req:Request, res:Response, next:NextFunction) {
  const { username, classe, password } = req.body;
  if (!username) return res.status(400).json({ message: '"username" is required' });
  if (!classe) return res.status(400).json({ message: '"classe" is required' });
 
  if (!password) return res.status(400).json({ message: '"password" is required' });
  next();
}

export function UserJoiValidation(req:Request, res:Response, next:NextFunction) {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    classe: Joi.string().min(3).required(),
    level: Joi.number().min(1).required(),
    password: Joi.string().min(8).required(),
  });

  if (!req.body.level && req.body.level !== 0) {
    return res.status(400)
      .json({ message: '"level" is required' });
  }
  //   Que beleza, hein!

  const validate = schema.validate(req.body);

  if (validate.error) return res.status(422).json({ message: validate.error.message });

  next();
}