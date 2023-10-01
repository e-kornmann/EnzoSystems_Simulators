
try {
  const enzoUtility = require('./utilities/enzo.utility');
  enzoUtility.initialize();

  const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet');
  const httpStatus = require('http-status-codes');

  const auth = require('./middleware/auth.middleware');
  const logonRoute = require('./routes/logon.route');
  const deviceRoute = require('./routes/device.route');
  const hostRoute = require('./routes/host.route');
  const { DEVICE_STATUS, SESSION_STATUS, TRANSACTION_STATUS } = require('./constants/constants');

  const expressLogging = require('./middleware/express-logging.middleware');

  const app = express();

   app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
  }));
  app.use(helmet());
  app.use(express.json({ limit: process.env.EXPRESS_JSON_LIMIT }));

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    app.use(expressLogging.trackResponseJsonBody);
    app.use(expressLogging.extendedLogging);
  }

  // check .env
  if (!process.env.SESSION_TIMEOUT_SEC) {
    throw new Error('.env is missing \'SESSION_TIMEOUT_SEC\' setting');
  }
  if (!process.env.DEVICE_CONNECTION_TIMEOUT_SEC) {
    throw new Error('.env is missing \'DEVICE_CONNECTION_TIMEOUT_SEC\' setting');
  }
  if (!process.env.LONG_POLLING_SEC) {
    throw new Error('.env is missing \'LONG_POLLING_SEC\' setting');
  }

  // Health status check route
  app.get(`/${process.env.API_BASE_PATH}/v${process.env.API_VERSION}/health`, function (req, res) {
    res.status(httpStatus.StatusCodes.OK).json({ info: 'The payment terminal back-end server is healthy!' });
  });

  // initialize local properties
  app.locals.deviceStatus = DEVICE_STATUS.NOT_FOUND;
  app.locals.deviceId = '';
  app.locals.connectionTimeoutMS = 0;
  app.locals.sessions = new Map();
  app.locals.activeSessionId = '';
  app.locals.activeSessionTimeoutMS = -1;
  if (!process.env.LONG_POLLING_SEC) {
    app.locals.longPollingMS = 1000;
  } else {
    app.locals.longPollingMS = Number(process.env.LONG_POLLING_SEC) * 1000;
  }

  // set timer to check each second if React simulator is CONNECTED
  setInterval(() => {
    if (app.locals.connectionTimeoutMS) {
      app.locals.connectionTimeoutMS -= 1000;

      if (app.locals.connectionTimeoutMS === 0 && app.locals.deviceStatus !== DEVICE_STATUS.NOT_FOUND) {
        app.locals.deviceStatus = DEVICE_STATUS.NOT_FOUND;
        console.log('Device failed to reconnect within the required timeout period');
      }
    }
    if (app.locals.activeSessionTimeoutMS >= 0) {
      app.locals.activeSessionTimeoutMS -= 1000;

      if (app.locals.activeSessionTimeoutMS < 0 && app.locals.sessions.get(app.locals.activeSessionId)) {
        const session = app.locals.sessions.get(app.locals.activeSessionId);
        if (session.status === SESSION_STATUS.ACTIVE) {
          session.status = SESSION_STATUS.TIMED_OUT;
          session.transactionData.status = TRANSACTION_STATUS.STOPPED;
          app.locals.sessions.set(app.locals.activeSessionId, session);
          console.log(`Session time-out, sessionId: ${app.locals.activeSessionId}`);
          app.locals.activeSessionId = '';
        }
      }
    }
  }, 1000);

  // Map routes
  // Log-on to get an access token
  app.use(`/${process.env.API_BASE_PATH}/v${process.env.API_VERSION}/auth/`, logonRoute);

  // Verify token to allow access to endpoints
  app.use('', auth.verifyAuthenticationHeader);
  app.use(`/${process.env.API_BASE_PATH}/v${process.env.API_VERSION}/`, deviceRoute);
  app.use(`/${process.env.API_BASE_PATH}/v${process.env.API_VERSION}/`, hostRoute);

  // Catch all unmapped routes
  app.all('*', function (req, res) {
    res.status(httpStatus.StatusCodes.NOT_FOUND).json({});
  });

  app.listen(process.env.PORT);
  console.info(`The payment terminal back-end server started and is listening on port: ${process.env.PORT}`);
} catch (error) {
  console.error(`Uncaught application error. ${error}`);
  if (error?.stack) {
    console.error(`Stacktrace: ${error.stack}`);
  }
  process.exit(1);
}
