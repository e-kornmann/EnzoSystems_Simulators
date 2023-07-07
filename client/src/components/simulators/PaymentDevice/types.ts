type Res = {
    terminalId: string;
    transactionId: string;
    amount: number;
  };
  
  type PayState = {
    idle: boolean;
    req: boolean;
    res: Res;
    timeout: boolean;
    pending: boolean;
    success: boolean;
    error: boolean;
    abort: boolean;
  };

  export type { Res, PayState };