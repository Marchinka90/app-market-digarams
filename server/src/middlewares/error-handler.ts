import { Request, Response, NextFunction } from 'express';
import HttpError from '../models/http-error';

export const errorHandler = (error: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(error.code || 500);
  res.json({ message: error.message || 'Something went wrong. Please try again later.' });
}