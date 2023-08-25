const httpStatus = require('http-status-codes');
const crypto = require('crypto');
const { DEVICE_STATUS, SESSION_COMMAND, SESSION_STATUS, CREATION_MODE, LONG_POLLING_INTERVAL_MS } = require('../constants/constants');
const { KeyData, SessionData } = require('../classes/classes');

/* //////////////////////////////////////////////////////////////////////////////
//
// getStatus function to get the current status of the device
//
/////////////////////////////5///////////////////////////////////////////////// */

async function getStatus (req, res) {
  try {
    if (req.authenticationType !== 'host') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'host\' are allowed to call this endpoint');
    }

    // check if there are query params, if so, both longPollingMS and currentState are mandatory
    if (Object.keys(req.query).length) {
      if (!Object.keys(req.query).includes('longPollingMS') || !Object.keys(req.query).includes('referenceStatus')) {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Query string must be empty or contain both the \'longPollingMS\' and \'referenceStatus\' properties');
      }

      if (req.query.referenceStatus !== DEVICE_STATUS.CONNECTED &&
          req.query.referenceStatus !== DEVICE_STATUS.DISCONNECTED &&
          req.query.referenceStatus !== DEVICE_STATUS.NOT_FOUND &&
          req.query.referenceStatus !== DEVICE_STATUS.OUT_OF_ORDER) {
        // error
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Query string \'referenceStatus\' property must be \'CONNECTED\', \'DISCONNECTED\', \'NOT_FOUND\' or \'OUT_OF_ORDER\'');
      }

      if (req.query.longPollingMS <= 500 || req.query.longPollingMS > 60000) {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error(`Invalid longPollingMS value: ${req.query.longPollingMS}. It should be any value between 500 and 60000`);
      }

      const longPollingMS = Number(req.query.longPollingMS);
      let pollingMS = 0;
      // if mode already changed, return directly
      if (req.query.referenceStatus !== req.app.locals.deviceStatus) {
        res.status(httpStatus.StatusCodes.OK).json({ metadata: { referenceStatus: req.query.referenceStatus, longPollingMS: longPollingMS, pollingMS: pollingMS }, status: req.app.locals.deviceStatus });
        console.log(`(${req.authenticationType} :${req.authenticationUser} - get status) {${JSON.stringify({ metadata: { referenceStatus: req.query.referenceStatus, longPollingMS: longPollingMS, pollingMS: pollingMS }, status: req.app.locals.deviceStatus })}}`);
      } else {
        // use long polling
        // let pollingMS = req.query.longPollingMS * 1000;
        const timer = setInterval(() => {
          try {
            pollingMS += LONG_POLLING_INTERVAL_MS;
            if ((req.query.referenceStatus !== req.app.locals.deviceStatus) || pollingMS >= longPollingMS) {
              clearInterval(timer);
              res.status(httpStatus.StatusCodes.OK).json({ metadata: { referenceStatus: req.query.referenceStatus, longPollingMS: longPollingMS, pollingMS: pollingMS }, status: req.app.locals.deviceStatus });
              console.log(`(${req.authenticationType} :${req.authenticationUser} - get status) {${JSON.stringify({ metadata: { referenceStatus: req.query.referenceStatus, longPollingMS: longPollingMS, pollingMS: pollingMS }, status: req.app.locals.deviceStatus })}}`);
            }
          } catch (e) {
            console.log(`(${req.authenticationType}: ${req.authenticationUser} - get mode) ${e.message}`);
            res.json({ error: e.message });
          }
        }, LONG_POLLING_INTERVAL_MS);
      }
    } else {
      // return directly
      res.status(httpStatus.StatusCodes.OK).json({ status: req.app.locals.deviceStatus });
      console.log(`(${req.authenticationType}: ${req.authenticationUser} - get status) {${JSON.stringify({ status: req.app.locals.deviceStatus })}`);
    }
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - get status) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// postSession function to create a new room key or read an existing key
//
////////////////////////////////////////////////////////////////////////////// */

async function postSession (req, res) {
  try {
    if (req.authenticationType !== 'host') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'host\' are allowed to call this endpoint');
    }

    if (req.app.locals.activeSessionId && req.app.locals.sessions) {
      const activeSession = req.app.locals.sessions.get(req.app.locals.activeSessionId);
      if (activeSession && activeSession.status === SESSION_STATUS.WAITING_FOR_KEY) {
        res.status(httpStatus.StatusCodes.CONFLICT);
        throw new Error('Device is busy');
      }
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

    // check command
    if (req.body.command === undefined || req.body.command === null || typeof req.body.command !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'command\' property of type string');
    }

    if (req.body.command === SESSION_COMMAND.CREATE_KEY) {
      createKey(req, res);
    } else if (req.body.command === SESSION_COMMAND.READ_KEY) {
      readKey(req, res);
    } else {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error(`Body 'command' property should have a value of '${SESSION_COMMAND.CREATE_KEY}' or '${SESSION_COMMAND.READ_KEY}'`);
    }
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// createKey function to create a new room key
//
////////////////////////////////////////////////////////////////////////////// */

async function createKey (req, res) {
  try {
    // check if body has a data object
    if (req.body.data === undefined || req.body.data === null || typeof req.body.data !== 'object') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'data\' property of type object');
    }

    // check if creationMode is valid
    if (req.body.creationMode === undefined || req.body.creationMode === null || typeof req.body.creationMode !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'creationMode\' property of type string');
    } else if (!req.body.creationMode.length) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body \'creationMode\' property is an empty string value');
    } else if (req.body.creationMode !== CREATION_MODE.NEW && req.body.creationMode !== CREATION_MODE.COPY && req.body.creationMode !== CREATION_MODE.JOINING) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error(`Body 'creationMode' property should have a value of '${CREATION_MODE.NEW}', '${CREATION_MODE.COPY}' or '${CREATION_MODE.JOINING}'`);
    }

    // check is roomAccess is an valid array
    if (req.body.data.roomAccess === undefined || req.body.data.roomAccess === null || !Array.isArray(req.body.data.roomAccess)) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'data.roomAccess\' property of type array of strings');
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

    // check if additionalAccess is an valid array
    if (req.body.data.additionalAccess === undefined || req.body.data.additionalAccess === null || !Array.isArray(req.body.data.additionalAccess)) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'additionalAccess\' property of type array of strings');
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
    if (req.body.data.startDateTime === undefined || req.body.data.startDateTime === null || typeof req.body.data.startDateTime !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'startDateTime\' property of type string');
    } else if (isNaN(Date.parse(req.body.data.startDateTime))) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body \'startDateTime\' property is not a valid date and time');
    }

    // check if endDateTime is valid
    if (req.body.data.endDateTime === undefined || req.body.data.endDateTime === null || typeof req.body.data.endDateTime !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'endDateTime\' property of type string');
    } else if (isNaN(Date.parse(req.body.data.endDateTime))) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body \'endDateTime\' property is not a valid date and time');
    }

    let sessionTimeout = Number(process.env.SESSION_TIMEOUT_SEC);
    if (isNaN(sessionTimeout)) {
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error('SESSION_TIMEOUT_SEC is not defined in .env or not a number');
    } else if (sessionTimeout < 5) {
      sessionTimeout = 5;
    }
    req.app.locals.activeSessionTimeoutMS = sessionTimeout * 1000;

    const sessionId = crypto.randomUUID();
    req.app.locals.activeSessionId = sessionId;

    const sessionData = new SessionData(
      req.body.command,
      req.body.creationMode,
      SESSION_STATUS.WAITING_FOR_KEY,
      '',
      new KeyData(req.body.data.roomAccess, req.body.data.additionalAccess, req.body.data.startDateTime, req.body.data.endDateTime)
    );
    req.app.locals.sessions.set(sessionId, sessionData);

    res.status(httpStatus.StatusCodes.OK).json({
      metadata: {
        sessionId: sessionId,
        name: sessionData.command,
        creationMode: req.body.creationMode,
        keyId: sessionData.keyId,
        status: sessionData.status,
        keyData: sessionData.keyData
      }
    });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) {${JSON.stringify({
      metadata: {
        sessionId: sessionId,
        name: sessionData.command,
        creationMode: req.body.creationMode,
        keyId: sessionData.keyId,
        status: sessionData.status,
        keyData: sessionData.keyData
      }
    })}}`);
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// readKey function to read an existing room key
//
////////////////////////////////////////////////////////////////////////////// */

async function readKey (req, res) {
  try {
    let sessionTimeout = Number(process.env.SESSION_TIMEOUT_SEC);
    if (isNaN(sessionTimeout)) {
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error('SESSION_TIMEOUT_SEC is not defined in .env or not a number');
    } else if (sessionTimeout < 5) {
      sessionTimeout = 5;
    }
    req.app.locals.activeSessionTimeoutMS = sessionTimeout * 1000;

    const sessionId = crypto.randomUUID();
    req.app.locals.activeSessionId = sessionId;

    const sessionData = new SessionData(
      req.body.command,
      '',
      SESSION_STATUS.WAITING_FOR_KEY,
      '',
      new KeyData()
    );
    req.app.locals.sessions.set(sessionId, sessionData);

    res.status(httpStatus.StatusCodes.OK).json({
      metadata: {
        sessionId: sessionId,
        name: sessionData.command,
        creationMode: req.body.creationMode,
        keyId: sessionData.keyId,
        status: sessionData.status,
        keyData: sessionData.keyData
      }
    });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) {${JSON.stringify({
      metadata: {
        sessionId: sessionId,
        name: sessionData.command,
        creationMode: req.body.creationMode,
        keyId: sessionData.keyId,
        status: sessionData.status,
        keyData: sessionData.keyData
      }
    })}}`);
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// putSession function to stop an active session
//
////////////////////////////////////////////////////////////////////////////// */

async function putSession (req, res) {
  try {
    if (req.authenticationType !== 'host') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'host\' are allowed to call this endpoint');
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

    // check command
    if (req.body.command === undefined || req.body.command === null || typeof req.body.command !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'command\' property of type string');
    }

    if (req.body.command !== SESSION_COMMAND.STOP) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error(`Body 'command' property should have a value of '${SESSION_COMMAND.STOP}'`);
    }

    // check session
    const session = req.app.locals.sessions.get(req.params.id);
    if (session === undefined) {
      res.status(httpStatus.StatusCodes.NOT_FOUND);
      throw new Error(`Unknown session, id: ${req.params.id}`);
    }

    if (req.app.locals.activeSessionId !== req.params.id) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error(`Session can't be cancelled as it is no longer active, sessionId: ${req.params.id}`);
    }

    // check if the session is not timing out
    if (req.app.locals.activeSessionTimeoutMS <= 0) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error(`Session time-out, sessionId: id: ${req.app.locals.activeSessionId}`);
    }

    // stop session
    req.app.locals.activeSessionTimeoutMS = 0;
    req.app.locals.activeSessionId = '';
    session.status = SESSION_STATUS.STOPPED;
    req.app.locals.sessions.set(req.params.id, session);

    res.status(httpStatus.StatusCodes.OK).json({ metadata: { sessionId: req.params.id, name: session.name, status: session.status } });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put session) ${JSON.stringify({ metadata: { sessionId: req.params.id, name: session.name, status: session.status } })}`);
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put session) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// getSession function to get session data
//
////////////////////////////////////////////////////////////////////////////// */

async function getSession (req, res) {
  try {
    if (req.authenticationType !== 'host') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'host\' are allowed to call this endpoint');
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

    const session = req.app.locals.sessions.get(req.params.id);
    if (session === undefined) {
      res.status(httpStatus.StatusCodes.NOT_FOUND);
      throw new Error(`Session not found, id: ${req.params.id}`);
    }

    if (Object.keys(req.query).length) {
      if (!Object.keys(req.query).includes('longPollingMS')) {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Query string must be empty or contain the \'longPollingMS\' property');
      }

      // check if values are valid
      if (req.query.longPollingMS <= 500 || req.query.longPollingMS > 60000) {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error(`Invalid longPollingMS value: ${req.query.longPollingMS}. It should be any value between 500 and 60000`);
      }

      const longPollingMS = Number(req.query.longPollingMS);
      let pollingMS = 0;

      // if there is key data, return it directly, otherwise start long polling
      if (session.status !== SESSION_STATUS.WAITING_FOR_KEY) {
        res.status(httpStatus.StatusCodes.OK).json({
          metadata: {
            sessionId: req.params.id,
            name: session.command,
            creationMode: req.body.creationMode,
            status: session.status,
            longPollingMS: longPollingMS,
            pollingDurationMS: pollingMS
          },
          keyId: session.keyId,
          keyData: session.keyData
        });

        console.log(`(${req.authenticationType}: ${req.authenticationUser} - set session) {${JSON.stringify({
          metadata: {
            sessionId: req.params.id,
            name: session.command,
            creationMode: req.body.creationMode,
            status: session.status,
            longPollingMS: longPollingMS,
            pollingDurationMS: pollingMS
          },
          keyId: session.keyId,
          keyData: session.keyData
        })}}`);
        // res.status(httpStatus.StatusCodes.OK).json({ metadata: { sessionId: req.params.id, longPollingMS: longPollingMS }, session: session });
        // console.log(`(${req.authenticationType}: ${req.authenticationUser} - get session) {${JSON.stringify({ metadata: { sessionId: req.params.id, longPollingMS: longPollingMS }, session: session })}}`);
      } else {
        // let pollingMS = req.query.longPollingMS * 1000;
        const timer = setInterval(() => {
          try {
            pollingMS += LONG_POLLING_INTERVAL_MS;
            if (session.status !== SESSION_STATUS.WAITING_FOR_KEY || pollingMS >= 0) {
              clearInterval(timer);
              res.status(httpStatus.StatusCodes.OK).json({
                metadata: {
                  sessionId: req.params.id,
                  name: session.command,
                  creationMode: req.body.creationMode,
                  status: session.status,
                  longPollingMS: longPollingMS,
                  pollingDurationMS: pollingMS
                },
                keyId: session.keyId,
                keyData: session.keyData
              });

              console.log(`(${req.authenticationType}: ${req.authenticationUser} - set session) {${JSON.stringify({
                metadata: {
                  sessionId: req.params.id,
                  name: session.command,
                  creationMode: req.body.creationMode,
                  status: session.status,
                  longPollingMS: longPollingMS,
                  pollingDurationMS: pollingMS
                },
                keyId: session.keyId,
                keyData: session.keyData
              })}}`);
              // res.status(httpStatus.StatusCodes.OK).json({ metadata: { sessionId: req.params.id, longPollingMS: longPollingMS, pollingDurationMS: pollingMS }, session: session });
              // console.log(`(${req.authenticationType}: ${req.authenticationUser} - get session) {${JSON.stringify({ metadata: { sessionId: req.params.id, longPollingMS: longPollingMS }, session: session })}}`);
            }
          } catch (e) {
            res.json({ error: e.message });
            console.log(`(${req.authenticationType}: ${req.authenticationUser} - get key) ${e.message}`);
          }
        }, LONG_POLLING_INTERVAL_MS);
      }
    } else {
      res.status(httpStatus.StatusCodes.OK).json({
        metadata: {
          sessionId: req.params.id,
          name: session.command,
          creationMode: session.creationMode,
          status: session.status
        },
        ...(session.status === SESSION_STATUS.FINISHED && { keyId: session.keyId }),
        ...(session.status === SESSION_STATUS.FINISHED && { keyData: session.keyData })
      });

      console.log(`(${req.authenticationType}: ${req.authenticationUser} - set session) {${JSON.stringify({
        metadata: {
          sessionId: req.params.id,
          name: session.command,
          creationMode: session.creationMode,
          status: session.status
        },
        ...(session.status === SESSION_STATUS.FINISHED && { keyId: session.keyId }),
        ...(session.status === SESSION_STATUS.FINISHED && { keyData: session.keyData })
      })}}`);
    }
  } catch (e) {
    res.json({ error: e.message });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - get key) ${e.message}`);
  }
}

module.exports = {
  getStatus,
  postSession,
  createKey,
  readKey,
  putSession,
  getSession
};
