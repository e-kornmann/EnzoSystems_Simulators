import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import DEVICE_STATUS from '../enums/DeviceStatus';
import BIN_STATUS from '../enums/BinStatus';
import STACK_STATUS from '../enums/StackStatus';
import SESSION_COMMAND from '../enums/SessionCommand';
import SESSION_STATUS from '../enums/SessionStatus';
import SessionData from '../types/SessionData';
import CARD_POSITION from '../enums/CardPosition';

/* //////////////////////////////////////////////////////////////////////////////
//
// setDeviceStatus function
// if device status is CONNECTED , new scan sessions can be posted
//
////////////////////////////////////////////////////////////////////////////// */

const setStatus = (req: Request, res: Response) => {
  try {
    if (req.authenticationType !== 'device') {
      res.status(httpStatus.FORBIDDEN);
      throw new Error('Only accounts of type \'device\' are allowed to call this endpoint');
    }

    res.status(httpStatus.BAD_REQUEST);

    if (!req.body?.status) {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body is missing \'status\' property');
    } else if (!Object.values(DEVICE_STATUS).includes(req.body.status)) {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error(`Body status property should be one of ${Object.values(DEVICE_STATUS)}`);
    }

    if (!req.body?.binStatus) {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body is missing \'binStatus\' property');
    } else if (!Object.values(BIN_STATUS).includes(req.body.binStatus)) {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error(`Body binStatus property should be one of ${Object.values(BIN_STATUS)}`);
    }

    if (!req.body?.cardPosition) {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body is missing \'cardPosition\' property');
    } else if (!Object.values(CARD_POSITION).includes(req.body.cardPosition)) {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error(`Body cardPosition property should be one of ${Object.values(CARD_POSITION)}`);
    }

    if (!req.body?.stackStatus) {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error('Body is missing \'stackStatus\' property');
    } else if (!Object.values(STACK_STATUS).includes(req.body.stackStatus)) {
      res.status(httpStatus.BAD_REQUEST);
      throw new Error(`Body stackStatus property should be one of ${Object.values(STACK_STATUS)}`);
    }

    if (process.env.DEVICE_CONNECTION_TIMEOUT_SEC) {
      req.app.locals.connectionTimeoutMS = parseInt(process.env.DEVICE_CONNECTION_TIMEOUT_SEC as string, 10) * 1000;
    } else {
      req.app.locals.connectionTimeoutMS = 10000;
    }

    const previousStatus = req.app.locals.deviceStatus;
    req.app.locals.deviceStatus = req.body.status;
    req.app.locals.binStatus = req.body.binStatus;
    req.app.locals.cardPosition = req.body.cardPosition;
    req.app.locals.stackStatus = req.body.stackStatus;
    req.app.locals.deviceId = req.authenticationUser;

    const metadata = { previousStatus: previousStatus, status: req.app.locals.deviceStatus, timeoutMS: req.app.locals.connectionTimeoutMS };

    res.status(httpStatus.OK).json({ metadata: metadata });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - set status) {${JSON.stringify({ metadata: metadata })}}`);
  } catch (error) {
    console.error(`(${req.authenticationType}: ${req.authenticationUser} - set status) ${error}`);
    res.json({ error: error });
  }
};

/* //////////////////////////////////////////////////////////////////////////////
//
// getActiveSession function
//
////////////////////////////////////////////////////////////////////////////// */

const getActiveSession = (req: Request, res: Response) => {
  try {
    if (req.authenticationType !== 'device') {
      res.status(httpStatus.FORBIDDEN);
      throw new Error('Only accounts of type \'device\' are allowed to call this endpoint');
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

    const session = req.app.locals.sessions.get(req.app.locals.activeSessionId);

    // If there is card data, return it directly, otherwise start long polling
    if (session) {
      const metadata = { command: session.command, sessionId: session.sessionId, status: session.status };
      res.status(httpStatus.OK).json({ cardData: session.cardData, metadata: metadata });
      console.log(`(${req.authenticationType}: ${req.authenticationUser} - get active session) {${JSON.stringify({ cardData: session.cardData, metadata: metadata })}}`);
    } else {
      const longPollingMS = req.app.locals.longPollingMS;
      let pollingMS = 0;

      const timer = setInterval(() => {
        clearInterval(timer);

        if (session) {
          const metadata = { command: session.command, longPollingMS: longPollingMS, pollingMS: pollingMS, sessionId: session.sessionId, status: session.status };
          res.status(httpStatus.OK).json({ cardData: session.cardData, metadata: metadata });
          console.log(`(${req.authenticationType}: ${req.authenticationUser} - get active session) {${JSON.stringify({ cardData: session.cardData, metadata: metadata })}}`);
        } else {
          res.status(httpStatus.OK).json({ result: 'NO_ACTIVE_SESSION' });
          console.log(`(${req.authenticationType}: ${req.authenticationUser} - get active session) { result: 'NO_ACTIVE_SESSION }`);
        }
      }, parseInt(process.env.LONG_POLLING_INTERVAL_MS as string));
    }
  } catch (error) {
    console.error(`(${req.authenticationType}: ${req.authenticationUser} - get active session) ${error}`);
    res.json({ error: error });
  }
};

/* /////////////////////////////////////////////////////////////////////////////
//
// updateActiveSession function
//
////////////////////////////////////////////////////////////////////////////// */

const updateActiveSession = (req: Request, res: Response) => {
  try {
    if (req.authenticationType !== 'device') {
      res.status(httpStatus.FORBIDDEN);
      throw new Error('Only accounts of type \'device\' are allowed to call this endpoint');
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

    if (!req.app.locals.activeSessionId) {
      res.status(httpStatus.CONFLICT);
      throw new Error('No active session');
    }

    const session = req.app.locals.sessions.get(req.app.locals.activeSessionId);
    if (!session) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      throw new Error(`Active session not found, activeSessionId: ${req.app.locals.activeSessionId}`);
    }

    if (session.status !== SESSION_STATUS.ACTIVE && session.status !== SESSION_STATUS.CANCELLING) {
      res.status(httpStatus.CONFLICT);

      if (session.status === SESSION_STATUS.TIMED_OUT) {
        throw new Error('Session has timed out');
      } else if (session.status === SESSION_STATUS.STOPPED) {
        throw new Error('Session was cancelled');
      } else {
        throw new Error('No active session');
      }
    }

    if (req.app.locals.activeSessionTimeoutMS <= 0) {
      res.status(httpStatus.CONFLICT);
      throw new Error(`Session timeout, id: ${req.app.locals.activeSessionId}`);
    }

    if (req.body.data.status === SESSION_STATUS.STOPPED) {
      session.status === SESSION_STATUS.STOPPED;
    } else if (session.command === SESSION_COMMAND.CREATE_CARD) {
      updateCreate(req, res, session);
    } else if (session.command === SESSION_COMMAND.RETRACT_CARD_NOT_TAKEN || session.command === SESSION_COMMAND.SEND_FAULTY_CARD_TO_BIN) {
      updateGeneric(req, res, session);
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      throw new Error(`Session contains an unsupported command: ${session.command}`);
    }

    // Set new session timeout
    let sessionTimeout = Number(process.env.SESSION_TIMEOUT_SEC);

    if (isNaN(sessionTimeout)) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      throw new Error('SESSION_TIMEOUT_SEC is not defined in .env or not a number');
    } else if (sessionTimeout < 5) {
      sessionTimeout = 5;
    }

    req.app.locals.activeSessionTimeoutMS = sessionTimeout * 1000;

    // Update sessions with active session
    req.app.locals.sessions.set(req.app.locals.activeSessionId, session);
    const sessionId = req.app.locals.activeSessionId;
    req.app.locals.activeSessionId = '';

    // Send response
    const metadata = { cardData: session.cardData, command: session.command, sessionId: session.sessionId, status: session.status };
    res.status(httpStatus.OK).json({ metadata: metadata });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - update active session) {${JSON.stringify({ metadata: metadata })}}`);
  } catch (error) {
    console.error(`(${req.authenticationType}: ${req.authenticationUser} - update active session) ${error}`);
    res.json({ error: error });
  }
};

const updateCreate = (req: Request, res: Response, session: SessionData) => {
  // Check whether body contains a data object
  if (!req.body?.data || typeof req.body?.data !== 'object') {
    res.status(httpStatus.BAD_REQUEST);
    throw new Error('Body should contain a \'data\' property of type object');
  }

  // Update cardId, empty cardId is allowed
  if (!session.cardData) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    throw new Error('There is no active card session');
  }

  session.status = SESSION_STATUS.FINISHED;
};

const updateGeneric = (req: Request, res: Response, session: SessionData) => {
  session.status = SESSION_STATUS.FINISHED;
};

export { getActiveSession, setStatus, updateActiveSession };