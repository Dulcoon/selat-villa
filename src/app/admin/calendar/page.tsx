"use client";

import React, { useState, useMemo } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useSelat } from "@/context/SelatContext";
import { formatIdr } from "@/lib/pricing";
import { Booking } from "@/types/selat";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";

const MONTHS = [
  { year: 2026, month: 9, label: "October 2026" },
  { year: 2026, month: 10, label: "November 2026" },
  { year: 2026, month: 11, label: "December 2026" },
  { year: 2027, month: 0, label: "January 2027" },
];

export default function AdminCalendarPage() {
  const { villas, bookings, blockedDates, toggleBlockedDate } = useSelat();
  const [selectedVillaId, setSelectedVillaId] = useState(
    villas[0]?.id || "villa-layar"
  );
  const [monthIdx, setMonthIdx] = useState(0);
  const [blockReason, setBlockReason] = useState("Admin maintenance / owner hold");
  const [inspectedBooking, setInspectedBooking] = useState<Booking | null>(null);

  const currentMonth = MONTHS[monthIdx];
  const selectedVilla = villas.find((v) => v.id === selectedVillaId) || villas[0];

  const calendarDays = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: {
      dayNum: number | null;
      dateStr: string;
      state: "empty" | "available" | "confirmed" | "pending" | "blocked";
      booking?: Booking;
      blockedReason?: string;
    }[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ dayNum: null, dateStr: `empty-${i}`, state: "empty" });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(month + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      const dateStr = `${year}-${mm}-${dd}`;

      const foundBooking = bookings.find(
        (bk) =>
          bk.villaId === selectedVillaId &&
          bk.status !== "cancelled" &&
          dateStr >= bk.checkIn &&
          dateStr < bk.checkOut
      );

      const foundBlocked = blockedDates.find(
        (blk) => blk.villaId === selectedVillaId && blk.date === dateStr
      );

      if (foundBooking) {
        cells.push({
          dayNum: d,
          dateStr,
          state: foundBooking.status === "pending" ? "pending" : "confirmed",
          booking: foundBooking,
        });
      } else if (foundBlocked) {
        cells.push({
          dayNum: d,
          dateStr,
          state: "blocked",
          blockedReason: foundBlocked.reason,
        });
      } else {
        cells.push({
          dayNum: d,
          dateStr,
          state: "available",
        });
      }
    }

    return cells;
  }, [currentMonth, selectedVillaId, bookings, blockedDates]);

  return (
    <AdminLayout>
      <div className="w-full bg-[#171A18]">
        <div className="w-full px-8 md:px-10 py-10 border-b border-[#EAE4D8]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#A48A63]">
              04 // SIMULATED INVENTORY MATRIX
            </p>
            <h1 className="font-serif text-4xl text-[#F8F6F0] mt-1">
              Monthly Availability Calendar
            </h1>
          </div>

          <div className="flex flex-wrap items-stretch gap-3">
            <select
              value={selectedVillaId}
              onChange={(e) => {
                setSelectedVillaId(e.target.value);
                setInspectedBooking(null);
              }}
              className="bg-[#202420] border border-[#EAE4D8]/25 px-4 py-2.5 text-xs text-[#EAE4D8]"
            >
              {villas.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.code} — {v.name} ({v.location})
                </option>
              ))}
            </select>

            <div className="flex items-center border border-[#EAE4D8]/25 bg-[#202420] divide-x divide-[#EAE4D8]/20">
              <button
                type="button"
                disabled={monthIdx === 0}
                onClick={() => setMonthIdx((m) => Math.max(0, m - 1))}
                className="px-3 py-2.5 disabled:opacity-30 text-[#EAE4D8]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs uppercase tracking-[0.18em] px-5 text-[#F8F6F0]">
                {currentMonth.label}
              </span>
              <button
                type="button"
                disabled={monthIdx === MONTHS.length - 1}
                onClick={() => setMonthIdx((m) => Math.min(MONTHS.length - 1, m + 1))}
                className="px-3 py-2.5 disabled:opacity-30 text-[#EAE4D8]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full px-8 md:px-10 py-4 bg-[#202420] border-b border-[#EAE4D8]/15 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-wider">
            <span className="flex items-center gap-2 text-[#EAE4D8]">
              <span className="w-3 h-3 bg-[#171A18] border border-[#EAE4D8]/30 inline-block" />
              <span>Available (Click to Block)</span>
            </span>
            <span className="flex items-center gap-2 text-[#EAE4D8]">
              <span className="w-3 h-3 bg-[#25382F] border border-[#A48A63] inline-block" />
              <span>Confirmed / Checked-In</span>
            </span>
            <span className="flex items-center gap-2 text-[#C9BBA5]">
              <span className="w-3 h-3 bg-[#A48A63]/30 border border-[#A48A63] inline-block" />
              <span>Pending</span>
            </span>
            <span className="flex items-center gap-2 text-[#A5A69C]">
              <span className="w-3 h-3 bg-[#111412] border border-[#656D5D] inline-block" />
              <span>Blocked Hold (Click to Unblock)</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#A48A63]">
              Hold Reason:
            </span>
            <input
              type="text"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-1.5 text-xs text-[#EAE4D8] w-60"
            />
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 border-b border-[#EAE4D8]/15">
          <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-[#EAE4D8]/15">
            <div className="grid grid-cols-7 border-b border-[#EAE4D8]/15 bg-[#141715] text-center text-[10px] uppercase tracking-[0.22em] text-[#A5A69C]">
              <div className="py-3">Sun</div>
              <div className="py-3">Mon</div>
              <div className="py-3">Tue</div>
              <div className="py-3">Wed</div>
              <div className="py-3">Thu</div>
              <div className="py-3">Fri</div>
              <div className="py-3">Sat</div>
            </div>

            <div className="grid grid-cols-7 border-l border-[#EAE4D8]/15">
              {calendarDays.map((cell) => {
                if (cell.state === "empty") {
                  return (
                    <div
                      key={cell.dateStr}
                      className="h-28 bg-[#141715]/50 border-r border-b border-[#EAE4D8]/10"
                    />
                  );
                }

                const isConfirmed = cell.state === "confirmed";
                const isPending = cell.state === "pending";
                const isBlocked = cell.state === "blocked";

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() => {
                      if (cell.booking) {
                        setInspectedBooking(cell.booking);
                      } else {
                        toggleBlockedDate(selectedVillaId, cell.dateStr, blockReason);
                      }
                    }}
                    className={`h-28 p-3 border-r border-b border-[#EAE4D8]/15 text-left flex flex-col justify-between transition ${
                      isConfirmed
                        ? "bg-[#25382F] text-[#EAE4D8]"
                        : isPending
                        ? "bg-[#A48A63]/25 text-[#F8F6F0]"
                        : isBlocked
                        ? "bg-[#111412] text-[#656D5D]"
                        : "bg-[#171A18] hover:bg-[#202420] text-[#EAE4D8]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-serif text-xl">{cell.dayNum}</span>
                      {isBlocked && <Lock className="w-3.5 h-3.5 text-[#A48A63]" />}
                    </div>

                    {cell.booking && (
                      <div className="text-[10px] leading-tight truncate w-full">
                        <span className="font-semibold block truncate text-[#F8F6F0]">
                          {cell.booking.guestName}
                        </span>
                        <span className="text-[#A48A63] font-mono">
                          {cell.booking.reference}
                        </span>
                      </div>
                    )}

                    {isBlocked && (
                      <div className="text-[9px] leading-tight line-clamp-2 uppercase tracking-wider text-[#A5A69C]">
                        {cell.blockedReason}
                      </div>
                    )}

                    {cell.state === "available" && (
                      <span className="text-[9px] text-[#A5A69C] uppercase tracking-widest">
                        Available
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 p-8 bg-[#202420] space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#A48A63]">
                DATE & DOSSIER INSPECTOR
              </p>
              <h2 className="font-serif text-3xl text-[#F8F6F0] mt-1">
                {selectedVilla?.name}
              </h2>
            </div>
            <p className="text-xs text-[#C9BBA5] leading-relaxed">
              Click any available or blocked date on the matrix to toggle manual maintenance holds, or click a reservation cell to inspect check-in and check-out details.
            </p>

            {inspectedBooking ? (
              <div className="border-t border-[#EAE4D8]/15 pt-5 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-[#A48A63]">
                    {inspectedBooking.reference}
                  </span>
                  <span className="uppercase text-[10px] px-2.5 py-1 bg-[#25382F] text-[#EAE4D8]">
                    {inspectedBooking.status}
                  </span>
                </div>
                <div>
                  <span className="text-[#A5A69C] text-[10px] uppercase block">
                    Registered Guest
                  </span>
                  <span className="font-medium text-[#F8F6F0]">
                    {inspectedBooking.guestName}
                  </span>
                </div>
                <div>
                  <span className="text-[#A5A69C] text-[10px] uppercase block">
                    Stay Window
                  </span>
                  <span className="text-[#EAE4D8]">
                    {inspectedBooking.checkIn} → {inspectedBooking.checkOut} ({inspectedBooking.nights} nights)
                  </span>
                </div>
                <div>
                  <span className="text-[#A5A69C] text-[10px] uppercase block">
                    Total Simulated Value
                  </span>
                  <span className="font-semibold text-[#A48A63]">
                    {formatIdr(inspectedBooking.totalAmount)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-[#171A18] border border-[#EAE4D8]/15 text-xs text-[#A5A69C]">
                Select a reserved date cell on the calendar to inspect guest arrival & departure records.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
