const httpStatus = require('http-status-codes');

function health (req, res) {
  res.status(httpStatus.StatusCodes.OK).json({ status: 'The hotel server is healthy!' });
}

module.exports = {
  health
};
