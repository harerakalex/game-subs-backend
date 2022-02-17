import { Request, Response, NextFunction } from 'express';
import { UserService } from '../api/user/user.service';
import { GeneralValidator } from './generalValidator.middleware';
import { ResponseHandler } from '../helper/responseHandler.helper';
import { registerUserSchema } from '../helper/validationSchema.helper';

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
}
