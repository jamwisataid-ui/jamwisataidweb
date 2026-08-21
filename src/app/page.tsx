import { JsonLd } from "@/components/seo/JsonLd";
import { HeroPackages } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/HeroPackages";
import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";
import { WhatsAppConcierge } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/WhatsAppConcierge";

const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      "@id": "https://jamwisata.id/#organization",
      name: "Jam Wisata",
      alternateName: ["JamWisata", "PT Jaris Ammar Madani"],
      url: "https://jamwisata.id",
      logo: "https://jamwisata.id/images/logo.png",
      image: "https://jamwisata.id/images/jamwisata-makkah.png",
      description:
        "Biro perjalanan umroh amanah, profesional, dan berlandaskan sunnah dari Bandung dengan bimbingan ibadah terpercaya dan hotel dekat masjid.",
      telephone: "+6281809627499",
      email: "jamwisata99@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Cibangkong No. 28A Gatot Subroto",
        addressLocality: "Bandung",
        addressRegion: "Jawa Barat",
        postalCode: "40273",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -6.9272,
        longitude: 107.6322,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "17:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "09:00",
          closes: "14:00",
        },
      ],
      priceRange: "Rp 33.900.000 - Rp 36.900.000",
      sameAs: [
        "https://www.instagram.com/jamwisata",
        "https://www.youtube.com/@jamwisata",
        "https://jamwisata.com",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://jamwisata.id/#website",
      url: "https://jamwisata.id",
      name: "Jam Wisata",
      description: "Travel Umroh Terpercaya & Berlandaskan Sunnah",
      publisher: {
        "@id": "https://jamwisata.id/#organization",
      },
      inLanguage: "id-ID",
    },
  ],
};

export default function Home() {
  return (
    <main className="jam-page min-h-screen">
      <JsonLd schema={homepageSchema} />
      <PremiumHeader />
      <HeroPackages />
      <ModernProofFooter />
      <WhatsAppConcierge />
    </main>
  );
}
