import Joi from 'joi';

export const registerUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(20).required(),
  lastName: Joi.string().min(2).max(20).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(5).max(20).required(),
  referral: Joi.string().required(),
});

export const subscriptionSchema = Joi.object({
  subscription: Joi.number().required(),
});

export const advertSchema = Joi.object({
  gameId: Joi.number().integer().required(),
});

export const UpdateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(20).optional(),
  lastName: Joi.string().min(2).max(20).optional(),
  email: Joi.string().email({ minDomainSegments: 2 }).optional(),
  password: Joi.string().min(5).max(20).optional(),
  referral: Joi.string().required().optional(),
  subscription: Joi.number().optional(),
  balance: Joi.number().optional(),
});
