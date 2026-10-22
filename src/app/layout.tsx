import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gray Nguyen (GrayDev) | AI Backend & Distributed Systems Engineer",
  description: "Portfolio of Gray Nguyen (GrayDev) - AI Backend Engineer specializing in LLM serving, data pipelines, enterprise ITGC controls, and Java Spring Boot architectures.",
  keywords: ["GrayDev", "Gray Nguyen", "AI Backend", "Java Spring Boot", "Data Engineering", "IT Audit", "Deloitte Vietnam", "FastAPI", "BigQuery"],
  authors: [{ name: "Gray Nguyen (GrayDev)" }],
  openGraph: {
    title: "Gray Nguyen (GrayDev) | AI Backend & Distributed Systems Engineer",
    description: "Cyber-audit technical portfolio of Gray Nguyen: AI Backend, Data Pipelines, and Enterprise Architectures.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} scroll-smooth dark`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-screen bg-[#0f131c] text-[#dfe2ef] antialiased selection:bg-[#84cc16] selection:text-[#0a0e17]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
