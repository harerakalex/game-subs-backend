import Joi from 'joi';

export const registerUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(20).required(),
  lastName: Joi.string().min(2).max(20).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(5).max(20).required(),
  referral: Joi.string().optional(),
});

export const subscriptionSchema = Joi.object({
  subscription: Joi.number().required(),
});

export const advertSchema = Joi.object({
  gameId: Joi.number().integer().required(),
});
