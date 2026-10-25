import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function Github({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function Linkedin({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function JavaIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );
}

export function SpringIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export function AwsIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <path d="m8 15 3 3 5-5" />
    </svg>
  );
}

export function DockerIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M4 14h16c0 4-3 7-8 7s-8-3-8-7Z" />
      <rect x="4" y="9" width="3" height="3" />
      <rect x="8" y="9" width="3" height="3" />
      <rect x="12" y="9" width="3" height="3" />
      <rect x="8" y="5" width="3" height="3" />
      <rect x="12" y="5" width="3" height="3" />
      <path d="M20 12c1.5-1 2-2 2-2s-.5 0-1.5.5" />
    </svg>
  );
}

export function PostgresIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

export function RedisIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

export function KafkaIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <line x1="14" y1="10" x2="17.5" y2="6.5" />
      <line x1="9.5" y1="13.5" x2="6.5" y2="17.5" />
      <line x1="14" y1="14" x2="17.5" y2="17.5" />
    </svg>
  );
}

export function PythonIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 2H8a4 4 0 0 0-4 4v3a2 2 0 0 0 2 2h6V9a1 1 0 0 1 1-1h5a2 2 0 0 0 2-2V6a4 4 0 0 0-4-4h-4Z" />
      <path d="M12 22h4a4 4 0 0 0 4-4v-3a2 2 0 0 0-2-2h-6v2a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v0a4 4 0 0 0 4 4h4Z" />
      <circle cx="9" cy="5" r="1" fill="currentColor" />
      <circle cx="15" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}

export function GitIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

export function TypeScriptIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 8h6M10 8v8" />
      <path d="M14 15.5c1 .5 2.5.5 3 0s-.5-1.5-1.5-2-1.5-1.5-1-2.5 2-1 3 0" />
    </svg>
  );
}

export function PowerBIIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="4" y="13" width="4" height="8" rx="1" />
      <rect x="10" y="8" width="4" height="13" rx="1" />
      <rect x="16" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}

export const GithubIcon = Github;
export const LinkedinIcon = Linkedin;

export function getTechIcon(name: string, size = 16, className = ""): React.ReactNode {
  const lower = name.toLowerCase();
  if (lower.includes("java") && !lower.includes("script")) return <JavaIcon size={size} className={className} />;
  if (lower.includes("spring")) return <SpringIcon size={size} className={className} />;
  if (lower.includes("aws") || lower.includes("s3") || lower.includes("lambda") || lower.includes("cloudwatch") || lower.includes("eventbridge")) return <AwsIcon size={size} className={className} />;
  if (lower.includes("docker") || lower.includes("container")) return <DockerIcon size={size} className={className} />;
  if (lower.includes("postgres") || lower.includes("sql") || lower.includes("rds")) return <PostgresIcon size={size} className={className} />;
  if (lower.includes("redis")) return <RedisIcon size={size} className={className} />;
  if (lower.includes("kafka")) return <KafkaIcon size={size} className={className} />;
  if (lower.includes("python") || lower.includes("fastapi") || lower.includes("pytorch") || lower.includes("ml") || lower.includes("langchain")) return <PythonIcon size={size} className={className} />;
  if (lower.includes("github")) return <Github size={size} className={className} />;
  if (lower.includes("git")) return <GitIcon size={size} className={className} />;
  if (lower.includes("typescript") || lower.includes("ts") || lower.includes("javascript") || lower.includes("js")) return <TypeScriptIcon size={size} className={className} />;
  if (lower.includes("power bi") || lower.includes("analytics")) return <PowerBIIcon size={size} className={className} />;
  return null;
}

