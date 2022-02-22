import { Game } from '../../database';
import { IGame } from '../../database/models/interfaces/game.interface';
import { IFindOptions } from '../../database/models/interfaces/custom.interface';

export class GameService {
  static async findOne(option: IFindOptions) {
    const result = await Game.findOne(option);
    return result ? (result.get() as IGame) : null;
  }

  static async findAll(options?: IFindOptions) {
    const result = await Game.findAll(options);
    return result;
  }
}
