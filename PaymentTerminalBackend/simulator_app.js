try {
  const enzoUtility = require('./utilities/enzo.utility');
  enzoUtility.initialize();

  const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet');
  const httpStatus = require('http-status-codes');

  const auth = require('./middleware/auth.middleware');
  const logonRoute = require('./routes/logon.route');
  const paymentRoute = require('./routes/payment.route');

  const expressLogging = require('./middleware/express-logging.middleware');

  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json({ limit: process.env.EXPRESS_JSON_LIMIT }));

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    app.use(expressLogging.trackResponseJsonBody);
    app.use(expressLogging.extendedLogging);
  }

  // Health status check route
  app.get(`/${process.env.API_BASE_PATH}/v${process.env.API_VERSION}/health`, function (req, res) {
    res.status(httpStatus.StatusCodes.OK).json({ info: 'The SimulatorPaymentTerminal server is healthy!' });
  });

  // Map routes
  // Log-on to get an access token
  app.use(`/${process.env.API_BASE_PATH}/v${process.env.API_VERSION}/auth/`, logonRoute);
  // Verify token to allow access to endpoints
  app.use('', auth.verifyAuthenticationHeader);
  app.use(`/${process.env.API_BASE_PATH}/v${process.env.API_VERSION}/:merchantId/:terminalId/`, paymentRoute);

  // Catch all unmapped routes
  app.all('*', function (req, res) {
    res.status(httpStatus.StatusCodes.NOT_FOUND).json({});
  });

  app.listen(process.env.PORT);
  console.info(`The SimulatorPaymentTerminal server started and is listening on port: ${process.env.PORT}`);
} catch (error) {
  console.error(`Uncaught application error. ${error}`);
  if (error?.stack) {
    console.error(`Stacktrace: ${error.stack}`);
  }
  process.exit(1);
}
