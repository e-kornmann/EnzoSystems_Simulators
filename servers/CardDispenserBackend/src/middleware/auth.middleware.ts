import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';

const INDEX_AUTH_HEADER_SCHEME = 0;
const INDEX_AUTH_HEADER_DATA = 1;

const verifyAuthenticationHeader = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req?.headers?.authorization;

  try {
    res.status(httpStatus.UNAUTHORIZED);

    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }

    const splitAuthHeader = authHeader.split(' ');
    if (splitAuthHeader[INDEX_AUTH_HEADER_SCHEME] !== 'Bearer') {
      throw new Error('Invalid authentication type, should be \'Bearer\'');
    }
    if (splitAuthHeader.length < 2) {
      throw new Error('Incomplete authentication header, access token is missing');
    }

    const token = splitAuthHeader[INDEX_AUTH_HEADER_DATA];
    const decoded: jwt.JwtPayload = await verifyToken(token) as JwtPayload;

    if (!decoded.user) {
      throw new Error('Invalid access token, \'user\' missing');
    }
    if (!decoded.type) {
      throw new Error('Invalid access token, \'type\' missing');
    }

    req.authenticationType = decoded.type;
    req.authenticationUser = decoded.user;
    next();
  } catch (error) {
    console.error(`Request failed authentication check: ${error}`);
    console.trace('Stacktrace: ');
    res.status(httpStatus.UNAUTHORIZED).json({ error: error });
  }
};

const verifyToken = async (accessToken: string) => {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as jwt.Secret, { issuer: process.env.JWT_ISSUER });

  if (!decoded) {
    throw new Error(`No decoding result for the access token: ${accessToken}`);
  }

  return decoded;
};

export {
  verifyAuthenticationHeader,
  verifyToken
};
