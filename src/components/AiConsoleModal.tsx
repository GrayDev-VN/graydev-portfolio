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
  "Tóm tắt kinh nghiệm và thế mạnh của Gray Nguyen?",
  "Kiến trúc BigQuery Banking DWH hoạt động ra sao?",
  "Gray định hướng kết hợp AI Backend và Java Spring Boot như thế nào?",
  "Kinh nghiệm IT Audit tại Deloitte Vietnam có gì nổi bật?",
];

export default function AiConsoleModal({ isOpen, onClose }: AiConsoleModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "GrayDev AI Terminal v2.4 initialized. Model: GrayLLM-Inference-Engine (RAG). Ready for queries regarding Gray Nguyen's projects, AI Backend stack, Java Spring Boot architecture, and Deloitte IT Audit experience.",
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
      return `### Hồ Sơ & Thế Mạnh của Gray Nguyen (GrayDev):
- **Vị trí & Mục tiêu:** AI Backend Engineer & Distributed Systems Engineer.
- **Học vấn:** Sinh viên chuyên ngành Data Engineering tại HCM-UTE (GPA: 8.41).
- **Kinh nghiệm thực chiến:**
  1. **Deloitte Vietnam (Audit & Assurance):** Đánh giá ITGC (User Access, Change Management, ITIL), SOX 404, dùng SQL phân tích dữ liệu kiểm toán hệ thống ngân hàng.
  2. **Freelance System Planner & BA:** Thiết kế 14 BRDs, 32 UML Flowcharts, kiến trúc ERD chuẩn 3NF và API contracts.
  3. **Giảng viên phòng Lab ĐH:** Đào tạo 120+ sinh viên về tối ưu truy vấn SQL, PostgreSQL, Python pipelines.
- **Điểm mạnh cốt lõi:** Kết hợp tư duy hệ thống chặt chẽ (IT Audit / Governance) với kỹ năng lập trình AI Backend (Python/LLM) và hệ thống doanh nghiệp (Java Spring Boot).`;
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

    if (q.includes("spring boot") || q.includes("java") || q.includes("ai backend") || q.includes("kết hợp")) {
      return `### Chiến Lược Kết Hợp AI Backend & Java Spring Boot:
- **Tầng Doanh Nghiệp (Java Spring Boot):** 
  - Đảm nhận Gateway, Auth (OAuth2 / JWT), Rate Limiting, Audit Logging (ITGC compliant).
  - Xử lý các nghiệp vụ nghiệp vụ nặng về concurrency, giao dịch ACID và tích hợp cơ sở dữ liệu quan hệ (PostgreSQL).
- **Tầng AI Service (Python FastAPI / PyTorch / vLLM):**
  - Chuyên phục vụ suy luận mô hình AI (Model Serving), RAG pipeline, và cache nén KV (TurboQuant).
  - Giao tiếp với Spring Boot thông qua gRPC hoặc RESTful Streaming để đạt độ trễ thấp nhất.
- **Giao diện (Next.js):** 
  - Đóng vai trò Client tiêu thụ API từ cả hai service, render tĩnh siêu nhanh và tương thích hoàn hảo khi deploy trên GitHub Pages / Vercel.`;
    }

    if (q.includes("deloitte") || q.includes("itgc") || q.includes("audit") || q.includes("kiểm toán")) {
      return `### Kinh Nghiệm IT Audit tại Deloitte Vietnam:
- **Khối ngành:** Audit & Assurance, phục vụ danh mục khách hàng Ngân hàng & Tài chính hàng đầu.
- **Nhiệm vụ chính:**
  - Kiểm tra IT General Controls (ITGC): Quản lý phân quyền truy cập (Logical Access), quy trình thay đổi mã nguồn/phát hành (Change Management ITIL), và vận hành sao lưu (IT Operations).
  - Phân tích và kiểm thử Application Controls trên các hệ thống Core Banking.
  - Viết câu lệnh SQL substantive audit trên tập dữ liệu hàng triệu giao dịch ngân hàng để bảo đảm tính toàn vẹn (Completeness & Accuracy).`;
    }

    return `Cảm ơn bạn đã hỏi! Gray Nguyen (GrayDev) chuyên sâu về:
1. **AI Backend & LLM Inference:** Tối ưu hóa bộ nhớ GPU, RAG, PyTorch, FastAPI.
2. **Java Spring Boot:** Xây dựng Microservices chịu tải cao, chuẩn kiến trúc sạch.
3. **Big Data & DWH:** Google BigQuery, Apache Spark, MinIO Medallion Lakehouse.
4. **ITGC & Audit:** Đảm bảo hệ thống đạt chuẩn kiểm soát nội bộ và an ninh dữ liệu.

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
      <div className="w-full max-w-3xl bg-[#0a0e17] border border-[#1e293b] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col h-[620px] overflow-hidden relative">
        {/* Modal Terminal Header */}
        <div className="px-5 py-3.5 bg-[#181b25] border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono-code text-xs text-white">
            <Bot className="w-4 h-4 text-[#9ee939]" />
            <span className="font-bold">GrayDev AI Console</span>
            <span className="text-[#64748b]">[LLM-Inference-Engine // v2.4]</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-1.5 rounded bg-[#0f131c] border border-[#262a34] text-[#94a3b8] hover:text-white"
              title="Reset Session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded bg-[#0f131c] border border-[#262a34] text-[#94a3b8] hover:text-white"
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
                  ? "items-start text-[#64748b]"
                  : "items-start text-[#dfe2ef]"
              }`}
            >
              <div className="flex items-center gap-2 text-[10px] text-[#64748b]">
                <span className="uppercase font-bold text-[#9ee939]">
                  {m.role === "user" ? "USER" : m.role === "system" ? "KERNEL" : "GRAYDEV-AI"}
                </span>
                <span>{m.timestamp}</span>
              </div>

              <div
                className={`p-3.5 rounded-lg max-w-[90%] whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#1e293b] text-white border border-[#31353f]"
                    : m.role === "system"
                    ? "bg-[#0f131c] text-[#8b947d] border border-[#1e293b] w-full"
                    : "bg-[#131b2c] text-[#dfe2ef] border border-[#26354d]"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-[#9ee939] font-mono-code text-xs">
              <span className="w-2 h-2 rounded-full bg-[#9ee939] animate-ping"></span>
              <span>Evaluating query vector &amp; streaming response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Buttons */}
        <div className="px-4 py-2.5 bg-[#0f131c] border-t border-[#1e293b] flex gap-2 overflow-x-auto text-[11px] font-mono-code">
          {PRESET_QUERIES.map((preset, i) => (
            <button
              key={i}
              onClick={() => handleSend(preset)}
              className="px-3 py-1 rounded bg-[#181b25] border border-[#262a34] text-[#94a3b8] hover:text-[#9ee939] hover:border-[#9ee939]/40 whitespace-nowrap transition-all shrink-0"
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
          className="p-3 bg-[#181b25] border-t border-[#1e293b] flex items-center gap-2"
        >
          <span className="text-[#9ee939] font-mono-code font-bold pl-2">&gt;</span>
          <input
            type="text"
            placeholder="Type query or command for GrayDev AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-transparent text-white font-mono-code text-xs focus:outline-none placeholder:text-[#64748b]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#9ee939] hover:bg-[#acf847] text-[#0a0e17] font-mono-code text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <span>SEND</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
