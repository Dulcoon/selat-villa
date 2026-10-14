"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { EditorialFrame } from "@/components/EditorialFrame";
import { useSelat } from "@/context/SelatContext";
import {
  formatIdr,
  calculateBookingQuote,
  checkVillaAvailability,
} from "@/lib/pricing";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Maximize2,
  Check,
  Sparkles,
  X,
} from "lucide-react";

export default function VillaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const { villas, pricingRules, promoCodes, blockedDates, bookings, settings } =
    useSelat();

  const villa = villas.find((v) => v.slug === slug);

  const [checkIn, setCheckIn] = useState("2026-11-12");
  const [checkOut, setCheckOut] = useState("2026-11-15");
  const [guests, setGuests] = useState(2);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const quote = useMemo(() => {
    if (!villa) return null;
    return calculateBookingQuote({
      villa,
      checkIn,
      checkOut,
      guests,
      selectedExtras: [],
      pricingRules,
      promoCodes,
      settings,
    });
  }, [villa, checkIn, checkOut, guests, pricingRules, promoCodes, settings]);

  const availability = useMemo(() => {
    if (!villa) return { available: false };
    return checkVillaAvailability({
      villaId: villa.id,
      checkIn,
      checkOut,
      blockedDates,
      bookings,
    });
  }, [villa, checkIn, checkOut, blockedDates, bookings]);

  const next14Days = useMemo(() => {
    if (!villa) return [];
    const list: { date: string; label: string; status: "available" | "booked" | "blocked" }[] = [];
    const base = new Date("2026-10-15T00:00:00");
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const isBlk = blockedDates.some((b) => b.villaId === villa.id && b.date === dateStr);
      const isBkd = bookings.some(
        (bk) =>
          bk.villaId === villa.id &&
          bk.status !== "cancelled" &&
          dateStr >= bk.checkIn &&
          dateStr < bk.checkOut
      );
      list.push({
        date: dateStr,
        label: `${d.toLocaleString("en-US", { month: "short" })} ${dd}`,
        status: isBlk ? "blocked" : isBkd ? "booked" : "available",
      });
    }
    return list;
  }, [villa, blockedDates, bookings]);

  if (!villa) {
    return (
      <EditorialFrame>
        <div className="py-28 px-8 text-center max-w-xl mx-auto space-y-5">
          <p className="text-xs uppercase tracking-[0.25em] text-[#A48A63]">
            Residence Not Found
          </p>
          <h1 className="font-serif text-4xl text-[#F8F6F0]">
            This Residence Is Not in the Collection.
          </h1>
          <Link
            href="/villas"
            className="inline-block bg-[#EAE4D8] text-[#171A18] px-8 py-3 text-xs uppercase tracking-[0.2em]"
          >
            Back to All Residences
          </Link>
        </div>
      </EditorialFrame>
    );
  }

  const relatedVillas = villas
    .filter((v) => v.published && v.id !== villa.id)
    .slice(0, 3);

  const gallery =
    villa.gallery && villa.gallery.length > 0
      ? villa.gallery
      : [{ id: "default", url: villa.heroImage, alt: villa.name, caption: villa.shortDescription }];

  return (
    <EditorialFrame>
      {/* Top Breadcrumb Hairline Bar */}
      <div className="w-full px-8 md:px-14 py-4 border-b border-[#EAE4D8]/15 bg-[#171A18] flex items-center justify-between text-xs">
        <Link
          href="/villas"
          className="inline-flex items-center gap-2 text-[#C9BBA5] hover:text-[#F8F6F0] uppercase tracking-[0.2em]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Residences</span>
        </Link>
        <span className="text-[11px] uppercase tracking-[0.24em] text-[#A48A63]">
          Residence {villa.code} // {villa.location}
        </span>
      </div>

      {/* Full-Bleed Hero Photograph */}
      <section className="relative w-full h-[540px] md:h-[680px] bg-[#111412] border-b border-[#EAE4D8]/15 overflow-hidden">
        <img
          src={gallery[activeImageIdx]?.url || villa.heroImage}
          alt={gallery[activeImageIdx]?.alt || villa.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171A18] via-[#171A18]/30 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 border-t border-[#EAE4D8]/15 bg-[#171A18]/85 backdrop-blur-md px-8 md:px-14 py-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.26em] text-[#A48A63]">
              <span>{villa.code} — PRIVATE RESIDENCE</span>
              <span>•</span>
              <span className="text-[#EAE4D8] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#A48A63]" />
                {villa.location}, Labuan Bajo
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#F8F6F0] leading-none">
              {villa.name}
            </h1>
            <p className="text-sm text-[#C9BBA5] pt-1">{villa.shortDescription}</p>
          </div>

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="self-start lg:self-end bg-[#202420] hover:bg-[#25382F] text-[#EAE4D8] border border-[#EAE4D8]/30 px-6 py-3.5 text-xs uppercase tracking-[0.2em] flex items-center gap-2.5 transition"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#A48A63]" />
            <span>Full-Screen Monograph ({gallery.length} Photographs)</span>
          </button>
        </div>
      </section>

      {/* Flush 4-Column Gallery Strip */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#EAE4D8]/15 border-b border-[#EAE4D8]/15 bg-[#171A18]">
        {gallery.map((img, idx) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActiveImageIdx(idx)}
            className={`group relative aspect-[16/10] overflow-hidden text-left transition ${
              activeImageIdx === idx ? "ring-2 ring-inset ring-[#A48A63]" : "opacity-65 hover:opacity-100"
            }`}
          >
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-[#171A18]/85 px-3 py-2 text-[10px] uppercase tracking-wider text-[#EAE4D8] truncate border-t border-[#EAE4D8]/15">
              0{idx + 1} // {img.caption}
            </div>
          </button>
        ))}
      </div>

      {/* Full-Width Split: Left 7 Columns Architectural Details | Right 5 Columns Flush Reservation Console */}
      <section className="w-full bg-[#171A18] border-b border-[#EAE4D8]/15 grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 divide-y divide-[#EAE4D8]/15 border-b lg:border-b-0 lg:border-r border-[#EAE4D8]/15">
          {/* 4-Column Spec Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#EAE4D8]/15 bg-[#202420]">
            <div className="p-6">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#A5A69C] block">
                Bedrooms
              </span>
              <span className="font-serif text-3xl text-[#F8F6F0] mt-1 block">
                {villa.bedrooms} Suites
              </span>
            </div>
            <div className="p-6">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#A5A69C] block">
                Bathrooms
              </span>
              <span className="font-serif text-3xl text-[#F8F6F0] mt-1 block">
                {villa.bathrooms} Baths
              </span>
            </div>
            <div className="p-6">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#A5A69C] block">
                Occupancy
              </span>
              <span className="font-serif text-3xl text-[#F8F6F0] mt-1 block">
                Max {villa.maxGuests}
              </span>
            </div>
            <div className="p-6">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#A5A69C] block">
                Estate Area
              </span>
              <span className="font-serif text-3xl text-[#F8F6F0] mt-1 block">
                {villa.areaSqm} m²
              </span>
            </div>
          </div>

          {/* Architectural Narrative */}
          <div className="px-10 md:px-16 py-14 md:py-20 space-y-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#A48A63]">
              01 // ARCHITECTURAL NARRATIVE
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#F8F6F0]">{villa.tagline}</h2>
            <p className="text-sm text-[#C9BBA5] leading-relaxed">
              {villa.architecturalStory}
            </p>
          </div>

          {/* Distinguishing Features Matrix */}
          <div className="px-10 md:px-16 py-14 md:py-20 space-y-7">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#A48A63]">
              02 // DISTINGUISHING FEATURES
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-[#EAE4D8]/15">
              {villa.features.map((feat) => (
                <div
                  key={feat}
                  className="flex items-start gap-3 text-xs text-[#EAE4D8] p-4 border-r border-b border-[#EAE4D8]/15 bg-[#202420]/50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#A48A63] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="px-10 md:px-16 py-14 md:py-20 space-y-7">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#A48A63]">
              03 // RESIDENCE AMENITIES & HOSTING
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6">
              {villa.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 text-xs text-[#C9BBA5] py-2 border-b border-[#EAE4D8]/10"
                >
                  <Check className="w-3.5 h-3.5 text-[#A48A63] shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 14-Day Availability Matrix */}
          <div className="px-10 md:px-16 py-14 md:py-20 space-y-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#A48A63]">
                04 // 14-DAY AVAILABILITY MATRIX (SIMULATED)
              </p>
              <div className="flex items-center gap-5 text-[10px] uppercase tracking-widest">
                <span className="flex items-center gap-2 text-[#EAE4D8]">
                  <span className="w-2.5 h-2.5 bg-[#25382F] border border-[#A48A63]" />
                  Available
                </span>
                <span className="flex items-center gap-2 text-[#A5A69C]">
                  <span className="w-2.5 h-2.5 bg-[#202420]" />
                  Reserved / Held
                </span>
              </div>
            </div>
            <div className="grid grid-cols-7 border-t border-l border-[#EAE4D8]/15">
              {next14Days.map((item) => (
                <div
                  key={item.date}
                  className={`p-3 border-r border-b border-[#EAE4D8]/15 text-center ${
                    item.status === "available"
                      ? "bg-[#25382F]/35 text-[#EAE4D8]"
                      : "bg-[#202420] text-[#656D5D] line-through"
                  }`}
                >
                  <span className="block text-[10px] uppercase">{item.label}</span>
                  <span className="block text-[9px] mt-1 uppercase tracking-wider">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules */}
          <div className="px-10 md:px-16 py-14 md:py-20 space-y-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#A48A63]">
              05 // RESIDENCE GUIDELINES
            </p>
            <ul className="space-y-2.5 text-xs text-[#A5A69C]">
              {villa.houseRules.map((rule) => (
                <li key={rule} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#A48A63] mt-1.5 shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right 5 Columns: Flush Architectural Reservation Console */}
        <div className="lg:col-span-5 bg-[#202420] px-10 md:px-14 py-14 md:py-20 space-y-10">
          <div className="flex items-baseline justify-between border-b border-[#EAE4D8]/15 pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#A48A63] block">
                Base Nightly Rate
              </span>
              <span className="font-serif text-4xl text-[#F8F6F0] mt-1 block">
                {formatIdr(villa.baseNightlyRate)}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#A48A63] border border-[#A48A63]/50 px-3 py-1.5">
              Min. {villa.minStayNights} Nights
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 border border-[#EAE4D8]/20 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE4D8]/20 bg-[#171A18]">
            <div className="p-4">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#A48A63] mb-1.5">
                Check-In Date
              </label>
              <input
                type="date"
                value={checkIn}
                min="2026-10-14"
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-xs text-[#EAE4D8] focus:outline-none"
              />
            </div>
            <div className="p-4">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#A48A63] mb-1.5">
                Check-Out Date
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-xs text-[#EAE4D8] focus:outline-none"
              />
            </div>
          </div>

          <div className="border border-[#EAE4D8]/20 bg-[#171A18] p-4">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#A48A63] mb-1.5">
              Registered Guests (Max {villa.maxGuests})
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-[#171A18] text-xs text-[#EAE4D8] focus:outline-none"
            >
              {Array.from({ length: villa.maxGuests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Guest" : "Guests"}
                  {n > villa.baseIncludedGuests
                    ? ` (+${formatIdr(villa.extraGuestFee)}/night extra guest)`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {!availability.available && (
            <div className="p-4 bg-[#A48A63]/15 border-l-2 border-[#A48A63] text-xs text-[#EAE4D8]">
              {availability.conflictReason}. Please select alternative dates.
            </div>
          )}

          {quote && !quote.valid && (
            <div className="p-4 bg-red-950/60 border-l-2 border-red-400 text-xs text-red-200">
              {quote.error}
            </div>
          )}

          {quote && quote.valid && (
            <div className="border-t border-b border-[#EAE4D8]/15 py-6 space-y-3 text-xs">
              <div className="flex justify-between text-[#C9BBA5]">
                <span>Residence Stay ({quote.nights} nights)</span>
                <span className="text-[#EAE4D8]">{formatIdr(quote.nightlySubtotal)}</span>
              </div>
              {quote.extraGuestSubtotal > 0 && (
                <div className="flex justify-between text-[#C9BBA5]">
                  <span>
                    Extra Guests ({quote.extraGuestCount} × {quote.nights} nights)
                  </span>
                  <span className="text-[#EAE4D8]">{formatIdr(quote.extraGuestSubtotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#A5A69C]">
                <span>Service & Host Fee ({settings.serviceFeePercent}%)</span>
                <span>{formatIdr(quote.serviceFeeAmount)}</span>
              </div>
              <div className="flex justify-between text-[#A5A69C]">
                <span>Regional Hospitality Tax ({settings.taxPercent}%)</span>
                <span>{formatIdr(quote.taxAmount)}</span>
              </div>
              <div className="pt-4 border-t border-[#EAE4D8]/15 flex justify-between items-baseline">
                <span className="uppercase tracking-[0.2em] text-[#EAE4D8] font-semibold">
                  Estimated Total
                </span>
                <span className="font-serif text-3xl text-[#F8F6F0]">
                  {formatIdr(quote.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[#A48A63] pt-1">
                <span>Simulated Deposit ({settings.depositPercent}%)</span>
                <span>{formatIdr(quote.depositAmount)}</span>
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={!quote?.valid || !availability.available}
            onClick={() =>
              router.push(
                `/booking?villa=${villa.slug}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
              )
            }
            className="w-full bg-[#EAE4D8] hover:bg-[#C9BBA5] disabled:opacity-40 text-[#171A18] py-4 text-xs uppercase tracking-[0.22em] font-semibold flex items-center justify-center gap-3 transition"
          >
            <span>Proceed to Reservation</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-[#A5A69C] leading-relaxed">
            Includes complimentary private harbor transfer from Komodo International Airport (LBJ).
          </p>
        </div>
      </section>

      {/* Related Residences — Flush 3-Column Strip */}
      <section className="w-full bg-[#171A18] border-t border-[#EAE4D8]/15">
        <div className="px-8 md:px-14 pt-14 pb-12 md:pt-20 md:pb-16 border-b border-[#EAE4D8]/15 flex items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#A48A63]">
              CONTINUE EXPLORING
            </p>
            <h2 className="font-serif text-3xl text-[#F8F6F0] mt-1">
              Other Residences in the Collection
            </h2>
          </div>
          <Link
            href="/villas"
            className="text-xs uppercase tracking-[0.22em] text-[#EAE4D8] hover:text-[#A48A63]"
          >
            View All →
          </Link>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#EAE4D8]/15">
          {relatedVillas.map((rel) => (
            <Link
              key={rel.id}
              href={`/villas/${rel.slug}`}
              className="group bg-[#171A18] hover:bg-[#202420] flex flex-col justify-between transition"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-[#EAE4D8]/15">
                <img
                  src={rel.heroImage}
                  alt={rel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-0 left-0 bg-[#171A18]/90 px-3.5 py-1.5 text-[10px] uppercase tracking-widest text-[#EAE4D8] border-r border-b border-[#EAE4D8]/20">
                  {rel.code} // {rel.location}
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-[#F8F6F0]">{rel.name}</h3>
                  <p className="text-xs text-[#A5A69C] mt-0.5">
                    {rel.bedrooms} Bedrooms • Up to {rel.maxGuests} Guests
                  </p>
                </div>
                <span className="text-xs text-[#EAE4D8] font-semibold">
                  {formatIdr(rel.baseNightlyRate)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="max-w-5xl w-full space-y-4">
            <div className="flex items-center justify-between text-[#EAE4D8] border-b border-[#EAE4D8]/20 pb-3">
              <span className="font-serif text-2xl">
                {villa.name} — Monograph ({activeImageIdx + 1}/{gallery.length})
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2 border border-[#EAE4D8]/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-[16/10] overflow-hidden border border-[#EAE4D8]/20 bg-[#111412]">
              <img
                src={gallery[activeImageIdx]?.url}
                alt={gallery[activeImageIdx]?.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-[#C9BBA5] text-center">
              {gallery[activeImageIdx]?.caption}
            </p>
          </div>
        </div>
      )}
    </EditorialFrame>
  );
}
