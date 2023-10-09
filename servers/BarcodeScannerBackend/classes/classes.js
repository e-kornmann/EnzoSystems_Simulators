class SessionData {
  // constructor () {};

  constructor (command = '', status = '', barcodeData = '') {
    this.command = command;
    this.status = status;
    this.barcodeData = barcodeData;
  }
}

module.exports = {
  SessionData
};
