import { JsonLd } from "@/components/seo/JsonLd";
import { HeroPackages } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/HeroPackages";
import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";
import { WhatsAppConcierge } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/WhatsAppConcierge";
import { getPublishedEntries, getPublishedPackages } from "@/lib/cms/public";
import { SITE_URL } from "@/lib/seo";

const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      "@id": `${SITE_URL}/#organization`,
      name: "Jam Wisata",
      alternateName: ["JamWisata", "PT Jaris Ammar Madani"],
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
        width: 512,
        height: 512,
      },
      image: {
        "@type": "ImageObject",
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
      },
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
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Jam Wisata",
      description: "Travel Umroh Terpercaya & Berlandaskan Sunnah",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "id-ID",
    },
  ],
};

export default async function Home() {
  const [packages, testimonialsData, galleryData, faqData] = await Promise.all([
    getPublishedPackages(),
    getPublishedEntries("testimonial"),
    getPublishedEntries("gallery"),
    getPublishedEntries("faq"),
  ]);
  const displayedPackages = packages.slice(0, 10);

  const testimonials = testimonialsData.slice(0, 15).map((item) => ({
    id: item.id,
    youtubeId: String(item.data.youtubeId ?? ""),
    title: item.title,
    program: String(item.data.program ?? ""),
    year: String(item.data.year ?? ""),
    orientation: "portrait" as const,
  }));

  const gallery = galleryData.map((item, index) => ({
    image: String(item.data.imageUrl ?? ""),
    alt: String(item.data.alt ?? item.title),
    caption: String(item.data.caption ?? item.title),
    width: ["w-[320px]", "w-[270px]", "w-[350px]", "w-[290px]"][index % 4],
  }));

  const faqs = faqData.map((item) => [String(item.data.question ?? item.title), String(item.data.answer ?? "")] as const);

  return (
    <main className="jam-page min-h-screen">
      <JsonLd schema={homepageSchema} />
      <PremiumHeader />
      <HeroPackages packages={displayedPackages} />
      <ModernProofFooter
        testimonials={testimonials.length ? testimonials : undefined}
        gallery={gallery.length ? gallery : undefined}
        faqs={faqs.length ? faqs : undefined}
      />
      <WhatsAppConcierge />
    </main>
  );
}
