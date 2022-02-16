import { Response } from 'express';

export class ResponseHandler {
  static sendResponse(
    res: Response,
    statusCode: number,
    success: boolean,
    message: string,
    data?: object,
  ) {
    return res.status(statusCode).json({
      success,
      message,
      data,
    });
  }

  static sendErrorResponse(res: Response, errorInstance: IError) {
    const { message, error, statusCode } = errorInstance;
    const code = statusCode || 500;
    return res.status(code).json({
      success: false,
      message,
      error,
    });
  }
}

export interface IError {
  message?: string;
  statusCode?: number;
  error?: Error;
}
