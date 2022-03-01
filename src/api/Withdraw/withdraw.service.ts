import { Withdraw } from '../../database';
import { IWithdraw } from '../../database/models/interfaces/withdraw.interface';
import { IFindOptions } from '../../database/models/interfaces/custom.interface';

export class WithdrawService {
  static async findOne(option: IFindOptions) {
    const result = await Withdraw.findOne(option);
    return result ? (result.get() as IWithdraw) : null;
  }

  static async findAll(options?: IFindOptions) {
    const result = await Withdraw.findAll(options);
    return result;
  }

  static async create(model: IWithdraw) {
    const result = await Withdraw.create(model);
    return result.get() as IWithdraw;
  }
}
