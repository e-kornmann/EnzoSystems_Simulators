type Res = {
    terminalId: string;
    transactionId: string;
    amount: string;
  };
  
  type PayState = {
    idle: boolean;
    req: boolean;
    res: Res;
    pending: boolean;
    success: boolean;
    abort: boolean;
  };

  export type { Res, PayState };