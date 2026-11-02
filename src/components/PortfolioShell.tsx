"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import BinaryCursorBackground from "@/components/BinaryCursorBackground";

interface PortfolioShellProps {
  children: React.ReactNode;
}

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

export default function PortfolioShell({ children }: PortfolioShellProps) {
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => "");

  const routePath = pathname.replace(/^\/(en|vi)(?=\/blog(?:\/|$))/, "").replace(/\/+$/, "") || "/";
  const [scrollSection, setActiveSection] = useState("about");
  const activeSection = routePath === "/" ? scrollSection
    : routePath === "/career" ? "career"
    : routePath.startsWith("/projects") ? "projects"
    : routePath.startsWith("/blog") ? "blog"
    : routePath === "/jobs" ? "jobs"
    : routePath === "/credentials" ? (hash === "#contact" ? "contact" : "credentials")
    : "about";

  useEffect(() => {
    const targetId = hash.slice(1);
    if (!targetId) return;

    const timeout = window.setTimeout(() => {
      const target = document.getElementById(targetId);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [hash, pathname]);

  // Real-time scroll spy when on homepage
  useEffect(() => {
    if (routePath !== "/") return;

    const sectionIds = ["about", "career", "projects", "credentials", "contact"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 280;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }
      setActiveSection("about");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [routePath, hash]);

  return (
    <div className="bg-[#070a13] text-[#f8fafc] min-h-screen relative flex flex-col selection:bg-indigo-600 selection:text-white">
      <div className="fixed inset-0 cyber-grid pointer-events-none z-0" />
      <BinaryCursorBackground />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-indigo-600 focus:p-3 focus:text-white">Skip to content / Đến nội dung</a>
      <Navbar activeSection={activeSection} />
      <main id="main-content" tabIndex={-1} className="w-full pt-20 relative z-10 flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
