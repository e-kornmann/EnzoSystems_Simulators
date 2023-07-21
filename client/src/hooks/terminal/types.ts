    export type TransactionStateType = {
      statusCode: number | undefined;
      transactionId: string;
      amountToPay: number;    
    };

    export type UpdateTransaction = {
      action: string;
      amountPaid: number;
      scheme: string;
      pan: string;
    };
