const httpStatus = require('http-status-codes');
const { DEVICE_STATUS, SESSION_STATUS, LONG_POLLING_INTERVAL_MS } = require('../constants/constants');

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
      throw new Error('Body \'status\' property should be \'CONNECTED\', \'DISCONNECTED\' or \'OUT_OF_ORDER\'');
    }

    if (process.env.DEVICE_CONNECTION_TIMEOUT_MS) {
      req.app.locals.connectionTimeoutMS = parseInt(process.env.DEVICE_CONNECTION_TIMEOUT_MS, 10);
    } else {
      req.app.locals.connectionTimeoutMS = 10000;
    }

    const previousStatus = req.app.locals.deviceStatus;
    req.app.locals.deviceStatus = req.body.status;

    res.status(httpStatus.StatusCodes.OK).json({ metadata: { previousStatus: previousStatus, status: req.app.locals.deviceStatus, timeoutMS: req.app.locals.connectionTimeoutMS } });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put status) ${JSON.stringify({ metadata: { previousStatus: previousStatus, status: req.app.locals.deviceStatus, timeoutMS: req.app.locals.connectionTimeoutMS } })}`);
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put status) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// getSession function
//
////////////////////////////////////////////////////////////////////////////// */

async function getSession (req, res) {
  try {
    if (req.authenticationType !== 'device') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'device\' are allowed to call this endpoint');
    }

    if (req.app.locals.deviceStatus === DEVICE_STATUS.DISCONNECTED) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is disconnected');
    } else if (req.app.locals.deviceStatus === DEVICE_STATUS.NOT_FOUND) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is not not found');
    } else if (req.app.locals.deviceStatus === DEVICE_STATUS.OUT_OF_ORDER) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is out of order');
    } else if (req.app.locals.deviceStatus !== DEVICE_STATUS.CONNECTED) {
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error('Device is in an unknown state');
    }

    if (Object.keys(req.query).length) {
      if (!Object.keys(req.query).includes('longPollingMS')) {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Query string must be empty or contain the \'longPollingMS\' property');
      }

      // check if values are valid
      if (req.query.longPollingMS <= 500 || req.query.longPollingMS > 60000) {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error(`Invalid longPollingSecs value: ${req.query.longPollingMS}. It should be any value between 500 and 60000`);
      }
      const session = req.app.locals.sessions.get(req.app.locals.activeSessionId);

      const longPollingMS = Number(req.query.longPollingMS);
      let pollingMS = 0;

      // if there is key data, return it directly, otherwise start long polling
      if (session) {
        res.status(httpStatus.StatusCodes.OK).json({ metadata: { sessionId: req.app.locals.activeSessionId, name: session.name, status: session.status, longPollingMS: longPollingMS, pollingDurationMS: pollingMS } });
        console.log(`(${req.authenticationType}: ${req.authenticationUser} - get active session) ${JSON.stringify({ metadata: { sessionId: req.app.locals.activeSessionId, name: session.name, status: session.status, longPollingMS: longPollingMS, pollingDurationMS: pollingMS } })}`);
      } else {
        // let pollingMS = req.query.longPollingSecs * 1000;
        const timer = setInterval(() => {
          try {
            pollingMS += LONG_POLLING_INTERVAL_MS;
            const session = req.app.locals.sessions.get(req.app.locals.activeSessionId);
            if (session || pollingMS >= longPollingMS) {
              clearInterval(timer);
              if (session) {
                res.status(httpStatus.StatusCodes.OK).json({ metadata: { sessionId: req.app.locals.activeSessionId, name: session.name, status: session.status, longPollingMS: longPollingMS, pollingDurationMS: pollingMS } });
                console.log(`(${req.authenticationType}: ${req.authenticationUser} - get active session) ${JSON.stringify({ metadata: { sessionId: req.app.locals.activeSessionId, name: session.name, status: session.status, longPollingMS: longPollingMS, pollingDurationMS: pollingMS } })}`);
              } else {
                res.status(httpStatus.StatusCodes.CONFLICT);
                throw new Error('No active session');
              }
            }
          } catch (e) {
            res.json({ error: e.message });
            console.log(`(${req.authenticationType}: ${req.authenticationUser} - get key) ${e.message}`);
          }
        }, LONG_POLLING_INTERVAL_MS);
      }
    } else {
      const session = req.app.locals.sessions.get(req.app.locals.activeSessionId);

      if (session) {
        res.status(httpStatus.StatusCodes.OK).json({ metadata: { sessionId: req.app.locals.activeSessionId, name: session.name, status: session.status } });
        console.log(`(${req.authenticationType}: ${req.authenticationUser} - get active session) ${JSON.stringify({ metadata: { sessionId: req.app.locals.activeSessionId, name: session.name, status: session.status } })}`);
      } else {
        res.status(httpStatus.StatusCodes.CONFLICT);
        throw new Error('No active session');
      }
    }
  } catch (e) {
    res.json({ error: e.message });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - get active session) ${e.message}`);
  }
}

/* /////////////////////////////////////////////////////////////////////////////
//
// updateSession function
//
////////////////////////////////////////////////////////////////////////////// */

async function updateSession (req, res) {
  try {
    if (req.authenticationType !== 'device') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'device\' are allowed to call this endpoint');
    }

    if (req.app.locals.deviceStatus === DEVICE_STATUS.DISCONNECTED) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is disconnected');
    } else if (req.app.locals.deviceStatus === DEVICE_STATUS.NOT_FOUND) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is not not found');
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

    if (session.status !== SESSION_STATUS.WAITING_FOR_BARCODE) {
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

    // scanned data
    if (!req.body.barcodeData || typeof req.body.barcodeData !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'barcodeData\' property of type string');
    }

    session.barcodeData = req.body.barcodeData;
    session.status = SESSION_STATUS.FINISHED;
    const sessionId = req.app.locals.activeSessionId;

    // update sessions with active session
    req.app.locals.sessions.set(sessionId, session);
    req.app.locals.activeSessionId = '';
    req.app.locals.activeSessionTimeoutMS = 0;

    // send response
    res.status(httpStatus.StatusCodes.OK).json({ metadata: { sessionId: sessionId, name: session.name, status: session.status, barcodeData: session.barcodeData } });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put active session) ${JSON.stringify({ metadata: { sessionId: sessionId, name: session.name, status: session.status, barcodeData: session.barcodeData } })}`);
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put active session) ${e.message}`);
    res.json({ error: e.message });
  }
}

module.exports = {
  setStatus,
  getSession,
  updateSession
};
