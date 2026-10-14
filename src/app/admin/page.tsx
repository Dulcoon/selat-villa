"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/AdminLayout";
import { useSelat } from "@/context/SelatContext";
import { formatIdr } from "@/lib/pricing";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ArrowUpRight } from "lucide-react";

const MONTHLY_TREND_DATA = [
  { month: "May", bookingValueM: 94, collectedM: 88, occupancy: 64 },
  { month: "Jun", bookingValueM: 118, collectedM: 110, occupancy: 72 },
  { month: "Jul", bookingValueM: 152, collectedM: 145, occupancy: 84 },
  { month: "Aug", bookingValueM: 168, collectedM: 160, occupancy: 89 },
  { month: "Sep", bookingValueM: 142, collectedM: 132, occupancy: 78 },
  { month: "Oct", bookingValueM: 175, collectedM: 139, occupancy: 82 },
  { month: "Nov", bookingValueM: 128, collectedM: 76, occupancy: 68 },
];

export default function AdminOverviewPage() {
  const { bookings, villas } = useSelat();

  const metrics = useMemo(() => {
    const active = bookings.filter((b) => b.status !== "cancelled");
    const confirmed = bookings.filter(
      (b) => b.status === "confirmed" || b.status === "checked-in"
    );
    const pending = bookings.filter((b) => b.status === "pending");
    const upcomingArrivals = bookings.filter(
      (b) => b.status === "confirmed" && b.checkIn >= "2026-10-14"
    );
    const todaysDepartures = bookings.filter((b) => b.checkOut === "2026-10-14");

    const monthlyBookingValue = active
      .filter((b) => b.checkIn.startsWith("2026-10"))
      .reduce((acc, b) => acc + b.totalAmount, 0);

    const simulatedReceivedPayments = active.reduce((acc, b) => {
      if (b.paymentStatus === "paid-simulated") return acc + b.totalAmount;
      if (b.paymentStatus === "deposit-simulated") return acc + b.depositAmount;
      return acc;
    }, 0);

    const totalOctNightsBooked = active
      .filter((b) => b.checkIn.startsWith("2026-10"))
      .reduce((acc, b) => acc + b.nights, 0);
    const capacityNights = Math.max(1, villas.length * 31);
    const occupancyRate = Math.min(
      96,
      Math.round(((totalOctNightsBooked + 68) / capacityNights) * 100)
    );

    return {
      totalBookings: bookings.length,
      confirmedCount: confirmed.length,
      pendingCount: pending.length,
      upcomingArrivalsCount: upcomingArrivals.length,
      todaysDeparturesCount: todaysDepartures.length,
      monthlyBookingValue,
      simulatedReceivedPayments,
      occupancyRate,
    };
  }, [bookings, villas]);

  return (
    <AdminLayout>
      <div className="w-full bg-[#171A18]">
        {/* Full-Width Header Band */}
        <div className="w-full px-8 md:px-10 py-10 border-b border-[#EAE4D8]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#A48A63]">
              01 // EXECUTIVE SUMMARY • SIMULATED DATA
            </p>
            <h1 className="font-serif text-4xl text-[#F8F6F0] mt-1">
              Labuan Bajo Collection Overview
            </h1>
          </div>
          <div className="flex items-stretch gap-3">
            <Link
              href="/admin/bookings"
              className="bg-[#EAE4D8] text-[#171A18] hover:bg-[#C9BBA5] px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2"
            >
              <span>Reservations Ledger</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/calendar"
              className="border border-[#EAE4D8]/25 text-[#EAE4D8] hover:bg-[#202420] px-6 py-3 text-xs uppercase tracking-[0.2em]"
            >
              Availability Matrix
            </Link>
          </div>
        </div>

        {/* Row 1: Flush 4-Column Operational KPI Strip (Zero Cards) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE4D8]/15 border-b border-[#EAE4D8]/15 bg-[#202420]">
          <div className="p-7">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#A48A63] block">
              01 // Total Bookings (Demo)
            </span>
            <p className="font-serif text-4xl text-[#F8F6F0] mt-2">
              0{metrics.totalBookings}
            </p>
            <span className="text-[11px] text-[#A5A69C] mt-2 block">
              Across {villas.length} private residences
            </span>
          </div>

          <div className="p-7">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#A48A63] block">
              02 // Confirmed & Checked-In
            </span>
            <p className="font-serif text-4xl text-[#F8F6F0] mt-2">
              0{metrics.confirmedCount}
            </p>
            <span className="text-[11px] text-[#A5A69C] mt-2 block">
              {metrics.pendingCount} pending verification
            </span>
          </div>

          <div className="p-7">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#A48A63] block">
              03 // Arrivals / Today&apos;s Departures
            </span>
            <p className="font-serif text-4xl text-[#F8F6F0] mt-2">
              0{metrics.upcomingArrivalsCount} / 0{metrics.todaysDeparturesCount}
            </p>
            <span className="text-[11px] text-[#C9BBA5] mt-2 block">
              Private harbor tenders coordinated
            </span>
          </div>

          <div className="p-7">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#A48A63] block">
              04 // Estimated Occupancy Rate
            </span>
            <p className="font-serif text-4xl text-[#A48A63] mt-2">
              {metrics.occupancyRate}%
            </p>
            <span className="text-[11px] text-[#A5A69C] mt-2 block">
              October Komodo Dry Season
            </span>
          </div>
        </div>

        {/* Row 2: Flush 2-Column Financial Valuation Strip */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE4D8]/15 border-b border-[#EAE4D8]/15">
          <div className="p-8 md:px-10 bg-[#25382F]/45">
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#A48A63] block">
              05 // October Simulated Booking Value
            </span>
            <p className="font-serif text-4xl md:text-5xl text-[#F8F6F0] mt-2">
              {formatIdr(metrics.monthlyBookingValue)}
            </p>
            <span className="text-xs text-[#C9BBA5] mt-2 block">
              Gross contracted reservation value (fictional demonstration figure)
            </span>
          </div>

          <div className="p-8 md:px-10 bg-[#171A18]">
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#A48A63] block">
              06 // Simulated Received Payments (YTD Demo)
            </span>
            <p className="font-serif text-4xl md:text-5xl text-[#EAE4D8] mt-2">
              {formatIdr(metrics.simulatedReceivedPayments)}
            </p>
            <span className="text-xs text-[#A5A69C] mt-2 block">
              Includes simulated full settlements & 50% reservation deposits
            </span>
          </div>
        </div>

        {/* Row 3: Full-Width Dark Editorial Charts Split */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE4D8]/15 border-b border-[#EAE4D8]/15 bg-[#171A18]">
          <div className="lg:col-span-7 p-8 md:p-10 space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#A48A63]">
                REVENUE TREND (MILLIONS IDR — SIMULATED)
              </p>
              <h2 className="font-serif text-3xl text-[#F8F6F0] mt-1">
                Booking Value vs. Simulated Collected Payments
              </h2>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2B302C" />
                  <XAxis dataKey="month" stroke="#A5A69C" tick={{ fontSize: 11, fill: "#A5A69C" }} />
                  <YAxis stroke="#A5A69C" tick={{ fontSize: 11, fill: "#A5A69C" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#202420",
                      borderColor: "#A48A63",
                      color: "#F8F6F0",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bookingValueM"
                    name="Booking Value (M IDR)"
                    stroke="#EAE4D8"
                    fill="#25382F"
                    fillOpacity={0.65}
                  />
                  <Area
                    type="monotone"
                    dataKey="collectedM"
                    name="Simulated Collected (M IDR)"
                    stroke="#A48A63"
                    fill="#A48A63"
                    fillOpacity={0.35}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 md:p-10 space-y-6 bg-[#202420]/50">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#A48A63]">
                OCCUPANCY PERFORMANCE (%)
              </p>
              <h2 className="font-serif text-3xl text-[#F8F6F0] mt-1">
                Monthly Estate Occupancy
              </h2>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2B302C" />
                  <XAxis dataKey="month" stroke="#A5A69C" tick={{ fontSize: 11, fill: "#A5A69C" }} />
                  <YAxis stroke="#A5A69C" tick={{ fontSize: 11, fill: "#A5A69C" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#202420",
                      borderColor: "#A48A63",
                      color: "#F8F6F0",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="occupancy"
                    name="Occupancy %"
                    fill="#A48A63"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Row 4: Full-Bleed Architectural Recent Reservations Table */}
        <div className="w-full bg-[#171A18]">
          <div className="px-8 md:px-10 py-6 border-b border-[#EAE4D8]/15 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#A48A63]">
                LIVE SYNCHRONIZED LEDGER
              </p>
              <h2 className="font-serif text-2xl text-[#F8F6F0] mt-0.5">
                Recent Reservations
              </h2>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs uppercase tracking-[0.2em] text-[#A48A63] hover:text-[#EAE4D8]"
            >
              Inspect Full Ledger →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EAE4D8]/15 bg-[#202420] text-[10px] uppercase tracking-[0.2em] text-[#C9BBA5]">
                  <th className="py-4 px-8">Reference</th>
                  <th className="py-4 px-6">Registered Guest</th>
                  <th className="py-4 px-6">Residence</th>
                  <th className="py-4 px-6">Stay Window</th>
                  <th className="py-4 px-6">Simulated Total</th>
                  <th className="py-4 px-8">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4D8]/10">
                {bookings.slice(0, 6).map((bk) => (
                  <tr key={bk.id} className="hover:bg-[#202420]/70 transition">
                    <td className="py-4 px-8 font-mono font-semibold text-[#A48A63]">
                      {bk.reference}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-[#F8F6F0]">{bk.guestName}</div>
                      <div className="text-[11px] text-[#A5A69C]">{bk.guestEmail}</div>
                    </td>
                    <td className="py-4 px-6 text-[#EAE4D8]">{bk.villaName}</td>
                    <td className="py-4 px-6 text-[#C9BBA5]">
                      {bk.checkIn} → {bk.checkOut} ({bk.nights}n)
                    </td>
                    <td className="py-4 px-6 font-mono text-[#F8F6F0]">
                      {formatIdr(bk.totalAmount)}
                    </td>
                    <td className="py-4 px-8">
                      <span
                        className={`px-3 py-1 text-[10px] uppercase tracking-[0.18em] border ${
                          bk.status === "confirmed" || bk.status === "checked-in"
                            ? "bg-[#25382F] text-[#EAE4D8] border-[#A48A63]/50"
                            : bk.status === "pending"
                            ? "bg-[#A48A63]/20 text-[#EAE4D8] border-[#A48A63]"
                            : bk.status === "cancelled"
                            ? "bg-red-950/60 text-red-200 border-red-400/40"
                            : "bg-[#202420] text-[#C9BBA5] border-[#EAE4D8]/20"
                        }`}
                      >
                        {bk.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
