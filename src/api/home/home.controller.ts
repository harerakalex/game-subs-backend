import { Request, Response } from 'express';

export class HomeController {
  static async landingPage(req: Request, res: Response) {
    res.status(200).json({
      status: 200,
      message: 'Welcome to Games Subscription App.',
    });
  }
}
