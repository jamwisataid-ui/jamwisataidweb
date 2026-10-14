import { Image, type ImageSourcePropType } from "react-native";

import { api } from "./api";
import allInOneImage from "../../assets/onboarding/all-in-one.jpg";
import journeyImage from "../../assets/onboarding/journey.jpg";
import liveMuthowifImage from "../../assets/onboarding/live-muthowif.jpg";

export type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  ctaLabel: string;
};

type RemoteSlide = Omit<OnboardingSlide, "image"> & { imageUrl: string };

export const defaultOnboardingSlides: OnboardingSlide[] = [
  { id: "journey", title: "Perjalanan Ibadah\nLebih Mudah,\nLebih Bermakna.", description: "Bersama Jam Wisata, semua informasi perjalanan Umroh Anda tersedia dalam satu aplikasi, dari persiapan hingga kembali ke tanah air.", image: journeyImage, ctaLabel: "Selanjutnya →" },
  { id: "all-in-one", title: "Semua Kebutuhan Jamaah\nDalam Satu Aplikasi.", description: "Akses paket Umroh, itinerary, dokumen, pembayaran, jadwal sholat, Al-Qur'an, doa & dzikir, serta informasi perjalanan kapan saja.", image: allInOneImage, ctaLabel: "Selanjutnya →" },
  { id: "live-muthowif", title: "Tetap Terhubung\nDengan Muthowif.", description: "Dengarkan panduan ibadah secara langsung melalui fitur LIVE MUTHOWIF, khusus untuk jamaah dalam rombongan Jam Wisata.", image: liveMuthowifImage, ctaLabel: "Mulai Sekarang →" },
];

export async function fetchOnboardingSlides() {
  const remote = await api<RemoteSlide[]>("/onboarding");
  if (!remote.length) return defaultOnboardingSlides;
  await Promise.allSettled(remote.map((slide) => Image.prefetch(slide.imageUrl)));
  return remote.map((slide) => ({ ...slide, image: { uri: slide.imageUrl } }));
}
