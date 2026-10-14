import React from "react";
import Link from "next/link";
import { EditorialFrame } from "@/components/EditorialFrame";

export default function NotFound() {
  return (
    <EditorialFrame>
      <div className="py-28 px-6 text-center max-w-xl mx-auto space-y-6">
        <p className="text-xs uppercase tracking-[0.28em] text-[#A48A63]">
          404 • Uncharted Horizon
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#F8F6F0]">
          This Coordinates Point Beyond Our Archipelago.
        </h1>
        <p className="text-sm text-[#A5A69C] leading-relaxed">
          The page or residence you are looking for could not be found in the SELAT Labuan Bajo collection.
        </p>
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="bg-[#EAE4D8] text-[#171A18] px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.2em]"
          >
            Return Home
          </Link>
          <Link
            href="/villas"
            className="border border-[#EAE4D8]/30 text-[#EAE4D8] px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.2em]"
          >
            Explore Residences
          </Link>
        </div>
      </div>
    </EditorialFrame>
  );
}
