import { Response, NextFunction } from 'express';
import Joi from 'joi';

import { ResponseHandler } from '../helper/responseHandler.helper';

export class GeneralValidator {
  /**
   * @description creates a actual data against schema
   * @param  {object} data http request object to validate
   * @param {object} schema joi schema to compare with actual data for validation
   * @param  {object} res The http response object
   * @param  {function} next The function which allow us to go to next middleware
   * @returns {any} The http response object
   */
  static validator(
    res: Response,
    next: NextFunction,
    data: any,
    schema: Joi.AnySchema,
  ) {
    const { error } = schema.validate(data);
    if (error) {
      const message = error.details[0].message.replace(/\\|(")/g, '');
      return ResponseHandler.sendErrorResponse(res, {
        statusCode: 400,
        message: message,
        error: error,
      });
    }
    next();
  }
}
