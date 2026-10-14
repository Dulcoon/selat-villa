"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelat } from "@/context/SelatContext";
import { MapPin, Phone, Mail, X } from "lucide-react";

export function Footer() {
  const { settings } = useSelat();
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | null>(null);

  return (
    <footer id="contact" className="w-full bg-[#171A18] border-t border-[#EAE4D8]/15 text-[#C9BBA5]">
      <div className="w-full grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#EAE4D8]/15">
        <div className="md:col-span-5 px-10 md:px-16 py-14 md:py-20 space-y-6">
          <div className="flex items-center gap-3.5">
            <span className="w-7 h-7 border border-[#A48A63] flex items-center justify-center text-[#EAE4D8] text-xs font-serif">
              S
            </span>
            <span className="font-serif text-xl tracking-[0.28em] text-[#F8F6F0]">
              {settings.fullBrandName}
            </span>
          </div>
          <p className="text-sm text-[#A5A69C] max-w-md leading-relaxed">
            {settings.tagline} A boutique collection of architect-designed private island residences overlooking the Flores Sea and Komodo National Park channels.
          </p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#A48A63] pt-2">
            Frontend Portfolio Demonstration • Fictional Hospitality Brand
          </p>
        </div>

        <div className="md:col-span-3 px-10 md:px-16 py-14 md:py-20 space-y-5">
          <p className="text-[10px] uppercase tracking-[0.26em] text-[#A48A63]">
            01 // Architectural Index
          </p>
          <ul className="space-y-2.5 text-xs tracking-wider uppercase">
            <li>
              <Link href="/" className="hover:text-[#F8F6F0] transition">
                Editorial Monograph
              </Link>
            </li>
            <li>
              <Link href="/villas" className="hover:text-[#F8F6F0] transition">
                Private Residences
              </Link>
            </li>
            <li>
              <Link href="/booking" className="hover:text-[#F8F6F0] transition">
                Direct Reservation
              </Link>
            </li>
            <li>
              <Link href="/lookup" className="hover:text-[#F8F6F0] transition">
                Itinerary Lookup
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-[#A48A63] hover:text-[#F8F6F0] transition">
                Estate Backoffice Console
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4 px-10 md:px-16 py-14 md:py-20 space-y-5">
          <p className="text-[10px] uppercase tracking-[0.26em] text-[#A48A63]">
            02 // Island Concierge (Demo)
          </p>
          <div className="space-y-2.5 text-xs text-[#A5A69C]">
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#A48A63] shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#A48A63] shrink-0" />
              <span>{settings.contactPhone}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#A48A63] shrink-0" />
              <span>{settings.contactEmail}</span>
            </p>
          </div>
          <div className="pt-3 border-t border-[#EAE4D8]/10 flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-[#EAE4D8]">
            <span>Check-In: {settings.checkInTime}</span>
            <span className="text-[#A48A63]">/</span>
            <span>Check-Out: {settings.checkOutTime}</span>
          </div>
        </div>
      </div>

      <div className="w-full px-8 md:px-14 py-7 border-t border-[#EAE4D8]/15 flex flex-col sm:flex-row items-center justify-between gap-5 text-[11px] text-[#A5A69C] bg-[#141715]">
        <p>© 2026 {settings.fullBrandName}. Full-width architectural portfolio prototype.</p>
        <div className="flex items-center gap-8 uppercase tracking-[0.18em] text-[10px]">
          <button
            type="button"
            onClick={() => setLegalModal("privacy")}
            className="hover:text-[#EAE4D8]"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setLegalModal("terms")}
            className="hover:text-[#EAE4D8]"
          >
            Terms & Conditions
          </button>
          <Link href="/admin/login" className="hover:text-[#EAE4D8] text-[#A48A63]">
            Executive Login
          </Link>
        </div>
      </div>

      {legalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#202420] border border-[#EAE4D8]/30 max-w-lg w-full p-8 space-y-5 text-[#EAE4D8]">
            <div className="flex items-center justify-between border-b border-[#EAE4D8]/15 pb-4">
              <h3 className="font-serif text-2xl">
                {legalModal === "privacy"
                  ? "Demonstration Privacy Policy"
                  : "Demonstration Booking Conditions"}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="text-[#A5A69C] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#C9BBA5] leading-relaxed">
              {legalModal === "privacy"
                ? "SELAT Private Island Villas is a frontend-only hospitality showcase prototype. Any guest details or reservation entries created during your session are stored exclusively in your local browser storage (localStorage) for demonstration purposes and are never transmitted to any external server."
                : `${settings.bookingPolicy} ${settings.cancellationPolicy}`}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="bg-[#EAE4D8] text-[#171A18] px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
