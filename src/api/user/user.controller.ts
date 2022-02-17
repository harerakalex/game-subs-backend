import { Request, Response } from 'express';

import { UserService } from './user.service';
import { UserAuth } from '../../helper/user.helper';
import { IUser } from '../../database/models/interfaces/user.interfaces';
import { ResponseHandler } from '../../helper/responseHandler.helper';
import { STATUS_CODES } from '../../constants';

export class UserController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user: IUser = await UserService.findOne({ where: { email } });

      if (!user) {
        return ResponseHandler.sendResponse(
          res,
          STATUS_CODES.UNAUTHORIZED,
          false,
          'This email is not registered, Please sign up',
        );
      }

      const correctPassword = UserAuth.compareHashedPasswords(
        password,
        user.password,
      );

      if (!correctPassword) {
        return ResponseHandler.sendResponse(
          res,
          STATUS_CODES.UNAUTHORIZED,
          false,
          'Incorrect email or password',
        );
      }

      const token = UserAuth.generateToken(user);

      delete user.password;
      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.OK,
        true,
        'Logged in successfully',
        {
          ...user,
          token,
        },
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }

  static async signup(req: Request, res: Response) {
    try {
      const { password, firstName, lastName } = req.body;
      const hashedPassword = UserAuth.hashPassword(password);
      req.body.password = hashedPassword;

      const username = await UserAuth.generateUsername(firstName, lastName);
      req.body.username = username;
      console.log('usr===', username);
      const user = await UserService.create(req.body);
      const message = 'User has been successfull registered';
      delete user.password;

      return ResponseHandler.sendResponse(res, 201, true, message, user);
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }
}
