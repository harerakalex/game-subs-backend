import { Request, Response } from 'express';

import { ResponseHandler } from '../../helper/responseHandler.helper';
import { STATUS_CODES } from '../../constants';
import { PaginatorHelper } from '../../helper/pagination';
import { Payment, User, Withdraw } from '../../database';

export class AdminController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string, 10);
      const page = parseInt(req.query.page as string, 10);
      const { data, pageMeta } = await PaginatorHelper.getPaginated(User, {
        defaultOptions: {
          order: [['createdAt', 'DESC']],
        },
        limit,
        page,
      });
      // Remove password
      const users = data.map((d) => {
        delete d.password;
        return d;
      });
      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.OK,
        true,
        'Successfully retrieved the users',
        { pageMeta, users },
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }

  static async getAllPayments(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string, 10);
      const page = parseInt(req.query.page as string, 10);
      const { data, pageMeta } = await PaginatorHelper.getPaginated(Payment, {
        defaultOptions: {
          order: [['createdAt', 'DESC']],
        },
        limit,
        page,
      });

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.OK,
        true,
        'Successfully retrieved the payments',
        { pageMeta, payments: data },
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }

  static async getAllWithdraw(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string, 10);
      const page = parseInt(req.query.page as string, 10);
      const { data, pageMeta } = await PaginatorHelper.getPaginated(Withdraw, {
        defaultOptions: {
          order: [['createdAt', 'DESC']],
        },
        limit,
        page,
      });

      return ResponseHandler.sendResponse(
        res,
        STATUS_CODES.OK,
        true,
        'Successfully retrieved the withdraws',
        { pageMeta, withdraws: data },
      );
    } catch (error) {
      return ResponseHandler.sendErrorResponse(res, error);
    }
  }
}
