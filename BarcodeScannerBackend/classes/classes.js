class SessionData {
  // constructor () {};

  constructor (name = '', status = '', barcodeData = '') {
    this.name = name;
    this.status = status;
    this.barcodeData = barcodeData;
  }
}

module.exports = {
  SessionData
};
