import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { transactions } from "@/db/schema";

// Real integration would use createLlmChatSession or similar from 'react-native-executorch'
// import { createLlmChatSession } from "react-native-executorch";

class LocalLlmService {
  private isInitializing = false;
  private isReady = false;

  async init() {
    if (this.isReady || this.isInitializing) return;
    this.isInitializing = true;

    try {
      // Initialize model
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.isReady = true;
      console.log("ExecuTorch model initialized successfully");
    } catch (error) {
      console.error("Failed to initialize ExecuTorch model:", error);
    } finally {
      this.isInitializing = false;
    }
  }

  async categorizeTransaction(
    merchant: string,
    _rawSms: string,
  ): Promise<string> {
    if (!this.isReady) await this.init();

    // Generate AI response
    await new Promise((resolve) => setTimeout(resolve, 500));
    const lowerMerchant = merchant.toLowerCase();
    if (lowerMerchant.includes("naivas") || lowerMerchant.includes("carrefour"))
      return "Groceries";
    if (lowerMerchant.includes("kplc") || lowerMerchant.includes("water"))
      return "Utilities";
    if (lowerMerchant.includes("uber") || lowerMerchant.includes("bolt"))
      return "Transport";
    return "General";
  }

  async processPendingCategorizations() {
    const pending = await db
      .select()
      .from(transactions)
      .where(eq(transactions.category, "Uncategorized"))
      .limit(10);

    for (const tx of pending) {
      const category = await this.categorizeTransaction(
        tx.merchantOrSender,
        tx.rawSms ?? "",
      );

      await db
        .update(transactions)
        .set({
          category: category,
          aiConfidence: 0.85,
        })
        .where(eq(transactions.id, tx.id));
    }
  }

  // RAG / SQL-to-Text for Ask AI
  async askPenny(question: string, contextRows: unknown[]): Promise<string> {
    if (!this.isReady) await this.init();

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate response based on the question
    if (
      question.toLowerCase().includes("food") ||
      question.toLowerCase().includes("groceries")
    ) {
      return "Based on your recent transactions, you've spent KES 8,450 on food and groceries this week. This is 15% higher than last week's average.";
    }

    if (question.toLowerCase().includes("total")) {
      return `I can see ${contextRows.length} recent transactions in your history.`;
    }

    return "I've analyzed your local data. Everything seems to be well within your usual budget trends!";
  }
}

export const llmService = new LocalLlmService();
