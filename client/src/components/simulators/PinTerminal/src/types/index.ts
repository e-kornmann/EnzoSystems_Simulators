import ShowIcon from '../../local_types/ShowIcon';
import CurrencyCode from '../enums/Currency';
import Locale from '../enums/Locale';

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
