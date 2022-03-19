import { Router } from 'express';

import { AdminController } from './admin.controller';

export const adminRouter = Router();

adminRouter.get('/users', AdminController.getAllUsers);

adminRouter.get('/payments', AdminController.getAllPayments);

adminRouter.get('/withdraws', AdminController.getAllWithdraw);
