import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  ExternalLink, 
  ShoppingBag, 
  Tag, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { Product } from '../types';
import { AiService, ChatMessage } from '../services/aiService';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const DEFAULT_QUESTIONS = [
  '🔥 Aaj ki sabse best deals kya hain?',
  '🎧 Budget earphones under ₹2000 suggest karo',
  '💻 Best laptop ya gadget kaun sa hai?',
  '🏷️ Maximum discount wale products dikhao'
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Namaste! Main **Jyada Kharido AI Deals Guide** hoon. Main aapko best deals, discounts compare karne aur aapke budget ke mutabik products dhoondhne mein help kar sakta hoon. Aap mujhse Hindi, Hinglish ya English mein pooch sakte hain!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  // Catalog summary for Gemini context
  const catalogSummary = products.map(p => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    categoryName: p.categoryName || 'General',
    discountPercent: p.discountPercent || 0
  }));

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const reply = await AiService.chat(text, [...messages, userMsg], catalogSummary);
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: 'Maaf kijiye, connect karne mein thodi pareshani hui. Lekin aap humare store ke featured deals directly homepage par dekh sakte hain!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Find products mentioned or relevant
  const findMentionedProducts = (text: string): Product[] => {
    const lower = text.toLowerCase();
    return products.filter(p => {
      const nameMatch = lower.includes(p.name.toLowerCase());
      const brandMatch = p.brand && lower.includes(p.brand.toLowerCase());
      return nameMatch || (brandMatch && lower.includes(p.categoryName.toLowerCase()));
    }).slice(0, 3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 flex flex-col h-[600px] max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-gray-950 via-gray-900 to-purple-950 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#F52D56] to-purple-600 flex items-center justify-center shadow-md shadow-rose-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black tracking-wide">Jyada Kharido AI Guide</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Gemini Powered
                </span>
              </div>
              <p className="text-[11px] text-gray-300">
                Aapka personal shopping & deals advisor (Ask in Hindi or English)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-gray-50/80 border-b border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0">Quick Ask:</span>
          {DEFAULT_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="px-3 py-1 bg-white border border-gray-200 hover:border-[#F52D56] hover:text-[#F52D56] rounded-full text-[11px] font-semibold text-gray-700 whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50 shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/30">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            const matchedProducts = isBot ? findMentionedProducts(msg.content) : [];

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#F52D56] to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                      isBot
                        ? 'bg-white border border-gray-200/80 text-gray-800 rounded-tl-xs shadow-xs'
                        : 'bg-[#F52D56] text-white rounded-br-xs font-medium shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        isBot ? 'text-gray-400' : 'text-rose-200'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* If product mentioned, show quick cards */}
                  {matchedProducts.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Matching Store Products:
                      </p>
                      {matchedProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            onSelectProduct(p);
                            onClose();
                          }}
                          className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-200 hover:border-[#F52D56] shadow-2xs transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {p.primaryImage ? (
                              <img
                                src={p.primaryImage}
                                alt={p.name}
                                className="w-8 h-8 rounded-lg object-contain bg-gray-50 p-0.5 shrink-0"
                              />
                            ) : (
                              <ShoppingBag className="w-5 h-5 text-gray-400 shrink-0" />
                            )}
                            <div className="truncate">
                              <h5 className="text-[11px] font-bold text-gray-900 group-hover:text-[#F52D56] truncate">
                                {p.name}
                              </h5>
                              <p className="text-[10px] text-gray-500">
                                {p.brand} • {p.discountPercent ? `${p.discountPercent}% OFF` : 'Great Deal'}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#F52D56] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {!isBot && (
                  <div className="w-7 h-7 rounded-xl bg-gray-800 text-white flex items-center justify-center shrink-0 shadow-xs mb-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-center">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#F52D56] to-purple-600 text-white flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl rounded-tl-xs text-xs text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F52D56] animate-ping" />
                <span>AI is finding best deals & suggestions...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Poochiye: e.g. Best boAt earphones under 2000 ya aaj ke offers..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F52D56] transition-all"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-2xl bg-[#F52D56] hover:bg-[#D82C4A] text-white disabled:opacity-40 transition-colors shadow-sm cursor-pointer shrink-0"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
