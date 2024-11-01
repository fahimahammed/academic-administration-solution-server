import { sign, verify } from 'jsonwebtoken';
import config from '../config';
import { IAuthUser } from '../interfaces/auth';
import ApiError from '../errors/apiError';
import httpStatus from 'http-status';

const createToken = (payload: Object) => {
  return sign(payload, config.jwt.secret, {
    algorithm: 'HS256',
    expiresIn: config.jwt.expirationTime
  });
};

const createRefreshToken = (payload: Object) => {
  return sign(payload, config.jwt.refreshSecret, {
    algorithm: 'HS256',
    expiresIn: config.jwt.refreshExpirationTime
  });
};

const createPasswordResetToken = (payload: Object) => {
  return sign(payload, config.jwt.secret, {
    algorithm: 'HS256',
    expiresIn: config.jwt.passwordResetTokenExpirationTime
  });
};

const verifyToken = (token: string) => {
  try {
    const isVerified = verify(token, config.jwt.secret);
    return isVerified as IAuthUser;
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token: string) => {
  try {
    const isVerified = verify(token, config.jwt.refreshSecret);
    return isVerified as any;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }
};

const verifyPasswordResetToken = (token: string) => {
  try {
    const isVerified = verify(token, config.jwt.secret);
    return isVerified as any;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset token is invalid or has expired');
  }
};

export const JwtHelper = {
  createToken,
  verifyToken,
  createRefreshToken,
  verifyRefreshToken,
  createPasswordResetToken,
  verifyPasswordResetToken
};
