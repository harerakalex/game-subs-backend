import { Router } from 'express';
import { homeRouter } from './home';
import { userRouter } from './user';
import { gameRouter } from './Game';

export const indexRouter = Router();

indexRouter.use('/', homeRouter);
indexRouter.use('/users', userRouter);
indexRouter.use('/games', gameRouter);
