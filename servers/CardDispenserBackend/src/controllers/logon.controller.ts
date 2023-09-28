import bcrypt from 'bcrypt';
import { Buffer } from 'buffer';
import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';

const INDEX_AUTH_HEADER_SCHEME = 0;
const INDEX_AUTH_HEADER_DATA = 1;

const logon = async (req: Request, res: Response) => {
  const authHeader = req?.headers?.authorization;

  try {
    res.status(httpStatus.UNAUTHORIZED);

    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }

    const splitAuthHeader = authHeader.split(' ');
    if (splitAuthHeader[INDEX_AUTH_HEADER_SCHEME] !== 'Basic') {
      throw new Error('Invalid authentication type, should be \'Basic\'');
    }
    if (splitAuthHeader.length < 2) {
      throw new Error('Incomplete authentication header, credentials are missing');
    }

    const base64Credentials = splitAuthHeader[INDEX_AUTH_HEADER_DATA];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

    if (!credentials) {
      throw new Error('Invalid authentication credentials');
    }

    const credentialsElements = credentials.split(':');
    if (credentialsElements.length < 2) {
      throw new Error('Invalid or incomplete authentication credentials');
    }

    if (req.body.deviceId) {
      // check whether the credentials match for the device
      if (credentialsElements[0] === process.env.DEVICE_USERNAME) {
        const match = await bcrypt.compare(credentialsElements[1], process.env.DEVICE_PASSWORD as string)
        if (match === false) {
          throw new Error('Invalid authentication credentials');
        }
      } else {
        throw new Error('Invalid authentication credentials');
      }
    } else if (req.body.hostId) {
      // check whether the credentials match for the host
      if (credentialsElements[0] === process.env.HOST_USERNAME) {
        const match = await bcrypt.compare(credentialsElements[1], process.env.HOST_PASSWORD as string);
        if (match === false) {
          throw new Error('Invalid authentication credentials');
        }
      } else {
        throw new Error('Invalid authentication credentials');
      }
    } else {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body does not contain a deviceId or hostId property');
    }

    createToken(req, res);
  } catch (error) {
    console.error(`Error during login. ${error}`);
    console.trace('Stacktrace: ');
    res.json({ error: error });
  }
};

const createToken = async (req: Request, res: Response) => {
  try {
    const expiry = parseInt(process.env.JWT_ACCESS_EXPIRY_SECS as string);
    let accessPayload;
    if (req.body.deviceId) {
      accessPayload = { type: 'device', user: req.body.deviceId };
    } else {
      accessPayload = { type: 'host', user: req.body.hostId };
    }

    const accessToken = jwt.sign(
      accessPayload,
      process.env.JWT_SECRET as jwt.Secret,
      {
        algorithm: process.env.JWT_SIGNING_ALGORITHM as jwt.Algorithm,
        expiresIn: expiry,
        issuer: process.env.JWT_ISSUER
      }
    );

    res.status(httpStatus.CREATED).json({ accessToken: accessToken });
  } catch (error) {
    console.error(`Error creating token. ${error}`);
    console.trace('Stacktrace: ');
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error });
  }
};

export {
  createToken,
  logon
};
