const httpStatus = require('http-status-codes');
const crypto = require('crypto');
const { DEVICE_STATUS, SESSION_COMMAND, SESSION_STATUS, TRANSACTION_STATUS, LONG_POLLING_INTERVAL_MS } = require('../constants/constants');

/* //////////////////////////////////////////////////////////////////////////////
//
// HELPER functions
//
////////////////////////////////////////////////////////////////////////////// */

function maskPan (pan) {
  let maskedPan = '****';
  if (!pan) return maskedPan;
  const length = pan.length;

  if (length > 4) {
    maskedPan = pan.slice(-4);
    maskedPan = maskedPan.padStart(length, '*');
  }
  return maskedPan;
}

function generatePspApprovalCode () {
  return crypto.randomUUID().slice(0, 8);
}

function generatePspReferenceId () {
  return crypto.randomUUID().slice(24, 36);
}

function generatePspTransactionId () {
  return crypto.randomUUID();
}

/* //////////////////////////////////////////////////////////////////////////////
//
// setDeviceStatus function
// if device status is CONNECTED , new scan sessions can be posted
//
////////////////////////////////////////////////////////////////////////////// */

async function setDeviceStatus (req, res) {
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
          Command: session.command,
          status: session.status
        },
        transactionData: session.transactionData
      });
      console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) {${JSON.stringify({
        metadata: {
          sessionId: req.app.locals.activeSessionId,
          command: session.command,
          status: session.status
        },
        transactionData: session.transactionData
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
                transactionData: session.transactionData
              });
              console.log(`(${req.authenticationType}: ${req.authenticationUser} - post session) {${JSON.stringify({
                metadata: {
                  sessionId: req.app.locals.activeSessionId,
                  command: session.command,
                  status: session.status,
                  longPollingMS: longPollingMS,
                  pollingMS: pollingMS
                },
                transactionData: session.transactionData
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
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - get key) ${e.message}`);
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// createReceipt
//
////////////////////////////////////////////////////////////////////////////// */

function createReceipt (transactionData) {
  try {
    const dateTime = new Date();

    const receiptData = {
      header: '',
      date: `${dateTime.getDate().toString().padStart(2, '0')}-${dateTime.getMonth().toString().padStart(2, '0')}-${dateTime.getFullYear()}`,
      time: `${dateTime.toLocaleTimeString(transactionData.locale)}`,
      transactionId: transactionData.transactionId,
      merchantId: transactionData.merchantId,
      deviceId: transactionData.deviceId,
      reference: transactionData.orderId,
      systemId: transactionData.systemId
    };

    switch (transactionData.locale.substring(0, 2)) {
      case 'nl':
        receiptData.header = 'Betaalbewijs';
        break;
      case 'de':
        receiptData.header = 'Zahlungsbeleg';
        break;
      case 'fr':
        receiptData.header = 'Reçu';
        break;
      case 'en':
      default:
        receiptData.header = 'Payment receipt';
        break;
    }

    const amountFormat = new Intl.NumberFormat(transactionData.locale, { minimumFractionDigits: 2 });

    switch (transactionData.status) {
      case TRANSACTION_STATUS.APPROVED:
        switch (transactionData.locale.substring(0, 2)) {
          case 'nl':
            receiptData.message = 'Betaling goedgekeurd';
            break;
          case 'de':
            receiptData.message = 'Zahlung genehmigt';
            break;
          case 'fr':
            receiptData.message = 'Paiement approuvé';
            break;
          case 'en':
          default:
            receiptData.message = 'Payment Approved';
            break;
        }
        receiptData.application = transactionData.scheme;
        receiptData.approvalCode = transactionData.pspApprovalCode;
        receiptData.pan = maskPan(transactionData.pan);
        break;
      case TRANSACTION_STATUS.STOPPED:
        switch (transactionData.locale.substring(0, 2)) {
          case 'nl':
            receiptData.message = 'Betaling gestopt';
            break;
          case 'de':
            receiptData.message = 'Die Zahlung wurde gestoppt';
            break;
          case 'fr':
            receiptData.message = 'Paiement arrêté';
            break;
          case 'en':
          default:
            receiptData.message = 'Payment stopped';
            break;
        }
        break;
      case TRANSACTION_STATUS.DECLINED:
        switch (transactionData.locale.substring(0, 2)) {
          case 'nl':
            receiptData.message = 'Betaling geweigerd';
            break;
          case 'de':
            receiptData.message = 'Zahlung abgelehnt';
            break;
          case 'fr':
            receiptData.message = 'Paiement refusé';
            break;
          case 'en':
          default:
            receiptData.message = 'Payment declined';
            break;
        }
        break;
      case TRANSACTION_STATUS.FAILED:
      default:
        switch (transactionData.locale.substring(0, 2)) {
          case 'nl':
            receiptData.message = 'Betaling mislukt';
            break;
          case 'de':
            receiptData.message = 'Bezahlung fehlgeschlagen';
            break;
          case 'fr':
            receiptData.message = 'Paiement échoué';
            break;
          case 'en':
          default:
            receiptData.message = 'Payment failed';
            break;
        }
        break;
    }
    if (transactionData.amountPaid === 0) {
      switch (transactionData.locale.substring(0, 2)) {
        case 'nl':
          receiptData.amountPaid = 'Niets betaald';
          break;
        case 'de':
          receiptData.amountPaid = 'Nichts bezahlt';
          break;
        case 'fr':
          receiptData.amountPaid = 'Rien de payé';
          break;
        case 'en':
        default:
          receiptData.amountPaid = 'Nothing paid';
          break;
      }
    } else {
      receiptData.amountPaid = `${transactionData.currency} ${amountFormat.format(transactionData.amountPaid / 100)}`;
    }
    transactionData.receipt = receiptData;
  } catch (e) {
    console.log(`${e.message}`);
  }
}

/* /////////////////////////////////////////////////////////////////////////////
//
// updatePreauthSession function
//
////////////////////////////////////////////////////////////////////////////// */

function updatePreauthSession (session, req, res) {
  // TO DO
  session.status = SESSION_STATUS.FAILED;
}

/* //////////////////////////////////////////////////////////////////////////////
//
// updatePaymentSession function
//
////////////////////////////////////////////////////////////////////////////// */

function updatePaymentSession (session, req, res) {
  // check if body contains a data object
  if (req.body.data === undefined || req.body.data === null || typeof req.body.data !== 'object') {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('Body should have a \'data\' property of type object');
  }

  // check if data.status is valid
  if (!req.body.data.status || typeof req.body.data.status !== 'string') {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error('Body should have a \'data.status\' property of type string');
  } else if (Object.values(TRANSACTION_STATUS).includes(req.body.data.status) === false) {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);
    throw new Error(`Body 'data.status' property should be one of ${Object.values(TRANSACTION_STATUS)}`);
  }

  // if data.status is APPROVED, all kind of properties are required
  if (req.body.data.status === TRANSACTION_STATUS.APPROVED) {
    // check if data.amountPaid is valid in case data.status is APPROVED
    if (req.body.data.amountPaid === undefined || typeof req.body.data.amountPaid !== 'number') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'data.amountPaid\' property of type number');
    }

    if (req.body.data.amountPaid !== session.transactionData.amount) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error(`The 'data.amountPaid' property value is not equal to the amount to pay, amount to pay: ${session.transactionData.amount}`);
    }

    // check if data.scheme is available and valid
    if (!req.body.data.scheme || typeof req.body.data.scheme !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'data.scheme\' property of type string');
    }

    // check if data.pan is available and valid
    if (!req.body.data.pan && typeof req.body.data.pan !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Body should have a \'data.pan\' property of type string');
    }

    // check if data.pspApprovalCode is available and valid
    if (req.body.data.pspApprovalCode && typeof req.body.data.pspApprovalCode !== 'string') {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('If body has a \'data.pspApprovalCode\' property, it should be of type string');
    }

    session.transactionData.amountPaid = req.body.data.amountPaid;
    session.transactionData.scheme = req.body.data.scheme;
    session.transactionData.pan = maskPan(req.body.data.pan);
    session.transactionData.pspApprovalCode = generatePspApprovalCode(); // req.body.data.pspApprovalCode;
    session.transactionData.status = req.body.data.status;
    session.transactionData.pspReferenceId = generatePspReferenceId();
    session.transactionData.pspTransactionId = generatePspTransactionId();
    session.status = SESSION_STATUS.FINISHED;
  } else if (req.body.data.status === TRANSACTION_STATUS.DECLINED ||
    req.body.data.status === TRANSACTION_STATUS.FAILED ||
    req.body.data.status === TRANSACTION_STATUS.STOPPED) {
    session.transactionData.status = req.body.data.status;
    session.status = SESSION_STATUS.STOPPED;
  }
}

/* /////////////////////////////////////////////////////////////////////////////
//
// putActiveSession function to write data to device memory from transaction
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
        throw new Error('Transaction has timed-out');
      } else if (session.status === SESSION_STATUS.STOPPED) {
        throw new Error('Transaction was stopped');
      } else {
        throw new Error('No active session');
      }
    }

    if (req.app.locals.activeSessionTimeoutMS <= 0) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error(`Session time-out, sessionId: id: ${req.app.locals.activeSessionId}`);
    }

    // check if it is a payment or pre-authorisation
    if (session.command === SESSION_COMMAND.PAYMENT) {
      updatePaymentSession(session, req, res);
    } else if (session.command === SESSION_COMMAND.PREAUTH) {
      updatePreauthSession(session, req, res);
    } else {
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error(`Session has a unsupported command: ${session.command}`);
    }

    createReceipt(session.transactionData);

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
        transactionData: session.transactionData
      }
    });
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put active session) {${JSON.stringify({
      metadata: {
        sessionId: sessionId,
        command: session.command,
        status: session.status,
        transactionData: session.transactionData
      }
    })}}`);
  } catch (e) {
    console.log(`(${req.authenticationType}: ${req.authenticationUser} - put active session) ${e.message}`);
    res.json({ error: e.message });
  }
}

module.exports = {
  setDeviceStatus,
  getActiveSession,
  putActiveSession
};
