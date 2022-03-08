import { Password } from '../../database';
import { IPassword } from '../../database/models/interfaces/password.interface';
import {
  IFindOptions,
  IUpdateOptions,
} from '../../database/models/interfaces/custom.interface';

export class PasswordService {
  static async findOne(option: IFindOptions) {
    const result = await Password.findOne(option);
    return result ? (result.get() as IPassword) : null;
  }

  static async findAll(options?: IFindOptions) {
    const result = await Password.findAll(options);
    return result.map((item) => {
      const res = item.get();
      return res;
    }) as IPassword[];
  }

  static async create(model: IPassword) {
    const result = await Password.create(model);
    return result.get() as IPassword;
  }

  static async update(payload: object, condition: IUpdateOptions) {
    const [, [result]] = await Password.update(payload, condition);
    return result ? (result.get() as IPassword) : null;
  }
}
