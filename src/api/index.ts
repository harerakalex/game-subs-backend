import { Router } from 'express';
import { homeRouter } from './home';
import { userRouter } from './user';

export const indexRouter = Router();

indexRouter.use('/', homeRouter);
indexRouter.use('/users', userRouter);
