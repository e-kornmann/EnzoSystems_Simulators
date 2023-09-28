const httpStatus = require('http-status-codes');
const morgan = require('morgan');

function expressTrackResponseJsonBody (req, res, next) {
  const oldJson = res.json;
  res.json = (body) => {
    res.body = body;
    return oldJson.call(res, body);
  };
  next();
}

const expressLogging = morgan(function (tokens, req, res) {
  // Try not to log the health checks
  if (req.baseUrl) {
    if (
      req.baseUrl.endsWith('/health') ||
      req.baseUrl.endsWith('/healthCheck')
    ) {
      return;
    }
  }

  // Requests from AWS ELB health checker result in an empty req.baseUrl
  // So for those cases, fall back to checking the original url
  if (req.originalUrl) {
    if (
      req.originalUrl.endsWith('/health') ||
      req.originalUrl.endsWith('/healthCheck')
    ) {
      return;
    }
  }

  let responseHttpStatus = `- Response Status: ${tokens.status(req, res)}`;
  if (tokens.status(req, res)) {
    try {
      responseHttpStatus = `${responseHttpStatus} - ${httpStatus.getReasonPhrase(
        tokens.status(req, res)
      )}`;
    } catch (error) {
      console.warn(
        `Unable to get http status reason phrase for status: ${tokens.status(
          req,
          res
        )}`
      );
    }
  }

  return [
    `[${new Date().toISOString()}]`,
    `- Request Version: ${tokens['http-version'](req)}`,
    `- Request Method: ${tokens.method(req)}`,
    `- Request Url: ${tokens.url(req)}`,
    `- Request User Agent: ${tokens['user-agent'](req)}`,
    `- Request Body: ${JSON.stringify(req.body, null, 3)}`,
    `${responseHttpStatus}`,
    `- Response Headers: ${JSON.stringify(res.getHeaders(), null, 3)}`,
    `- Response Body: ${JSON.stringify(res.body, null, 3)}`,
    `- Response Content length: ${tokens.res(
      req,
      res,
      'content-length'
    )} bytes`,
    `- Response Time: ${tokens['response-time'](req, res)} ms`,
    `- Total time: ${tokens['total-time'](req, res)} ms`
  ].join('\n');
});

module.exports = {
  expressTrackResponseJsonBody,
  expressLogging
};
