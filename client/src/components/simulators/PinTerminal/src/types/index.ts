import ShowIcon from '../../local_types/ShowIcon';

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

export type MessageContentType = {
  mainline: string;
  subline: string | undefined;
  checkOrCrossIcon: ShowIcon | undefined;
};
