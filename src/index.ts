import express, { Request, Response } from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import { indexRouter } from './api';

const app = express();

app.use(cors());
app.use(morgan('dev'));
// Body parser
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api/v1', indexRouter);
app.use((_req: Request, res: Response) => {
  res.status(404).json({ status: 404, error: 'Endpoint route not found' });
});

export { app };
