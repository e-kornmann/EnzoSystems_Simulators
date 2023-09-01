const { Buffer } = require('buffer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status-codes');

const INDEX_AUTH_HEADER_SCHEME = 0;
const INDEX_AUTH_HEADER_DATA = 1;

async function logon (req, res) {
  const authHeader = req?.headers?.authorization;

  try {
    res.status(httpStatus.StatusCodes.UNAUTHORIZED);

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

    const base64credentials = splitAuthHeader[INDEX_AUTH_HEADER_DATA];
    const credentials = Buffer.from(base64credentials, 'base64').toString('ascii');

    if (!credentials) {
      throw new Error('Invalid authentication credentials');
    }

    const credentialsElements = credentials.split(':');
    if (credentialsElements.length < 2) {
      throw new Error('Invalid or incomplete authentication credentials');
    }

    if (req.body.deviceId) {
      // check if creditals are correct for this terminal
      if (credentialsElements[0] === process.env.DEVICE_USERNAME) {
        const match = await bcrypt.compare(credentialsElements[1], process.env.DEVICE_PASSWORD);
        if (match === false) {
          throw new Error('Invalid authentication credentials');
        }
      } else {
        throw new Error('Invalid authentication credentials');
      }
    } else if (req.body.hostId) {
      // check if creditals are correct for this host
      if (credentialsElements[0] === process.env.HOST_USERNAME) {
        const match = await bcrypt.compare(credentialsElements[1], process.env.HOST_PASSWORD);
        if (match === false) {
          throw new Error('Invalid authentication credentials');
        }
      } else {
        throw new Error('Invalid authentication credentials');
      }
    } else {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body does not contain a deviceId or hostId property');
    }

    createToken(req, res);
  } catch (e) {
    console.error(e.message);
    res.json({ error: e.message });
  }
}

async function createToken (req, res) {
  try {
    const expiry = parseInt(process.env.JWT_ACCESS_EXPIRY_SECS);
    let accessPayload;
    if (req.body.deviceId) {
      if (req.body.deviceId === process.env.DEVICE_ID) {
        accessPayload = { type: 'device', user: req.body.deviceId };
      } else {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error(`Body contains invalid deviceId value, should be: \'${process.env.DEVICE_ID}\'`);
      }
    } else { // if (req.body.hostId) 
      accessPayload = { type: 'host', user: req.body.hostId };
    }
    // else {
    //   res.status(httpStatus.StatusCodes.BAD_REQUEST);
    //   throw new Error('Body does not contain a deviceId or hostId property');
    // }

    const accessToken = jwt.sign(
      accessPayload,
      process.env.JWT_SECRET,
      {
        algorithm: process.env.JWT_SIGNING_ALGORITHM,
        expiresIn: expiry,
        issuer: process.env.JWT_ISSUER
      }
    );

    res.status(httpStatus.StatusCodes.CREATED).json({ accessToken: accessToken });
  } catch (e) {
    console.error(e.message);
    res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: e.message });
  }
}

module.exports = {
  logon,
  createToken
};
