import Joi from 'joi';

export const CreateTransactionSchema = Joi.object()
  .keys({
    from_account: Joi.string()
      .min(1)
      .required()
      .error(() => new Error('Origin account is invalid')),
    to_account: Joi.string()
      .min(1)
      .required()
      .error(() => new Error('Destination account is invalid')),
    amount: Joi.number()
      .required()
      .error(() => new Error('Amount is invalid')),
  })
  .required();
