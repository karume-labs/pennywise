export type ParsedTransaction = {
  transactionCode: string;
  amount: number;
  merchantOrSender: string;
  date: Date;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  transactionFee?: number;
  accountBalance?: number;
  source?: string;
  originalCurrency?: string;
  originalAmount?: number;
};
