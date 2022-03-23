import { Router } from 'express';

import { UserController } from './user.controller';
import { UserValidator } from '../../middlewares/userValidator.middleware';

export const userRouter = Router();

userRouter.post('/login', UserController.login);

userRouter.post(
  '/signup',
  UserValidator.validateUserBody,
  UserValidator.validateUserExists,
  UserValidator.validateIfReferralExists,
  UserValidator.emailChecker,
  UserController.signup,
);

userRouter.get('/:username', UserController.getProfile);

// Update profile
userRouter.put(
  '/:username',
  UserValidator.validateUpdateUserBody,
  UserController.UpdateProfile,
);

userRouter.put(
  '/deposit/:username',
  UserValidator.validateSubscriptionBody,
  UserController.subscription,
);

userRouter.post('/password', UserController.sendPassword);

userRouter.put(
  '/reset-password',
  UserValidator.verifyToken,
  UserController.resetPassword,
);
