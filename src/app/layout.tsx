import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { LocaleProvider } from "@/components/LocaleProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gray Nguyen | AI & Backend Engineer",
  description: "Gray Nguyen (Nguyễn Đức Toàn) — AI Developer at SOFTWORLD, AWS Intern, and AI Teaching Assistant.",
  keywords: ["Gray Nguyen", "Nguyễn Đức Toàn", "AI Developer", "Backend Engineer", "AI Teaching Assistant", "AWS Intern", "SOFTWORLD"],
  authors: [{ name: "Gray Nguyen" }],
  icons: {
    icon: "/avatar.jpg",
    shortcut: "/avatar.jpg",
    apple: "/avatar.jpg",
  },
  openGraph: {
    title: "Gray Nguyen | AI & Backend Engineer",
    description: "AI Developer at SOFTWORLD, AWS Intern, and AI Teaching Assistant.",
    type: "website",
    images: [{ url: "/avatar.jpg" }],
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
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-[#0b0814] text-[#f1edfa] antialiased selection:bg-[#8b5cf6] selection:text-[#1b1230]"
        suppressHydrationWarning
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
