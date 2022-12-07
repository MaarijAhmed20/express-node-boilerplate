import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import config from '../config/config';
import * as userService from './user.service';
import { Token, User } from '../models';
import { TokenTypes, tokenTypes } from '../config/tokens';
import { UserAttributes } from 'src/models/user.model';
// import {UserPayload} from '../interfaces/auth'


type GenerateTokenFn = (user: UserAttributes, expires: Moment,type: TokenTypes, secret?: string) => string

export const generateToken: GenerateTokenFn = (user, expires, type, secret = config.jwt.secret) => {
  const payload = {
    user_id: user.user_id,
    role: user.role,
    email: user.email,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

export const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = new Token({
    token,
    user_id: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  await tokenDoc.save();
  return tokenDoc;
};

export const verifyToken = async (token: string, type: string) => {
  const payload:any  = jwt.verify(token, config.jwt.secret);
  console.log(payload);

  const tokenDoc = await Token.findOne({
    where: { token,type, user_id : payload.user_id  },
    include: { model: User },
  });
  console.log(tokenDoc)
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
export const generateAuthTokens = async (user: UserAttributes) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user, accessTokenExpires, tokenTypes.ACCESS);
  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.user_id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (email: string) => {
  const user = (await userService.getUserByEmail(email));
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.user_id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.user_id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.user_id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};
