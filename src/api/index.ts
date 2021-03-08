import { Router } from 'express';
import { homeRouter } from './home';

export const indexRouter = Router();

indexRouter.use('/', homeRouter);
