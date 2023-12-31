const DEVICE_STATUS = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  OUT_OF_ORDER: 'OUT_OF_ORDER',
  NOT_FOUND: 'NOT_FOUND'
};

const SESSION_COMMAND = {
  PAYMENT: 'PAYMENT',
  PREAUTH: 'PREAUTH',
  CAPTURE: 'CAPTURE',
  CANCEL: 'CANCEL'
};

const SESSION_STATUS = {
  ACTIVE: 'ACTIVE',
  CANCELLING: 'CANCELLING',
  FINISHED: 'FINISHED',
  STOPPED: 'STOPPED',
  TIMED_OUT: 'TIMED_OUT'
};

const TRANSACTION_STATUS = {
  ACTIVE: 'ACTIVE',
  APPROVED: 'APPROVED',
  FAILED: 'FAILED',
  DECLINED: 'DECLINED',
  STOPPED: 'STOPPED'
};

const CURRENCY = {
  AUD: 'AUD',
  CAD: 'CAD',
  CHF: 'CHF',
  EUR: 'EUR',
  USD: 'USD',
  DKK: 'DKK',
  GEL: 'GEL',
  MYR: 'MYR',
  TWD: 'TWD'
};

const LOCALE = {
  nl_NL: 'nl-NL',
  de_DE: 'de-DE',
  en_US: 'en-US',
  fr_FR: 'fr-FR'
};

const LONG_POLLING_INTERVAL_MS = 250;

module.exports = {
  DEVICE_STATUS,
  SESSION_COMMAND,
  SESSION_STATUS,
  TRANSACTION_STATUS,
  CURRENCY,
  LOCALE,
  LONG_POLLING_INTERVAL_MS
};
