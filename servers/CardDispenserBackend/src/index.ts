import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status-codes';
// Enums
import DEVICE_STATUS from './enums/DeviceStatus';
import SESSION_STATUS from './enums/SessionStatus';
// Middleware
import { verifyAuthenticationHeader } from './middleware/auth.middleware';
import expressLogging from './middleware/express-logging.middleware.js';
// Routes
import deviceRoute from './routes/device.route';
import hostRoute from './routes/host.route';
import logonRoute from './routes/logon.route';
// Utilities
import enzoUtility from './utilities/enzo.utility';

try {
  enzoUtility.initialize();
  process.env.TZ = 'Etc/UTC'; // force timezone to UTC regardless of where we are, this means all Date calls result in UTC datetimes!

  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(enzoUtility.validateRequestContentTypeJson);
  app.use(express.json({ limit: process.env.EXPRESS_JSON_LIMIT }));

  if (enzoUtility.isDevelopmentEnvironment()) {
    app.use(expressLogging.expressTrackResponseJsonBody);
    app.use(expressLogging.expressLogging);
  }

  // Check .env
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
    res.status(httpStatus.OK).json({ info: 'The Card Dispenser back-end server is healthy!' });
  });

  // Initialize local properties
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

  // Set timer to check each second if React simulator is CONNECTED
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
  app.use('', verifyAuthenticationHeader);
  app.use(`/${process.env.API_BASE_PATH}/v${process.env.API_VERSION}/`, deviceRoute);
  app.use(`/${process.env.API_BASE_PATH}/v${process.env.API_VERSION}/`, hostRoute);

  // Catch all unmapped routes
  app.all('*', function (req, res) {
    res.status(httpStatus.NOT_FOUND).json({});
  });

  app.listen(process.env.PORT);
  console.info(`The card dispenser back-end server started and is listening on port: ${process.env.PORT}`);
} catch (error) {
  console.error(`Uncaught application error. ${error}`);
  console.trace('Stacktrace: ');
  process.exit(1);
}