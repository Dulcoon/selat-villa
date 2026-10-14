"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useSelat } from "@/context/SelatContext";
import { formatIdr } from "@/lib/pricing";
import { Search } from "lucide-react";

export default function AdminGuestsPage() {
  const { guests, bookings } = useSelat();
  const [query, setQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const filteredGuests = guests.filter((g) => {
    const q = query.toLowerCase();
    return (
      !q ||
      g.name.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.country.toLowerCase().includes(q)
    );
  });

  const selectedGuestBookings = bookings.filter(
    (b) => selectedEmail && b.guestEmail.toLowerCase() === selectedEmail.toLowerCase()
  );

  return (
    <AdminLayout>
      <div className="w-full bg-[#171A18]">
        <div className="w-full px-8 md:px-10 py-10 border-b border-[#EAE4D8]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#A48A63]">
              06 // FICTIONAL GUEST DOSSIERS
            </p>
            <h1 className="font-serif text-4xl text-[#F8F6F0] mt-1">
              Guest Directory & Stay History
            </h1>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-[#A5A69C] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guest name, email, country..."
              className="w-full bg-[#202420] border border-[#EAE4D8]/25 pl-9 pr-4 py-2.5 text-xs text-[#EAE4D8]"
            />
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 border-b border-[#EAE4D8]/15">
          <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-[#EAE4D8]/15 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EAE4D8]/15 bg-[#141715] text-[10px] uppercase tracking-[0.2em] text-[#A5A69C]">
                  <th className="py-4 px-8">Guest Name</th>
                  <th className="py-4 px-5">Contact</th>
                  <th className="py-4 px-4">Stays</th>
                  <th className="py-4 px-5">Last Stay</th>
                  <th className="py-4 px-5">Simulated Value</th>
                  <th className="py-4 px-8">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4D8]/10">
                {filteredGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-[#202420]/70 transition">
                    <td className="py-4 px-8">
                      <div className="font-medium text-[#F8F6F0]">{g.name}</div>
                      <div className="text-[11px] text-[#A48A63]">{g.country}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-[#EAE4D8]">{g.email}</div>
                      <div className="text-[11px] text-[#A5A69C]">{g.phone}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[#F8F6F0]">{g.bookingsCount}</td>
                    <td className="py-4 px-5 text-[#C9BBA5]">{g.lastStay}</td>
                    <td className="py-4 px-5 font-mono text-[#EAE4D8]">
                      {formatIdr(g.simulatedTotalValue)}
                    </td>
                    <td className="py-4 px-8">
                      <button
                        type="button"
                        onClick={() => setSelectedEmail(g.email)}
                        className="text-[#A48A63] hover:text-[#F8F6F0] uppercase tracking-widest text-[10px]"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-4 p-8 bg-[#202420] space-y-5">
            <h2 className="font-serif text-3xl text-[#F8F6F0]">
              Associated Reservations
            </h2>
            {selectedEmail ? (
              <div className="space-y-4 text-xs">
                <p className="text-[#C9BBA5]">
                  Reservations for <strong className="text-[#F8F6F0]">{selectedEmail}</strong>:
                </p>
                {selectedGuestBookings.length === 0 ? (
                  <p className="text-[#A5A69C]">No reservations found in active ledger.</p>
                ) : (
                  <div className="divide-y divide-[#EAE4D8]/15 border-y border-[#EAE4D8]/15">
                    {selectedGuestBookings.map((bk) => (
                      <div key={bk.id} className="py-4 space-y-1">
                        <div className="flex justify-between font-mono text-[#A48A63]">
                          <span>{bk.reference}</span>
                          <span className="uppercase text-[10px]">{bk.status}</span>
                        </div>
                        <p className="font-serif text-xl text-[#F8F6F0]">{bk.villaName}</p>
                        <p className="text-[#A5A69C]">
                          {bk.checkIn} → {bk.checkOut} ({bk.nights} nights)
                        </p>
                        <p className="text-[#EAE4D8] font-mono pt-1">
                          {formatIdr(bk.totalAmount)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#A5A69C] leading-relaxed">
                Select &ldquo;Inspect&rdquo; on any guest row to view their associated Labuan Bajo stay history and preferences.
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
