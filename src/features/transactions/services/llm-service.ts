import { eq } from "drizzle-orm";
import {
  createLLMChatSession,
  download,
  type LLMChatSession,
  models,
} from "react-native-executorch";
import { db } from "@/db/client";
import { customRules, transactions } from "@/db/schema";

class LocalLlmService {
  private isInitializing = false;
  private session: LLMChatSession | null = null;
  private isReady = false;

  async init(onProgress?: (p: number) => void) {
    if (this.isReady || this.isInitializing) return;
    this.isInitializing = true;

    try {
      // Step 1: Download model files to local cache (skipped if already cached)
      const modelConfig = models.llm.LLAMA3_2_1B.XNNPACK_SPINQUANT;
      const localConfig = await download(modelConfig, {
        onProgress,
      });

      // Step 2: Initialize with local paths
      this.session = await createLLMChatSession(localConfig, {
        generationConfig: {
          temperature: 0.1,
        },
      });
      this.isReady = true;
      console.log("ExecuTorch LLM model initialized successfully");
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

    if (!this.session) return "General";

    const prompt = `Categorize the following transaction into exactly one of these categories: Groceries, Transport, Utilities, Dining, Shopping, Entertainment, Healthcare, General.
Merchant: ${merchant}
SMS context: ${_rawSms}
Answer only with the category name.`;

    try {
      const response = await this.session.sendMessage(prompt);
      const text = response.messages[response.messages.length - 1]
        .content as string;
      const lowerText = text.toLowerCase();

      const categories = [
        "groceries",
        "transport",
        "utilities",
        "dining",
        "shopping",
        "entertainment",
        "healthcare",
      ];
      for (const cat of categories) {
        if (lowerText.includes(cat)) {
          return cat.charAt(0).toUpperCase() + cat.slice(1);
        }
      }
      return "General";
    } catch (e) {
      console.error("Categorization failed:", e);
      return "General";
    }
  }

  async processPendingCategorizations() {
    const pending = await db
      .select()
      .from(transactions)
      .where(eq(transactions.category, "Uncategorized"))
      .limit(10);

    if (pending.length === 0) return;

    // Fetch custom rules
    const rules = await db.select().from(customRules);

    for (const tx of pending) {
      let category = "Uncategorized";
      let confidence = 0;
      const merchant = tx.merchantOrSender?.toLowerCase() ?? "";

      // Check rules first (deterministic)
      for (const rule of rules) {
        if (merchant.includes(rule.merchantPattern.toLowerCase())) {
          category = rule.assignedCategory;
          confidence = 1.0; // 100% confidence for manual rules
          break;
        }
      }

      // Fallback to AI (stochastic)
      if (category === "Uncategorized") {
        category = await this.categorizeTransaction(
          tx.merchantOrSender ?? "",
          tx.rawSms ?? "",
        );
        confidence = 0.85;
      }

      await db
        .update(transactions)
        .set({
          category,
          aiConfidence: confidence,
        })
        .where(eq(transactions.id, tx.id));
    }
  }

  // RAG / SQL-to-Text for Ask AI
  async askPenny(
    question: string,
    contextRows: unknown[],
    onToken?: (token: string) => void,
  ): Promise<string> {
    if (!this.isReady) await this.init();
    if (!this.session) return "Sorry, my engine failed to start.";

    // Provide context as a system prompt style message
    const prompt = `You are Pennywise, an on-device AI financial assistant. Answer the user's question using the following recent transactions as context. Keep your answer brief and conversational.
Context transactions: ${JSON.stringify(contextRows)}
Question: ${question}`;

    try {
      const response = await this.session.sendMessage(prompt, onToken, {
        temperature: 0.7,
      });
      return response.messages[response.messages.length - 1].content as string;
    } catch (e) {
      console.error("AskPenny failed:", e);
      return "Oops, I encountered an error running the AI model locally.";
    }
  }
}

export const llmService = new LocalLlmService();
