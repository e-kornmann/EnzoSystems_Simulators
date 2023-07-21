import { CurrencyCode } from "../../types/CurrencyTypes";
import { Locale } from "../../types/LocaleTypes";

    export type TransactionStateType = {
      statusCode: number | undefined;
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
    }



    export type AcceptTransaction = {
      transactionId: string,
      amountToPay: number,
      locale: string,
      currency: string,
      reference: string,
    }
      
    

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
    }