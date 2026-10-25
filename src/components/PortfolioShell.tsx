"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface PortfolioShellProps {
  children: React.ReactNode;
}

export default function PortfolioShell({ children }: PortfolioShellProps) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  const routePath = pathname.replace(/\/+$/, "") || "/";
  const [activeSection, setActiveSection] = useState<string>(() => {
    if (routePath === "/career") return "career";
    if (routePath === "/projects") return "projects";
    if (routePath.startsWith("/blog")) return "blog";
    if (routePath === "/credentials") return "credentials";
    return "about";
  });

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

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
    if (routePath !== "/") {
      if (routePath === "/career") setActiveSection("career");
      else if (routePath === "/projects") setActiveSection("projects");
      else if (routePath.startsWith("/blog")) setActiveSection("blog");
      else if (routePath === "/credentials") setActiveSection(hash === "#contact" ? "contact" : "credentials");
      else setActiveSection("about");
      return;
    }

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
      <Navbar activeSection={activeSection} />
      <main className="w-full pt-20 relative z-10 flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
