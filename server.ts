import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // Lazy / Safe GoogleGenAI client (no crash if API key is missing)
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiAvailable: Boolean(process.env.GEMINI_API_KEY) });
  });

  // AI Product Details Generator Endpoint (Server-Side)
  app.post("/api/ai/generate-product", async (req, res) => {
    try {
      const { productName, brand, categoryName, currentDetails } = req.body;
      if (!productName || typeof productName !== "string") {
        return res.status(400).json({ error: "Product name is required" });
      }

      const ai = getAi();
      if (!ai) {
        // High quality fallback if API key is not yet configured
        return res.json({
          shortDescription: `Top-rated ${brand || ''} ${productName} featuring premium design and performance.`,
          description: `${productName} delivers exceptional quality, modern features, and reliable performance. Designed for convenience, durability, and everyday use, it provides outstanding value and seamless operation for Indian consumers looking for authentic quality and genuine value for money.`,
          specifications: {
            "Brand": brand || "Original Brand",
            "Model": productName,
            "Warranty": "1 Year Manufacturer Warranty",
            "Condition": "100% Genuine & Brand New"
          },
          suggestedDiscount: 25,
          isAiGenerated: false
        });
      }

      const prompt = `You are an expert e-commerce catalog copywriter for "Jyada Kharido", an Indian deals and shopping affiliate platform.
Generate engaging, attractive, and accurate product details for:
Product Name: "${productName}"
Brand: "${brand || 'Generic'}"
Category: "${categoryName || 'Electronics/Lifestyle'}"
Additional Notes: "${currentDetails || ''}"

Return ONLY valid JSON with this exact structure:
{
  "shortDescription": "A punchy, attractive one-liner (max 100 characters) highlighting the best feature",
  "description": "2-3 well-written, engaging paragraphs highlighting key benefits, sound/build/performance, and value for money for shoppers",
  "specifications": {
    "Key Feature 1": "Value",
    "Key Feature 2": "Value",
    "Connectivity/Type": "Value",
    "Warranty": "1 Year Manufacturer Warranty"
  },
  "suggestedDiscount": 20
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json({ ...parsed, isAiGenerated: true });
    } catch (err: any) {
      console.error("AI product generation error:", err);
      res.status(500).json({ 
        error: err?.message || "Failed to generate product details with AI",
        fallback: {
          shortDescription: `Top-rated ${req.body?.brand || ''} ${req.body?.productName || 'Product'} featuring high performance.`,
          description: `${req.body?.productName || 'This product'} offers premium craftsmanship, high reliability, and top customer satisfaction.`,
          specifications: {
            "Brand": req.body?.brand || "Original Brand",
            "Model": req.body?.productName || "Standard",
            "Warranty": "1 Year Manufacturer Warranty"
          },
          suggestedDiscount: 20
        }
      });
    }
  });

  // AI Shopping Assistant Chat Endpoint (Server-Side)
  app.post("/api/ai/chat-assistant", async (req, res) => {
    try {
      const { message, conversationHistory = [], catalogSummary = [] } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getAi();
      if (!ai) {
        return res.json({
          reply: "नमस्ते! Welcome to Jyada Kharido! हमारे स्टोर पर बेस्ट डील्स और डिस्काउंटेड प्रोडक्ट्स उपलब्ध हैं। आप earphones, smart watches, laptops, consoles या फैशन एक्सप्लोर कर सकते हैं!",
          suggestedProducts: []
        });
      }

      const catalogContext = catalogSummary.length > 0 
        ? `Here are current featured products in the Jyada Kharido store: ${JSON.stringify(catalogSummary.slice(0, 15))}`
        : '';

      const systemInstruction = `You are the "Jyada Kharido AI Shopping Guide" (ज्यादा खरीदो शॉपिंग असिस्टेंट), a polite, helpful Indian shopping advisor.
${catalogContext}
Guidelines:
1. You assist customers in finding deals, choosing best gadgets, comparing options, and answering questions about products.
2. If the user talks in Hindi or Hinglish, reply naturally in friendly Hinglish/Hindi. If they speak English, reply in English.
3. Be concise (2-4 sentences), highlight savings/discounts, and recommend products from the store if relevant.
4. Keep tone enthusiastic, trustworthy, and respectful.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          ...conversationHistory.slice(-6).map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text });
    } catch (err: any) {
      console.error("AI chat assistant error:", err);
      res.status(500).json({ 
        reply: "Maaf kijiye, abhi AI server connect nahi ho pa raha hai. Aap humare deals explore kar sakte hain!" 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
