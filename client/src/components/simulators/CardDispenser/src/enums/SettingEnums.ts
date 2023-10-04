import CountriesAlpha3 from './CountryCodesISO3166Alpha3';

// SETTINGS
enum APPSETTINGS {
  DEVICE_STATUS = 'status',
  CARD_STACK = 'stackStatus',
  BIN = 'binStatus',
  CARD_POSITION = 'cardPosition',
  FAIL_PROCESS = 'failProcess',
}

// OPTIONS
enum DEVICESTATUSOPTIONS {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  OUT_OF_ORDER = 'OUT_OF_ORDER',
}
enum CARDPOSITIONS {
  STACK = 'STACK',
  ENCODER = 'ENCODER',
  BEZEL = 'BEZEL',
}
enum BINSTATUSES {
  FULL = 'FULL',
  EMPTY = 'EMPTY',
}
enum STACKSTATUSES {
  FULL = 'FULL',
  LOW = 'LOW',
  EMPTY = 'EMPTY',
}
enum FAILPROCESS {
  NEVER = 'NEVER',
  SPORADICALLY = 'SPORADICALLY',
}

// NOT IMPLEMENTED BUT AVAILABLE
enum Lang {
  DUTCH = CountriesAlpha3.Netherlands,
  ENGLISH = CountriesAlpha3['United Kingdom'],
  GERMAN = CountriesAlpha3.Germany,
  FRENCH = CountriesAlpha3.France,
}

export { STACKSTATUSES, BINSTATUSES, CARDPOSITIONS, DEVICESTATUSOPTIONS, FAILPROCESS, APPSETTINGS, Lang };
