const httpStatus = require('http-status-codes');
const crypto = require('crypto');

/* //////////////////////////////////////////////////////////////////////////////
//
// Transaction storage as long as the service is running
//
////////////////////////////////////////////////////////////////////////////// */

// static variables
const TransactionMap = new Map();
let CurrentTransaction = null;
let TimeoutTimer = null;

const TRANSACTION_STATUS = {
  CREATED: 'CREATED',
  IDLE: 'IDLE',
  RUNNING: 'RUNNING',
  STOPPED: 'STOPPED',
  APPROVED: 'APPROVED',
  FAILED: 'FAILED',
  DECLINED: 'DECLINED',
  TIMEDOUT: 'TIMEDOUT',
  OUT_OF_ORDER: 'OUT_OF_ORDER'
};

class TransactionParams {
  constructor (transactionId, terminalId, merchantId, reference, amountToPay, amountPaid, currency, locale, receipt, status, scheme, pan, tsExpiration) {
    this.transactionId = transactionId;
    this.terminalId = terminalId;
    this.merchantId = merchantId;
    this.reference = reference;
    this.amountToPay = amountToPay;
    this.amountPaid = amountPaid;
    this.currency = currency;
    this.locale = locale;
    this.receipt = receipt;
    this.status = status;
    this.scheme = scheme;
    this.pan = pan;
    this.tsExpiration = tsExpiration;
  }
}

// function to add new transaction to the map
function setTransactionToMap (params) {
  try {
    if (!(params instanceof TransactionParams)) {
      throw new Error('Invalid params');
    }
    TransactionMap.set(params.transactionId, {
      terminalId: params.terminalId,
      merchantId: params.merchantId,
      reference: params.reference,
      amountToPay: params.amountToPay,
      amountPaid: params.amountPaid,
      currency: params.currency,
      locale: params.locale,
      receipt: params.receipt,
      status: params.status,
      scheme: params.scheme,
      pan: params.pan,
      tsExpiry: new Date(params.tsExpiration).valueOf() + process.env.TRANSACTION_EXPIRY_SEC,
      expired: false
    });
  } catch (e) {
    throw new Error(e.message);
  }
}

function getTransactionFromMap(transactionId) {
  return TransactionMap.get(transactionId);
}

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

/* //////////////////////////////////////////////////////////////////////////////
//
// enableTimeoutTimer & handleTimeout
//
////////////////////////////////////////////////////////////////////////////// */

function enableTimeoutTimer () {
  if (TimeoutTimer) {
    clearTimeout(TimeoutTimer);
  }
  TimeoutTimer = setTimeout(handleTimeout, process.env.TRANSACTION_EXPIRY_SEC * 1000);
}

function handleTimeout () {
  CurrentTransaction.status = TRANSACTION_STATUS.TIMEDOUT;
  createReceipt(CurrentTransaction);
  setTransactionToMap(CurrentTransaction);
  console.log(`Transaction timed-out, transactionId: ${CurrentTransaction.transactionId}`);
  CurrentTransaction = null;
  TimeoutTimer = null;
}

/* //////////////////////////////////////////////////////////////////////////////
//
// createReceipt
//
////////////////////////////////////////////////////////////////////////////// */

function createReceipt (transaction) {
  try {
    const dateTime = new Date();
    const receiptData = {
      header: 'Transaction Receipt',
      date: `${dateTime.getDate()}-${dateTime.getMonth()}-${dateTime.getYear()}`,
      time: `${dateTime.getHours()}:${dateTime.getMinutes()}`,
      merchantId: transaction.merchantId,
      terminalId: transaction.terminalId,
      reference: transaction.reference
    };

    const amountFormat = new Intl.NumberFormat(transaction.locale);

    switch (CurrentTransaction.status) {
      case TRANSACTION_STATUS.APPROVED:
        receiptData.message = 'Payment Approved';
        receiptData.application = transaction.scheme;
        receiptData.pan = maskPan(transaction.pan);
        break;
      case TRANSACTION_STATUS.STOPPED:
        receiptData.message = 'Payment Stopped';
        break;
      case TRANSACTION_STATUS.DECLINED:
        receiptData.message = 'Payment Declined';
        break;
      case TRANSACTION_STATUS.FAILED:
        receiptData.message = 'Payment Failed';
        break;
      case TRANSACTION_STATUS.TIMEDOUT:
        receiptData.message = 'Payment Timed out';
        break;
      default:
        receiptData.message = 'Payment Failed';
        break;
    }
    if (transaction.amountPaid === 0) {
      receiptData.amountPaid = 'NIHIL';
    } else {
      receiptData.amountPaid = `${transaction.currency} ${amountFormat.format(transaction.amountPaid / 100)}`;
    }
    transaction.receipt = receiptData;
  } catch (e) {
    console.log(`${e.message}`);
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// newTransaction + createTransaction + connectTerminal
//
////////////////////////////////////////////////////////////////////////////// */

async function newTransaction (req, res) {
  try {
    if (req.authenticationType === 'host') {
      await createTransaction(req, res);
    } else if (req.authenticationType === 'device') {
      await connectTerminal(req, res);
    } else {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'host\' and \'device\' are allowed to call this endpoint');
    }
  } catch (e) {
    console.log(`(${req.authenticationType}:${req.authenticationUser} - post) ${e.message}`);
    res.json({ error: e.message });
  }
}

async function createTransaction (req, res) {
  try {
    if (CurrentTransaction) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      if (CurrentTransaction.status === TRANSACTION_STATUS.CREATED) {
        throw new Error('Already busy with creating a new transaction');
      } else {
        throw new Error(`Already busy with processing a transaction, id: ${CurrentTransaction.transactionId}`);
      }
    }

    const uuid = crypto.randomUUID();

    const params = new TransactionParams(
      uuid,
      req.params.terminalId,
      req.params.merchantId,
      req.body.reference,
      req.body.amountToPay,
      0, // amountPaid
      req.body.currency,
      req.body.locale,
      null, // receipt
      TRANSACTION_STATUS.CREATED,
      null // expiry TODO
    );
    CurrentTransaction = params;

    console.log(`(${req.authenticationType}:${req.authenticationUser} - post) New transaction created, waiting for terminal to connect`);

    // wait max. 5 seconds for React UI app to connect
    let timeout = 5000;
    const checkStatusTimer = setInterval(() => {
      try {
        if (CurrentTransaction.status === TRANSACTION_STATUS.RUNNING) {
          clearInterval(checkStatusTimer);
          setTransactionToMap(params);

          // set timeout timer in case Frontend is not calling Update within the right time
          enableTimeoutTimer();
          // TimeoutTimer = setTimeout(() => {
          //   CurrentTransaction.status = 'TIMEDOUT';
          //   createReceipt(CurrentTransaction);
          //   setTransactionToMap(CurrentTransaction);
          //   console.log(`Transaction timed-out, transactionId: ${CurrentTransaction.transactionId}`);
          //   CurrentTransaction = null;
          // }, process.env.TRANSACTION_EXPIRY_SEC * 1000);

          res.status(httpStatus.StatusCodes.OK).json({ transactionId: uuid, state: CurrentTransaction.status });
          console.log(`(${req.authenticationType}:${req.authenticationUser} - post) New transaction running, transactionId: ${uuid}`);
        } else if (CurrentTransaction.status === TRANSACTION_STATUS.STOPPED) {
          clearInterval(checkStatusTimer);
          setTransactionToMap(params);
          CurrentTransaction = null;

          res.status(httpStatus.StatusCodes.CONFLICT);
          throw new Error('Terminal directly stopped the transaction');
        } else if (timeout <= 0) {
          clearInterval(checkStatusTimer);
          CurrentTransaction.status = TRANSACTION_STATUS.OUT_OF_ORDER;
          setTransactionToMap(params);
          CurrentTransaction = null;

          res.status(httpStatus.StatusCodes.CONFLICT);
          throw new Error('Terminal was not able to start processing a new transaction');
        } else {
          timeout -= 250;
        }
      } catch (e) {
        console.log(`(${req.authenticationType}:${req.authenticationUser} - post) ${e.message}`);
        res.json({ error: e.message });
      }
    }, 250);

    // res.status(httpStatus.StatusCodes.OK).json({ transactionId: uuid });
  } catch (e) {
    console.log(`(${req.authenticationType}:${req.authenticationUser} - post) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// connectTerminal function to start the new transaction after React App connected
//
////////////////////////////////////////////////////////////////////////////// */

async function connectTerminal (req, res) {
  try {
    if (!CurrentTransaction) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('There is no active transaction to be CREATED');
    }

    if (CurrentTransaction.status !== TRANSACTION_STATUS.CREATED) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error(`Already busy with processing a transaction, id: ${CurrentTransaction.transactionId}`);
    }

    if (req.body.action.toUpperCase() === 'RUN') {
      CurrentTransaction.status = TRANSACTION_STATUS.RUNNING;
    } else {
      CurrentTransaction.status = TRANSACTION_STATUS.STOPPED;
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error('Action property should be \'RUN\' to start processing the new transaction');
    }

    res.status(httpStatus.StatusCodes.OK).json({
      transactionId: CurrentTransaction.transactionId,
      amountToPay: CurrentTransaction.amountToPay,
      locale: CurrentTransaction.locale,
      currency: CurrentTransaction.currency,
      reference: CurrentTransaction.reference });
    console.log(`(${req.authenticationType}:${req.authenticationUser} - post) New transaction connected to terminal, transactionId: ${CurrentTransaction.transactionId}`);
  } catch (e) {
    console.log(`(${req.authenticationType}:${req.authenticationUser} - post) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// updateTransaction function to update properties of the running transaction
//
////////////////////////////////////////////////////////////////////////////// */

async function updateTransaction (req, res) {
  try {
    if (req.body.action.toUpperCase() !== 'STOP' && req.authenticationType !== 'device') {
      res.status(httpStatus.StatusCodes.FORBIDDEN);
      throw new Error('Only accounts of type \'device\' are allowed to call this endpoint');
    }

    if (!CurrentTransaction) {
      res.status(httpStatus.StatusCodes.CONFLICT);
      throw new Error('There is no active transaction to be updated');
    }

    if (CurrentTransaction.transactionId !== req.params.transactionId) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error(`This is not an active transaction, id: ${req.params.transactionId}`);
    }

    if (req.body.action.toUpperCase() === 'FINISH' && req.body.amountPaid !== CurrentTransaction.amountToPay) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST);
      throw new Error(`The amountPaid (${req.body.amountPaid}) is not equal to the amountToPay (${CurrentTransaction.amountToPay})`);
    }

    // restart the timeout timer
    enableTimeoutTimer();

    switch (req.body.action.toUpperCase()) {
      case 'STOP':
        CurrentTransaction.status = TRANSACTION_STATUS.STOPPED;
        break;
      case 'APPROVE':
        CurrentTransaction.status = TRANSACTION_STATUS.APPROVED;
        break;
      case 'FAIL':
        CurrentTransaction.status = TRANSACTION_STATUS.FAILED;
        break;
      case 'DECLINE':
        CurrentTransaction.status = TRANSACTION_STATUS.DECLINED;
        break;
      case 'TIMEOUT':
        CurrentTransaction.status = TRANSACTION_STATUS.TIMEDOUT;
        break;
      default:
        break;
    }

    if (CurrentTransaction.status === TRANSACTION_STATUS.APPROVED) {
      CurrentTransaction.amountPaid = req.body.amountPaid;
      CurrentTransaction.scheme = req.body.scheme;
      CurrentTransaction.pan = req.body.pan;
    }

    if (CurrentTransaction.status !== TRANSACTION_STATUS.RUNNING) {
      // stop TimeoutTimer
      clearTimeout(TimeoutTimer);
      createReceipt(CurrentTransaction);
    }

    const data = {
      amountToPay: CurrentTransaction.amountToPay,
      amountPaid: CurrentTransaction.amountPaid,
      currency: CurrentTransaction.currency,
      locale: CurrentTransaction.locale,
      receipt: CurrentTransaction.receipt,
      status: CurrentTransaction.status
    };
    res.status(httpStatus.StatusCodes.OK).json(data);
    console.log(`(${req.authenticationType}:${req.authenticationUser} - update) Transaction is succesfully updated, transaction params: ${JSON.stringify(data)}`);

    setTransactionToMap(CurrentTransaction);

    if (CurrentTransaction.status !== TRANSACTION_STATUS.RUNNING) {
      CurrentTransaction = null;
    }
  } catch (e) {
    console.log(`(${req.authenticationType}:${req.authenticationUser} - update) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// getTransaction function to get properties of a specific transaction
//
////////////////////////////////////////////////////////////////////////////// */

async function getTransaction (req, res) {
  try {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);

    const transaction = getTransactionFromMap(req.params.transactionId);
    if (!transaction) {
      res.status(httpStatus.StatusCodes.NOT_FOUND);
      throw new Error(`No transaction found with id: ${req.params.transactionId}`);
    }

    // if transaction.status != TRANSACTION_STATUS.RUNNING, directly return the response
    // if transaction.status == TRANSACTION_STATUS.RUNNING, wait until status != RUNNING or responseTimeout expired

    if (transaction.status !== TRANSACTION_STATUS.RUNNING) {
      const data = {
        terminalId: transaction.terminalId,
        merchantId: transaction.merchantId,
        reference: transaction.reference,
        amountToPay: transaction.amountToPay,
        amountPaid: transaction.amountPaid,
        currency: transaction.currency,
        locale: transaction.locale,
        receipt: transaction.receipt,
        status: transaction.status
      };
      res.status(httpStatus.StatusCodes.OK).json(data);
      console.log(`(${req.authenticationType}:${req.authenticationUser} - get) Retrieved transaction, transaction params: ${JSON.stringify(data)}`);
    } else {
      let interval = process.env.LONG_POLLING_INTERVAL_MSEC;
      if (interval < 100) {
        interval = 100;
      } else if (interval > 2000) {
        interval = 2000;
      }
      let pollingTimeout = process.env.LONG_POLLING_TIMEOUT_SEC * 1000;
      if (pollingTimeout < 1000) {
        pollingTimeout = 1000;
      } else if (pollingTimeout > 30000) {
        pollingTimeout = 30000;
      }
      const pollingTimer = setInterval(() => {
        pollingTimeout -= interval;
        const transaction = getTransactionFromMap(req.params.transactionId);
        if (pollingTimeout <= 0 || transaction.status !== TRANSACTION_STATUS.RUNNING) {
          const data = {
            terminalId: transaction.terminalId,
            merchantId: transaction.merchantId,
            reference: transaction.reference,
            amountToPay: transaction.amountToPay,
            amountPaid: transaction.amountPaid,
            currency: transaction.currency,
            locale: transaction.locale,
            receipt: transaction.receipt,
            status: transaction.status
          };
          res.status(httpStatus.StatusCodes.OK).json(data);
          console.log(`(${req.authenticationType}:${req.authenticationUser} - get) Retrieved transaction, transaction params: ${JSON.stringify(data)}`);
          clearInterval(pollingTimer);
        }
      }, interval);
    }
  } catch (e) {
    console.log(`(${req.authenticationType}:${req.authenticationUser} - get) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// getTransactions function to get properties of all transactions
//
////////////////////////////////////////////////////////////////////////////// */

async function getTransactions (req, res) {
  try {
    res.status(httpStatus.StatusCodes.BAD_REQUEST);

    let data;
    const transactions = [];
    TransactionMap.forEach((value, key, map) => {
      data = {
        transactionId: key,
        terminalId: value.terminalId,
        merchantId: value.merchantId,
        reference: value.reference,
        amountToPay: value.amountToPay,
        amountPaid: value.amountPaid,
        currency: value.currency,
        locale: value.locale,
        receipt: value.receipt,
        status: value.status
      };
      transactions.push(data);
    });

    res.status(httpStatus.StatusCodes.OK).json(transactions);
    console.log(`(${req.authenticationType}:${req.authenticationUser} - get) Retrieved ${TransactionMap.size} transaction(s)`);
  } catch (e) {
    console.log(`(${req.authenticationType}:${req.authenticationUser} - get) ${e.message}`);
    res.json({ error: e.message });
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// deleteTransaction function to delete a specific transaction
//
////////////////////////////////////////////////////////////////////////////// */

async function deleteTransaction (req, res) {
  if (!TransactionMap.has(req.params.transactionId)) {
    res.status(httpStatus.StatusCodes.NOT_FOUND).json({ result: `Deletion failed, transaction not found, transactionId: ${req.params.transactionId}` });
    console.log(`(${req.authenticationType}:${req.authenticationUser} - delete) Deletion failed, transaction not found, transactionId: ${req.params.transactionId}`);
  } else {
    TransactionMap.delete(req.params.transactionId);
    res.status(httpStatus.StatusCodes.OK).json({ result: `Deleted transaction with transactionId: ${req.params.transactionId}` });
    console.log(`(${req.authenticationType}:${req.authenticationUser} - delete) Deleted transaction, transactionId: ${req.params.transactionId}`);
  }
}

/* //////////////////////////////////////////////////////////////////////////////
//
// deleteTransactions function to delete all transactions
//
////////////////////////////////////////////////////////////////////////////// */

async function deleteTransactions (req, res) {
  const numOfTransactions = TransactionMap.size;
  TransactionMap.clear();
  res.status(httpStatus.StatusCodes.OK).json({ result: `Deleted ${numOfTransactions} transaction(s)` });
  console.log(`(${req.authenticationType}:${req.authenticationUser} - delete) Deleted ${numOfTransactions} transaction(s)`);
}

module.exports = {
  newTransaction,
  updateTransaction,
  getTransaction,
  getTransactions,
  deleteTransaction,
  deleteTransactions
};
