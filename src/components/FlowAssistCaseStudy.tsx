"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";

export default function FlowAssistCaseStudy() {
  const { t } = useLocale();
  const panel = "rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 sm:p-8";
  return <div className="max-w-5xl mx-auto py-10 sm:py-16 space-y-8">
    <Link href="/projects" className="text-sm text-indigo-300">← {t("All projects", "Tất cả dự án")}</Link>
    <header className="py-5">
      <p className="text-indigo-400 text-xs font-mono tracking-[0.2em] mb-4">CASE STUDY / APPLIED AI</p>
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">FlowAssist Chatbot</h1>
      <p className="mt-6 text-lg leading-8 text-slate-300 max-w-3xl">{t("Turning business documents into a searchable knowledge assistant, from ingestion and retrieval to an API deployed on AWS EC2.", "Biến tài liệu doanh nghiệp thành trợ lý tra cứu kiến thức, từ xử lý dữ liệu và truy xuất đến API triển khai trên AWS EC2.")}</p>
      <div className="flex flex-wrap gap-2 mt-6">{["Python", "FastAPI", "RAG", "TiDB Vector", "Redis", "MinIO", "AWS EC2"].map(tag => <span key={tag} className="rounded-md bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300">{tag}</span>)}</div>
      <div className="mt-8 flex flex-wrap gap-4"><a href="https://github.com/GrayNguyen-Data/FlowAssist-Chatbot" target="_blank" rel="noreferrer" className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500">{t("Explore source code", "Xem mã nguồn")} ↗</a><Link href="/#contact" className="rounded-xl border border-slate-700 px-5 py-3">{t("Discuss this project", "Trao đổi về dự án")}</Link></div>
    </header>
    <div className="grid md:grid-cols-2 gap-5">
      <section className={panel}><h2 className="text-xl font-bold mb-4">{t("The problem", "Bài toán")}</h2><p className="text-slate-400 leading-7">{t("Business knowledge lives across documents. A useful assistant needs to find relevant passages before generating an answer, instead of relying only on general model knowledge.", "Kiến thức doanh nghiệp nằm rải rác trong tài liệu. Trợ lý cần tìm được đoạn thông tin liên quan trước khi tạo câu trả lời, thay vì chỉ dựa vào kiến thức tổng quát của mô hình.")}</p></section>
      <section className={panel}><h2 className="text-xl font-bold mb-4">{t("My contribution", "Phần mình thực hiện")}</h2><p className="text-slate-400 leading-7">{t("Built the RAG pipeline and FastAPI services, tuned chunking and retrieval thresholds, integrated storage and caching, and deployed the system on EC2. This scope is documented in my October 2026 CV.", "Xây dựng pipeline RAG và dịch vụ FastAPI, điều chỉnh chia đoạn và ngưỡng truy xuất, tích hợp lưu trữ và cache, triển khai trên EC2. Phạm vi này được ghi trong CV tháng 10/2026.")}</p></section>
    </div>
    <section className={panel}>
      <h2 className="text-2xl font-bold mb-6">{t("How data moves", "Luồng xử lý")}</h2>
      <p className="text-sm text-slate-400 mb-4">{t("Document ingestion", "Nạp tài liệu")}</p>
      <ol className="grid sm:grid-cols-4 gap-3">{[t("Upload → MinIO", "Tải tài liệu → MinIO"), t("Extract & chunk", "Trích xuất & chia đoạn"), "Embeddings", "TiDB Vector"].map((step, i) => <li key={step} className="rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-4"><span className="text-xs text-indigo-400 font-mono">0{i + 1}</span><p className="mt-2 text-sm">{step}</p></li>)}</ol>
      <p className="text-sm text-slate-400 mt-6 mb-4">{t("Answer generation", "Tạo câu trả lời")}</p>
      <ol className="grid sm:grid-cols-4 gap-3">{[t("Question → FastAPI", "Câu hỏi → FastAPI"), t("Retrieve context", "Truy xuất ngữ cảnh"), t("Prompt + Redis memory", "Prompt + bộ nhớ Redis"), t("Groq LLM → answer", "Groq LLM → câu trả lời")].map((step, i) => <li key={step} className="rounded-xl border border-sky-500/25 bg-sky-500/5 p-4"><span className="text-xs text-sky-400 font-mono">0{i + 1}</span><p className="mt-2 text-sm">{step}</p></li>)}</ol>
    </section>
    <section className={panel}><h2 className="text-2xl font-bold mb-6">{t("Engineering considerations", "Các điểm cần cân nhắc khi thiết kế")}</h2><div className="space-y-6">
      {[
        [t("Retrieval before generation", "Truy xuất trước khi sinh câu trả lời"), t("Retrieved passages provide document-specific context. Answer quality still depends on retrieving the right evidence; RAG does not guarantee correctness.", "Các đoạn truy xuất cung cấp ngữ cảnh riêng của tài liệu. Chất lượng vẫn phụ thuộc việc tìm đúng bằng chứng; RAG không tự bảo đảm câu trả lời đúng.")],
        [t("Chunking and thresholds", "Chia đoạn và ngưỡng truy xuất"), t("Smaller chunks can be precise but lose context; larger chunks preserve context but add noise. Tuning these settings is part of the implementation documented in the CV.", "Đoạn nhỏ có thể chính xác nhưng mất ngữ cảnh; đoạn lớn giữ ngữ cảnh nhưng dễ thêm nhiễu. Điều chỉnh các tham số này là một phần triển khai được ghi trong CV.")],
        [t("Separate storage responsibilities", "Tách trách nhiệm lưu trữ"), t("MinIO holds documents, TiDB supports vector retrieval, and Redis supports conversational context and caching. Each layer needs its own lifecycle and failure handling.", "MinIO lưu tài liệu, TiDB hỗ trợ truy xuất vector, Redis phục vụ ngữ cảnh hội thoại và cache. Mỗi lớp cần vòng đời dữ liệu và cách xử lý lỗi riêng.")],
      ].map(([title, body]) => <div key={title}><h3 className="font-semibold text-indigo-200 mb-2">{title}</h3><p className="text-slate-400 leading-7">{body}</p></div>)}</div></section>
    <section className={panel}><h2 className="text-2xl font-bold mb-4">{t("Delivered scope and next validation", "Phạm vi đã làm và hướng kiểm chứng tiếp")}</h2><p className="text-slate-400 leading-7">{t("The CV records an end-to-end implementation and deployment on EC2. Source code is available for review. No public latency, accuracy benchmark or active demo is claimed here.", "CV ghi nhận việc triển khai xuyên suốt và đưa hệ thống lên EC2. Có thể xem mã nguồn để đối chiếu cách thực hiện. Trang này chưa công bố số đo độ trễ, độ chính xác hoặc demo đang hoạt động.")}</p><p className="text-slate-400 leading-7 mt-4">{t("Next validation: build representative questions, measure retrieval and grounded-answer quality separately, and track latency, cost and failures.", "Hướng kiểm chứng tiếp: tạo bộ câu hỏi đại diện, đo riêng chất lượng truy xuất và mức độ câu trả lời bám tài liệu, theo dõi độ trễ, chi phí và các trường hợp lỗi.")}</p></section>
    <p className="text-sm text-slate-500">{t("Source: CV dated 31 October 2026.", "Nguồn: CV ngày 31/10/2026.")} <a href="/cv/Nguyen-Duc-Toan-CV.pdf" className="text-indigo-300 underline" target="_blank" rel="noreferrer">{t("View CV", "Xem CV")}</a></p>
  </div>;
}
