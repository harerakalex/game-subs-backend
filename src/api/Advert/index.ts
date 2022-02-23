import { Router } from 'express';

import { AdvertController } from './advert.controller';
import { UserValidator } from '../../middlewares/userValidator.middleware';

export const advertRouter = Router();

advertRouter.post(
  '/',
  UserValidator.verifyToken,
  UserValidator.validateAdvertBody,
  AdvertController.advertiseGame,
);

advertRouter.get(
  '/',
  UserValidator.verifyToken,
  AdvertController.getUserAdvert,
);
