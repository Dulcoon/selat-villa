"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EditorialFrame } from "@/components/EditorialFrame";
import { useSelat } from "@/context/SelatContext";
import { formatIdr } from "@/lib/pricing";
import { Search, AlertCircle, Printer } from "lucide-react";

function LookupContent() {
  const searchParams = useSearchParams();
  const { bookings } = useSelat();

  const [reference, setReference] = useState(
    searchParams?.get("ref") || "SLT-731944"
  );
  const [email, setEmail] = useState(
    searchParams?.get("email") || "clara.vance@atelier-paris.demo"
  );
  const [searched, setSearched] = useState(false);

  const matchedBooking = bookings.find(
    (b) =>
      b.reference.toUpperCase() === reference.trim().toUpperCase() &&
      b.guestEmail.toLowerCase() === email.trim().toLowerCase()
  );

  return (
    <div className="w-full bg-[#171A18]">
      <div className="w-full px-8 md:px-14 lg:px-20 pt-16 pb-14 md:pt-20 md:pb-16 border-b border-[#EAE4D8]/15 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="max-w-2xl space-y-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#A48A63] flex items-center gap-3">
            <span className="w-6 h-[1px] bg-[#A48A63]" />
            <span>FRONTEND RESERVATION LOOKUP DEMO</span>
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#F8F6F0] leading-[1.05]">
            Manage & Verify Your Stay
          </h1>
          <p className="text-sm text-[#A5A69C] max-w-xl leading-relaxed">
            Enter a booking reference and guest email to inspect your simulated itinerary. Try seeded example{" "}
            <strong className="text-[#EAE4D8]">SLT-731944</strong> with{" "}
            <strong className="text-[#EAE4D8]">clara.vance@atelier-paris.demo</strong>.
          </p>
        </div>
        <div className="shrink-0 grid grid-cols-2 border border-[#EAE4D8]/20 divide-x divide-[#EAE4D8]/20 text-center">
          <div className="px-6 py-4">
            <span className="block text-[9px] uppercase tracking-[0.22em] text-[#A5A69C]">Source</span>
            <span className="block font-serif text-lg text-[#F8F6F0] mt-1">Local Demo</span>
          </div>
          <div className="px-6 py-4">
            <span className="block text-[9px] uppercase tracking-[0.22em] text-[#A5A69C]">Server</span>
            <span className="block font-serif text-lg text-[#A48A63] mt-1">None</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearched(true);
        }}
        className="w-full grid grid-cols-1 md:grid-cols-12 border-b border-[#EAE4D8]/15 bg-[#202420] divide-y md:divide-y-0 md:divide-x divide-[#EAE4D8]/15"
      >
        <div className="md:col-span-5 px-6 py-7 md:px-10">
          <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-3">
            Booking Reference
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="SLT-XXXXXX"
            className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-4 py-3 text-xs text-[#EAE4D8] uppercase"
          />
        </div>
        <div className="md:col-span-5 px-6 py-7 md:px-10">
          <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-3">
            Registered Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="guest@domain.com"
            className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-4 py-3 text-xs text-[#EAE4D8]"
          />
        </div>
        <div className="md:col-span-2 flex items-stretch">
          <button
            type="submit"
            className="w-full bg-[#EAE4D8] hover:bg-[#C9BBA5] text-[#171A18] py-6 text-xs uppercase tracking-[0.22em] font-semibold flex items-center justify-center gap-2 transition"
          >
            <Search className="w-4 h-4" />
            <span>Retrieve</span>
          </button>
        </div>
      </form>

      {(searched || searchParams?.get("ref")) ? (
        <div className="w-full px-8 md:px-14 lg:px-20 py-12 md:py-16 border-b border-[#EAE4D8]/15">
          {matchedBooking ? (
            <div className="border border-[#EAE4D8]/20 bg-[#202420]">
              <div className="px-8 py-7 border-b border-[#EAE4D8]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#A48A63] block">
                    Reservation Verified • Status: {matchedBooking.status.toUpperCase()}
                  </span>
                  <h2 className="font-serif text-3xl text-[#F8F6F0] mt-1">
                    {matchedBooking.villaName} ({matchedBooking.reference})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="border border-[#EAE4D8]/30 px-5 py-2.5 text-xs uppercase tracking-widest flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 border-t border-l border-[#EAE4D8]/15 text-xs">
                <div className="p-6 border-r border-b border-[#EAE4D8]/15">
                  <span className="text-[#A5A69C] uppercase tracking-wider text-[10px] block">
                    Guest
                  </span>
                  <span className="text-[#EAE4D8] font-semibold mt-1 block">
                    {matchedBooking.guestName}
                  </span>
                </div>
                <div className="p-6 border-r border-b border-[#EAE4D8]/15">
                  <span className="text-[#A5A69C] uppercase tracking-wider text-[10px] block">
                    Stay Dates
                  </span>
                  <span className="text-[#EAE4D8] mt-1 block">
                    {matchedBooking.checkIn} → {matchedBooking.checkOut} ({matchedBooking.nights} nights)
                  </span>
                </div>
                <div className="p-6 border-r border-b border-[#EAE4D8]/15">
                  <span className="text-[#A5A69C] uppercase tracking-wider text-[10px] block">
                    Party Size
                  </span>
                  <span className="text-[#EAE4D8] mt-1 block">
                    {matchedBooking.guests} Guests
                  </span>
                </div>
                <div className="p-6 border-r border-b border-[#EAE4D8]/15">
                  <span className="text-[#A5A69C] uppercase tracking-wider text-[10px] block">
                    Total Simulated Amount
                  </span>
                  <span className="text-[#EAE4D8] font-semibold mt-1 block">
                    {formatIdr(matchedBooking.totalAmount)}
                  </span>
                </div>
                <div className="p-6 border-r border-b border-[#EAE4D8]/15">
                  <span className="text-[#A5A69C] uppercase tracking-wider text-[10px] block">
                    Payment Status
                  </span>
                  <span className="text-[#A48A63] uppercase mt-1 block">
                    {matchedBooking.paymentStatus}
                  </span>
                </div>
                <div className="p-6 border-r border-b border-[#EAE4D8]/15">
                  <span className="text-[#A5A69C] uppercase tracking-wider text-[10px] block">
                    Booked On
                  </span>
                  <span className="text-[#EAE4D8] mt-1 block">
                    {matchedBooking.createdAt}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#202420] border-l-2 border-red-400 p-6 text-xs text-red-200 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>
                No local demo reservation matched reference &ldquo;{reference}&rdquo; and email &ldquo;{email}&rdquo;.
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full px-8 md:px-14 lg:px-20 py-12 md:py-16 border-b border-[#EAE4D8]/15">
          <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-l border-[#EAE4D8]/15">
            {[
              { code: "01", title: "Enter Reference", desc: "Use the 9-character code from your confirmation ledger." },
              { code: "02", title: "Match Email", desc: "The same guest email used at checkout." },
              { code: "03", title: "Press Retrieve", desc: "Your itinerary renders instantly from local demo storage." },
            ].map((s) => (
              <div key={s.code} className="p-7 border-r border-b border-[#EAE4D8]/15 bg-[#202420]/40">
                <span className="text-[10px] font-mono tracking-[0.22em] text-[#A48A63]">{s.code}</span>
                <p className="font-serif text-xl text-[#F8F6F0] mt-2">{s.title}</p>
                <p className="text-xs text-[#A5A69C] mt-1.5 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LookupPage() {
  return (
    <EditorialFrame>
      <Suspense fallback={<div className="p-12 text-center text-xs">Loading Lookup...</div>}>
        <LookupContent />
      </Suspense>
    </EditorialFrame>
  );
}
