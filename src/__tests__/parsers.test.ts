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

  test("returns null for non-financial formats", () => {
    const sms = "Dear Customer, your balance is low.";
    const result = parseFinancialSms(sms);
    expect(result).toBeNull();
  });
});

describe("Equity Bank SMS Parser", () => {
  test("parses a debit transaction", () => {
    const sms =
      "Dear Customer, KES 1,500.00 has been debited from your A/C ...012 on 26/09/2026 at 08:00 via POS at NAIVAS. Avail Bal: KES 10,000.00.";
    const result = parseFinancialSms(sms);
    expect(result).not.toBeNull();
    expect(result?.amount).toBe(1500);
    expect(result?.merchantOrSender).toBe("NAIVAS");
    expect(result?.type).toBe("EXPENSE");
    expect(result?.accountBalance).toBe(10000);
    expect(result?.source).toBe("EQUITY_BANK");
  });

  test("parses a credit transaction", () => {
    const sms =
      "Dear Customer, KES 5,000.00 has been credited to your A/C ...012 on 25/09/2026 at 14:00 by JOHN DOE. Avail Bal: KES 15,000.00.";
    const result = parseFinancialSms(sms);
    expect(result).not.toBeNull();
    expect(result?.amount).toBe(5000);
    expect(result?.merchantOrSender).toBe("JOHN DOE");
    expect(result?.type).toBe("INCOME");
    expect(result?.accountBalance).toBe(15000);
    expect(result?.source).toBe("EQUITY_BANK");
  });
});

describe("Generic Fallback SMS Parser", () => {
  test("parses a foreign currency USD expense", () => {
    const sms =
      "Alert: USD 45.99 was debited from your card ending 1234 on 26/09. Ref: AMZN123. Bal: USD 1,200.50";
    const result = parseFinancialSms(sms);
    expect(result).not.toBeNull();
    // `amount` is normalized to KES; the source figures are preserved alongside.
    expect(result?.originalCurrency).toBe("USD");
    expect(result?.originalAmount).toBe(45.99);
    expect(result?.amount).toBeCloseTo(45.99 * 130.5, 5);
    expect(result?.type).toBe("EXPENSE");
    expect(result?.accountBalance).toBe(1200.5);
    expect(result?.source).toBe("GENERIC_BANK");
  });

  test("parses a generic KES income", () => {
    const sms =
      "You have received Ksh 12,000.00 from ALICE W. via PesaLink on 26/09.";
    const result = parseFinancialSms(sms);
    expect(result).not.toBeNull();
    expect(result?.amount).toBe(12000);
    expect(result?.type).toBe("INCOME");
    expect(result?.merchantOrSender).toBe("ALICE W");
    expect(result?.source).toBe("GENERIC_BANK");
  });
});
