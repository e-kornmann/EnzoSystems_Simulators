const httpStatus = require('http-status-codes');
const crypto = require('crypto');
const { DEVICE_STATUS, SESSION_COMMAND, SESSION_STATUS, LONG_POLLING_INTERVAL_MS, CURRENCY, LOCALE, TRANSACTION_STATUS } = require('../constants/constants');
const { TransactionData, SessionData } = require('../classes/classes');

/* //////////////////////////////////////////////////////////////////////////////
//
// getDeviceStatus function to get the current status of the device
//
/////////////////////////////5///////////////////////////////////////////////// */

async function getDeviceStatus (req, res) {
  try {
    if (req.authenticationType !== 'host') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'host\' are allowed to call this endpoint');
    }

    // check the deviceId
    if (req.params.deviceId !== req.app.locals.deviceId) {
      res.status(httpStatus.StatusCodes.NOT_FOUND);
      throw new Error(`Unknown deviceId: ${req.params.deviceId}`);
    }

    // check if there are query params, if so, both longPollingMS and currentState are mandatory
    if (Object.keys(req.query).length) {
      if (!Object.keys(req.query).includes('referenceDeviceStatus')) {
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Query string must be empty or contain the \'referenceDeviceStatus\' property');
      }

      if (req.query.referenceDeviceStatus !== DEVICE_STATUS.CONNECTED &&
        req.query.referenceDeviceStatus !== DEVICE_STATUS.DISCONNECTED &&
        req.query.referenceDeviceStatus !== DEVICE_STATUS.NOT_FOUND &&
        req.query.referenceDeviceStatus !== DEVICE_STATUS.OUT_OF_ORDER) {
        // error
        res.status(httpStatus.StatusCodes.BAD_REQUEST);
        throw new Error('Query string \'referenceDeviceStatus\' property must be \'CONNECTED\', \'DISCONNECTED\', \'NOT_FOUND\' or \'OUT_OF_ORDER\'');
      }

      const longPollingMS = req.app.locals.longPollingMS;
      let pollingMS = 0;
      // if mode already changed, return directly
      if (req.query.referenceDeviceStatus !== req.app.locals.deviceStatus) {
        res.status(httpStatus.StatusCodes.OK).json({ metadata: { referenceDeviceStatus: req.query.referenceDeviceStatus }, deviceStatus: req.app.locals.deviceStatus });
        console.log(`(${req.authenticationType} :${req.authenticationUser} - get status) {${JSON.stringify({ metadata: { referenceDeviceStatus: req.query.referenceDeviceStatus }, deviceStatus: req.app.locals.deviceStatus })}}`);
      } else {
        // use long polling
        const timer = setInterval(() => {
          try {
            pollingMS += LONG_POLLING_INTERVAL_MS;
            if ((req.query.referenceDeviceStatus !== req.app.locals.deviceStatus) || pollingMS >= longPollingMS) {
              clearInterval(timer);
              res.status(httpStatus.StatusCodes.OK).json({ metadata: { referenceDeviceStatus: req.query.referenceDeviceStatus, longPollingMS: longPollingMS, pollingMS: pollingMS }, deviceStatus: req.app.locals.deviceStatus });
              console.log(`(${req.authenticationType} :${req.authenticationUser} - get status) {${JSON.stringify({ metadata: { referenceDeviceStatus: req.query.referenceDeviceStatus, longPollingMS: longPollingMS, pollingMS: pollingMS }, deviceStatus: req.app.locals.deviceStatus })}}`);
            }
          } catch (e) {
            console.log(`(${req.authenticationType}: ${req.authenticationUser} - get mode) ${e.message}`);
            res.json({ error: e.message });
          }
        }, LONG_POLLING_INTERVAL_MS);
      }
    } else {
      // return directly
      res.status(httpStatus.StatusCodes.OK).json({ deviceStatus: req.app.locals.deviceStatus });
      console.log(`(${req.authenticationType}: ${req.authenticationUser} - get status) {${JSON.stringify({ deviceStatus: req.app.locals.deviceStatus })}`);
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

async function newSession (req, res) {
  try {
    if (req.authenticationType !== 'host') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'host\' are allowed to call this endpoint');
    }

    if (req.app.locals.activeSessionId && req.app.locals.sessions) {
      const activeSession = req.app.locals.sessions.get(req.app.locals.activeSessionId);
      if (activeSession && activeSession.status === SESSION_STATUS.ACTIVE) {
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

    // check if body has a data object
    if (req.body.data === undefined || req.body.data === null || typeof req.body.data !== 'object') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'data\' property of type object');
    }

    // check if data.deviceId is valid
    if (req.body.data.deviceId === undefined || req.body.data.deviceId === null || typeof req.body.data.deviceId !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'data.deviceId\' property of type string');
    } else if (req.body.data.deviceId !== req.app.locals.deviceId) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error(`There is no payment terminal available with deviceId: ${req.body.data.deviceId}`);
    }

    if (req.body.command === SESSION_COMMAND.PAYMENT) {
      startPayment(req, res);
    } else if (req.body.command === SESSION_COMMAND.PREAUTH) {
      startPreAuthorisation(req, res);
    } else if (req.body.command === SESSION_COMMAND.CAPTURE) {
      startCapture(req, res);
    } else {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error(`Body 'command' property should have a value of '${SESSION_COMMAND.PAYMENT}', '${SESSION_COMMAND.PREAUTH}' or '${SESSION_COMMAND.FINALIZE}'`);
    }
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// startPayment function
//
////////////////////////////////////////////////////////////////////////////// */

function startPayment (req, res) {
  try {
    // check if data.amount is valid
    if (req.body.data.amount === undefined || req.body.data.amount === null || typeof req.body.data.amount !== 'number') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'data.amount\' property of type number');
    } else if (req.body.data.amount <= process.env.TRANSACTION_MINIMUM_AMOUNT) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error(`Body 'data.amount' property should have a minimum value of ${process.env.TRANSACTION_MINIMUM_AMOUNT}`);
    }

    // check if data.currency is valid
    if (req.body.data.currency === undefined || req.body.data.currency === null || typeof req.body.data.currency !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'data.currency\' property of type string');
    } else if (Object.values(CURRENCY).includes(req.body.data.currency) === false) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error(`Body 'data.currency' property should be one of ${Object.values(CURRENCY)}`);
    }

    // check if data.locale is valid
    if (req.body.data.locale === undefined || req.body.data.locale === null || typeof req.body.data.locale !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'data,locale\' property of type string');
    } else if (Object.values(LOCALE).includes(req.body.data.locale) === false) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error(`Body 'data.locale' property should be one of ${Object.values(LOCALE)}`);
    }

    // check if data.merchantId is valid
    if (req.body.data.merchantId === undefined || req.body.data.merchantId === null || typeof req.body.data.merchantId !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'data.merchantId\' property of type string');
    }

    // check if data.systemId is valid
    if (req.body.data.systemId === undefined || req.body.data.systemId === null || typeof req.body.data.systemId !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'data.systemId\' property of type string');
    }

    // check if data.orderId is valid
    if (req.body.data.orderId === undefined || req.body.data.orderId === null || typeof req.body.data.orderId !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'data.orderId\' property of type string');
    }

    // check if data.description is valid
    if (req.body.data.description === undefined || req.body.data.description === null || typeof req.body.data.description !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'data.description\' property of type string');
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

    const session = new SessionData(
      req.body.command,
      SESSION_STATUS.ACTIVE,
      new TransactionData(
        crypto.randomUUID(), // transactionId
        req.body.data.deviceId, // deviceId
        req.body.data.merchantId, // merchantId
        req.body.data.orderId, // orderId
        req.body.data.description, // description
        req.body.data.systemsId, // systemId
        SESSION_COMMAND.PAYMENT, // transactionType
        req.body.data.amount, // amount
        req.body.data.currency, // currency
        req.body.data.locale, // locale
        TRANSACTION_STATUS.ACTIVE // status
      )
    );
    req.app.locals.sessions.set(sessionId, session);

    res.status(httpStatus.StatusCodes.OK).json({
      metadata: {
        sessionId: sessionId,
        command: session.command,
        status: session.status,
        transactionData: session.transactionData
      }
    });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) {${JSON.stringify({
      metadata: {
        sessionId: sessionId,
        command: session.command,
        status: session.status,
        transactionData: session.transactionData
      }
    })}}`);
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// startPreAuthorisation function to read an existing room key
//
////////////////////////////////////////////////////////////////////////////// */

function startPreAuthorisation (req, res) {
  // try {
  //   let sessionTimeout = Number(process.env.SESSION_TIMEOUT_SEC);
  //   if (isNaN(sessionTimeout)) {
  //     res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
  //     throw new Error('SESSION_TIMEOUT_SEC is not defined in .env or not a number');
  //   } else if (sessionTimeout < 5) {
  //     sessionTimeout = 5;
  //   }
  //   req.app.locals.activeSessionTimeoutMS = sessionTimeout * 1000;

  //   const sessionId = crypto.randomUUID();
  //   req.app.locals.activeSessionId = sessionId;

  //   const session = new SessionData(
  //     req.body.command,
  //     '',
  //     SESSION_STATUS.ACTIVE,
  //     '',
  //     new KeyData()
  //   );
  //   req.app.locals.sessions.set(sessionId, session);

  //   res.status(httpStatus.StatusCodes.OK).json({
  //     metadata: {
  //       sessionId: sessionId,
  //       sessionCommand: session.command,
  //       creationMode: req.body.creationMode,
  //       keyId: session.keyId,
  //       sessionStatus: session.status,
  //       transactionData: session.transactionData
  //     }
  //   });
  //   console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) {${JSON.stringify({
  //     metadata: {
  //       sessionId: sessionId,
  //       sessionCommand: session.command,
  //       creationMode: req.body.creationMode,
  //       keyId: session.keyId,
  //       sessionStatus: session.status,
  //       transactionData: session.transactionData
  //     }
  //   })}}`);
  // } catch (e) {
  //   console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) ${e.message}`);
  //   res.json({ error: e.message });
  // }
}

function startCapture (req, res) {

}

/* //////////////////////////////////////////////////////////////////////////////
//
// putSession function to stop an active session
//
////////////////////////////////////////////////////////////////////////////// */

async function updateSession (req, res) {
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

    if (req.body.command !== SESSION_COMMAND.CANCEL) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error(`Body 'command' property should have a value of '${SESSION_COMMAND.CANCEL}'`);
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

    session.status = SESSION_STATUS.CANCELLING;
    req.app.locals.sessions.set(req.params.id, session);

    res.status(httpStatus.StatusCodes.OK).json({ metadata: { sessionId: req.params.id, sessionCommand: session.command, sessionStatus: session.status } });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put session) ${JSON.stringify({ metadata: { sessionId: req.params.id, sessionCommand: session.command, sessionStatus: session.status } })}`);
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

    if (req.app.locals.deviceStatus === DEVICE_STATUS.DISCONNECTED) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('Device is disconnected');
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

    const session = req.app.locals.sessions.get(req.params.id);
    if (session === undefined) {
      res.status(httpStatus.StatusCodes.NOT_FOUND);
      throw new Error(`Session not found, id: ${req.params.id}`);
    }

    const longPollingMS = req.app.locals.longPollingMS;
    let pollingMS = 0;

    // if there is data, return it directly, otherwise start long polling
    if (session.status !== SESSION_STATUS.ACTIVE) {
      res.status(httpStatus.StatusCodes.OK).json({
        metadata: {
          sessionId: req.params.id,
          command: session.command,
          status: session.status,
          longPollingMS: longPollingMS,
          pollingDurationMS: pollingMS
        },
        // ...(session.status === SESSION_STATUS.FINISHED && { transactionData: session.transactionData })
        transactionData: session.transactionData
      });

      console.log(`(${req.authenticationType}: ${req.authenticationUser} - set session) {${JSON.stringify({
        metadata: {
          sessionId: req.params.id,
          command: session.command,
          status: session.status,
          longPollingMS: longPollingMS,
          pollingDurationMS: pollingMS
        },
        // amountPaid: session.transactionData.amountPaid
        // ...(session.status === SESSION_STATUS.FINISHED && { transactionData: session.transactionData })
        transactionData: session.transactionData
      })}}`);
      // res.status(httpStatus.StatusCodes.OK).json({ metadata: { sessionId: req.params.id, longPollingMS: longPollingMS }, session: session });
      // console.log(`(${req.authenticationType}: ${req.authenticationUser} - get session) {${JSON.stringify({ metadata: { sessionId: req.params.id, longPollingMS: longPollingMS }, session: session })}}`);
    } else {
      const timer = setInterval(() => {
        try {
          pollingMS += LONG_POLLING_INTERVAL_MS;
          if (session.status !== SESSION_STATUS.ACTIVE || pollingMS >= 0) {
            clearInterval(timer);
            res.status(httpStatus.StatusCodes.OK).json({
              metadata: {
                sessionId: req.params.id,
                command: session.command,
                status: session.status,
                longPollingMS: longPollingMS,
                pollingDurationMS: pollingMS
              },
              // amountPaid: session.transactionData.amountPaid
              // ...(session.status === SESSION_STATUS.FINISHED && { transactionData: session.transactionData })
              transactionData: session.transactionData
            });

            console.log(`(${req.authenticationType}: ${req.authenticationUser} - set session) {${JSON.stringify({
              metadata: {
                sessionId: req.params.id,
                command: session.command,
                status: session.status,
                longPollingMS: longPollingMS,
                pollingDurationMS: pollingMS
              },
              // amountPaid: session.transactionData.amountPaid
              // ...(session.status === SESSION_STATUS.FINISHED && { transactionData: session.transactionData })
              transactionData: session.transactionData
            })}}`);
          }
        } catch (e) {
          res.json({ error: e.message });
          console.log(`(${req.authenticationType}: ${req.authenticationUser} - get key) ${e.message}`);
        }
      }, LONG_POLLING_INTERVAL_MS);
    }
  } catch (e) {
    res.json({ error: e.message });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - get key) ${e.message}`);
  }
}

module.exports = {
  getDeviceStatus,
  newSession,
  updateSession,
  getSession
};
