// ============================================================
// PORTFOLIO DATA — Gray Nguyen (Nguyễn Đức Toàn)
// AI Backend Engineer | AI Developer @ SOFTWORLD | Cloud
// ============================================================

// IMPORTANT:
// - Keep career responsibilities factual and update them to match
//   your actual work at SOFTWORLD.
// - Replace placeholder GitHub URLs with each project's real repo.
// - Mark credentials as "earned" only after verifying them.
// - Project status must reflect the actual implementation state.

export type ProjectStatus = "completed" | "in-progress" | "planned";
export type CredentialStatus = "earned" | "in-progress" | "planned";

export interface CareerRole {
  category: string;
  categoryVi?: string;
  company: string;
  division: string;
  divisionVi?: string;
  role: string;
  roleVi?: string;
  period?: string;
  periodVi?: string;
  location?: string;
  locationVi?: string;
  scope?: string;
  scopeVi?: string;
  statusBadge: string;
  statusBadgeVi?: string;
  description: string;
  descriptionVi?: string;
  responsibilities: string[];
  responsibilitiesVi?: string[];
  skills: string[];
  frameworkScore?: {
    name: string;
    percentage: number;
    scoreLabel: string;
  };
}

export interface Project {
  id: string;
  category: string;
  categoryVi?: string;
  domain: string;
  domainVi?: string;
  title: string;
  titleVi?: string;
  summary: string;
  summaryVi?: string;
  highlights: string[];
  highlightsVi?: string[];
  tags: string[];
  githubUrl: string;
  isFeatured?: boolean;
  status: ProjectStatus;
}

export interface TraceLog {
  type: string;
  message: string;
  messageVi?: string;
}

export interface Credential {
  id: string;
  category: "aws" | "google" | "industry" | "award" | "academic";
  title: string;
  issuer: string;
  badgeType: string;
  hours?: string;
  verifiedId?: string;
  year: string;
  date: string;
  credlyUrl?: string;
  status: CredentialStatus;
}

export interface LearningGoal {
  id: string;
  category: "backend" | "ai" | "cloud";
  title: string;
  priority: "high" | "medium" | "long-term";
  topics: string[];
  targetOutcome: string;
}

export const PORTFOLIO_DATA = {
  profile: {
    name: "Gray Nguyen",
    handle: "GrayDev",
    realName: "Nguyễn Đức Toàn",
    title: "AI Backend Engineer",
    tagline:
      "AI Developer at SOFTWORLD | Backend Engineering | Cloud-Native AI",
    bio:
      "AI developer focused on building software systems that integrate " +
      "AI capabilities, backend services, and cloud technologies. Interested " +
      "in LLM applications, reliable APIs, and scalable cloud-native architecture.",
    email: "ndtoan.work@gmail.com",
    github: "https://github.com/GrayDev-VN",
    linkedin: "https://www.linkedin.com/in/ndtoanwork/",
    university: "HCM-UTE",
    currentRole: "AI Developer @ SOFTWORLD",
    location: "Ho Chi Minh City, Vietnam",
    certsCount: "7+",
  },

  keySignals: [
    {
      value: "AI",
      label: "PROFESSIONAL EXPERIENCE",
      labelVi: "KINH NGHIỆM THỰC TẾ",
      highlight: "AI Developer at SOFTWORLD",
    },
    {
      value: "BE",
      label: "ENGINEERING FOCUS",
      labelVi: "TRỌNG TÂM KỸ THUẬT",
      highlight: "Backend systems and API development",
    },
    {
      value: "LLM",
      label: "AI INTEREST",
      labelVi: "ĐỊNH HƯỚNG AI",
      highlight: "RAG and AI-powered applications",
    },
    {
      value: "AWS",
      label: "CLOUD DIRECTION",
      labelVi: "ĐỊNH HƯỚNG CLOUD",
      highlight: "Cloud infrastructure and deployment",
    },
  ],

  securityScopes: [
    {
      title: "AI Development",
      titleVi: "Phát triển AI",
      desc: "AI-powered software applications",
    },
    {
      title: "Backend Engineering",
      titleVi: "Kỹ thuật Backend",
      desc: "APIs, services, and data integration",
    },
    {
      title: "Cloud Engineering",
      titleVi: "Kỹ thuật Cloud",
      desc: "AWS fundamentals and cloud-native systems",
    },
  ],

  traceLogs: [
    {
      type: "AI",
      message: "AI development profile loaded.",
      messageVi: "Đã tải hồ sơ phát triển AI.",
    },
    {
      type: "BACKEND",
      message: "Backend engineering focus loaded.",
      messageVi: "Đã tải định hướng kỹ thuật backend.",
    },
    {
      type: "CLOUD",
      message: "Cloud learning roadmap loaded.",
      messageVi: "Đã tải lộ trình học cloud.",
    },
  ] as TraceLog[],

  // Update period, location, and responsibilities with verified details.
  career: [
    {
      category: "ARTIFICIAL INTELLIGENCE",
      categoryVi: "TRÍ TUỆ NHÂN TẠO",
      company: "SOFTWORLD",
      division: "AI Engineering & Solutions",
      divisionVi: "Kỹ thuật & Giải pháp AI",
      role: "AI Developer",
      roleVi: "Lập trình viên AI",
      scope: "AI application development & scalable backend services",
      statusBadge: "PROFESSIONAL EXPERIENCE",
      statusBadgeVi: "KINH NGHIỆM CHUYÊN NGHIỆP",
      description:
        "Developing production-ready AI-powered software, LLM retrieval pipelines, and backend APIs. Focusing on system reliability, clean domain boundaries, and high-performance integration.",
      descriptionVi:
        "Phát triển phần mềm ứng dụng AI thực tế, pipeline truy xuất LLM và các dịch vụ backend hiệu năng cao. Tập trung vào tính ổn định của hệ thống, thiết kế ranh giới kiến trúc sạch và tích hợp mượt mà.",
      responsibilities: [
        "Develop and deploy production-grade AI applications, conversational agents, and RESTful APIs.",
        "Implement Retrieval-Augmented Generation (RAG) pipelines with vector databases and semantic search.",
        "Design robust backend database schemas and optimize system response latency under concurrent traffic.",
      ],
      responsibilitiesVi: [
        "Phát triển và triển khai ứng dụng AI, trợ lý ảo thông minh và hệ thống API RESTful phục vụ sản phẩm.",
        "Xây dựng pipeline RAG kết hợp cơ sở dữ liệu vector và tìm kiếm ngữ nghĩa chính xác.",
        "Thiết kế lược đồ cơ sở dữ liệu bền vững và tối ưu hóa độ trễ xử lý dưới lưu lượng truy cập cao.",
      ],
      skills: [
        "Python",
        "FastAPI",
        "PyTorch",
        "LangChain",
        "Docker",
        "PostgreSQL",
        "Redis",
        "Git",
        "REST APIs",
      ],
    },
    {
      category: "CLOUD INFRASTRUCTURE",
      categoryVi: "ĐIỆN TOÁN ĐÁM MÂY",
      company: "Amazon Web Services (AWS)",
      division: "Cloud Architecture & Solutions",
      divisionVi: "Kiến trúc & Giải pháp Cloud",
      role: "AWS Cloud Intern",
      roleVi: "Thực tập sinh Điện toán Đám mây AWS",
      scope: "Cloud infrastructure, serverless pipelines & security",
      statusBadge: "INTERNSHIP PROGRAM",
      statusBadgeVi: "CHƯƠNG TRÌNH THỰC TẬP",
      description:
        "Hands-on immersion in AWS cloud native architecture, automated ETL pipelines, serverless workflows, and IAM security controls.",
      descriptionVi:
        "Rèn luyện thực chiến về kiến trúc điện toán đám mây AWS, xây dựng pipeline ETL tự động, quy trình serverless và cấu hình bảo mật IAM tối ưu chi phí.",
      responsibilities: [
        "Architect serverless data ingestion pipelines using AWS Lambda, Amazon S3, and Amazon RDS.",
        "Configure automated event orchestration with Amazon EventBridge, CloudWatch metrics, and SNS alerts.",
        "Apply AWS Well-Architected Framework principles, IAM least-privilege access, and VPC networking.",
      ],
      responsibilitiesVi: [
        "Thiết kế pipeline nạp và xử lý dữ liệu serverless kết hợp AWS Lambda, Amazon S3 và Amazon RDS PostgreSQL.",
        "Cấu hình tự động hóa lịch chạy với EventBridge (cron), giám sát CloudWatch và gửi cảnh báo SNS.",
        "Áp dụng nguyên tắc AWS Well-Architected, phân quyền IAM tối thiểu và thiết lập mạng VPC an toàn.",
      ],
      skills: [
        "AWS S3",
        "AWS Lambda",
        "Amazon RDS",
        "EventBridge",
        "CloudWatch",
        "IAM",
        "Serverless",
        "Python",
        "PostgreSQL",
      ],
    },
    {
      category: "ACADEMIA & EDUCATION",
      categoryVi: "NGHIÊN CỨU & GIẢNG DẠY",
      company: "HCM-UTE",
      division: "Faculty of Information Technology",
      divisionVi: "Khoa Công nghệ Thông tin",
      role: "AI Teaching Assistant",
      roleVi: "Trợ giảng Trí tuệ Nhân tạo",
      scope: "AI tutoring, machine learning lab facilitation & student mentorship",
      statusBadge: "ACADEMIC APPOINTMENT",
      statusBadgeVi: "VAI TRÒ HỌC THUẬT",
      description:
        "Assisting university professors in instructional delivery of Artificial Intelligence, Machine Learning algorithms, and software engineering coursework.",
      descriptionVi:
        "Hỗ trợ giảng viên hướng dẫn môn Trí tuệ nhân tạo, giải thuật học máy và lập trình hướng đối tượng cho sinh viên khoa Công nghệ thông tin.",
      responsibilities: [
        "Guide students through practical laboratory experiments in Python, Machine Learning, and Deep Neural Networks.",
        "Facilitate code reviews, debug student implementations, and conduct hands-on algorithm workshops.",
        "Evaluate academic coursework and provide constructive feedback on software design patterns.",
      ],
      responsibilitiesVi: [
        "Hướng dẫn sinh viên thực hành lập trình Python, mô hình Machine Learning và mạng nơ-ron nhân tạo.",
        "Review mã nguồn, gỡ lỗi bài tập lớn và tổ chức các buổi trao đổi giải thuật thực chiến.",
        "Đánh giá đồ án môn học và hướng dẫn sinh viên áp dụng các mẫu thiết kế phần mềm chuẩn mực.",
      ],
      skills: [
        "Machine Learning",
        "Deep Learning",
        "Python",
        "Java",
        "Data Structures",
        "Algorithms",
        "Git",
        "OOP",
      ],
    },
  ] as CareerRole[],

  projects: [
    {
      id: "banking-app",
      category: "FINTECH & AWS CLOUD ARCHITECTURE",
      categoryVi: "FINTECH & KIẾN TRÚC AWS CLOUD",
      domain: "Fintech Core Banking • AWS Cloud Data Platform (~1.26M Tx)",
      domainVi: "Ngân hàng Lõi • Kho Dữ liệu AWS Cloud (~1.26M Giao dịch)",
      title: "Next-Gen Digital Banking Core & AWS Cloud Data Platform",
      titleVi: "Hệ thống Ngân hàng Số & Nền tảng Dữ liệu AWS Cloud",
      summary:
        "An end-to-end cloud banking data warehouse and transaction analytics platform: processing ~1.26M Kaggle banking records, AWS S3 raw storage, 4-stage Python Lambda ETL, 3-tier RDS PostgreSQL schemas, and Power BI dashboards.",
      summaryVi:
        "Nền tảng kho dữ liệu ngân hàng và phân tích giao dịch toàn diện trên AWS Cloud: Xử lý ~1.26 triệu bản ghi giao dịch ngân hàng, lưu trữ Amazon S3, 4 bước ETL tự động với AWS Lambda (Python), cơ sở dữ liệu Amazon RDS PostgreSQL 3 phân tầng (Staging, Warehouse, Marts) và báo cáo Microsoft Power BI.",
      highlights: [
        "4-Stage AWS Lambda ETL pipeline: ingest S3, clean staging, build star-schema warehouse, and aggregate analytical marts.",
        "Amazon RDS PostgreSQL with 3-tier schema architecture: staging tables, dimensional warehouse (dims/facts), and analytical data marts.",
        "Serverless orchestration via Amazon EventBridge cron schedules, CloudWatch logging & metrics, and SNS alert notifications.",
        "Power BI integration directly querying RDS mart schema for credit risk monitoring, customer 360, and branch performance.",
        "Double-entry bookkeeping transaction engine design with Redis distributed locking and idempotent API boundaries.",
      ],
      highlightsVi: [
        "Pipeline ETL 4 bước với AWS Lambda: nạp dữ liệu S3, làm sạch staging, dựng kho star-schema và tổng hợp data marts.",
        "Cơ sở dữ liệu Amazon RDS PostgreSQL 3 phân tầng: staging tables, dimensional warehouse (facts/dims), và analytical marts.",
        "Điều phối serverless tự động với Amazon EventBridge (cron), giám sát CloudWatch và gửi cảnh báo qua Amazon SNS.",
        "Kết nối Microsoft Power BI trực tiếp vào schema mart phục vụ phân tích rủi ro tín dụng, Customer 360 và hiệu suất chi nhánh.",
        "Thiết kế sổ cái kép kế toán (double-entry ledger) kết hợp distributed locking Redis và API idempotent.",
      ],
      tags: [
        "AWS S3",
        "AWS Lambda",
        "PostgreSQL",
        "Power BI",
        "EventBridge",
        "Python",
        "CloudWatch",
        "Redis",
        "Fintech",
      ],
      githubUrl: "https://github.com/GrayDev-VN",
      isFeatured: true,
      status: "in-progress",
    },
    {
      id: "goutms",
      category: "HEALTHCARE AI / FULLSTACK",
      categoryVi: "AI Y TẾ / FULLSTACK",
      domain: "Clinical Tracking • Purine Diet Engine",
      domainVi: "Theo dõi Lâm sàng • Kiểm soát Purin Dinh dưỡng",
      title: "GoutMS — Smart Gout Management & Clinical Nutrition System",
      titleVi: "GoutMS — Hệ thống Quản lý & Hỗ trợ Điều trị Bệnh Gút Thông minh",
      summary:
        "A dedicated clinical and dietary assistance system for hyperuricemia and gout patients, tracking serum uric acid trends and providing AI purine nutrition evaluation.",
      summaryVi:
        "Hệ thống chuyên sâu hỗ trợ bệnh nhân gút và tăng axit uric máu: theo dõi chuỗi thời gian nồng độ axit uric, cảnh báo nguy cơ bùng phát cơn gút và trợ lý AI đánh giá thực đơn purin an toàn.",
      highlights: [
        "Longitudinal uric acid monitoring with automated threshold alerts and flare-up risk forecasting.",
        "Comprehensive food purine database with nutritional danger scoring and meal recommendations.",
        "High-performance REST API backend built with Python FastAPI and PostgreSQL time-series indexing.",
        "RAG-powered clinical consultation assistant grounded on ACR and EULAR gout treatment guidelines.",
      ],
      highlightsVi: [
        "Theo dõi chuỗi thời gian nồng độ axit uric máu, cảnh báo ngưỡng nguy hiểm và dự báo cơn gút cấp.",
        "Cơ sở dữ liệu định lượng purin thực phẩm với thang đo nguy cơ và gợi ý thực đơn an toàn.",
        "Backend REST API hiệu năng cao với Python FastAPI và cơ sở dữ liệu chuỗi thời gian PostgreSQL.",
        "Trợ lý AI tra cứu lâm sàng (RAG) tham chiếu chuẩn phác đồ quốc tế ACR và EULAR.",
      ],
      tags: [
        "Python",
        "FastAPI",
        "PostgreSQL",
        "RAG",
        "AI Health Assistant",
        "TimescaleDB",
        "Docker",
      ],
      githubUrl: "https://github.com/GrayDev-VN",
      isFeatured: false,
      status: "in-progress",
    },
    {
      id: "flowassist-chatbot",
      category: "AI BACKEND ENGINEERING",
      categoryVi: "KỸ THUẬT BACKEND AI",
      domain: "LLM / RAG / Vector Search",
      domainVi: "LLM / RAG / Tìm kiếm Vector",
      title: "FlowAssist Chatbot",
      titleVi: "FlowAssist Chatbot",
      summary:
        "A document-aware AI chatbot combining backend APIs, multilingual embeddings, vector retrieval, conversation memory, and LLM integrations.",
      summaryVi:
        "Trợ lý AI thông minh xử lý tài liệu đa định dạng kết hợp API backend, vector embedding đa ngữ, bộ nhớ ngữ cảnh hội thoại và tích hợp LLM.",
      highlights: [
        "FastAPI backend for chatbot and document-processing workflows.",
        "TiDB vector search with multilingual-e5-small embeddings.",
        "Redis-based conversation memory.",
        "PDF and DOCX ingestion with Groq and Ollama integrations.",
      ],
      highlightsVi: [
        "Backend FastAPI điều phối quy trình chatbot và xử lý văn bản.",
        "Tìm kiếm vector trên TiDB với mô hình embedding multilingual-e5-small.",
        "Bộ nhớ ngữ cảnh đàm thoại lưu trữ trên Redis tốc độ cao.",
        "Trích xuất văn bản PDF/DOCX tích hợp Groq và Ollama.",
      ],
      tags: [
        "Python",
        "FastAPI",
        "RAG",
        "TiDB",
        "Redis",
        "LLM",
        "Embeddings",
      ],
      githubUrl: "https://github.com/GrayDev-VN",
      isFeatured: false,
      status: "in-progress",
    },
    {
      id: "yhct-knowledge-graph",
      category: "AI RESEARCH",
      categoryVi: "NGHIÊN CỨU AI",
      domain: "Knowledge Graph / Retrieval",
      domainVi: "Đồ thị Tri thức / Truy xuất",
      title: "YHCT Knowledge Graph Chatbot",
      titleVi: "YHCT Knowledge Graph Chatbot",
      summary:
        "A traditional medicine question-answering research project combining structured knowledge relationships with semantic retrieval.",
      summaryVi:
        "Dự án nghiên cứu hỏi đáp Y học cổ truyền kết hợp cấu trúc liên kết đồ thị tri thức và tìm kiếm ngữ nghĩa.",
      highlights: [
        "Knowledge graph modeling with Neo4j.",
        "Vector retrieval architecture using Qdrant.",
        "Structured relationships between symptoms, syndromes, herbs, and contraindications.",
      ],
      highlightsVi: [
        "Mô hình hóa đồ thị tri thức dược liệu và bệnh chứng trên Neo4j.",
        "Kiến trúc truy xuất vector kết hợp Qdrant.",
        "Liên kết ngữ nghĩa chặt chẽ giữa triệu chứng, bài thuốc và chống chỉ định.",
      ],
      tags: [
        "Python",
        "Neo4j",
        "Qdrant",
        "Knowledge Graph",
        "RAG",
      ],
      githubUrl: "https://github.com/GrayDev-VN",
      isFeatured: false,
      status: "in-progress",
    },
    {
      id: "hadoop-hive-platform",
      category: "DISTRIBUTED DATA SYSTEMS",
      categoryVi: "HỆ THỐNG DỮ LIỆU PHÂN TÁN",
      domain: "Hadoop / Hive / HDFS",
      domainVi: "Hadoop / Hive / HDFS",
      title: "Multi-Node Hadoop and Hive Data Warehouse",
      titleVi: "Kho Dữ liệu Phân tán Multi-Node Hadoop & Hive",
      summary:
        "A distributed data platform for cluster configuration, distributed storage, resource management, and SQL-based analytics.",
      summaryVi:
        "Nền tảng xử lý dữ liệu lớn phân tán: cấu hình cụm đa node, lưu trữ phân tán HDFS, quản lý tài nguyên YARN và truy vấn Hive SQL.",
      highlights: [
        "Multi-node Hadoop cluster configured with Docker Compose.",
        "HDFS distributed storage and YARN resource management.",
        "Hive warehouse with PostgreSQL Metastore.",
      ],
      highlightsVi: [
        "Cụm Hadoop multi-node tự động hóa qua Docker Compose.",
        "Lưu trữ phân tán trên HDFS và điều phối tác vụ với YARN.",
        "Kho dữ liệu Hive kết nối PostgreSQL Metastore.",
      ],
      tags: [
        "Hadoop",
        "HDFS",
        "YARN",
        "Hive",
        "Docker Compose",
      ],
      githubUrl: "https://github.com/GrayDev-VN",
      isFeatured: false,
      status: "in-progress",
    },
  ] as Project[],

  // Credentials supplied in the earlier draft.
  // Verify the award, badge, dates, and IDs before publishing.
  credentials: [
    {
      id: "aws-data-eng",
      category: "aws",
      title: "AWS Academy Graduate - Data Engineering",
      issuer: "Amazon Web Services (AWS)",
      badgeType: "Training Badge",
      hours: "40 hours",
      verifiedId: "W928-10",
      year: "2025",
      date: "05/11/2025",
      status: "earned",
    },
    {
      id: "aws-cloud-foundations",
      category: "aws",
      title: "AWS Academy Graduate - Cloud Foundations",
      issuer: "Amazon Web Services (AWS)",
      badgeType: "Training Badge",
      hours: "20 hours",
      verifiedId: "PZ2V",
      year: "2025",
      date: "08/10/2025",
      status: "earned",
    },
    {
      id: "aws-web-app",
      category: "aws",
      title: "AWS Academy Graduate - Cloud Web App Builder",
      issuer: "Amazon Web Services (AWS)",
      badgeType: "Training Badge",
      hours: "12 hours",
      verifiedId: "BKmay",
      year: "2025",
      date: "09/10/2025",
      status: "earned",
    },
    {
      id: "google-gemini",
      category: "google",
      title: "Gemini Certified Student (University)",
      issuer: "Google for Education",
      badgeType: "Certification",
      verifiedId: "EDU-2025",
      year: "2025",
      date: "12/07/2025",
      status: "earned",
    },
    {
      id: "google-data-analytics",
      category: "google",
      title: "Google Data Analytics",
      issuer: "Google / Coursera",
      badgeType: "Professional Certificate",
      hours: "180 hours",
      verifiedId: "Coursera Verified",
      year: "2024",
      date: "2024",
      status: "earned",
    },
    {
      id: "coursera-dl",
      category: "industry",
      title: "Deep Learning Specialization",
      issuer: "DeepLearning.AI / Coursera",
      badgeType: "Specialization Certificate",
      hours: "120 hours",
      verifiedId: "Coursera Verified",
      year: "2024",
      date: "2024",
      status: "earned",
    },
    {
      id: "oracle-sql",
      category: "industry",
      title: "Oracle Database SQL Certified Associate",
      issuer: "Oracle Corporation",
      badgeType: "Associate Certification",
      verifiedId: "Oracle Credly Verified",
      year: "2024",
      date: "2024",
      status: "earned",
    },
    {
      id: "hcmute-honor",
      category: "academic",
      title: "Academic Excellence Award — Data Engineering",
      issuer: "HCM University of Technology & Education",
      badgeType: "Academic Honor",
      verifiedId: "HCM-UTE Official",
      year: "2024",
      date: "2024",
      status: "earned",
    },
    {
      id: "coursera-mlops",
      category: "industry",
      title: "MLOps Specialization",
      issuer: "DeepLearning.AI / Coursera",
      badgeType: "Specialization Certificate",
      hours: "90 hours",
      verifiedId: "Coursera Verified",
      year: "2025",
      date: "2025",
      status: "earned",
    },
    {
      id: "aws-ml",
      category: "aws",
      title: "AWS Academy Graduate - Machine Learning Foundations",
      issuer: "Amazon Web Services (AWS)",
      badgeType: "Training Badge",
      hours: "32 hours",
      verifiedId: "Credly Verified",
      year: "2025",
      date: "2025",
      status: "earned",
    },
  ] satisfies Credential[],

  learningGoals: [
    {
      id: "backend-foundations",
      category: "backend",
      title: "Java Backend Engineering",
      priority: "high",
      topics: [
        "Java Core and OOP",
        "Collections, Generics, and Exceptions",
        "SQL and Database Design",
        "Spring Boot and REST APIs",
        "Spring Security and Testing",
        "Transactions and Database Optimization",
        "Data Structures and Algorithms",
      ],
      targetOutcome:
        "Build a production-style backend API with authentication, database " +
        "integration, validation, tests, and API documentation.",
    },
    {
      id: "ai-engineering",
      category: "ai",
      title: "AI Engineering and LLM Applications",
      priority: "high",
      topics: [
        "Python and FastAPI",
        "LLM APIs and structured outputs",
        "Embeddings and vector databases",
        "RAG evaluation and retrieval quality",
        "Tool calling and AI agents",
        "Model serving and inference optimization",
        "AI application evaluation and observability",
      ],
      targetOutcome:
        "Build an AI application with reliable APIs, retrieval, evaluation, " +
        "error handling, and measurable quality.",
    },
    {
      id: "aws-cloud",
      category: "cloud",
      title: "AWS Cloud Engineering",
      priority: "high",
      topics: [
        "IAM and least-privilege access",
        "VPC, networking, and security groups",
        "S3, Lambda, and API Gateway",
        "EC2, RDS, and managed databases",
        "CloudWatch and operational monitoring",
        "CI/CD and infrastructure as code",
        "Containers and cloud deployment",
      ],
      targetOutcome:
        "Deploy a backend and AI service securely with monitoring, automated " +
        "delivery, and documented infrastructure.",
    },
    {
      id: "cloud-native-architecture",
      category: "cloud",
      title: "Cloud-Native and Distributed Systems",
      priority: "long-term",
      topics: [
        "Docker and container fundamentals",
        "Kubernetes fundamentals",
        "Kafka and asynchronous messaging",
        "Caching and distributed-system patterns",
        "Reliability, scalability, and fault tolerance",
        "Terraform and infrastructure automation",
      ],
      targetOutcome:
        "Design, deploy, monitor, and scale distributed applications in cloud environments.",
    },
  ] satisfies LearningGoal[],

  certificationRoadmap: [
    {
      id: "aws-cloud-practitioner",
      title: "AWS Certified Cloud Practitioner",
      category: "cloud",
      status: "planned",
      reason:
        "Build or validate foundational knowledge of AWS services, security, and pricing.",
    },
    {
      id: "aws-developer-associate",
      title: "AWS Certified Developer - Associate",
      category: "cloud",
      status: "planned",
      reason:
        "Focus on developing, securing, deploying, and troubleshooting applications on AWS.",
    },
    {
      id: "aws-solutions-architect",
      title: "AWS Certified Solutions Architect - Associate",
      category: "cloud",
      status: "long-term",
      reason:
        "Develop broader skills in cloud architecture, reliability, security, and cost optimization.",
    },
  ],
} as const;
