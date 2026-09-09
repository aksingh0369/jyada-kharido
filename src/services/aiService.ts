export interface AiProductGenerationResult {
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  suggestedDiscount?: number;
  isAiGenerated?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export class AiService {
  /**
   * Generates catchy e-commerce copy, detailed descriptions, and structured specifications
   * using Gemini 3.8 Flash via the server-side API.
   */
  public static async generateProductDetails(
    productName: string,
    brand?: string,
    categoryName?: string,
    currentDetails?: string
  ): Promise<AiProductGenerationResult> {
    try {
      const res = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          brand: brand || '',
          categoryName: categoryName || '',
          currentDetails: currentDetails || ''
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.fallback) {
          return errorData.fallback;
        }
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      return {
        shortDescription: data.shortDescription || '',
        description: data.description || '',
        specifications: data.specifications || {},
        suggestedDiscount: data.suggestedDiscount || 20,
        isAiGenerated: Boolean(data.isAiGenerated)
      };
    } catch (err: any) {
      console.warn('AI product generation request failed, using intelligent offline fallback:', err);
      // Clean fallback so user work is never blocked
      return {
        shortDescription: `Authentic ${brand || ''} ${productName} with high durability and premium performance.`,
        description: `${productName} offers outstanding reliability, modern ergonomics, and long-lasting quality. Perfectly suited for daily usage and available at a limited-time deal price on Amazon India.`,
        specifications: {
          'Brand': brand || 'Original Brand',
          'Model': productName,
          'Warranty': '1 Year Manufacturer Warranty',
          'Condition': '100% Genuine & Brand New'
        },
        suggestedDiscount: 20,
        isAiGenerated: false
      };
    }
  }

  /**
   * Chat with the Jyada Kharido AI Shopping Advisor
   */
  public static async chat(
    message: string,
    conversationHistory: ChatMessage[],
    catalogSummary: Array<{ id: string; name: string; brand: string; categoryName: string; discountPercent: number }>
  ): Promise<string> {
    try {
      const res = await fetch('/api/ai/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationHistory: conversationHistory.map(m => ({
            role: m.role,
            content: m.content
          })),
          catalogSummary
        })
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      return data.reply || 'Main aapki shopping mein madad karne ke liye yahan hoon! Aap humare categories aur deals dekh sakte hain.';
    } catch (err) {
      console.error('AI chat failed:', err);
      return 'Namaste! Main Jyada Kharido Shopping Assistant hoon. Store mein boAt earphones, smartwatches, laptops aur kitchen gadgets par badiya deals chal rahi hain!';
    }
  }
}
