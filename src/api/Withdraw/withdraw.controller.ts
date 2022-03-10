import { Request, Response } from 'express';

import { WithdrawService } from './withdraw.service';
import { ResponseHandler } from '../../helper/responseHandler.helper';
import { EEmailActions, STATUS_CODES } from '../../constants';
import { UserService } from '../../api/user/user.service';
import { User } from '../../database';
import sendEmail from '../../helper/mailer';

export class WithdrawController {
  static async withdraw(req: Request | any, res: Response) {
    try {
      const { id } = req.user;
      req.body.userId = id;

      const debit = await WithdrawService.create(req.body);

      // Find and update user balance
      const user = await UserService.findOne({ where: { id } });
      const balance = user.balance - req.body.amount;
      const payload = {
        balance: balance,
      };

      await UserService.update(
        { ...payload },
        { where: { id }, returning: true },
      );

      await sendEmail(EEmailActions.WITHDRAW, user.email);

      const message = 'withdrawn successfully';

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.CREATED,
        true,
        message,
        debit,
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }

  //   This return user debit.
  static async getUserWithdraw(req: Request | any, res: Response) {
    try {
      const { id } = req.user;

      const debits = await WithdrawService.findAll({
        where: {
          userId: id,
        },
        include: [{ model: User }],
      });

      const message = 'Withdraws has been retrieved successfully';

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.OK,
        true,
        message,
        debits,
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }
}
