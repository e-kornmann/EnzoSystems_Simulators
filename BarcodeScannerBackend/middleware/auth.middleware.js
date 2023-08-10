const jwt = require('jsonwebtoken');
const httpStatus = require('http-status-codes');

const INDEX_AUTH_HEADER_SCHEME = 0;
const INDEX_AUTH_HEADER_DATA = 1;

async function verifyAuthenticationHeader (req, res, next) {
  const authHeader = req?.headers?.authorization;

  try {
    res.status(httpStatus.StatusCodes.UNAUTHORIZED);

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
    const decoded = await verifyToken(token);
    if (!decoded.user) {
      throw new Error('Invalid access token, \'user\' missing');
    }
    if (!decoded.type) {
      throw new Error('Invalid access token, \'type\' missing');
    }
    req.authenticationUser = decoded.user;
    req.authenticationType = decoded.type;
    next();
  } catch (e) {
    console.error(e.message);

    res.json({ error: e.message });
  }
}

async function verifyToken (accessToken) {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET, { issuer: process.env.JWT_ISSUER });

  if (!decoded) {
    throw new Error(`No decoding result of the access token, token: ${accessToken}`);
  }

  return decoded;
}

module.exports = {
  verifyAuthenticationHeader,
  verifyToken
};
