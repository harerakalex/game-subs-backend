import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

import { UserService } from '../api/user/user.service';
import { AdvertService } from '../api/Advert/advert.service';
import { GeneralValidator } from './generalValidator.middleware';
import { ResponseHandler } from '../helper/responseHandler.helper';
import {
  advertSchema,
  registerUserSchema,
  subscriptionSchema,
  UpdateUserSchema,
} from '../helper/validationSchema.helper';
import { IUser } from '../database/models/interfaces/user.interfaces';
import { environment } from '../config/environment';
import MailChecker from 'deep-email-validator';

export class UserValidator {
  static validateUserBody(req: Request, res: Response, next: NextFunction) {
    return GeneralValidator.validator(res, next, req.body, registerUserSchema);
  }

  static validateUpdateUserBody(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    return GeneralValidator.validator(res, next, req.body, UpdateUserSchema);
  }

  static async validateUserExists(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { email } = req.body;
    const message = `The user with email: '${email}' already exists`;
    const userExists = await UserService.findOne({ where: { email } });
    if (userExists) {
      return ResponseHandler.sendResponse(res, 409, false, message);
    }

    return next();
  }

  static async verifyToken(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ) {
    const token: string = req.headers.authorization;
    if (!token) {
      const message = 'Please log in or Register';
      return ResponseHandler.sendResponse(res, 401, false, message);
    } else {
      jwt.verify(
        token,
        environment.jwtSecretKey,
        async (error: any, decoded: IUser) => {
          if (error) {
            return ResponseHandler.sendResponse(res, 403, true, error.message);
          }
          req.user = decoded;
          next();
        },
      );
    }
  }

  static validateSubscriptionBody(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    return GeneralValidator.validator(res, next, req.body, subscriptionSchema);
  }

  static validateAdvertBody(req: Request, res: Response, next: NextFunction) {
    return GeneralValidator.validator(res, next, req.body, advertSchema);
  }

  static async emailChecker(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const response = await MailChecker(email);
    const message = `This email seems to be invalid, please check the spelling`;
    if (response.valid === false) {
      return ResponseHandler.sendResponse(res, 404, false, message);
    }

    return next();
  }

  static async validateIfGameIsAdvertized(
    req: Request | any,
    res: Response,
    next: NextFunction,
  ) {
    const { id } = req.user;
    const { gameId } = req.body;

    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();
    const message = `This game is already advertized`;
    const advertized = await AdvertService.findOne({
      where: {
        [Op.and]: {
          userId: id,
          gameId,
          createdAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
      },
    });

    if (advertized) {
      return ResponseHandler.sendResponse(res, 409, false, message);
    }

    return next();
  }

  // Validate referral
  static async validateIfReferralExists(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { referral } = req.body;
    const message = `Invalid referral code, Please ask the referral code from the person who referred you.`;
    const userExists = await UserService.findOne({
      where: { username: referral },
    });
    if (!userExists) {
      return ResponseHandler.sendResponse(res, 404, false, message);
    }

    return next();
  }
}
