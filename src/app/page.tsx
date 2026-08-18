import { HeroPackages } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/HeroPackages";
import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";
import { WhatsAppConcierge } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/WhatsAppConcierge";

export default function Home() {
  return (
    <main className="jam-page min-h-screen">
      <PremiumHeader />
      <HeroPackages />
      <ModernProofFooter />
      <WhatsAppConcierge />
    </main>
  );
}
