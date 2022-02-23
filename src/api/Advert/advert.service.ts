import { Advert } from '../../database';
import { IAdvert } from '../../database/models/interfaces/advert.interface';
import { IFindOptions } from '../../database/models/interfaces/custom.interface';

export class AdvertService {
  static async findOne(option: IFindOptions) {
    const result = await Advert.findOne(option);
    return result ? (result.get() as IAdvert) : null;
  }

  static async findAll(options?: IFindOptions) {
    const result = await Advert.findAll(options);
    return result;
  }

  static async create(model: IAdvert) {
    const result = await Advert.create(model);
    return result.get() as IAdvert;
  }
}
