import Joi from 'joi';
import httpStatus from 'http-status';
import { pick } from '../utils/pick';
import ApiError from '../utils/ApiError';
import { NextFunction, Request, Response } from 'express';

type ValidationKeys = 'body' | 'query' | 'params';
type TSchema = Partial<Record<ValidationKeys, Joi.ObjectSchema>>;

const validate = (schema: TSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const schemaKeys = Object.keys(validSchema) as ValidationKeys[];
  const object = pick(req, schemaKeys);
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};
export default validate;
