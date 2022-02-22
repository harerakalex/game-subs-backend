import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { UserService } from '../api/user/user.service';
import { GeneralValidator } from './generalValidator.middleware';
import { ResponseHandler } from '../helper/responseHandler.helper';
import {
  registerUserSchema,
  subscriptionSchema,
} from '../helper/validationSchema.helper';
import { IUser } from '../database/models/interfaces/user.interfaces';
import { environment } from '../config/environment';

export class UserValidator {
  static validateUserBody(req: Request, res: Response, next: NextFunction) {
    return GeneralValidator.validator(res, next, req.body, registerUserSchema);
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
      return ResponseHandler.sendResponse(res, 404, false, message);
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
}
