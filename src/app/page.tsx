import HeroSection from "@/components/HeroSection";
import CareerSection from "@/components/CareerSection";
import ProjectsSection from "@/components/ProjectsSection";
import CredentialsSection from "@/components/CredentialsSection";
import ContactSection from "@/components/ContactSection";
import PortfolioShell from "@/components/PortfolioShell";
import { canonical } from "@/lib/site";

export const metadata = { alternates: { canonical: canonical("/") } };

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
