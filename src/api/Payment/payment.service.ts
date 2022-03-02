import { Payment } from '../../database';
import { IPayment } from '../../database/models/interfaces/payment.interface';
import {
  IFindOptions,
  IUpdateOptions,
} from '../../database/models/interfaces/custom.interface';

export class PaymentService {
  static async findOne(option: IFindOptions) {
    const result = await Payment.findOne(option);
    return result ? (result.get() as IPayment) : null;
  }

  static async findAll(options?: IFindOptions) {
    const result = await Payment.findAll(options);
    return result;
  }

  static async create(model: IPayment) {
    const result = await Payment.create(model);
    return result.get() as IPayment;
  }

  static async update(payload: object, condition: IUpdateOptions) {
    const [, [result]] = await Payment.update(payload, condition);
    return result ? (result.get() as IPayment) : null;
  }
}
