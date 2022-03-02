import { Router } from 'express';

import { PaymentController } from './payment.controller';
import { UserValidator } from '../../middlewares/userValidator.middleware';

export const paymentRouter = Router();

paymentRouter.post(
  '/',
  UserValidator.verifyToken,
  PaymentController.createPayment,
);

paymentRouter.get('/:userId', PaymentController.getUserPayments);

paymentRouter.put(
  '/status/:paymentId',
  PaymentController.updateUserPaymentStatus,
);
