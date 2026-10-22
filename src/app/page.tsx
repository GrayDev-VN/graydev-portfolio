"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutBento from "@/components/AboutBento";
import CareerSection from "@/components/CareerSection";
import ProjectsSection from "@/components/ProjectsSection";
import CredentialsSection from "@/components/CredentialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AiConsoleModal from "@/components/AiConsoleModal";

export default function Home() {
  const [aiConsoleOpen, setAiConsoleOpen] = useState(false);

  return (
    <div className="bg-[#0f131c] text-[#dfe2ef] min-h-screen relative flex flex-col selection:bg-[#9ee939] selection:text-[#0a0e17]">
      {/* Background Cyber Grid Pattern */}
      <div className="fixed inset-0 cyber-grid pointer-events-none z-0"></div>

      {/* Global Navbar */}
      <Navbar onOpenAiConsole={() => setAiConsoleOpen(true)} />

      {/* Main Content Sections */}
      <main className="w-full pt-20 relative z-10 flex-1 max-w-7xl mx-auto px-6 lg:px-12">
        <HeroSection onOpenAiConsole={() => setAiConsoleOpen(true)} />
        <AboutBento />
        <CareerSection />
        <ProjectsSection />
        <CredentialsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive AI Terminal Console Modal */}
      <AiConsoleModal
        isOpen={aiConsoleOpen}
        onClose={() => setAiConsoleOpen(false)}
      />
    </div>
  );
}
