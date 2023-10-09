import crypto from 'crypto';
import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
// Enums
import DEVICE_STATUS from '../enums/DeviceStatus';
// Types
import SessionData from '../types/SessionData';
import SESSION_STATUS from '../enums/SessionStatus';
import SESSION_COMMAND from '../enums/SessionCommand';

/* //////////////////////////////////////////////////////////////////////////////
//
// getStatus function to get the current status of the device
//
/////////////////////////////////////////////////////////////////////////////// */

const getDeviceStatus = async (req: Request, res: Response) => {
  try {
    if (req.authenticationType !== 'host') {
      res.status(httpStatus.FORBIDDEN);
      throw new Error('Only accounts of type \'host\' are allowed to call this endpoint');
    }

    // Check the deviceId
    if (req.params.deviceId !== req.app.locals.deviceId) {
      res.status(httpStatus.NOT_FOUND);
      throw new Error(`Unknown deviceId: ${req.params.deviceId}`);
    }

    // TODO: handle bin status and stack status

    // Check whether there are any query params, if so, referenceDeviceStatus is mandatory
    if (Object.keys(req.query).length) {
      if (!Object.keys(req.query).includes('referenceDeviceStatus')) {
        res.status(httpStatus.BAD_REQUEST);
        throw new Error('Query string must be empty or contain the \'referenceDeviceStatus\' property');
      }

      if (!req.query.referenceDeviceStatus || (req.query.referenceDeviceStatus && !Object.values<string>(DEVICE_STATUS).includes(req.query.referenceDeviceStatus as string))) {
        res.status(httpStatus.BAD_REQUEST);
        throw new Error(`Query string 'referenceDeviceStatus' property should be one of ${Object.values(DEVICE_STATUS)}`);
      }

      const longPollingMS = req.app.locals.longPollingMS;
      let pollingMS = 0;

      // if mode has already changed, return immediately
      const timer = setInterval(() => {
        try {
          pollingMS += Number(process.env.LONG_POLLING_INTERVAL_MS as string);
          if ((req.query.referenceDeviceStatus !== req.app.locals.deviceStatus) || pollingMS >= longPollingMS) {
            clearInterval(timer);
            const metadata = { binStatus: req.app.locals.binStatus, cardPosition: req.app.locals.cardPosition, longPollingMS: longPollingMS, pollingMS: pollingMS, referenceDeviceStatus: req.query.referenceDeviceStatus, stackStatus: req.app.locals.stackStatus };
            res.status(httpStatus.OK).json({ deviceStatus: req.app.locals.deviceStatus, metadata: metadata });
            console.log(`(${req.authenticationType}: ${req.authenticationUser} - get status) {${JSON.stringify({ deviceStatus: req.app.locals.deviceStatus, metadata: metadata })}}`);
          }
        } catch (error) {
          console.error(`(${req.authenticationType}: ${req.authenticationUser} - get status) ${error}`);
          res.json({ error: error });
        }
      }, Number(process.env.LONG_POLLING_INTERVAL_MS as string));
    } else { // return directly
      res.status(httpStatus.OK).json({ binStatus: req.app.locals.binStatus, cardPosition: req.app.locals.cardPosition, deviceStatus: req.app.locals.deviceStatus, stackStatus: req.app.locals.stackStatus });
      console.log(`(${req.authenticationType}: ${req.authenticationUser} - get status) {${JSON.stringify({ binStatus: req.app.locals.binStatus, cardPosition: req.app.locals.cardPosition, deviceStatus: req.app.locals.deviceStatus, stackStatus: req.app.locals.stackStatus })}}`);
    }
  } catch (error) {
    console.error(`(${req.authenticationType}: ${req.authenticationUser} - get status) ${error}`);
    res.json({ error: error });
  }
};

/* //////////////////////////////////////////////////////////////////////////////
//
// getSession function to get session data
//
////////////////////////////////////////////////////////////////////////////// */

const getSession = async (req: Request, res: Response) => {
  try {
    if (req.authenticationType !== 'host') {
      res.status(httpStatus.FORBIDDEN);
      throw new Error('Only account of type \'host\' are allowed to call this endpoint');
    }

    if (req.app.locals.deviceStatus === DEVICE_STATUS.DISCONNECTED) {
      res.status(httpStatus.CONFLICT);
      throw new Error('Device is DISCONNECTED');
    } else if (req.app.locals.deviceStatus === DEVICE_STATUS.NOT_FOUND) {
      res.status(httpStatus.CONFLICT);
      throw new Error('Device is NOT FOUND');
    } else if (req.app.locals.deviceStatus === DEVICE_STATUS.OUT_OF_ORDER) {
      res.status(httpStatus.CONFLICT);
      throw new Error('Device is OUT OF ORDER');
    } else if (req.app.locals.deviceStatus !== DEVICE_STATUS.CONNECTED) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      throw new Error('Device is in an unknown state');
    }

    const longPollingMS = req.app.locals.longPollingMS;
    let pollingMS = 0;

    // If there is data, return it immediately, otherwise use long poll
    const timer = setInterval(() => {
      try {
        pollingMS += Number(process.env.LONG_POLLING_INTERVAL_MS as string);
        const session = req.app.locals.sessions.get(req.params.id);

        if (!session) {
          res.status(httpStatus.NOT_FOUND);
          throw new Error(`Session not found, id: ${req.params.id}`);
        }

        if (session.status !== SESSION_STATUS.ACTIVE || pollingMS >= 0) {
          clearInterval(timer);
          const metadata = { command: session.command, longPollingMS: longPollingMS, pollingMS: pollingMS, sessionId: req.params.id, status: session.status };
          res.status(httpStatus.OK).json({ metadata: metadata, ...(session.status === SESSION_STATUS.FINISHED && { cardData: session.cardData }) });
          console.log(`(${req.authenticationType}: ${req.authenticationUser} - get session) {${JSON.stringify({ metadata: metadata, ...(session.status === SESSION_STATUS.FINISHED && { cardData: session.cardData }) })}}`);
        }
      } catch (error) {
        console.error(`(${req.authenticationType}: ${req.authenticationUser} - get session) ${error}`);
        res.json({ error: error });
      }
    }, Number(process.env.LONG_POLLING_INTERVAL_MS as string));
  } catch (error) {
    console.error(`(${req.authenticationType}: ${req.authenticationUser} - get session) ${error}`);
    res.json({ error: error });
  }
};

/* //////////////////////////////////////////////////////////////////////////////
//
// newSession function to create a new card or get status information
//
/////////////////////////////////////////////////////////////////////////////// */

const newSession = (req: Request, res: Response) => {
  try {
    if (req.authenticationType !== 'host') {
      res.status(httpStatus.FORBIDDEN);
      throw new Error('Only accounts of type \'host\' are allowed to call this endpoint');
    }

    if (req.app.locals.activeSessionId && req.app.locals.sessions) {
      const activeSession = req.app.locals.sessions.get(req.app.locals.activeSessionId);
      if (activeSession && activeSession.status === SESSION_STATUS.ACTIVE) {
        res.status(httpStatus.CONFLICT);
        throw new Error('Device is busy');
      }
    }

    if (req.app.locals.deviceStatus === DEVICE_STATUS.DISCONNECTED) {
      res.status(httpStatus.CONFLICT);
      throw new Error('Device is DISCONNECTED');
    } else if (req.app.locals.deviceStatus === DEVICE_STATUS.NOT_FOUND) {
      res.status(httpStatus.CONFLICT);
      throw new Error('Device is NOT FOUND');
    } else if (req.app.locals.deviceStatus === DEVICE_STATUS.OUT_OF_ORDER) {
      res.status(httpStatus.CONFLICT);
      throw new Error('Device is OUT OF ORDER');
    } else if (req.app.locals.deviceStatus !== DEVICE_STATUS.CONNECTED) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      throw new Error('Device is in an unknown state');
    }

    // Check command
    if (!req.body?.command || typeof req.body?.command !== 'string') {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body should contain a \'command\' property of type string');
    }

    // Check deviceId validity
    if (!req.body?.deviceId || typeof req.body?.deviceId !== 'string') {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body should contain a \'deviceId\' property of type string');
    } else if (req.body.deviceId !== req.app.locals.deviceId) {
      res.status(httpStatus.CONFLICT);
      throw new Error(`There is no card dispenser available with deviceId: ${req.body.deviceId}`);
    }

    if (req.body.command === SESSION_COMMAND.CREATE_CARD) {
      createCard(req, res);
    } else {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error(`Body '' command property should be one of: ${Object.values(SESSION_COMMAND)}`);
    }
  } catch (error) {
    console.error(`(${req.authenticationType}: ${req.authenticationUser} - new session) ${error}`);
    res.json({ error: error });
  }
};

/* Create Card */
const createCard = (req: Request, res: Response) => {
  try {
    // Check if body contains a data object
    if (!req.body?.data || typeof req.body?.data !== 'object') {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body should contain a \'data\' property of type object');
    }

    // Check whether additionalAccess is a valid array
    if (!req.body.data?.additionalAccess || !Array.isArray(req.body.data.additionalAccess)) {
      console.dir(!Array.isArray(req.body.data.additionalAccess));
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body should contain a \'data.additionalAccess\' property of type string array');
    } else {
      for (const access of req.body.data.additionalAccess) {
        if (typeof access !== 'string') {
          res.status(httpStatus.BAD_REQUEST);
          throw new Error('Body \'data.additionalAccess\' property contains items that are not of type string');
        } else if (!access.length) {
          res.status(httpStatus.BAD_REQUEST);
          throw new Error('Body \'data.additionalAccess\' property contains items with an empy string value');
        }
      }
    }

    // Check endDateTime validity
    if (!req.body.data?.endDateTime || typeof req.body.data.endDateTime !== 'string') {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body should contain a \'data.endDateTime\' property of type string');
    } else if (isNaN(Date.parse(req.body.data.endDateTime))) {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body \'data.endDateTime\' property is not a valid date time');
    }

    // Check whether roomAccess is a valid array
    if (!req.body.data?.roomAccess || !Array.isArray(req.body.data.roomAccess)) {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body should contain a \'data.roomAccess\' property of type string array');
    } else if (!req.body.data.roomAccess.length) {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body \'data.roomAccess\' property should contain at least one string item');
    } else {
      for (const access of req.body.data.roomAccess) {
        if (typeof access !== 'string') {
          res.status(httpStatus.BAD_REQUEST);
          throw new Error('Body \'data.roomAccess\' property contains items that are not of type string');
        } else if (!access.length) {
          res.status(httpStatus.BAD_REQUEST);
          throw new Error('Body \'data.roomAccess\' property contains items with an empty string value');
        }
      }
    }

    // Check startDateTime validity
    if (!req.body.data?.startDateTime || typeof req.body.data.startDateTime !== 'string') {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body should contain a \'data.startDateTime\' property of type string');
    } else if (isNaN(Date.parse(req.body.data.startDateTime))) {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body \'data.startDateTime\' property is not a valid date time');
    }

    // Set session timeout
    if (process.env.SESSION_TIMEOUT_SEC) {
      req.app.locals.activeSessionTimeoutMS = Number(process.env.SESSION_TIMEOUT_SEC) * 1000;
    } else {
      req.app.locals.activeSessionTimeoutMS = 60 * 1000;
    }

    const sessionId = crypto.randomUUID();
    req.app.locals.activeSessionId = sessionId;

    const sessionData: SessionData = {
      cardData: {
        additionalAccess: req.body.data.additionalAccess,
        cardId: crypto.randomUUID(),
        endDateTime: req.body.data.endDateTime,
        roomAccess: req.body.data.roomAccess,
        startDateTime: req.body.data.startDateTime
      },
      command: req.body.command,
      status: SESSION_STATUS.ACTIVE
    };
    const metadata = { ...sessionData, sessionId: sessionId };

    req.app.locals.sessions.set(sessionId, sessionData);

    res.status(httpStatus.OK).json({ metadata: metadata });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - new session) {${JSON.stringify({ metadata: metadata })}}`);
  } catch (error) {
    console.error(`(${req.authenticationType}: ${req.authenticationUser} - new session) ${error}`);
    res.json({ error: error });
  }
};

// Generic Commands - like part statuses / retract card / discard faulty card to bin
const genericCommand = (req: Request, res: Response) => {
  try {
    // Set session timeout
    if (process.env.SESSION_TIMEOUT_SEC) {
      req.app.locals.activeSessionTimeoutMS = Number(process.env.SESSION_TIMEOUT_SEC) * 1000;
    } else {
      req.app.locals.activeSessionTimeoutMS = 60 * 1000;
    }

    const sessionId = crypto.randomUUID();
    req.app.locals.activeSessionId = sessionId;

    const sessionData: SessionData = {
      command: req.body.command,
      status: SESSION_STATUS.ACTIVE
    };
    const metadata = { ...sessionData, sessionId: sessionId };

    req.app.locals.sessions.set(sessionId, sessionData);

    res.status(httpStatus.OK).json({ metadata: metadata });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - new session) {${JSON.stringify({ metadata: metadata })}}`);
  } catch (error) {
    console.error(`(${req.authenticationType}: ${req.authenticationUser} - new session) ${error}`);
    res.json({ error: error });
  }
};

/* //////////////////////////////////////////////////////////////////////////////
//
// updateSession function to stop an active session
//
////////////////////////////////////////////////////////////////////////////// */

const updateSession = (req: Request, res: Response) => {
  try {
    if (req.authenticationType !== 'host') {
      res.status(httpStatus.FORBIDDEN);
      throw new Error('Only accounts of type \'host\' are allowed to call this endpoint');
    }

    if (req.app.locals.deviceStatus === DEVICE_STATUS.DISCONNECTED) {
      res.status(httpStatus.CONFLICT);
      throw new Error('Device is DISCONNECTED');
    } else if (req.app.locals.deviceStatus === DEVICE_STATUS.NOT_FOUND) {
      res.status(httpStatus.CONFLICT);
      throw new Error('Device is NOT FOUND');
    } else if (req.app.locals.deviceStatus === DEVICE_STATUS.OUT_OF_ORDER) {
      res.status(httpStatus.CONFLICT);
      throw new Error('Device is OUT OF ORDER');
    } else if (req.app.locals.deviceStatus !== DEVICE_STATUS.CONNECTED) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      throw new Error('Device is in an unknown state');
    }

    // Check command
    if (!req.body?.command || typeof req.body?.command !== 'string') {
      console.dir(req.body);
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body should contain a \'command\' property of type string');
    }

    // Check session
    const session = req.app.locals.sessions.get(req.params.id);
    if (!session) {
      res.status(httpStatus.NOT_FOUND);
      throw new Error(`Unknown session, id: ${req.params.id}`);
    }

    if (req.app.locals.activeSessionId !== req.params.id) {
      res.status(httpStatus.CONFLICT);
      throw new Error(`Session can't be cancelled as it is no longer active, id: ${req.params.id}`);
    }

    // Check if session has timed out
    if (req.app.locals.activeSessionTimeoutMS <= 0) {
      res.status(httpStatus.CONFLICT);
      throw new Error(`Session timed out, id: ${req.app.locals.activeSessionId}`);
    }

    if (req.body.command === SESSION_COMMAND.CANCEL) {
      session.status = SESSION_STATUS.CANCELLING;
    } else if (req.body.command === SESSION_COMMAND.READ_CARD || req.body.command === SESSION_COMMAND.PRESENT_CARD || req.body.command === SESSION_COMMAND.RETRACT_CARD_NOT_TAKEN || req.body.command === SESSION_COMMAND.SEND_FAULTY_CARD_TO_BIN) {
      session.status = SESSION_STATUS.ACTIVE;
    } else {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error(`Body 'command' property should have a value of: ${SESSION_COMMAND.CANCEL} | ${SESSION_COMMAND.PRESENT_CARD} | ${SESSION_COMMAND.RETRACT_CARD_NOT_TAKEN} | ${SESSION_COMMAND.SEND_FAULTY_CARD_TO_BIN}`);
    }

    session.command = req.body.command;
    req.app.locals.sessions.set(req.params.id, session);

    const metadata = { command: session.command, sessionId: req.params.id, status: session.status };

    res.status(httpStatus.OK).json({ metadata: metadata });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - update session) {${JSON.stringify({ metadata: metadata })}}`);
  } catch (error) {
    console.error(`(${req.authenticationType}: ${req.authenticationUser} - update session) ${error}`);
    res.json({ error: error });
  }
};

export {
  getDeviceStatus,
  getSession,
  newSession,
  updateSession
};