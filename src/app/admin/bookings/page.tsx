"use client";

import React, { useState, useMemo } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useSelat } from "@/context/SelatContext";
import { formatIdr, exportRowsToCsv } from "@/lib/pricing";
import { Booking, BookingStatus } from "@/types/selat";
import { Search, Download, Eye, X } from "lucide-react";

export default function AdminBookingsPage() {
  const { bookings, villas, updateBookingStatus, updateBookingNotes } = useSelat();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [villaFilter, setVillaFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const pageSize = 6;

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        b.reference.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.guestEmail.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
      const matchesVilla = villaFilter === "ALL" || b.villaId === villaFilter;
      const matchesDate = !dateFrom || b.checkIn >= dateFrom;
      return matchesQuery && matchesStatus && matchesVilla && matchesDate;
    });
  }, [bookings, searchQuery, statusFilter, villaFilter, dateFrom]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExportCsv = () => {
    const headers = [
      "Reference",
      "Guest Name",
      "Guest Email",
      "Residence",
      "Check-In",
      "Check-Out",
      "Nights",
      "Guests",
      "Total IDR (Simulated)",
      "Booking Status",
      "Payment Status",
      "Created Date",
    ];
    const rows = filteredBookings.map((b) => [
      b.reference,
      b.guestName,
      b.guestEmail,
      b.villaName,
      b.checkIn,
      b.checkOut,
      b.nights,
      b.guests,
      b.totalAmount,
      b.status,
      b.paymentStatus,
      b.createdAt,
    ]);
    exportRowsToCsv("selat-simulated-bookings.csv", headers, rows);
  };

  return (
    <AdminLayout>
      <div className="w-full bg-[#171A18]">
        {/* Header Band */}
        <div className="w-full px-8 md:px-10 py-10 border-b border-[#EAE4D8]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#A48A63]">
              02 // RESERVATIONS LEDGER
            </p>
            <h1 className="font-serif text-4xl text-[#F8F6F0] mt-1">
              Booking Management
            </h1>
          </div>
          <button
            type="button"
            onClick={handleExportCsv}
            className="bg-[#EAE4D8] text-[#171A18] hover:bg-[#C9BBA5] px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2.5 self-start sm:self-end"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredBookings.length})</span>
          </button>
        </div>

        {/* Flush 4-Column Filter Bar */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE4D8]/15 border-b border-[#EAE4D8]/15 bg-[#202420]">
          <div className="p-4 relative">
            <label className="block text-[9px] uppercase tracking-[0.22em] text-[#A48A63] mb-1.5">
              Search Reference or Guest
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#A5A69C] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="SLT-731944, guest..."
                className="w-full bg-[#171A18] border border-[#EAE4D8]/20 pl-8 pr-3 py-2 text-xs text-[#EAE4D8]"
              />
            </div>
          </div>

          <div className="p-4">
            <label className="block text-[9px] uppercase tracking-[0.22em] text-[#A48A63] mb-1.5">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2 text-xs text-[#EAE4D8]"
            >
              <option value="ALL">All Booking Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="checked-in">Checked-In</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="p-4">
            <label className="block text-[9px] uppercase tracking-[0.22em] text-[#A48A63] mb-1.5">
              Residence Filter
            </label>
            <select
              value={villaFilter}
              onChange={(e) => {
                setVillaFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2 text-xs text-[#EAE4D8]"
            >
              <option value="ALL">All Residences</option>
              {villas.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4">
            <label className="block text-[9px] uppercase tracking-[0.22em] text-[#A48A63] mb-1.5">
              Check-In From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2 text-xs text-[#EAE4D8]"
            />
          </div>
        </div>

        {/* Full-Width Ledger Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAE4D8]/15 bg-[#141715] text-[10px] uppercase tracking-[0.2em] text-[#A5A69C]">
                <th className="py-4 px-8">Reference</th>
                <th className="py-4 px-5">Guest</th>
                <th className="py-4 px-5">Residence</th>
                <th className="py-4 px-5">Check-In</th>
                <th className="py-4 px-5">Check-Out</th>
                <th className="py-4 px-4">Party</th>
                <th className="py-4 px-5">Total (Simulated)</th>
                <th className="py-4 px-5">Status Control</th>
                <th className="py-4 px-5">Payment</th>
                <th className="py-4 px-8">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4D8]/10">
              {paginatedBookings.map((bk) => (
                <tr key={bk.id} className="hover:bg-[#202420]/70 transition">
                  <td className="py-4 px-8 font-mono font-semibold text-[#A48A63]">
                    {bk.reference}
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-medium text-[#F8F6F0]">{bk.guestName}</div>
                    <div className="text-[11px] text-[#A5A69C]">{bk.guestEmail}</div>
                  </td>
                  <td className="py-4 px-5 text-[#EAE4D8]">{bk.villaName}</td>
                  <td className="py-4 px-5 text-[#C9BBA5]">{bk.checkIn}</td>
                  <td className="py-4 px-5 text-[#C9BBA5]">{bk.checkOut}</td>
                  <td className="py-4 px-4 text-[#EAE4D8]">{bk.guests}</td>
                  <td className="py-4 px-5 font-mono text-[#F8F6F0]">
                    {formatIdr(bk.totalAmount)}
                  </td>
                  <td className="py-4 px-5">
                    <select
                      value={bk.status}
                      onChange={(e) =>
                        updateBookingStatus(bk.id, e.target.value as BookingStatus)
                      }
                      className="bg-[#202420] border border-[#EAE4D8]/25 text-[#EAE4D8] px-2.5 py-1.5 text-[10px] uppercase tracking-wider"
                    >
                      <option value="confirmed">confirmed</option>
                      <option value="pending">pending</option>
                      <option value="checked-in">checked-in</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#202420] border border-[#EAE4D8]/15 text-[#C9BBA5]">
                      {bk.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-8">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBooking(bk);
                        setNotesDraft(bk.internalNotes || "");
                      }}
                      className="text-[#EAE4D8] hover:text-[#A48A63] uppercase tracking-widest text-[10px] inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Strip */}
        <div className="px-8 py-5 border-t border-b border-[#EAE4D8]/15 bg-[#202420] flex items-center justify-between text-xs">
          <span className="text-[#A5A69C] uppercase tracking-wider text-[11px]">
            Page {currentPage} of {totalPages} • {filteredBookings.length} Reservations
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 border border-[#EAE4D8]/25 text-[#EAE4D8] disabled:opacity-30 uppercase tracking-widest text-[10px]"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 border border-[#EAE4D8]/25 text-[#EAE4D8] disabled:opacity-30 uppercase tracking-widest text-[10px]"
            >
              Next
            </button>
          </div>
        </div>

        {/* Dossier Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#202420] border border-[#EAE4D8]/30 max-w-xl w-full p-8 space-y-6 text-[#EAE4D8]">
              <div className="flex items-center justify-between border-b border-[#EAE4D8]/15 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#A48A63]">
                    Reservation Dossier • Created {selectedBooking.createdAt}
                  </span>
                  <h2 className="font-serif text-3xl text-[#F8F6F0] mt-1">
                    {selectedBooking.reference} — {selectedBooking.guestName}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="p-1 text-[#A5A69C] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 border border-[#EAE4D8]/15 divide-x divide-y divide-[#EAE4D8]/15 bg-[#171A18] text-xs">
                <div className="p-4">
                  <span className="text-[#A5A69C] text-[10px] uppercase block">Residence</span>
                  <span className="font-semibold text-[#F8F6F0] mt-1 block">
                    {selectedBooking.villaName}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-[#A5A69C] text-[10px] uppercase block">Stay Dates</span>
                  <span className="text-[#EAE4D8] mt-1 block">
                    {selectedBooking.checkIn} → {selectedBooking.checkOut} ({selectedBooking.nights}n)
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-[#A5A69C] text-[10px] uppercase block">Guest Contact</span>
                  <span className="text-[#EAE4D8] mt-1 block">
                    {selectedBooking.guestEmail}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-[#A5A69C] text-[10px] uppercase block">Simulated Total</span>
                  <span className="font-semibold text-[#A48A63] mt-1 block">
                    {formatIdr(selectedBooking.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63]">
                  Internal Concierge & Operations Notes
                </label>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="w-full bg-[#171A18] border border-[#EAE4D8]/20 p-3 text-xs text-[#EAE4D8]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#EAE4D8]/15">
                <button
                  type="button"
                  onClick={() => {
                    updateBookingStatus(selectedBooking.id, "cancelled", "refunded-simulated");
                    setSelectedBooking(null);
                  }}
                  className="text-xs text-red-300 border border-red-400/40 px-4 py-2.5 uppercase tracking-wider hover:bg-red-950/50"
                >
                  Simulate Cancellation & Refund
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateBookingNotes(selectedBooking.id, notesDraft);
                    setSelectedBooking(null);
                  }}
                  className="bg-[#EAE4D8] text-[#171A18] px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold"
                >
                  Save Dossier Notes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
