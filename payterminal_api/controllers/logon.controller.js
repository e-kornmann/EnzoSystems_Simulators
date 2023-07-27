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

    if (req.body.terminalId) {
      // check if creditals are correct for this terminal
      if (credentialsElements[0] === process.env.DEVICE_USERNAME) {
        const match = await bcrypt.compare(credentialsElements[1], process.env.DEVICE_PASSWORD);
        if (match === false) {
          throw new Error('Invalid authentication credentials');
        }
      }
    } else if (req.body.hostId) {
      // check if creditals are correct for this host
      if (credentialsElements[0] === process.env.HOST_USERNAME) {
        const match = await bcrypt.compare(credentialsElements[1], process.env.HOST_PASSWORD);
        if (match === false) {
          throw new Error('Invalid authentication credentials');
        }
      }
    } else {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body does not contain a terminalId or hostId property');
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
    if (req.body.terminalId) {
      accessPayload = { type: 'device', user: req.body.terminalId };
    } else {
      accessPayload = { type: 'host', user: req.body.hostId };
    }

    const accessToken = jwt.sign(
      accessPayload,
      process.env.JWT_SECRET,
      {
        algorithm: process.env.JWT_SIGNING_ALGORITHM,
        expiresIn: expiry,
        issuer: process.env.JWT_ISSUER
      }
    );

    res.status(200).json({ accessToken: accessToken });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: e.message });
  }
}

module.exports = {
  logon,
  createToken
};
