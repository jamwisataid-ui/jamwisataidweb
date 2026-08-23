import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Jam Wisata CMS", template: "%s · Jam Wisata CMS" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
