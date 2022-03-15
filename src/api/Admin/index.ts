import { Router } from 'express';

import { AdminController } from './admin.controller';
import { UserValidator } from '../../middlewares/userValidator.middleware';

export const adminRouter = Router();

adminRouter.get('/users', AdminController.getAllUsers);

adminRouter.get('/payments', AdminController.getAllPayments);
