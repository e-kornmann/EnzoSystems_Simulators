const httpStatus = require('http-status-codes');
const { DEVICE_STATUS, SESSION_COMMAND, SESSION_STATUS, LONG_POLLING_INTERVAL_MS } = require('../constants/constants');

/* //////////////////////////////////////////////////////////////////////////////
//
// setDeviceStatus function
// if device status is CONNECTED , new scan sessions can be posted
//
////////////////////////////////////////////////////////////////////////////// */

async function setStatus (req, res) {
  try {
    if (req.authenticationType !== 'device') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'device\' are allowed to call this endpoint');
    }

    res.status(httpStatus.StatusCodes.BAD_REQUEST);

    if (req.body.status === undefined) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body is missing \'status\' property');
    } else if (req.body.status === null) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body contains \'status\' property with null value');
    } else if (req.body.status !== DEVICE_STATUS.CONNECTED &&
      req.body.status !== DEVICE_STATUS.DISCONNECTED &&
      req.body.status !== DEVICE_STATUS.OUT_OF_ORDER) {
      throw new Error(`Body \'status\' property should should be one of ${Object.values(DEVICE_STATUS)}`);
    }

    if (process.env.DEVICE_CONNECTION_TIMEOUT_SEC) {
      req.app.locals.connectionTimeoutMS = parseInt(process.env.DEVICE_CONNECTION_TIMEOUT_SEC, 10) * 1000;
    } else {
      req.app.locals.connectionTimeoutMS = 10000;
    }

    const previousStatus = req.app.locals.deviceStatus;
    req.app.locals.deviceStatus = req.body.status;
    req.app.locals.deviceId = req.authenticationUser;

    res.status(httpStatus.StatusCodes.OK).json({ metadata: { previousStatus: previousStatus, status: req.app.locals.deviceStatus, timeoutMS: req.app.locals.connectionTimeoutMS } });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put status) {${JSON.stringify({ metadata: { previousStatus: previousStatus, status: req.app.locals.deviceStatus, timeoutMS: req.app.locals.connectionTimeoutMS } })}}`);
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put status) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// getActiveSession function
//
////////////////////////////////////////////////////////////////////////////// */

async function getActiveSession (req, res) {
  try {
    if (req.authenticationType !== 'device') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'device\' are allowed to call this endpoint');
    }

    if (req.app.locals.deviceStatus === DEVICE_STATUS.NOT_FOUND) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device not found');
    } else if (req.app.locals.deviceStatus === DEVICE_STATUS.OUT_OF_ORDER) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is out of order');
    } else if (req.app.locals.deviceStatus !== DEVICE_STATUS.CONNECTED) {
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error('Device is in an unknown state');
    }

    const session = req.app.locals.sessions.get(req.app.locals.activeSessionId);
    // if there is key data, return it directly, otherwise start long polling
    if (session) {
      res.status(httpStatus.StatusCodes.OK).json({
        metadata: {
          sessionId: req.app.locals.activeSessionId,
          command: session.command,
          status: session.status
        },
        keyData: session.keyData
      });
      console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) {${JSON.stringify({
        metadata: {
          sessionId: req.app.locals.activeSessionId,
          command: session.command,
          status: session.status
        },
        keyData: session.keyData
      })}}`);
    } else {
      const longPollingMS = req.app.locals.longPollingMS;
      let pollingMS = 0;
      const timer = setInterval(() => {
        try {
          pollingMS += LONG_POLLING_INTERVAL_MS;
          const session = req.app.locals.sessions.get(req.app.locals.activeSessionId);
          if (session || pollingMS >= longPollingMS) {
            clearInterval(timer);
            if (session) {
              res.status(httpStatus.StatusCodes.OK).json({
                metadata: {
                  sessionId: req.app.locals.activeSessionId,
                  command: session.command,
                  status: session.status,
                  longPollingMS: longPollingMS,
                  pollingMS: pollingMS
                },
                keyData: session.keyData
              });
              console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) {${JSON.stringify({
                metadata: {
                  sessionId: req.app.locals.activeSessionId,
                  command: session.command,
                  status: session.status,
                  longPollingMS: longPollingMS,
                  pollingMS: pollingMS
                },
                keyData: session.keyData
              })}}`);
            } else {
              res.status(httpStatus.StatusCodes.OK).json({ result: 'NO_ACTIVE_SESSION' });
              console.log(`(${req.authenticationType}: ${req.authenticationUser} - get active session) {result: 'NO_ACTIVE_SESSION'}`);
            }
          }
        } catch (e) {
          res.json({ error: e.message });
          console.log(`(${req.authenticationType}: ${req.authenticationUser} - get key) ${e.message}`);
        }
      }, LONG_POLLING_INTERVAL_MS);
    }
  } catch (e) {
    res.json({ error: e.message });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - get active session) ${e.message}`);
  }
}

/* /////////////////////////////////////////////////////////////////////////////
//
// updateCreateKeySession function
//
////////////////////////////////////////////////////////////////////////////// */

async function updateCreateKeySession (session, req, res) {
  // check if body contains a data object
  if (req.body.data === undefined || req.body.data === null || typeof req.body.data !== 'object') {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('Body should have a \'data\' property of type object');
  }
  
  // update keyId, empty keyId is allowed
  if (!req.body.data.keyId || typeof req.body.data.keyId !== 'string') {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('Body should have a \'keyId\' property of type string');
  }
  session.keyData.keyId = req.body.data.keyId;

  // add any extra additional access, if available
  if (req.body.data && req.body.data.additionalAccess) {
    if (!Array.isArray(req.body.data.additionalAccess)) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body \'data.additionalAccess\' property must be of type array of strings');
    }
    for (const access of req.body.data.additionalAccess) {
      if (typeof access !== 'string') {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Body \'data.additionalAccess\' property contains one or more items not being of type string');
      } else if (!access.length) {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Body \'data.additionalAccess\' property contains one or more items with an empty string value');
      }

      // add item to req.app.locals.keyData if not already there
      if (!session.keyData.additionalAccess.includes(access)) {
        session.keyData.additionalAccess.push(access);
      }
    }
  }

  session.status = SESSION_STATUS.FINISHED;
}

/* //////////////////////////////////////////////////////////////////////////////
//
// updateReadKeySession function
//
////////////////////////////////////////////////////////////////////////////// */

async function updateReadKeySession (session, req, res) {
  // check if body contains a data object with roomAccess, additionalAccess, startDateTime and endDateTime properties
  if (req.body.data === undefined || req.body.data === null || typeof req.body.data !== 'object') {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('Body should have a \'data\' property of type object');
  }

  // update keyId, empty keyId is allowed
  if (!req.body.data.keyId || typeof req.body.data.keyId !== 'string') {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('Body should have a \'data.keyId\' property of type string');
  }

  // check is roomAccess array is available and valid
  if (!req.body.data.roomAccess) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('The body should have a \'data.roomAccess\' property of type array of strings');
  } else if (!Array.isArray(req.body.data.roomAccess)) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('The body \'data.roomAccess\' property should be of type array of strings');
  } else if (!req.body.data.roomAccess.length) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('Body \'data.roomAccess\' property should have at least one string item');
  } else {
    for (const access of req.body.data.roomAccess) {
      if (typeof access !== 'string') {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Body \'data.roomAccess\' property contains one or more items not being of type string');
      } else if (!access.length) {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Body \'data.roomAccess\' property contains one or more items with an empty string value');
      }
    }
  }

  // optional: check is additionalAccess array is available and is so, if it is an valid array
  if (!req.body.data.roomAccess) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('The body should have a \'data.roomAccess\' property of type array of strings');
  } else if (!Array.isArray(req.body.data.additionalAccess)) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('The body \'data.additionalAccess\' property should be of type array of strings');
  } else {
    for (const access of req.body.data.additionalAccess) {
      if (typeof access !== 'string') {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Body \'data.additionalAccess\' property contains one or more items not being of type string');
      } else if (!access.length) {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Body \'data.additionalAccess\' property contains one or more items with an empty string value');
      }
    }
  }

  // check if startDateTime is valid
  if (!req.body.data.startDateTime || typeof req.body.data.startDateTime !== 'string') {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('Body should have a \'data.startDateTime\' property of type string');
  } else if (isNaN(Date.parse(req.body.data.startDateTime))) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('Body \'data.startDateTime\' property is not a valid date and time');
  }

  // check if endDateTime is valid
  if (!req.body.data.endDateTime || typeof req.body.data.endDateTime !== 'string') {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('Body should have a \'data.endDateTime\' property of type string');
  } else if (isNaN(Date.parse(req.body.data.endDateTime))) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('Body \'data.endDateTime\' property is not a valid date and time');
  }

  session.keyData.keyId = req.body.data.keyId;
  if (req.body.data.roomAccess && req.body.data.roomAccess.length > 0) {
    session.keyData.roomAccess = req.body.data.roomAccess;
  } else {
    session.keyData.roomAccess = [];
  }
  if (req.body.data.additionalAccess && req.body.data.additionalAccess.length > 0) {
    session.keyData.additionalAccess = req.body.data.additionalAccess;
  } else {
    session.keyData.additionalAccess = [];
  }
  session.keyData.startDateTime = req.body.data.startDateTime;
  session.keyData.endDateTime = req.body.data.endDateTime;

  session.status = SESSION_STATUS.FINISHED;
}

/* /////////////////////////////////////////////////////////////////////////////
//
// putActiveSession function to write data to device memory from presented key
//
////////////////////////////////////////////////////////////////////////////// */

async function putActiveSession (req, res) {
  try {
    if (req.authenticationType !== 'device') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'device\' are allowed to call this endpoint');
    }

    if (req.app.locals.deviceStatus === DEVICE_STATUS.DISCONNECTED) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is DISCONNECTED');
    } else if (req.app.locals.deviceStatus === DEVICE_STATUS.NOT_FOUND) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device not found');
    } else if (req.app.locals.deviceStatus === DEVICE_STATUS.OUT_OF_ORDER) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is out of order');
    } else if (req.app.locals.deviceStatus !== DEVICE_STATUS.CONNECTED) {
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error('Device is in an unknown state');
    }

    if (!req.app.locals.activeSessionId) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('No active session');
    }

    const session = req.app.locals.sessions.get(req.app.locals.activeSessionId);
    if (!session) {
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error(`Active session not found, activeSessionId: ${req.app.locals.activeSessionId}`);
    }

    if (session.status !== SESSION_STATUS.ACTIVE && session.status !== SESSION_STATUS.CANCELLING) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      if (session.status === SESSION_STATUS.TIMED_OUT) {
        throw new Error('Session has timed-out');
      } else if (session.status === SESSION_STATUS.STOPPED) {
        throw new Error('Session was cancelled');
      } else {
        throw new Error('No active session');
      }
    }

    if (req.app.locals.activeSessionTimeoutMS <= 0) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error(`Session time-out, sessionId: id: ${req.app.locals.activeSessionId}`);
    }

    if (req.body.data.status === SESSION_STATUS.STOPPED) {
      session.status = SESSION_STATUS.STOPPED;
    }
    else if (session.command === SESSION_COMMAND.CREATE_NEW_KEY || session.command === SESSION_COMMAND.CREATE_COPY_KEY || session.command === SESSION_COMMAND.CREATE_JOINNER_KEY) {
      updateCreateKeySession(session, req, res);
    } else if (session.command === SESSION_COMMAND.READ_KEY) {
      updateReadKeySession(session, req, res);
    } else {
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error(`Session has a unsupported command: ${session.command}`);
    }

    // set new session time-out
    let sessionTimeout = Number(process.env.SESSION_TIMEOUT_SEC);
    if (isNaN(sessionTimeout)) {
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error('SESSION_TIMEOUT_SEC is not defined in .env or not a number');
    } else if (sessionTimeout < 5) {
      sessionTimeout = 5;
    }
    req.app.locals.activeSessionTimeoutMS = sessionTimeout * 1000;

    // update sessions with active session
    req.app.locals.sessions.set(req.app.locals.activeSessionId, session);
    const sessionId = req.app.locals.activeSessionId;
    req.app.locals.activeSessionId = '';

    // send response
    res.status(httpStatus.StatusCodes.OK).json({
      metadata: {
        sessionId: sessionId,
        command: session.command,
        status: session.status,
        keyData: session.keyData
      }
    });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put active session) {${JSON.stringify({
      metadata: {
        sessionId: sessionId,
        command: session.command,
        status: session.status,
        keyData: session.keyData
      }
    })}}`);
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put active session) ${e.message}`);
    res.json({ error: e.message });
  }
}

module.exports = {
  setStatus,
  getActiveSession,
  putActiveSession
};
