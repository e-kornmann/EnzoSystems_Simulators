import CurrencyCode from '../../../../types/CurrencyTypes';
import Locale from '../../../../types/LocaleTypes';
import ShowIcon from '../../QR-Scanner/local_types/ShowIcon';

export enum OPSTATE {
  DEVICE_START_UP,
  DEVICE_CONNECT,
  DEVICE_DISCONNECT,
  DEVICE_COULD_NOT_CONNECT,
  DEVICE_DISCONNECTED,
  DEVICE_COULD_NOT_DISCONNECT,
  DEVICE_OUT_OF_ORDER,
  DEVICE_IDLE,
  UPDATE_TRANSACTION,
  SERVER_ERROR,
  CHOOSE_METHOD,
  ACTIVE_METHOD,
  PIN_ENTRY,
  PIN_CONFIRM,
  CHECK_PIN,
  STOP_TRANSACTION,
  WRONG_PIN,
  CHECK_AMOUNT,
  API_TIMED_OUT,
  API_CANCEL,
  PIN_ERROR,
  AMOUNT_ERROR,
  SUCCESS,
  STOPPED,
  UNKNOWN,
}

export enum PayMethod {
  NONE,
  SMARTPHONE,
  CONTACTLESS,
  CARD,
}

export type UpdatePostTransaction = {
  action: string;
  amountPaid: number;
  scheme: string;
  pan: string;
};

export type UpdateResponseTransaction = {
  header: 'Transaction Receipt',
  date: string;
  time: string;
  merchantId: string,
  terminalId: string,
  reference: string,
};

export type GetTransactionDetails = {
  terminalId: string,
  merchantId: string,
  reference: string,
  amountToPay: number,
  amountPaid: number,
  currency: CurrencyCode,
  locale: Locale,
  receipt: string,
  status: string
};

export type MessageContentType = {
  mainline: string;
  subline: string | undefined;
  checkOrCrossIcon: ShowIcon | undefined;
};
