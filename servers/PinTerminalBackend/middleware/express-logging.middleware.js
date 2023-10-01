const httpStatus = require('http-status-codes');
const morgan = require('morgan');

function trackResponseJsonBody (req, res, next) {
  const oldJson = res.json;
  res.json = (body) => {
    res.body = body;
    return oldJson.call(res, body);
  };
  next();
}

const extendedLogging = morgan(function (tokens, req, res) {
  return [
    `[${new Date().toISOString()}]`,
    `- Request Version: ${tokens['http-version'](req)}`,
    `- Request Method: ${tokens.method(req)}`,
    `- Request Url: ${tokens.url(req)}`,
    `- Request User Agent: ${tokens['user-agent'](req)}`,
    `- Request Body: ${JSON.stringify(req.body, null, 3)}`,
    `- Response Status: ${tokens.status(req, res)} - ${httpStatus.getReasonPhrase(tokens.status(req, res))}`,
    `- Response Headers: ${JSON.stringify(res.getHeaders(), null, 3)}`,
    `- Response Body: ${JSON.stringify(res.body, null, 3)}`,
    `- Response Content length: ${tokens.res(req, res, 'content-length')} bytes`,
    `- Response Time: ${tokens['response-time'](req, res)} ms`,
    `- Total time: ${tokens['total-time'](req, res)} ms`
  ].join('\n');
});

module.exports = {
  trackResponseJsonBody,
  extendedLogging
};
