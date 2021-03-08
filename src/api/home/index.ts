import { Router } from 'express';
import { HomeController } from './home.controller';

export const homeRouter = Router();

homeRouter.get('/', HomeController.landingPage);
