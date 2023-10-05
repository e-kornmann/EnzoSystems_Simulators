import CurrencyCode from '../enums/Currency';
import Locale from '../enums/Locale';

export type GetTransactionDetailsType = {
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
