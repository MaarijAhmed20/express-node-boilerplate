import express from 'express';
import { User as UserType, UserAttributes } from 'src/models/user.model';
import { UserPayload } from '../interfaces/auth';

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes;
    }
  }
}

