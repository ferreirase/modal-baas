import Joi from 'joi';

export const CreateAccountSchema = Joi.object()
  .keys({
    number: Joi.string()
      .min(1)
      .required()
      .error(() => new Error('Number account is invalid')),
    digit: Joi.string()
      .min(1)
      .required()
      .error(() => new Error('Digit account is invalid')),
    balance: Joi.number()
      .required()
      .error(() => new Error('Initial Balance is invalid')),
    user_owner: Joi.string()
      .required()
      .error(() => new Error('User owner ID is invalid')),
  })
  .required();
