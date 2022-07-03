import Joi from 'joi';
import { passwordRegex } from '../utils/regex';

export const CreateUserSchema = Joi.object()
  .keys({
    first_name: Joi.string()
      .min(1)
      .required()
      .error(() => new Error('First name is invalid')),
    last_name: Joi.string()
      .min(1)
      .required()
      .error(() => new Error('Last name is invalid')),
    email: Joi.string()
      .email()
      .required()
      .error(() => new Error('E-mail is invalid')),
    password: Joi.string()
      .pattern(new RegExp(passwordRegex))
      .required()
      .error(() => new Error('Password is invalid')),
    phone: Joi.string()
      .required()
      .error(() => new Error('Phone is invalid')),
  })
  .required();
