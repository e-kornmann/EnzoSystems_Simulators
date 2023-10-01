class TransactionData {
  constructor (transactionId, deviceId, merchantId, orderId, description, systemId, transactionType, amount, currency, locale, status) {
    this.transactionId = transactionId;
    this.deviceId = deviceId;
    this.merchantId = merchantId;
    this.orderId = orderId;
    this.description = description;
    this.systemId = systemId;
    this.transactionType = transactionType;
    this.amount = amount;
    this.amountPaid = 0;
    this.currency = currency;
    this.locale = locale;
    this.receipt = '';
    this.status = status;
    this.scheme = '';
    this.pan = '';
    this.pspApprovalCode = '';
    this.pspReferenceId = '';
    this.pspTransactionId = '';
  }
}

class SessionData {
  constructor (command = '',  status = '', transactionData = new TransactionData()) {
    this.command = command;
    this.status = status;
    this.transactionData = transactionData;
  }
}

module.exports = {
  TransactionData,
  SessionData
};
