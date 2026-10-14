"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EditorialFrame } from "@/components/EditorialFrame";
import { useSelat } from "@/context/SelatContext";
import { INITIAL_TESTIMONIALS, EDITORIAL_IMAGES } from "@/data/seed";
import { formatIdr } from "@/lib/pricing";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Compass,
  Waves,
  Droplets,
  Anchor,
  Utensils,
  Sparkles,
  Quote,
  X,
} from "lucide-react";

const SIGNATURE_EXPERIENCES = [
  {
    id: "exp-1",
    code: "01",
    title: "Private Residences",
    description: "Distinct spaces designed around privacy and comfort.",
    detail:
      "Each residence is positioned on its own coastal contour or hillside ridge, ensuring uninterrupted sightlines toward the Flores Sea and complete acoustic privacy.",
    icon: Compass,
  },
  {
    id: "exp-2",
    code: "02",
    title: "Oceanfront Living",
    description: "Expansive views and open-air terraces.",
    detail:
      "Retractable glazing and cantilevered ironwood decks merge indoor salons with the sea breeze, framing shifting light from dawn over Flores to amber Komodo sunsets.",
    icon: Waves,
  },
  {
    id: "exp-3",
    code: "03",
    title: "Private Pool",
    description: "A slower rhythm beside the water.",
    detail:
      "Every villa features a private mineral or saltwater infinity pool engineered to align with the horizon line of Waecicu Bay, Wae Rana, or the Rinca channel.",
    icon: Droplets,
  },
  {
    id: "exp-4",
    code: "04",
    title: "Island Journeys",
    description: "Curated exploration of the surrounding archipelago.",
    detail:
      "Embark directly from private moorings aboard custom wooden phinisi yachts for dawn treks on Padar, drift snorkeling at Manta Point, and quiet pink-sand coves.",
    icon: Anchor,
  },
  {
    id: "exp-5",
    code: "05",
    title: "Local Dining",
    description: "Thoughtfully prepared meals inspired by local flavors.",
    detail:
      "Our private chefs work with morning line-caught reef fish, sea salt from eastern Flores, organic Bajawa highland coffee, and heritage archipelago spices.",
    icon: Utensils,
  },
  {
    id: "exp-6",
    code: "06",
    title: "Personal Hosting",
    description: "Attentive service shaped around each guest.",
    detail:
      "A dedicated Residence Host coordinates private airport tenders, in-villa botanical spa rituals, and unhurried dining according to your personal rhythm.",
    icon: Sparkles,
  },
];

export default function HomePage() {
  const { villas, settings } = useSelat();
  const publishedVillas = villas.filter((v) => v.published);
  const featuredVilla =
    publishedVillas.find((v) => v.slug === "layar-house") || publishedVillas[0];
  const totalGuestCapacity = publishedVillas.reduce((sum, v) => sum + v.maxGuests, 0);
  const totalSuites = publishedVillas.reduce((sum, v) => sum + v.bedrooms, 0);

  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [selectedExperience, setSelectedExperience] = useState<
    (typeof SIGNATURE_EXPERIENCES)[0] | null
  >(null);

  const currentTestimonial = INITIAL_TESTIMONIALS[testimonialIdx];

  return (
    <EditorialFrame>
      {/* SECTION 1 — FULL-BLEED ARCHITECTURAL HERO (NO INSET CARD) */}
      <section className="relative w-full min-h-[88vh] bg-[#171A18] border-b border-[#EAE4D8]/15 flex flex-col justify-between overflow-hidden">
        {/* Full-Bleed Real Villa Photograph */}
        <div className="absolute inset-0 z-0">
          <img
            src={EDITORIAL_IMAGES.heroMain}
            alt="SELAT Private Island Villa overlooking the Flores Sea at twilight"
            className="w-full h-full object-cover object-center scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171A18] via-[#171A18]/55 to-[#171A18]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171A18]/85 via-[#171A18]/25 to-[#171A18]/65" />
        </div>

        {/* Giant Edge-to-Edge Background Wordmark */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none relative z-10 w-full pt-10 md:pt-14 overflow-hidden flex justify-center"
        >
          <span className="font-serif font-normal text-[23vw] leading-[0.78] tracking-[0.16em] text-[#EAE4D8]/[0.11] uppercase">
            {settings.brandName}
          </span>
        </div>

        {/* Top Coordinates Strip */}
        <div className="relative z-10 w-full px-8 md:px-14 py-5 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-[#EAE4D8]/80">
          <span className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-[#A48A63]" />
            <span>Labuan Bajo • East Nusa Tenggara</span>
          </span>
          <span className="hidden sm:inline text-[#C9BBA5]">
            8°27&apos;14″S 119°52&apos;08″E — Komodo Strait
          </span>
        </div>

        {/* Full-Width Bottom Architectural Split Grid (Flush Hairlines, Zero Floating Cards) */}
        <div className="relative z-10 w-full border-t border-[#EAE4D8]/20 bg-[#171A18]/80 backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE4D8]/15">
          <div className="lg:col-span-8 px-10 md:px-14 lg:px-16 pt-14 pb-16 md:pt-16 md:pb-20 space-y-7">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#A48A63] flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#A48A63]" />
              <span>01 // PRIVATE ISLAND COLLECTION</span>
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-[68px] text-[#F8F6F0] leading-[1.02] tracking-tight max-w-3xl">
              Somewhere Between Sea and Stillness.
            </h1>
            <p className="text-sm md:text-base text-[#C9BBA5] max-w-xl leading-relaxed">
              Private residences shaped by the rugged beauty of Labuan Bajo.
            </p>

            <div className="pt-3 flex flex-wrap items-stretch gap-4">
              <Link
                href="/villas"
                className="bg-[#EAE4D8] text-[#171A18] hover:bg-[#C9BBA5] px-8 py-4 text-xs uppercase tracking-[0.22em] font-semibold flex items-center gap-3 transition"
              >
                <span>Explore Residences</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <a
                href="#story"
                className="border border-[#EAE4D8]/35 hover:border-[#EAE4D8] hover:bg-[#202420] text-[#EAE4D8] px-8 py-4 text-xs uppercase tracking-[0.22em] flex items-center transition"
              >
                Discover the Island
              </a>
            </div>
          </div>

          {/* Flush Architectural Specification Column — real collection facts */}
          <div className="lg:col-span-4 grid grid-rows-3 divide-y divide-[#EAE4D8]/15">
            <div className="px-8 md:px-12 py-7 md:py-8 flex items-baseline justify-between gap-4">
              <span className="font-serif text-4xl text-[#F8F6F0]">
                {String(publishedVillas.length).padStart(2, "0")}
              </span>
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#C9BBA5] text-right">
                Private Residences
              </span>
            </div>
            <div className="px-8 md:px-12 py-7 md:py-8 flex items-baseline justify-between gap-4">
              <span className="font-serif text-4xl text-[#F8F6F0]">
                {String(totalGuestCapacity).padStart(2, "0")}
              </span>
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#C9BBA5] text-right">
                Guests Total Capacity • {totalSuites} Suites
              </span>
            </div>
            <div className="px-8 md:px-12 py-7 md:py-8 flex items-baseline justify-between gap-4">
              <span className="font-serif text-4xl tracking-[0.08em] text-[#F8F6F0]">
                LBJ
              </span>
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#A5A69C] text-right">
                Private Harbor Transfer
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — ABOUT SELAT (FULL-WIDTH EDGE-TO-EDGE SPLIT) */}
      <section
        id="story"
        className="w-full bg-[#171A18] border-b border-[#EAE4D8]/15 grid grid-cols-1 lg:grid-cols-12"
      >
        <div className="lg:col-span-5 px-10 md:px-16 lg:px-24 py-16 md:py-24 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EAE4D8]/15 space-y-12">
          <div className="space-y-7">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#A48A63] flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#A48A63]" />
              <span>02 // ABOUT SELAT</span>
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#F8F6F0] leading-[1.08]">
              Rooted in the land.
              <br />
              Drawn to the sea.
            </h2>
            <p className="text-sm text-[#C9BBA5] leading-relaxed">
              Named after the calm maritime straits of eastern Indonesia, SELAT represents a quieter approach to island hospitality. Rather than imposing ornate resort conventions onto Flores, each residence is sculpted from local sandstone, reclaimed ironwood, and hand-troweled plaster to honor the dry tropical hills and luminous waters of Labuan Bajo.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-t border-[#EAE4D8]/15 divide-y divide-[#EAE4D8]/15">
              <div className="flex items-center justify-between py-4">
                <span className="text-xs uppercase tracking-[0.22em] text-[#F8F6F0]">
                  01 — Thoughtful by Nature
                </span>
                <span className="text-[11px] text-[#A5A69C] uppercase tracking-wider">
                  Low-impact coastal form
                </span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-xs uppercase tracking-[0.22em] text-[#F8F6F0]">
                  02 — Quietly Distinct
                </span>
                <span className="text-[11px] text-[#A5A69C] uppercase tracking-wider">
                  Four singular estates
                </span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-[#EAE4D8]/15">
                <span className="text-xs uppercase tracking-[0.22em] text-[#F8F6F0]">
                  03 — Personal Hospitality
                </span>
                <span className="text-[11px] text-[#A5A69C] uppercase tracking-wider">
                  Dedicated hosts & tenders
                </span>
              </div>
            </div>

            <Link
              href="/villas"
              className="inline-flex items-center gap-3 border border-[#EAE4D8]/35 hover:border-[#EAE4D8] hover:bg-[#202420] text-[#EAE4D8] px-7 py-3.5 text-xs uppercase tracking-[0.22em] transition"
            >
              <span>Discover Our Philosophy</span>
              <ArrowUpRight className="w-4 h-4 text-[#A48A63]" />
            </Link>
          </div>
        </div>

        {/* Flush Edge-to-Edge Right Photograph */}
        <div className="lg:col-span-7 relative min-h-[480px] lg:min-h-[680px] bg-[#202420]">
          <img
            src={EDITORIAL_IMAGES.aboutArchitecture}
            alt="Contemporary tropical timber and stone villa overlooking Flores waters"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171A18]/85 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 border-t border-[#EAE4D8]/15 bg-[#171A18]/90 backdrop-blur-md px-8 md:px-12 py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#A48A63]">
                Spaces Shaped by the Island
              </p>
              <p className="font-serif text-xl text-[#F8F6F0] mt-1">
                &ldquo;Architecture that listens to the trade winds and lets the Flores horizon speak first.&rdquo;
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#A5A69C] shrink-0">
              Waecicu & Wae Rana
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 3 — SIGNATURE EXPERIENCES (FULL-WIDTH 6-COLUMN ARCHITECTURAL MATRIX) */}
      <section id="experiences" className="w-full bg-[#202420] border-b border-[#EAE4D8]/15">
        <div className="w-full px-8 md:px-14 lg:px-20 pt-24 pb-20 md:pt-32 md:pb-24 border-b border-[#EAE4D8]/15 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#A48A63] flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#A48A63]" />
              <span>03 // THE SELAT EXPERIENCE</span>
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#F8F6F0] leading-[1.08]">
              Thoughtful Details.
              <br />
              Unforgettable Stays.
            </h2>
          </div>
          <p className="text-xs md:text-sm text-[#C9BBA5] max-w-md leading-relaxed">
            Every stay is tailored around your pace—whether spending uninterrupted days beside your horizon pool or sailing at dawn into the Komodo archipelago.
          </p>
        </div>

        {/* Flush 6-Column Hairline Grid — Zero Floating Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE4D8]/15 bg-[#171A18]">
          {SIGNATURE_EXPERIENCES.map((exp) => {
            const Icon = exp.icon;
            return (
              <button
                key={exp.id}
                type="button"
                onClick={() => setSelectedExperience(exp)}
                className="text-left group hover:bg-[#25382F]/40 p-8 lg:p-10 flex flex-col justify-between min-h-[320px] transition"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-9 h-9 border border-[#EAE4D8]/20 flex items-center justify-center text-[#A48A63] group-hover:border-[#A48A63]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono tracking-[0.22em] text-[#A5A69C]">
                    {exp.code}
                  </span>
                </div>

                <div className="my-10 space-y-3">
                  <h3 className="font-serif text-2xl text-[#F8F6F0]">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-[#A5A69C] leading-relaxed">
                    {exp.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#EAE4D8]/10 w-full">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#C9BBA5]">
                    Inspect Detail
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#A48A63] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </button>
            );
          })}
        </div>

        {selectedExperience && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#202420] border border-[#EAE4D8]/30 max-w-lg w-full p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-[#EAE4D8]/15 pb-4">
                <span className="text-[10px] uppercase tracking-[0.26em] text-[#A48A63]">
                  Experience {selectedExperience.code}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedExperience(null)}
                  className="text-[#A5A69C] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-serif text-3xl text-[#F8F6F0]">
                {selectedExperience.title}
              </h3>
              <p className="text-xs text-[#C9BBA5] leading-relaxed">
                {selectedExperience.detail}
              </p>
              <div className="pt-4 flex items-center justify-between border-t border-[#EAE4D8]/15">
                <Link
                  href="/booking"
                  className="bg-[#EAE4D8] text-[#171A18] px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold"
                >
                  Include in Stay
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedExperience(null)}
                  className="text-xs uppercase tracking-widest text-[#A5A69C] hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 4 — SELECTED RESIDENCES (FULL-WIDTH 4-COLUMN EDGE-TO-EDGE GALLERY) */}
      <section className="w-full bg-[#171A18] border-b border-[#EAE4D8]/15">
        <div className="w-full px-8 md:px-14 lg:px-20 pt-24 pb-20 md:pt-32 md:pb-24 border-b border-[#EAE4D8]/15 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#A48A63] flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#A48A63]" />
              <span>04 // THE PRIVATE COLLECTION</span>
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#F8F6F0] leading-[1.08]">
              Distinct Places.
              <br />
              One Extraordinary Setting.
            </h2>
          </div>
          <Link
            href="/villas"
            className="self-start md:self-end inline-flex items-center gap-3 border border-[#EAE4D8]/35 hover:border-[#EAE4D8] hover:bg-[#202420] px-7 py-3.5 text-xs uppercase tracking-[0.22em] text-[#EAE4D8] transition"
          >
            <span>Filter & Compare All ({publishedVillas.length})</span>
            <ArrowUpRight className="w-4 h-4 text-[#A48A63]" />
          </Link>
        </div>

        {/* Flush 4-Column Architectural Gallery — Edge-to-Edge Photos & Hairlines */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#EAE4D8]/15">
          {publishedVillas.map((villa) => (
            <Link
              key={villa.id}
              href={`/villas/${villa.slug}`}
              className="group bg-[#171A18] hover:bg-[#202420] flex flex-col justify-between transition"
            >
              <div>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111412] border-b border-[#EAE4D8]/15">
                  <img
                    src={villa.heroImage}
                    alt={`${villa.name} — ${villa.location}, Labuan Bajo`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171A18]/80 via-transparent to-transparent" />
                  <div className="absolute top-0 left-0 bg-[#171A18]/90 border-r border-b border-[#EAE4D8]/20 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[#EAE4D8]">
                    {villa.code} // {villa.location}
                  </div>
                </div>

                <div className="p-8 md:p-9 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-3xl text-[#F8F6F0] group-hover:text-[#C9BBA5] transition">
                      {villa.name}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[#A48A63]" />
                  </div>
                  <p className="text-xs text-[#A5A69C] line-clamp-2 leading-relaxed">
                    {villa.shortDescription}
                  </p>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-[#EAE4D8]/15 bg-[#141715]/60 space-y-3">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#C9BBA5]">
                  <span>{villa.bedrooms} Bedrooms</span>
                  <span>•</span>
                  <span>Up to {villa.maxGuests} Guests</span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#A5A69C]">
                    Nightly Rate
                  </span>
                  <span className="text-xs font-semibold text-[#EAE4D8]">
                    {formatIdr(villa.baseNightlyRate)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 5 — FEATURED RESIDENCE (FULL-WIDTH EDGE-TO-EDGE MONOGRAPH SPLIT) */}
      {featuredVilla && (
        <section className="w-full bg-[#202420] border-b border-[#EAE4D8]/15 grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 px-10 md:px-16 lg:px-24 py-16 md:py-24 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EAE4D8]/15 space-y-12">
            <div className="space-y-7">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#A48A63] flex items-center gap-3">
                <span className="w-6 h-[1px] bg-[#A48A63]" />
                <span>05 // FEATURED RESIDENCE</span>
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#F8F6F0] leading-[1.08]">
                An Open Horizon.
                <br />
                Your Own Sanctuary.
              </h2>
              <p className="text-sm text-[#C9BBA5] leading-relaxed">
                {featuredVilla.architecturalStory}
              </p>
            </div>

            {/* Flush 2x2 Architectural Spec Matrix */}
            <div className="space-y-8">
              <div className="grid grid-cols-2 border-y border-[#EAE4D8]/15 divide-x divide-[#EAE4D8]/15">
                <div className="p-5">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#A5A69C] block">
                    Location
                  </span>
                  <span className="font-serif text-2xl text-[#F8F6F0] mt-1 block">
                    {featuredVilla.location}
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#A5A69C] block">
                    Accommodation
                  </span>
                  <span className="font-serif text-2xl text-[#F8F6F0] mt-1 block">
                    {featuredVilla.bedrooms} Ocean Suites
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-[#EAE4D8]/15 divide-x divide-[#EAE4D8]/15 -mt-8">
                <div className="p-5">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#A5A69C] block">
                    Capacity
                  </span>
                  <span className="font-serif text-2xl text-[#F8F6F0] mt-1 block">
                    Up to {featuredVilla.maxGuests} Guests
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#A5A69C] block">
                    Nightly Rate
                  </span>
                  <span className="font-serif text-2xl text-[#A48A63] mt-1 block">
                    {formatIdr(featuredVilla.baseNightlyRate)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-stretch gap-4">
                <Link
                  href={`/villas/${featuredVilla.slug}`}
                  className="bg-[#EAE4D8] text-[#171A18] hover:bg-[#C9BBA5] px-8 py-4 text-xs uppercase tracking-[0.22em] font-semibold inline-flex items-center gap-3 transition"
                >
                  <span>Discover {featuredVilla.name}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/booking?villa=${featuredVilla.slug}`}
                  className="border border-[#EAE4D8]/35 text-[#EAE4D8] hover:border-[#EAE4D8] hover:bg-[#171A18] px-7 py-4 text-xs uppercase tracking-[0.2em] transition"
                >
                  Reserve Dates
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative min-h-[480px] lg:min-h-[680px] bg-[#111412]">
            <img
              src={featuredVilla.heroImage}
              alt={`${featuredVilla.name} panoramic horizon pool in Waecicu Bay`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171A18]/85 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 border-t border-[#EAE4D8]/15 bg-[#171A18]/90 backdrop-blur-md px-8 md:px-12 py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#EAE4D8]">
              <span className="font-serif text-2xl">
                {featuredVilla.code} — {featuredVilla.name} ({featuredVilla.areaSqm} m² Coastal Estate)
              </span>
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#A48A63]">
                {featuredVilla.coordinates}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6 — GUEST NOTES (FULL-WIDTH ARCHITECTURAL BAND, NO FLOATING CARD) */}
      <section className="w-full bg-[#171A18] border-b border-[#EAE4D8]/15 grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-4 px-10 md:px-16 lg:px-24 py-16 md:py-24 border-b lg:border-b-0 lg:border-r border-[#EAE4D8]/15 flex flex-col justify-between space-y-10">
          <div className="space-y-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#A48A63] flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#A48A63]" />
              <span>06 // GUEST NOTES</span>
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#F8F6F0] leading-[1.08]">
              Made for Moments
              <br />
              Worth Remembering.
            </h2>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() =>
                setTestimonialIdx((prev) =>
                  prev === 0 ? INITIAL_TESTIMONIALS.length - 1 : prev - 1
                )
              }
              aria-label="Previous Guest Note"
              className="w-12 h-12 border border-[#EAE4D8]/25 hover:border-[#EAE4D8] hover:bg-[#202420] flex items-center justify-center text-[#EAE4D8] transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono tracking-[0.24em] text-[#C9BBA5] px-2">
              0{testimonialIdx + 1} / 0{INITIAL_TESTIMONIALS.length}
            </span>
            <button
              type="button"
              onClick={() =>
                setTestimonialIdx((prev) =>
                  prev === INITIAL_TESTIMONIALS.length - 1 ? 0 : prev + 1
                )
              }
              aria-label="Next Guest Note"
              className="w-12 h-12 border border-[#EAE4D8]/25 hover:border-[#EAE4D8] hover:bg-[#202420] flex items-center justify-center text-[#EAE4D8] transition"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 px-10 md:px-16 lg:px-24 py-16 md:py-24 bg-[#202420] flex flex-col justify-between space-y-10">
          <div className="flex items-center justify-between">
            <Quote className="w-9 h-9 text-[#A48A63]" />
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#A48A63] border border-[#A48A63]/40 px-4 py-1.5">
              {currentTestimonial.ratingLabel}
            </span>
          </div>

          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#F8F6F0] leading-[1.35]">
            &ldquo;{currentTestimonial.quote}&rdquo;
          </blockquote>

          <div className="pt-6 border-t border-[#EAE4D8]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <p className="text-[#EAE4D8] font-semibold uppercase tracking-[0.22em]">
                {currentTestimonial.guestName}
              </p>
              <p className="text-[#A5A69C] mt-1">{currentTestimonial.context}</p>
            </div>
            <span className="text-[10px] text-[#A48A63] uppercase tracking-[0.2em]">
              Illustrative Demonstration Content
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 7 — FINAL BOOKING CTA (FULL-WIDTH EDGE-TO-EDGE SPLIT) */}
      <section className="w-full bg-[#171A18] grid grid-cols-1 lg:grid-cols-12 border-b border-[#EAE4D8]/15">
        <div className="lg:col-span-7 relative min-h-[420px] lg:min-h-[540px] border-b lg:border-b-0 lg:border-r border-[#EAE4D8]/15">
          <img
            src={EDITORIAL_IMAGES.ctaTwilight}
            alt="Illuminated oceanfront villa terrace and infinity pool at twilight"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#171A18]/75 hidden lg:block" />
        </div>

        <div className="lg:col-span-5 px-10 md:px-16 lg:px-24 py-16 md:py-24 bg-[#25382F]/35 flex flex-col justify-center space-y-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#A48A63] flex items-center gap-3">
            <span className="w-6 h-[1px] bg-[#A48A63]" />
            <span>07 // PRIVATE RESERVATIONS</span>
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#F8F6F0] leading-[1.08]">
            Your Island Story
            <br />
            Starts Here.
          </h2>
          <p className="text-sm text-[#C9BBA5] leading-relaxed">
            Find a quieter rhythm in a place shaped by open horizons and thoughtful hospitality.
          </p>
          <div className="pt-4 flex flex-wrap items-stretch gap-4">
            <Link
              href="/villas"
              className="bg-[#EAE4D8] text-[#171A18] hover:bg-[#C9BBA5] px-8 py-4 text-xs uppercase tracking-[0.22em] font-semibold inline-flex items-center gap-3 transition"
            >
              <span>Find Your Residence</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/booking"
              className="border border-[#EAE4D8]/35 text-[#EAE4D8] hover:border-[#EAE4D8] hover:bg-[#171A18] px-7 py-4 text-xs uppercase tracking-[0.22em] inline-flex items-center transition"
            >
              Enquire About Your Stay
            </Link>
          </div>
        </div>
      </section>
    </EditorialFrame>
  );
}
