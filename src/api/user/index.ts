import { Router } from 'express';

import { UserController } from './user.controller';
import { UserValidator } from '../../middlewares/userValidator.middleware';

export const userRouter = Router();

userRouter.post('/login', UserController.login);

userRouter.post(
  '/signup',
  UserValidator.validateUserBody,
  UserValidator.validateUserExists,
  UserValidator.emailChecker,
  UserController.signup,
);

userRouter.get('/:username', UserController.getProfile);

userRouter.put(
  '/deposit',
  UserValidator.verifyToken,
  UserValidator.validateSubscriptionBody,
  UserController.subscription,
);

userRouter.post('/password', UserController.sendPassword);

userRouter.put(
  '/reset-password',
  UserValidator.verifyToken,
  UserController.resetPassword,
);
