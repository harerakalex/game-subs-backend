import { User } from '../../database';
import { IUser } from '../../database/models/interfaces/user.interfaces';
import {
  IFindOptions,
  IUpdateOptions,
} from '../../database/models/interfaces/custom.interface';

export class UserService {
  static async findOne(option: IFindOptions) {
    const result = await User.findOne(option);
    return result ? (result.get() as IUser) : null;
  }

  static async findAll(options?: IFindOptions) {
    const result = await User.findAll(options);
    return result.map((item) => {
      const res = item.get();
      delete res.password;
      return res;
    }) as IUser[];
  }

  static async create(model: IUser) {
    const result = await User.create(model);
    return result.get() as IUser;
  }

  static async update(payload: object, condition: IUpdateOptions) {
    const [, [result]] = await User.update(payload, condition);
    return result ? (result.get() as IUser) : null;
  }
}
