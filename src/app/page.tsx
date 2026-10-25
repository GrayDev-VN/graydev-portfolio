import HeroSection from "@/components/HeroSection";
import CareerSection from "@/components/CareerSection";
import ProjectsSection from "@/components/ProjectsSection";
import CredentialsSection from "@/components/CredentialsSection";
import ContactSection from "@/components/ContactSection";
import PortfolioShell from "@/components/PortfolioShell";

export default function Home() {
  return (
    <PortfolioShell>
      <HeroSection />
      <CareerSection />
      <ProjectsSection />
      <CredentialsSection />
      <ContactSection />
    </PortfolioShell>
  );
}
