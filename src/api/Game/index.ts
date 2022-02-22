import { Router } from 'express';

import { GameController } from './game.controller';

export const gameRouter = Router();

gameRouter.get('/', GameController.getGames);
