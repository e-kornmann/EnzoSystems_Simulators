import { GetTransactionDetails } from '../../PaymentDevice/types/types';

type Prop = {
    transactionDetails: GetTransactionDetails;
}

const TransactionDetails = ({transactionDetails}:Prop) => {
    const { terminalId, merchantId, reference, amountToPay, amountPaid, currency, locale } = transactionDetails;
  return (
    <>
    Transaction details:<br />
    Terminal Id: {terminalId}<br />
    Merchant Id: {merchantId}<br />
    Reference: {reference}<br />
    Amount To Pay: {amountToPay}<br />
    Amount Paid: {amountPaid}<br />
    Currency: {currency}<br />
    Locale: {locale}<br />
  </>  )
}

export default TransactionDetails;