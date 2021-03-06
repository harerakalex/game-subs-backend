import { Request, Response } from 'express';
import { Op } from 'sequelize';

import { UserService } from './user.service';
import { PasswordService } from './password.service';
import { UserAuth } from '../../helper/user.helper';
import { IUser } from '../../database/models/interfaces/user.interfaces';
import { ResponseHandler } from '../../helper/responseHandler.helper';
import { STATUS_CODES, EEmailActions } from '../../constants';
import sendEmail from '../../helper/mailer';

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
        // Check if user has a temporary passowrd
        let success = false;

        const tempPwd = await PasswordService.findAll({
          where: {
            [Op.and]: {
              userId: user.id,
              used: false,
            },
          },
          order: [['createdAt', 'DESC']],
        });

        success = tempPwd.length > 0;

        if (tempPwd.length) {
          const last = tempPwd[0];
          success = UserAuth.compareHashedPasswords(password, last.password);

          if (success) {
            const payload = {
              used: true,
            };
            await PasswordService.update(
              { ...payload },
              {
                where: {
                  id: last.id,
                },
                returning: true,
              },
            );
          }
        }

        if (!success) {
          return ResponseHandler.sendResponse(
            res,
            STATUS_CODES.UNAUTHORIZED,
            false,
            'Incorrect email or password',
          );
        }
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
      const { password, firstName, lastName, referral } = req.body;
      const hashedPassword = UserAuth.hashPassword(password);
      req.body.password = hashedPassword;

      // Check if referall exists
      if (req.body.referral) {
        const referralUser = await UserService.findOne({
          where: { username: referral },
        });

        if (!referralUser) delete req.body.referral;
      }

      const username = await UserAuth.generateUsername(firstName, lastName);
      req.body.username = username;

      const user = await UserService.create(req.body);
      const message = 'User has been successfull registered';
      delete user.password;

      await sendEmail(EEmailActions.WELCOME, user.email);

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.CREATED,
        true,
        message,
        user,
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const { username } = req.params;

      const user = await UserService.findOne({ where: { username } });

      if (!user) {
        return ResponseHandler.sendResponse(
          res,
          STATUS_CODES.NOT_FOUND,
          false,
          `User not found`,
        );
      }

      const message = 'User has been successfull retrieved';
      delete user.password;

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.OK,
        true,
        message,
        user,
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }

  static async subscription(req: Request | any, res: Response) {
    try {
      const { username } = req.params;

      const user = await UserService.update(
        { ...req.body },
        { where: { username }, returning: true },
      );

      if (!user) {
        return ResponseHandler.sendResponse(
          res,
          STATUS_CODES.NOT_FOUND,
          false,
          `User not found`,
        );
      }

      // Handle giving user commission
      if (user.referral) {
        const commission = req.body.subscription * 0.1;

        const referralUser = await UserService.findOne({
          where: { username: user.referral },
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

      const message = 'Successfully deposited the sum of money';
      delete user.password;

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.OK,
        true,
        message,
        user,
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }

  static async sendPassword(req: Request | any, res: Response) {
    try {
      const { email } = req.body;

      const user = await UserService.findOne({ where: { email } });

      if (!user) {
        return ResponseHandler.sendResponse(
          res,
          STATUS_CODES.NOT_FOUND,
          false,
          'This email is not registered, Please sign up',
        );
      }

      const password = await UserAuth.generateTemporyPassword();
      console.log('Password', password);

      const payload: any = {
        userId: user.id,
        password: UserAuth.hashPassword(password),
      };

      const createPwd = await PasswordService.create(payload);

      await sendEmail(EEmailActions.PASSWORD, user.email, password);

      const message = 'Successfully sent temporary password';

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.OK,
        true,
        message,
        createPwd,
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }

  static async resetPassword(req: Request | any, res: Response) {
    try {
      const { password } = req.body;
      const { id } = req.user;

      const hashedPassword = UserAuth.hashPassword(password);
      req.body.password = hashedPassword;

      const user = await UserService.update(
        { ...req.body },
        { where: { id }, returning: true },
      );

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.OK,
        true,
        'Password reset successfully',
        user,
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }

  static async UpdateProfile(req: Request, res: Response) {
    try {
      const { username } = req.params;

      const user = await UserService.update(
        { ...req.body },
        { where: { username }, returning: true },
      );

      if (!user) {
        return ResponseHandler.sendResponse(
          res,
          STATUS_CODES.NOT_FOUND,
          false,
          `User not found`,
        );
      }

      const message = 'User profile updated successfully';
      delete user.password;

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.OK,
        true,
        message,
        user,
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }
}
