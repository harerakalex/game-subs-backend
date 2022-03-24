import { Router } from 'express';

import { WithdrawController } from './withdraw.controller';
import { UserValidator } from '../../middlewares/userValidator.middleware';

export const withdrawRouter = Router();

withdrawRouter.post(
  '/',
  UserValidator.verifyToken,
  WithdrawController.withdraw,
);

withdrawRouter.get('/user/:username', WithdrawController.getUserWithdraw);

withdrawRouter.put(
  '/user/:id/status/:status',
  WithdrawController.updateWithdraw,
);
