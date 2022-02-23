import { Router } from 'express';
import { homeRouter } from './home';
import { userRouter } from './user';
import { gameRouter } from './Game';
import { advertRouter } from './Advert';

export const indexRouter = Router();

indexRouter.use('/', homeRouter);
indexRouter.use('/users', userRouter);
indexRouter.use('/games', gameRouter);
indexRouter.use('/adverts', advertRouter);
