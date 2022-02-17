import { Router } from 'express';

import { UserController } from './user.controller';
import { UserValidator } from '../../middlewares/userValidator.middleware';

export const userRouter = Router();

userRouter.post('/login', UserController.login);

userRouter.post(
  '/signup',
  UserValidator.validateUserBody,
  UserValidator.validateUserExists,
  UserController.signup,
);
