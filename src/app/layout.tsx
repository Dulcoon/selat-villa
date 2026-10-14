import type { Metadata } from "next";
import "./globals.css";
import { SelatProvider } from "@/context/SelatContext";

export const metadata: Metadata = {
  title: "SELAT Private Island Villas | Labuan Bajo, Flores, Indonesia",
  description:
    "A quieter way to experience the extraordinary. Boutique private island residences shaped by the dramatic coastal landscapes of Labuan Bajo and Flores.",
  openGraph: {
    title: "SELAT Private Island Villas — Labuan Bajo, Flores",
    description:
      "Private architectural residences overlooking the Flores Sea and Komodo archipelago. Interactive hospitality & booking showcase prototype.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-[#171A18] text-[#EAE4D8]">
        <SelatProvider>{children}</SelatProvider>
      </body>
    </html>
  );
}
