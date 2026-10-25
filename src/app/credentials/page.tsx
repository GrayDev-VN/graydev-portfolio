import ContactSection from "@/components/ContactSection";
import CredentialsSection from "@/components/CredentialsSection";
import PortfolioShell from "@/components/PortfolioShell";

export default function CredentialsPage() {
  return (
    <PortfolioShell>
      <CredentialsSection />
      <ContactSection />
    </PortfolioShell>
  );
}
