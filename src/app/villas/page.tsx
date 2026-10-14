"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { EditorialFrame } from "@/components/EditorialFrame";
import { useSelat } from "@/context/SelatContext";
import { formatIdr, checkVillaAvailability } from "@/lib/pricing";
import { ArrowUpRight, X, CheckCircle2, Clock } from "lucide-react";

export default function VillasListingPage() {
  const { villas, blockedDates, bookings } = useSelat();
  const publishedVillas = villas.filter((v) => v.published);

  const [checkIn, setCheckIn] = useState("2026-11-12");
  const [checkOut, setCheckOut] = useState("2026-11-15");
  const [guests, setGuests] = useState(2);
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [selectedAmenity, setSelectedAmenity] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "capacity">(
    "featured"
  );

  const locations = useMemo(() => {
    return Array.from(new Set(publishedVillas.map((v) => v.location)));
  }, [publishedVillas]);

  const allAmenities = useMemo(() => {
    const set = new Set<string>();
    publishedVillas.forEach((v) => v.amenities.forEach((a) => set.add(a)));
    return Array.from(set);
  }, [publishedVillas]);

  const filteredVillas = useMemo(() => {
    return publishedVillas
      .filter((villa) => {
        if (guests > villa.maxGuests) return false;
        if (minBedrooms > 0 && villa.bedrooms < minBedrooms) return false;
        if (selectedLocation !== "ALL" && villa.location !== selectedLocation) return false;
        if (selectedAmenity !== "ALL" && !villa.amenities.includes(selectedAmenity))
          return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.baseNightlyRate - b.baseNightlyRate;
        if (sortBy === "price-desc") return b.baseNightlyRate - a.baseNightlyRate;
        if (sortBy === "capacity") return b.maxGuests - a.maxGuests;
        return a.code.localeCompare(b.code);
      });
  }, [publishedVillas, guests, minBedrooms, selectedLocation, selectedAmenity, sortBy]);

  const clearFilters = () => {
    setGuests(2);
    setMinBedrooms(0);
    setSelectedLocation("ALL");
    setSelectedAmenity("ALL");
    setSortBy("featured");
  };

  return (
    <EditorialFrame>
      {/* Full-Width Architectural Header Band */}
      <section className="w-full px-8 md:px-14 lg:px-20 pt-24 pb-20 md:pt-32 md:pb-24 border-b border-[#EAE4D8]/15 bg-[#171A18]">
        <div className="max-w-3xl space-y-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#A48A63] flex items-center gap-3">
            <span className="w-6 h-[1px] bg-[#A48A63]" />
            <span>THE PRIVATE COLLECTION • LABUAN BAJO</span>
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#F8F6F0] leading-[1.04]">
            Private Residences.
            <br />
            Open Horizons.
          </h1>
          <p className="text-sm md:text-base text-[#C9BBA5] leading-relaxed">
            Explore our collection of architect-designed coastal and hillside sanctuaries across Waecicu Bay, Wae Rana, Labuan Bajo Hills, and Golo Mori.
          </p>
        </div>
      </section>

      {/* Full-Width Flush Filter Ledger Strip (No Floating Box) */}
      <section className="w-full bg-[#202420] border-b border-[#EAE4D8]/15">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE4D8]/15">
          <div className="p-5">
            <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
              Check-In Date
            </label>
            <input
              type="date"
              value={checkIn}
              min="2026-10-14"
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2 text-xs text-[#EAE4D8]"
            />
          </div>
          <div className="p-5">
            <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
              Check-Out Date
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2 text-xs text-[#EAE4D8]"
            />
          </div>
          <div className="p-5">
            <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2 text-xs text-[#EAE4D8]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>
          <div className="p-5">
            <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
              Bedrooms
            </label>
            <select
              value={minBedrooms}
              onChange={(e) => setMinBedrooms(Number(e.target.value))}
              className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2 text-xs text-[#EAE4D8]"
            >
              <option value={0}>Any Bedrooms</option>
              <option value={2}>2+ Bedrooms</option>
              <option value={3}>3+ Bedrooms</option>
              <option value={4}>4 Bedrooms</option>
            </select>
          </div>
          <div className="p-5">
            <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2 text-xs text-[#EAE4D8]"
            >
              <option value="ALL">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className="p-5">
            <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2 text-xs text-[#EAE4D8]"
            >
              <option value="featured">Editorial Index</option>
              <option value="price-asc">Rate: Low to High</option>
              <option value="price-desc">Rate: High to Low</option>
              <option value="capacity">Guest Capacity</option>
            </select>
          </div>
        </div>

        {/* Flush Amenity Filter Bar */}
        <div className="w-full px-8 py-5 border-t border-[#EAE4D8]/15 bg-[#171A18] flex flex-wrap items-center justify-between gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#A5A69C] mr-2">
              Amenity Filter:
            </span>
            <button
              type="button"
              onClick={() => setSelectedAmenity("ALL")}
              className={`px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] transition ${
                selectedAmenity === "ALL"
                  ? "bg-[#EAE4D8] text-[#171A18] font-semibold"
                  : "bg-[#202420] text-[#C9BBA5] border border-[#EAE4D8]/15"
              }`}
            >
              All
            </button>
            {allAmenities.slice(0, 5).map((am) => (
              <button
                key={am}
                type="button"
                onClick={() => setSelectedAmenity(am === selectedAmenity ? "ALL" : am)}
                className={`px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] transition ${
                  selectedAmenity === am
                    ? "bg-[#EAE4D8] text-[#171A18] font-semibold"
                    : "bg-[#202420] text-[#C9BBA5] border border-[#EAE4D8]/15"
                }`}
              >
                {am}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5 text-xs">
            <span className="text-[#C9BBA5] text-[11px] uppercase tracking-wider">
              Displaying <strong>{filteredVillas.length}</strong> of {publishedVillas.length} Residences
            </span>
            <button
              type="button"
              onClick={clearFilters}
              className="text-[#A48A63] hover:text-[#EAE4D8] inline-flex items-center gap-1 uppercase tracking-[0.2em] text-[10px]"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </section>

      {/* Full-Width Edge-to-Edge Residence Rows (Zero Cards) */}
      <section className="w-full bg-[#171A18] divide-y divide-[#EAE4D8]/15 border-b border-[#EAE4D8]/15">
        {filteredVillas.length === 0 ? (
          <div className="py-24 px-8 text-center space-y-5">
            <p className="text-xs uppercase tracking-[0.26em] text-[#A48A63]">
              No Matching Residences
            </p>
            <h2 className="font-serif text-4xl text-[#F8F6F0]">
              Refine Your Search Parameters
            </h2>
            <button
              type="button"
              onClick={clearFilters}
              className="bg-[#EAE4D8] text-[#171A18] px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredVillas.map((villa, idx) => {
            const availability = checkVillaAvailability({
              villaId: villa.id,
              checkIn,
              checkOut,
              blockedDates,
              bookings,
            });

            return (
              <article
                key={villa.id}
                className="w-full grid grid-cols-1 lg:grid-cols-12 group"
              >
                {/* Left 7-Column Flush Photograph */}
                <div
                  className={`lg:col-span-7 relative min-h-[380px] md:min-h-[480px] overflow-hidden bg-[#111412] border-b lg:border-b-0 ${
                    idx % 2 === 1 ? "lg:order-2 lg:border-l" : "lg:border-r"
                  } border-[#EAE4D8]/15`}
                >
                  <img
                    src={villa.heroImage}
                    alt={`${villa.name} in ${villa.location}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171A18]/75 via-transparent to-transparent" />
                  <div className="absolute top-0 left-0 bg-[#171A18]/90 border-r border-b border-[#EAE4D8]/20 px-5 py-2.5 text-[10px] uppercase tracking-[0.24em] text-[#EAE4D8]">
                    {villa.code} // {villa.location}
                  </div>
                  <div className="absolute top-0 right-0">
                    {availability.available ? (
                      <span className="bg-[#25382F] text-[#EAE4D8] border-l border-b border-[#A48A63]/50 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#A48A63]" />
                        <span>Available for Selected Dates</span>
                      </span>
                    ) : (
                      <span className="bg-[#171A18]/95 text-[#C9BBA5] border-l border-b border-[#EAE4D8]/20 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#A48A63]" />
                        <span>Dates Partially Held</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right 5-Column Architectural Monograph Spec Block */}
                <div
                  className={`lg:col-span-5 px-10 md:px-14 lg:px-16 py-14 md:py-20 flex flex-col justify-between gap-10 bg-[#171A18] group-hover:bg-[#202420]/60 transition ${
                    idx % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <div className="space-y-7">
                    <div className="flex items-baseline justify-between gap-4 border-b border-[#EAE4D8]/15 pb-5">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.26em] text-[#A48A63]">
                          Residence {villa.code} • {villa.coordinates}
                        </p>
                        <h2 className="font-serif text-4xl text-[#F8F6F0] mt-1">
                          {villa.name}
                        </h2>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#A5A69C] block">
                          Base Rate
                        </span>
                        <span className="font-serif text-2xl text-[#EAE4D8]">
                          {formatIdr(villa.baseNightlyRate)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-[#C9BBA5] leading-relaxed">
                      {villa.architecturalStory}
                    </p>

                    <div className="grid grid-cols-4 border-y border-[#EAE4D8]/15 divide-x divide-[#EAE4D8]/15 text-center py-3 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#A5A69C] block">
                          Suites
                        </span>
                        <span className="font-serif text-lg text-[#F8F6F0]">
                          {villa.bedrooms}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#A5A69C] block">
                          Baths
                        </span>
                        <span className="font-serif text-lg text-[#F8F6F0]">
                          {villa.bathrooms}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#A5A69C] block">
                          Guests
                        </span>
                        <span className="font-serif text-lg text-[#F8F6F0]">
                          Max {villa.maxGuests}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#A5A69C] block">
                          Estate
                        </span>
                        <span className="font-serif text-lg text-[#F8F6F0]">
                          {villa.areaSqm} m²
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 grid grid-cols-2 gap-4">
                    <Link
                      href={`/villas/${villa.slug}`}
                      className="border border-[#EAE4D8]/35 hover:border-[#EAE4D8] text-[#EAE4D8] py-3.5 text-center text-xs uppercase tracking-[0.2em] transition"
                    >
                      Inspect Monograph
                    </Link>
                    <Link
                      href={`/booking?villa=${villa.slug}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                      className="bg-[#EAE4D8] text-[#171A18] hover:bg-[#C9BBA5] py-3.5 text-xs uppercase tracking-[0.2em] font-semibold inline-flex items-center justify-center gap-2 transition"
                    >
                      <span>Reserve Stay</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </EditorialFrame>
  );
}
