const httpStatus = require('http-status-codes');
const { DEVICE_STATUS, SESSION_COMMAND, SESSION_STATUS, LONG_POLLING_INTERVAL_MS } = require('../constants/constants');
const { DocumentTypes } = require('../enums/documentTypes');
const { format, parse } = require('date-fns');

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
      throw new Error(`Body status property should should be one of ${Object.values(DEVICE_STATUS)}`);
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
        idData: session.idData
      });
      console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) {${JSON.stringify({
        metadata: {
          sessionId: req.app.locals.activeSessionId,
          command: session.command,
          status: session.status
        },
        idData: session.idData
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
                idData: session.idData
              });
              console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) {${JSON.stringify({
                metadata: {
                  sessionId: req.app.locals.activeSessionId,
                  command: session.command,
                  status: session.status,
                  longPollingMS: longPollingMS,
                  pollingMS: pollingMS
                },
                idData: session.idData
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

/* //////////////////////////////////////////////////////////////////////////////
//
// updateScanIDSession function
//
////////////////////////////////////////////////////////////////////////////// */

async function updateScanIDSession (session, req, res) {
  // check if body contains a proper data object
  if (req.body.data === undefined || req.body.data === null || typeof req.body.data !== 'object') {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('Body should have a \'data\' property of type object');
  }

  // check if required fields are present
  if (!req.body.data.issuerCode) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('The body should have a \'data.issuerCode\' property of type string');
  } else if (!req.body.data.documentNumber) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('The body should have a \'data.documentNumber\' property of type string');
  } else if (!req.body.data.documentType) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('The body should have a \'data.documentType\' property of type string');
  } else if (!req.body.data.namePrimary) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('The body should have a \'data.namePrimary\' property of type string');
  } else if (!req.body.data.nameSecondary) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('The body should have a \'data.nameSecondary\' property of type string');
  } else if (!req.body.data.dateOfBirth) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('The body should have a \'data.dateOfBirth\' property of type string');
  } else if (!req.body.data.dateOfExpiry) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('The body should have a \'data.dateOfExpiry\' property of type string');
  } else if (!req.body.data.nationality) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('The body should have a \'data.nationality\' property of type string');
  } else if (!req.body.data.sex) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('The body should have a \'data.sex\' property of type string');
  }

  const { status, ...rest } = req.body.data;

  // format data for use by other services
  const newData = { ...rest };
  // Document Type: are you sure you want this, anything hooked up to this now can't register document sub-types like AC (Air Crew) as that'll just be IDENTITY_CARD now
  let type = DocumentTypes.IDENTITY_CARD;

  switch (newData.documentType.charAt(0)) {
    case 'P':
      type = DocumentTypes.PASSPORT;
      break;
    case 'V':
      type = DocumentTypes.VISA;
      break;
    default:
      type = DocumentTypes.IDENTITY_CARD;
      break;
  }

  newData.documentType = type;
  // Date of Birth: turn YYMMDD into an ISO string representation
  newData.dateOfBirth = convertYear(newData.dateOfBirth);
  // Date of Expiry: turn YYMMDD into an ISO string representation
  newData.dateOfExpiry = convertYear(newData.dateOfExpiry);
  // Sex?
  // Nationality?

  // Assign modified data to session
  session.idData = newData;

  session.status = SESSION_STATUS.FINISHED;
}

const convertYear = (date) => {
  const yearValue = date.slice(0, 2);

  const currentDate = new Date(Date.now());
  const currentCentury = currentDate.getFullYear().toString().slice(0, 2);
  const currentYear = currentDate.getFullYear().toString().slice(3, 5);
  const thisCenturyDate = parse(`${currentCentury}${date}`, 'yyyyMMdd', new Date(Date.now()));

  if (yearValue > currentYear || (thisCenturyDate > currentDate)) { // last century
    const priorCenturyDate = parse(`${currentCentury - 1}${date}`, 'yyyyMMdd', new Date(Date.now()));
    const newDate = format(priorCenturyDate, 'yyyy-MM-dd');
    return newDate;
  } else { // this century
    const newDate = format(thisCenturyDate, 'yyyy-MM-dd');
    return newDate;
  }
};

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
    } else if (session.command === SESSION_COMMAND.SCAN_ID) {
      updateScanIDSession(session, req, res);
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
        idData: session.idData
      }
    });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put active session) {${JSON.stringify({
      metadata: {
        sessionId: sessionId,
        command: session.command,
        status: session.status,
        idData: session.idData
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
