import { Handler, NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface User {
      email: string;
    }
  }
}


export const catchAsync = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
