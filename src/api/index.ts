import { Router } from 'express';
import { homeRouter } from './home';
import { userRouter } from './user';
import { gameRouter } from './Game';
import { advertRouter } from './Advert';
import { withdrawRouter } from './Withdraw';
import { paymentRouter } from './Payment';
import { adminRouter } from './Admin';

export const indexRouter = Router();

indexRouter.use('/', homeRouter);
indexRouter.use('/users', userRouter);
indexRouter.use('/games', gameRouter);
indexRouter.use('/adverts', advertRouter);
indexRouter.use('/withdraw', withdrawRouter);
indexRouter.use('/payment', paymentRouter);
indexRouter.use('/admin', adminRouter);
