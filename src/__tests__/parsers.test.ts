// @ts-expect-error
import { describe, expect, test } from "bun:test";
import { parseFinancialSms } from "../features/transactions/services/parsers";

describe("Mobile Money SMS Parser", () => {
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
    expect(result?.source).toBe("MOBILE_MONEY");
  });

  test("parses the SMS date into local time components", () => {
    const sms =
      "QWE123RTY Confirmed. Ksh4,500.00 paid to Naivas Supermarket. on 21/9/23 at 10:24 AM. New M-PESA balance is Ksh15,000.00.";

    const result = parseFinancialSms(sms);
    expect(result?.date).toBeInstanceOf(Date);
    // Optional chaining short-circuits the whole chain, so these are safe
    // even when the SMS does not parse.
    // Must be a real timestamp: an Invalid Date becomes NaN, which SQLite
    // stores as NULL and the NOT NULL constraint on `date` rejects.
    expect(Number.isNaN(result?.date.getTime())).toBe(false);

    expect(result?.date.getFullYear()).toBe(2023);
    expect(result?.date.getMonth()).toBe(8); // September, 0-indexed
    expect(result?.date.getDate()).toBe(21);
    expect(result?.date.getHours()).toBe(10);
    expect(result?.date.getMinutes()).toBe(24);
  });

  test("does not mangle a 4-digit year into 4000s", () => {
    const sms =
      "QWE123RTY Confirmed. Ksh4,500.00 paid to Naivas Supermarket. on 21/9/2023 at 10:24 AM. New M-PESA balance is Ksh15,000.00.";

    const result = parseFinancialSms(sms);
    expect(result?.date.getFullYear()).toBe(2023);
  });

  test("handles 12 AM as midnight and 12 PM as noon", () => {
    const midnight = parseFinancialSms(
      "QWE123RTY Confirmed. Ksh4,500.00 paid to Naivas Supermarket. on 21/9/23 at 12:00 AM. New M-PESA balance is Ksh15,000.00.",
    );
    const noon = parseFinancialSms(
      "QWE123RTY Confirmed. Ksh4,500.00 paid to Naivas Supermarket. on 21/9/23 at 12:00 PM. New M-PESA balance is Ksh15,000.00.",
    );

    expect(midnight?.date.getHours()).toBe(0);
    expect(noon?.date.getHours()).toBe(12);
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

  // The provider name in the balance line is matched as a variable, so the
  // template is not Safaricom-only. These are the cases that regress if a
  // literal "M-PESA" creeps back into the pattern.
  test("parses another provider with a two-word name", () => {
    const sms =
      "X9K2LM Confirmed. Ksh4,500.00 paid to Naivas Supermarket. on 21/9/23 at 10:24 AM. New Airtel Money balance is Ksh15,000.00.";

    const result = parseFinancialSms(sms);
    expect(result).not.toBeNull();
    expect(result?.transactionCode).toBe("X9K2LM");
    expect(result?.amount).toBe(4500);
    expect(result?.accountBalance).toBe(15000);
    expect(result?.source).toBe("MOBILE_MONEY");
  });

  test("parses another provider with a single-word name", () => {
    const sms =
      "AB12CD Confirmed. You have received Ksh900.00 from Jane Doe 0712345678 on 21/9/23 at 10:24 AM. New Equitel balance is Ksh5,400.00.";

    const result = parseFinancialSms(sms);
    expect(result).not.toBeNull();
    expect(result?.amount).toBe(900);
    expect(result?.type).toBe("INCOME");
    expect(result?.merchantOrSender).toBe("Jane Doe");
    expect(result?.accountBalance).toBe(5400);
    expect(result?.source).toBe("MOBILE_MONEY");
  });

  test("returns null for non-financial formats", () => {
    const sms = "Dear Customer, your balance is low.";
    const result = parseFinancialSms(sms);
    expect(result).toBeNull();
  });
});

describe("Bank Alert SMS Parser", () => {
  test("parses a debit transaction", () => {
    const sms =
      "Dear Customer, KES 1,500.00 has been debited from your A/C ...012 on 26/09/2026 at 08:00 via POS at NAIVAS. Avail Bal: KES 10,000.00.";
    const result = parseFinancialSms(sms);
    expect(result).not.toBeNull();
    expect(result?.amount).toBe(1500);
    expect(result?.merchantOrSender).toBe("NAIVAS");
    expect(result?.type).toBe("EXPENSE");
    expect(result?.accountBalance).toBe(10000);
    expect(result?.source).toBe("BANK_ALERT");
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
    expect(result?.source).toBe("BANK_ALERT");
  });

  // Known gap, deliberately not asserted: this template carries
  // "on 26/09/2026 at 08:00" but the regex `.*` runs swallow it, so the
  // returned date is the sync time, not the transaction time. Fixing that
  // changes stored data, so it is called out rather than silently changed.
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
    expect(result?.source).toBe("GENERIC");
  });

  test("parses a generic KES income", () => {
    const sms =
      "You have received Ksh 12,000.00 from ALICE W. via PesaLink on 26/09.";
    const result = parseFinancialSms(sms);
    expect(result).not.toBeNull();
    expect(result?.amount).toBe(12000);
    expect(result?.type).toBe("INCOME");
    expect(result?.merchantOrSender).toBe("ALICE W");
    expect(result?.source).toBe("GENERIC");
  });
});
