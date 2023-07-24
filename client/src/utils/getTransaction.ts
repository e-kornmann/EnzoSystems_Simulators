import api from '../api';
import { GetTransactionDetails } from '../components/simulators/PaymentDevice/types';
import { Locale } from '../types/LocaleTypes';
import { CurrencyCode } from '../types/CurrencyTypes';
import React from 'react';

export const initialReceipt: GetTransactionDetails = {
  terminalId: '',
  merchantId: '',
  reference: '',
  amountToPay: 0,
  amountPaid: 0,
  currency: CurrencyCode.EUR,
  locale: Locale.nl_NL,
  receipt: '',
  status: '',
}



  
  export const getTransaction = async (accessToken: string, transactionIdApp: string, setTransactionDetails: React.Dispatch<React.SetStateAction<GetTransactionDetails>>) => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        }
      };
      await api.get(`/${import.meta.env.VITE_MERCHANT_ID}/${import.meta.env.VITE_TERMINAL_ID}/transactions/${transactionIdApp}`, config)
      .then( response => {
       setTransactionDetails({
        terminalId: response.data.terminalId,
        merchantId: response.data.merchantId,
        reference: response.data.reference,
        amountToPay: response.data.amountToPay,
        amountPaid: response.data.amountPaid,
        currency: response.data.currency,
        locale: response.data.locale,
        receipt: response.data.receipt,
        status: response.data.status}
        );
       })
    } catch (error) {
        console.error('Unable to get transaction:', error);
    }

};



