export interface Project {
  id: string;
  title: string;
  category: string;
  domain: string;
  summary: string;
  highlights: string[];
  tags: string[];
  metrics?: { label: string; value: string }[];
  githubUrl?: string;
  demoUrl?: string;
  isFeatured?: boolean;
}

export interface CareerRole {
  company: string;
  role: string;
  division: string;
  period: string;
  location: string;
  scope: string;
  statusBadge: string;
  isCurrent?: boolean;
  description: string;
  responsibilities: string[];
  skills: string[];
  frameworkScore?: {
    name: string;
    percentage: number;
    scoreLabel: string;
  };
}

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  category: "all" | "aws" | "google" | "industry" | "award" | "academic";
  hours?: string;
  verifiedId: string;
  year: string;
  date: string;
  badgeType: string;
}

export const PORTFOLIO_DATA = {
  profile: {
    name: "Gray Nguyen",
    handle: "GrayDev",
    tagline: "AI Backend & Distributed Systems Engineer",
    shortBio: "Data Engineering graduate at HCM-UTE with strong background in AI model serving, distributed data pipelines, enterprise ITGC controls (Deloitte Vietnam), and scalable Java Spring Boot architectures.",
    gpa: "8.41",
    certsCount: "11",
    projectsCount: "4+",
    orgRole: "RTIC Co-Founder",
    email: "contact@graydev.tech",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    statusText: "SYSTEM_ONLINE // AI_BACKEND_READY",
  },
  
  keySignals: [
    { label: "CURRENT GPA", value: "8.41", highlight: "HCM-UTE Data Eng" },
    { label: "VERIFIED CERTS", value: "11", highlight: "AWS, Google & Industry" },
    { label: "CORE SYSTEMS", value: "4+", highlight: "Production & Research" },
    { label: "CO-FOUNDER", value: "RTIC", highlight: "Tech Risk & Controls" }
  ],

  securityScopes: [
    { icon: "ShieldCheck", title: "Deloitte Vietnam (Intern)", desc: "Audit & Assurance (ITGC / SOX 404)" },
    { icon: "Terminal", title: "AI Backend & LLM Serving", desc: "Python / FastAPI / PyTorch / CUDA" },
    { icon: "Database", title: "Enterprise Systems", desc: "Java Spring Boot / PostgreSQL / BigQuery" },
    { icon: "Layers", title: "Medallion Lakehouse", desc: "Apache Spark / MinIO / Delta Lake" },
  ],

  career: [
    {
      company: "Deloitte Vietnam",
      role: "IT Audit Intern",
      division: "Audit & Assurance Division",
      period: "Sep 2024 — Present",
      location: "Ho Chi Minh City, Vietnam",
      scope: "Financial Services & Tier-1 Banking Portfolio",
      statusBadge: "ACTIVE ASSIGNMENT",
      isCurrent: true,
      description: "Supporting IT audit procedures across complex client enterprise infrastructures, core banking systems, and automated ERP workflows adhering to Big 4 global methodologies.",
      responsibilities: [
        "Review IT General Controls (ITGC) encompassing User Access Management, Change Management (ITIL), and Batch Operations.",
        "Execute automated and manual testing of application controls and system interfaces across core banking platforms.",
        "Perform substantive population testing using advanced SQL queries, verifying transaction completeness and data integrity.",
        "Prepare audit work papers, risk assessments, and compliance documentation under senior auditor supervision.",
        "Participate in client process walkthroughs, control owner interviews, and remediation consultations."
      ],
      skills: ["ITGC Testing", "Application Controls", "SQL Analytics", "SOX 404", "COSO & COBIT 2019", "Change Management"],
      frameworkScore: {
        name: "COSO / COBIT 2019 / ITGC",
        percentage: 92,
        scoreLabel: "92%"
      }
    },
    {
      company: "Freelance",
      role: "AI & Software Systems Planner",
      division: "Requirements & Technical Architecture",
      period: "2023 — 2024",
      location: "Ho Chi Minh City, Vietnam",
      scope: "B2B E-Commerce & High-Concurrency Distribution Systems",
      statusBadge: "FREELANCE CONTRACT",
      isCurrent: false,
      description: "Analyzed business requirements, designed system dataflows, drafted technical specifications (BRD/SRS), and modeled normalized relational database schemas for high-traffic web applications.",
      responsibilities: [
        "Consulted with business stakeholders to formulate end-to-end data workflows and functional software requirements.",
        "Architected relational schemas (ERD) with 3NF normalization, optimized query indexing, and defined RESTful API payloads.",
        "Drafted comprehensive system documentation (SRS, BPMN flowcharts, sequence diagrams) for engineering development teams.",
        "Designed and executed User Acceptance Testing (UAT) test matrices to ensure high functional compliance."
      ],
      skills: ["Business Process Modeling", "ERD & Database Architecture", "API Contract Design", "UAT Planning", "Technical Documentation"],
      frameworkScore: {
        name: "Delivered Specs",
        percentage: 100,
        scoreLabel: "14 BRDs"
      }
    },
    {
      company: "University Laboratory",
      role: "Data Systems & Analytics Instructor",
      division: "Faculty of Information Systems (HCM-UTE)",
      period: "2022 — 2023",
      location: "Ho Chi Minh City, Vietnam",
      scope: "Advanced SQL, Relational Architecture & Python Pipelines",
      statusBadge: "ACADEMIC LAB",
      isCurrent: false,
      description: "Mentored over 120 undergraduate students in relational database theory, SQL query optimization, transaction ACID properties, and automated data processing with Python.",
      responsibilities: [
        "Delivered hands-on laboratory modules on database indexing strategies, execution plans, and normalization.",
        "Formulated real-world fraud detection audit datasets and automated evaluation scripts for capstone projects.",
        "Assisted students with Docker deployment environments and relational database integration best practices."
      ],
      skills: ["PostgreSQL / Oracle SQL", "Python Data Pipelines", "Query Tuning", "Lab Mentorship", "Data Structures"],
      frameworkScore: {
        name: "Student Reach",
        percentage: 95,
        scoreLabel: "120+ Students"
      }
    }
  ] as CareerRole[],

  projects: [
    {
      id: "vn-banking-dwh",
      title: "Vietnamese Banking Financial Analytics Platform",
      category: "ENTERPRISE LAKEHOUSE & ANALYTICS",
      domain: "BIGQUERY / MACHINE LEARNING",
      isFeatured: true,
      summary: "An end-to-end financial data warehouse analyzing 20+ years of Vietnamese commercial banking performance on Google BigQuery. Automated ELT pipelines clean and transform audited balance sheets into a Star Schema, integrated with Random Forest risk classification and interactive visual intelligence.",
      highlights: [
        "20+ Years Granular Data: Processed and audited 28,490+ records spanning 31 commercial banks in Vietnam (2003–2024).",
        "Star Schema Design: Built Fact_Financials, Dim_Bank, and Dim_Macroeconomy with automated SCD Type 2 dimension handling.",
        "Machine Learning Risk Model: Random Forest classifier achieving 91.4% accuracy in predicting asset distress and NPL ratio shifts.",
        "Partitioning & Clustering: BigQuery table optimization partitioned by (report_year, bank_code) achieving 75% query cost reduction."
      ],
      tags: ["Google BigQuery", "Python", "SQL", "Star Schema", "Random Forest", "Looker Studio", "Streamlit"],
      metrics: [
        { label: "Banks Analyzed", value: "31" },
        { label: "Years Covered", value: "2003-2024" },
        { label: "RF Model Accuracy", value: "91.4%" },
        { label: "Total Audited Records", value: "28,490" }
      ],
      githubUrl: "https://github.com",
      demoUrl: "#"
    },
    {
      id: "ecommerce-architecture",
      title: "Samsung Galaxy Z / High-Concurrency E-Commerce Web Architecture",
      category: "E-COMMERCE STACK",
      domain: "SYSTEMS • DISTRIBUTED WEB",
      summary: "Modular e-commerce microservices with automated catalog syndication, high-concurrency order orchestrators, dynamic Redis caching layers, and responsive UI components engineered for massive flash-sale gadget releases.",
      highlights: [
        "High-throughput checkout pipeline handling burst traffic via message queue buffers.",
        "Resilient PostgreSQL schema with connection pooling, transaction isolation, and row-level locking.",
        "Responsive, dark cyber-themed storefront UI built with Next.js and Tailwind CSS."
      ],
      tags: ["Next.js", "Java Spring Boot / Node.js", "PostgreSQL", "Redis", "Docker"],
      githubUrl: "https://github.com",
      demoUrl: "#"
    },
    {
      id: "minio-lakehouse",
      title: "MinIO Object Storage & Lakehouse Spark Pipeline",
      category: "MEDALLION ARCHITECTURE",
      domain: "LAKEHOUSE • APACHE SPARK",
      summary: "Batch & streaming ELT orchestration engine transitioning raw transactional datasets into structured Parquet tables across Bronze, Silver, and Gold tiers using Apache Spark, MinIO S3 API, and Delta Lake ACID semantics.",
      highlights: [
        "Bronze-Silver-Gold automated progression with schema enforcement and quarantine bad-records queue.",
        "Apache Spark distributed processing engine with adaptive query execution (AQE).",
        "MinIO S3-compatible cloud storage deployment running fully on containerized infrastructure."
      ],
      tags: ["MinIO", "Apache Spark", "Delta Lake", "Airflow", "Docker", "Python"],
      githubUrl: "https://github.com",
      demoUrl: "#"
    },
    {
      id: "turboquant-llm",
      title: "Benchmarking TurboQuant & KV Cache Compression on Vietnamese LLMs",
      category: "ACADEMIC RESEARCH",
      domain: "DEEP LEARNING • LLM SERVING",
      summary: "Empirical study evaluating 4-bit KV Cache quantizers, SnapKV, and Pyramidal attention pruning algorithms on Vietnamese Large Language Models to minimize VRAM memory footprint while preserving benchmark perplexity.",
      highlights: [
        "Achieved 60% VRAM memory reduction on long-context Vietnamese dialogue generation.",
        "Evaluated latency vs. perplexity trade-offs across Llama-3-Vietnamese and PhoGPT checkpoints.",
        "Benchmarked inference throughput on single GPU nodes using PyTorch and CUDA kernels."
      ],
      tags: ["PyTorch", "CUDA", "HuggingFace", "Quantization", "vLLM", "Python"],
      githubUrl: "https://github.com",
      demoUrl: "#"
    }
  ] as Project[],

  credentials: [
    {
      id: "c1",
      title: "AWS Academy Graduate - Data Engineering",
      issuer: "Amazon Web Services (AWS)",
      category: "aws",
      hours: "40 hours",
      verifiedId: "Credly ID #W928-10",
      year: "2025",
      date: "05/11/2025",
      badgeType: "TRAINING BADGE"
    },
    {
      id: "c2",
      title: "AWS Academy Graduate - Cloud Foundations",
      issuer: "Amazon Web Services (AWS)",
      category: "aws",
      hours: "20 hours",
      verifiedId: "Credly ID #PZ2V-88",
      year: "2025",
      date: "08/10/2025",
      badgeType: "TRAINING BADGE"
    },
    {
      id: "c3",
      title: "AWS Academy Graduate - Cloud Web App Builder",
      issuer: "Amazon Web Services (AWS)",
      category: "aws",
      hours: "25 hours",
      verifiedId: "Credly ID #AW94-41",
      year: "2025",
      date: "14/09/2025",
      badgeType: "TRAINING BADGE"
    },
    {
      id: "c4",
      title: "Google Data Analytics Professional Certificate",
      issuer: "Google Career Certificates",
      category: "google",
      hours: "180 hours",
      verifiedId: "Coursera #GGL-DATA-01",
      year: "2024",
      date: "20/08/2024",
      badgeType: "PROFESSIONAL CERT"
    },
    {
      id: "c5",
      title: "Google Advanced Data Analytics Specialization",
      issuer: "Google Career Certificates",
      category: "google",
      hours: "160 hours",
      verifiedId: "Coursera #GGL-ADV-99",
      year: "2024",
      date: "15/11/2024",
      badgeType: "SPECIALIZATION"
    },
    {
      id: "c6",
      title: "Enterprise Java Microservices with Spring Boot",
      issuer: "Industry Engineering Program",
      category: "industry",
      hours: "60 hours",
      verifiedId: "Cert #SPR-JAVA-2024",
      year: "2024",
      date: "12/07/2024",
      badgeType: "ENGINEERING"
    },
    {
      id: "c7",
      title: "Deep Learning Specialization",
      issuer: "DeepLearning.AI",
      category: "industry",
      hours: "120 hours",
      verifiedId: "Coursera #DLAI-DL-82",
      year: "2024",
      date: "03/06/2024",
      badgeType: "SPECIALIZATION"
    },
    {
      id: "c8",
      title: "COSO Internal Controls & ITGC Foundations",
      issuer: "Deloitte Academy / Risk Advisory",
      category: "industry",
      hours: "35 hours",
      verifiedId: "Cert #DLT-ITGC-01",
      year: "2024",
      date: "28/09/2024",
      badgeType: "ASSURANCE"
    },
    {
      id: "c9",
      title: "Academic Excellence Scholarship (Data Eng)",
      issuer: "HCM-UTE University",
      category: "award",
      hours: "Semester Honors",
      verifiedId: "Honors #UTE-DE-2024",
      year: "2024",
      date: "10/01/2024",
      badgeType: "HONOR AWARD"
    },
    {
      id: "c10",
      title: "Best Capstone - Distributed Database Systems",
      issuer: "Faculty of Information Systems",
      category: "academic",
      hours: "Academic Jury",
      verifiedId: "Award #FIS-UTE-88",
      year: "2023",
      date: "19/12/2023",
      badgeType: "FIRST PRIZE"
    },
    {
      id: "c11",
      title: "Big Data Processing with Apache Spark & Hadoop",
      issuer: "IBM Skills Network",
      category: "industry",
      hours: "45 hours",
      verifiedId: "Credly ID #IBM-SPK-77",
      year: "2023",
      date: "04/09/2023",
      badgeType: "DATA PLATFORM"
    }
  ] as Credential[],

  traceLogs: [
    { type: "OK", timestamp: "2024-09-01T08:30:00Z", message: "Authenticated security clearance for Deloitte Vietnam Audit & Assurance." },
    { type: "DATA", timestamp: "2024-10-15T14:22:10Z", message: "ITGC scope check completed: Logical Access Controls (LAC) & Automated Batch Scheduling passed." },
    { type: "AI", timestamp: "2025-01-10T11:05:42Z", message: "AI Backend model serving: vLLM + PyTorch KV cache quantization benchmarked at 0.024s latency." },
    { type: "WARN", timestamp: "2025-02-20T09:15:00Z", message: "Cryptographic signature verified: 0x9ee9...39ac [GrayDev Production Node]." }
  ]
};
