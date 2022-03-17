import { Request, Response } from 'express';
import { Op } from 'sequelize';

import { PaymentService } from './payment.service';
import { ResponseHandler } from '../../helper/responseHandler.helper';
import { STATUS_CODES } from '../../constants';
import { User } from '../../database';
import { UserService } from '../../api/user/user.service';

export class PaymentController {
  static async createPayment(req: Request | any, res: Response) {
    try {
      const payment = await PaymentService.create(req.body);

      const message = 'Paid successfully';

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.CREATED,
        true,
        message,
        payment,
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }

  //   This return user payments
  static async getUserPayments(req: Request | any, res: Response) {
    try {
      const { userId } = req.params;

      const payments = await PaymentService.findAll({
        where: {
          userId: userId,
        },
        include: [
          {
            model: User,
            attributes: [
              'id',
              'firstName',
              'lastName',
              'username',
              'email',
              'balance',
              'subscription',
            ],
          },
        ],
      });

      const message = 'Payments has been retrieved successfully';

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.OK,
        true,
        message,
        payments,
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }

  //   This return user payments
  static async updateUserPaymentStatus(req: Request | any, res: Response) {
    try {
      const { paymentId } = req.params;

      const findPayment = await PaymentService.findOne({
        where: { paymentId },
      });
      if (!findPayment) {
        return ResponseHandler.sendResponse(
          res,
          STATUS_CODES.NOT_FOUND,
          false,
          `Payment not found`,
        );
      }

      if (findPayment.status === 'confirmed') {
        return ResponseHandler.sendResponse(
          res,
          STATUS_CODES.CONFLICT,
          false,
          `Payment already confirmed`,
        );
      }

      const statusPayload = {
        status: 'confirmed',
      };
      const updatePaymentStatus = await PaymentService.update(
        { ...statusPayload },
        { where: { paymentId }, returning: true },
      );

      const user = await UserService.findOne({
        where: { id: updatePaymentStatus.userId },
      });

      const userPayload = {
        subscription: updatePaymentStatus.amount + user.subscription,
      };

      const updateUserSubscription = await UserService.update(
        { ...userPayload },
        { where: { id: updatePaymentStatus.userId }, returning: true },
      );

      const findAllPayments = await PaymentService.findAll({
        where: {
          [Op.and]: {
            userId: updatePaymentStatus.userId,
            status: 'confirmed',
          },
        },
      });

      // Handle giving user commission
      if (updateUserSubscription.referral && findAllPayments.length === 1) {
        const commission = updateUserSubscription.subscription * 0.1;

        const referralUser = await UserService.findOne({
          where: { username: updateUserSubscription.referral },
        });

        const balance = referralUser.balance + commission;
        const payload = {
          balance: balance,
        };
        await UserService.update(
          { ...payload },
          { where: { id: referralUser?.id }, returning: true },
        );
      }

      const message = 'Payments has been updated successfully';

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.OK,
        true,
        message,
        updatePaymentStatus,
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }
}
