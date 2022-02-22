import { Request, Response } from 'express';

import { GameService } from './game.service';
import { ResponseHandler } from '../../helper/responseHandler.helper';
import { STATUS_CODES } from '../../constants';

export class GameController {
  static async getGames(req: Request, res: Response) {
    try {
      const game = await GameService.findAll();

      const message = 'Games has been successfull retrieved';

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.OK,
        true,
        message,
        game,
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }
}
