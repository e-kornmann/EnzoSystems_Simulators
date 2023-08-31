import { CurrencyCode } from '../../../../types/CurrencyTypes';
import { Locale } from '../../../../types/LocaleTypes';

export enum PinTerminalStatus {
  START_UP,
  OUT_OF_ORDER,
  IDLE,
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
  TIMED_OUT,
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

export type AcceptTransactionStateType = {
  transactionId: string;
  amountToPay: number;
};

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
  failicon: boolean | undefined;
  successicon: boolean | undefined;
};
