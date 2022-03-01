import { Router } from 'express';

import { WithdrawController } from './withdraw.controller';
import { UserValidator } from '../../middlewares/userValidator.middleware';

export const withdrawRouter = Router();

withdrawRouter.post(
  '/',
  UserValidator.verifyToken,
  WithdrawController.withdraw,
);

withdrawRouter.get(
  '/',
  UserValidator.verifyToken,
  WithdrawController.getUserWithdraw,
);
