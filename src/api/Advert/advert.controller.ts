import { Request, Response } from 'express';
import { Op } from 'sequelize';

import { AdvertService } from './advert.service';
import { ResponseHandler } from '../../helper/responseHandler.helper';
import { STATUS_CODES } from '../../constants';
import { UserService } from '../../api/user/user.service';
import { getDailyIncome } from '../../helper/adverts.helper';

export class AdvertController {
  static async advertiseGame(req: Request | any, res: Response) {
    try {
      const { id } = req.user;
      req.body.userId = id;

      const advert = await AdvertService.create(req.body);

      // Find and Give the income
      const user = await UserService.findOne({ where: { id } });
      const income = getDailyIncome(user.subscription);
      const balance = user.balance + parseFloat(income.toFixed(3));
      const payload = {
        balance: balance,
      };

      await UserService.update(
        { ...payload },
        { where: { id }, returning: true },
      );

      const message = 'Advert has been created successfully';

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.CREATED,
        true,
        message,
        advert,
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }

  // This return daily advert.
  static async getUserAdvert(req: Request | any, res: Response) {
    try {
      const { id } = req.user;

      const TODAY_START = new Date().setHours(0, 0, 0, 0);
      const NOW = new Date();

      const adverts = await AdvertService.findAll({
        where: {
          [Op.and]: {
            userId: id,
            createdAt: {
              [Op.gt]: TODAY_START,
              [Op.lt]: NOW,
            },
          },
        },
      });

      const message = 'Advert has been retrieved successfully';

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.OK,
        true,
        message,
        adverts,
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }
}
