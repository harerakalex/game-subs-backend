import { Request, Response } from 'express';
import axios from 'axios';

import { PaymentService } from './payment.service';
import { ResponseHandler } from '../../helper/responseHandler.helper';
import { STATUS_CODES } from '../../constants';
import { User } from '../../database';
import { UserService } from '../../api/user/user.service';
import { UserAuth } from '../../helper/user.helper';
import { IPayment } from '../../database/models/interfaces/payment.interface';
import { environment } from '../../config/environment';

export class PaymentController {
  static async createPayment(req: Request | any, res: Response) {
    try {
      let findPayment: IPayment;
      let paymentId: string;
      paymentId = `${new Date().getTime()}${UserAuth.generateRandomNumber(
        10000,
      )}`;

      findPayment = await PaymentService.findOne({ where: { paymentId } });

      while (findPayment) {
        paymentId = `${new Date().getTime()}${UserAuth.generateRandomNumber(
          10000,
        )}`;

        findPayment = await PaymentService.findOne({ where: { paymentId } });
      }

      req.body.paymentId = paymentId;

      const payment = await PaymentService.create(req.body);

      const {
        blockChainXpub,
        blockChainApiKey,
        blockChainGapLimit,
        backendUrl,
      } = environment;

      const encodeCBURL = encodeURIComponent(
        `${backendUrl}/api/v1/payment/deposit/callback?paymentId=${
          payment.paymentId
        }&secret=${new Date().getTime()}`,
      );

      const blockChainURL = `https://api.blockchain.info/v2/receive?xpub=${blockChainXpub}&callback=${encodeCBURL}/&key=${blockChainApiKey}&gap_limit=${blockChainGapLimit}`;
      const data = await axios.get(blockChainURL);

      const message = 'Paid successfully';

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.CREATED,
        true,
        message,
        { ...payment, bitcoin: data.data },
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }

  //   This return user payments
  static async getUserPayments(req: Request | any, res: Response) {
    try {
      const { username } = req.params;

      const findUser = await UserService.findOne({ where: { username } });

      if (!findUser) {
        return ResponseHandler.sendResponse(
          res,
          STATUS_CODES.NOT_FOUND,
          false,
          `User does not exist`,
        );
      }

      const payments = await PaymentService.findAll({
        where: {
          userId: findUser.id,
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

  //  This is just our callback.
  static async updateUserPaymentStatus(req: Request | any, res: Response) {
    try {
      const paymentId = req.query.paymentId;
      const value = parseFloat(req.query.value as string) / 100000000;

      const btcToUsd = await UserAuth.convertBtcToUsd(value);

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
        amount: btcToUsd,
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

      // Handle giving user commission
      if (updateUserSubscription.referral) {
        const commission = btcToUsd * 0.1;

        const referralUser = await UserService.findOne({
          where: { username: updateUserSubscription.referral },
        });

        const balance =
          referralUser.balance + parseFloat(commission.toFixed(3));
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
