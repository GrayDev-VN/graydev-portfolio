"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Terminal, Sparkles, CornerDownLeft, RotateCcw } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

interface AiConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: string;
}

const PRESET_QUERIES = [
  "Tóm tắt kinh nghiệm của Gray Nguyen?",
  "Kiến trúc BigQuery Banking DWH hoạt động ra sao?",
  "Gray đã làm AI Teaching Assistant ở đâu?",
  "Gray có những kinh nghiệm AWS và AI Developer nào?",
];

export default function AiConsoleModal({ isOpen, onClose }: AiConsoleModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "GrayDev AI Terminal v2.4 initialized. Ready for queries about Gray Nguyen's AI Teaching Assistant, AWS Intern, and SOFTWORLD AI Developer experience.",
      timestamp: "SYS_READY",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("tóm tắt") || q.includes("kinh nghiệm") || q.includes("gray nguyen") || q.includes("thế mạnh")) {
      return `### Hồ sơ & Kinh nghiệm của Gray Nguyen (Nguyên Đức Toàn):
- AI Teaching Assistant.
- AWS Intern.
- AI Developer tại SOFTWORLD.

Các mốc thời gian và mô tả công việc chi tiết chưa được cung cấp.`;
    }

    if (q.includes("bigquery") || q.includes("banking") || q.includes("dwh") || q.includes("ngân hàng")) {
      return `### Kiến Trúc Nền Tảng Phân Tích Tài Chính Ngân Hàng (2003–2024):
- **Dữ liệu:** Thu thập và làm sạch 28,490+ bản ghi từ 31 ngân hàng thương mại Việt Nam (SOCB & JSCB).
- **Kho dữ liệu (DWH):** Thiết kế Star Schema trên Google BigQuery với các bảng Fact_Financials, Dim_Bank, Dim_Macroeconomy; tự động xử lý SCD Type 2.
- **Tối ưu hóa:** Partition theo \`(report_year, bank_code)\` giúp giảm 75% chi phí truy vấn BigQuery.
- **Machine Learning:** 
  - Mô hình phân cụm K-Means (k=4) nhận diện hồ sơ rủi ro nợ xấu (NPL).
  - Thuật toán Random Forest đạt độ chính xác **91.4%** trong dự báo cảnh báo sớm áp lực thanh khoản.`;
    }

    if (q.includes("assistant") || q.includes("teaching") || q.includes("trợ giảng")) {
      return "Gray Nguyen (Nguyên Đức Toàn) có kinh nghiệm làm AI Teaching Assistant. Thông tin về đơn vị và thời gian chưa được cung cấp.";
    }

    if (q.includes("aws") || q.includes("softworld") || q.includes("developer")) {
      return "Gray Nguyen (Nguyên Đức Toàn) từng làm AWS Intern và hiện có kinh nghiệm AI Developer tại SOFTWORLD. Thông tin chi tiết về nhiệm vụ và thời gian chưa được cung cấp.";
    }

    if (q.includes("spring boot") || q.includes("java") || q.includes("ai backend") || q.includes("kết hợp")) {
      return "Các thông tin hiện có chỉ xác nhận kinh nghiệm AI Teaching Assistant, AWS Intern và AI Developer tại SOFTWORLD; chưa có chi tiết về Java hoặc AI backend.";
    }

    if (q.includes("deloitte") || q.includes("itgc") || q.includes("audit") || q.includes("kiểm toán")) {
      return "Kinh nghiệm đã xác nhận của Gray Nguyen là AI Teaching Assistant, AWS Intern và AI Developer tại SOFTWORLD. Hiện chưa có thông tin về IT Audit.";
    }

    return `Cảm ơn bạn đã hỏi! Kinh nghiệm đã xác nhận của Gray Nguyen (Nguyên Đức Toàn) gồm:
1. **AI Teaching Assistant**
2. **AWS Intern**
3. **AI Developer tại SOFTWORLD**

Bạn có thể thử các câu hỏi gợi ý bên dưới hoặc gửi tin nhắn liên hệ trực tiếp cho Gray qua email: \`${PORTFOLIO_DATA.profile.email}\`!`;
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAnswer(query);
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleReset = () => {
    setMessages([
      {
        role: "system",
        content: "Terminal session reset. Ready for new queries.",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#080510] border border-[#30233f] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col h-[620px] overflow-hidden relative">
        {/* Modal Terminal Header */}
        <div className="px-5 py-3.5 bg-[#110d1c] border-b border-[#30233f] flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono-code text-xs text-white">
            <Bot className="w-4 h-4 text-[#a78bfa]" />
            <span className="font-bold">GrayDev AI Console</span>
            <span className="text-[#766b8e]">[LLM-Inference-Engine // v2.4]</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-1.5 rounded bg-[#0b0814] border border-[#241a32] text-[#b5aec7] hover:text-white"
              title="Reset Session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded bg-[#0b0814] border border-[#241a32] text-[#b5aec7] hover:text-white"
              title="Close Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto font-mono-code text-xs space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col space-y-1 ${
                m.role === "user"
                  ? "items-end"
                  : m.role === "system"
                  ? "items-start text-[#766b8e]"
                  : "items-start text-[#f1edfa]"
              }`}
            >
              <div className="flex items-center gap-2 text-[10px] text-[#766b8e]">
                <span className="uppercase font-bold text-[#a78bfa]">
                  {m.role === "user" ? "USER" : m.role === "system" ? "KERNEL" : "GRAYDEV-AI"}
                </span>
                <span>{m.timestamp}</span>
              </div>

              <div
                className={`p-3.5 rounded-lg max-w-[90%] whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#30233f] text-white border border-[#30233f]"
                    : m.role === "system"
                    ? "bg-[#0b0814] text-[#938aa6] border border-[#30233f] w-full"
                    : "bg-[#171026] text-[#f1edfa] border border-[#352a45]"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-[#a78bfa] font-mono-code text-xs">
              <span className="w-2 h-2 rounded-full bg-[#a78bfa] animate-ping"></span>
              <span>Evaluating query vector &amp; streaming response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Buttons */}
        <div className="px-4 py-2.5 bg-[#0b0814] border-t border-[#30233f] flex gap-2 overflow-x-auto text-[11px] font-mono-code">
          {PRESET_QUERIES.map((preset, i) => (
            <button
              key={i}
              onClick={() => handleSend(preset)}
              className="px-3 py-1 rounded bg-[#110d1c] border border-[#241a32] text-[#b5aec7] hover:text-[#a78bfa] hover:border-[#a78bfa]/40 whitespace-nowrap transition-all shrink-0"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Terminal Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-[#110d1c] border-t border-[#30233f] flex items-center gap-2"
        >
          <span className="text-[#a78bfa] font-mono-code font-bold pl-2">&gt;</span>
          <input
            type="text"
            placeholder="Type query or command for GrayDev AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-transparent text-white font-mono-code text-xs focus:outline-none placeholder:text-[#766b8e]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#080510] font-mono-code text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <span>SEND</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
