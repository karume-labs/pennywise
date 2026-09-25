// @ts-expect-error
import { describe, expect, test } from "bun:test";
import { parseFinancialSms } from "../features/transactions/services/parsers";

describe("M-PESA SMS Parser", () => {
  test("parses a Paybill/Buy Goods transaction", () => {
    const sms =
      "QWE123RTY Confirmed. Ksh4,500.00 paid to Naivas Supermarket. on 21/9/23 at 10:24 AM. New M-PESA balance is Ksh15,000.00. Transaction cost, Ksh 22.00.";

    const result = parseFinancialSms(sms);
    expect(result).not.toBeNull();
    expect(result?.transactionCode).toBe("QWE123RTY");
    expect(result?.amount).toBe(4500);
    expect(result?.merchantOrSender).toBe("Naivas Supermarket");
    expect(result?.type).toBe("EXPENSE");
    expect(result?.accountBalance).toBe(15000);
    expect(result?.transactionFee).toBe(22);
  });

  test("parses a Send Money transaction", () => {
    const sms =
      "QWE123RTY Confirmed. Ksh1,500.00 sent to John Doe 0712345678 on 21/9/23 at 10:24 AM. New M-PESA balance is Ksh15,000.00. Transaction cost, Ksh 12.00.";

    const result = parseFinancialSms(sms);
    expect(result).not.toBeNull();
    expect(result?.transactionCode).toBe("QWE123RTY");
    expect(result?.amount).toBe(1500);
    expect(result?.merchantOrSender).toBe("John Doe");
    expect(result?.type).toBe("EXPENSE");
    expect(result?.accountBalance).toBe(15000);
    expect(result?.transactionFee).toBe(12);
  });

  test("parses a Receive Money transaction", () => {
    const sms =
      "QWE123RTY Confirmed. You have received Ksh2,000.00 from Jane Doe 0712345678 on 21/9/23 at 10:24 AM. New M-PESA balance is Ksh17,000.00.";

    const result = parseFinancialSms(sms);
    expect(result).not.toBeNull();
    expect(result?.transactionCode).toBe("QWE123RTY");
    expect(result?.amount).toBe(2000);
    expect(result?.merchantOrSender).toBe("Jane Doe");
    expect(result?.type).toBe("INCOME");
    expect(result?.accountBalance).toBe(17000);
    expect(result?.transactionFee).toBe(0);
  });

  test("returns null for unknown formats", () => {
    const sms = "Dear Customer, your balance is low.";
    const result = parseFinancialSms(sms);
    expect(result).toBeNull();
  });
});
