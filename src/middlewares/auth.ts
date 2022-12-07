import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { roleRights } from '../config/roles';
import { NextFunction, Request, Response } from 'express';
import { UserAttributes } from 'src/models/user.model';

type TResolve = (value?: {} | PromiseLike<{}> | undefined) => void;
type TReject = (reason?: any) => void;

const verifyCallback =
  (req: Request, resolve: TResolve, reject: TReject, requiredRights: string[]) =>
  async (err: Error, user: UserAttributes, info) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      const hasRequiredRights = requiredRights.every((requiredRight) => userRights?.includes(requiredRight));
      if (!hasRequiredRights && +req.params.userId != user.user_id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

export const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };
