"use client";

import React, { useMemo } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useSelat } from "@/context/SelatContext";
import { formatIdr, exportRowsToCsv } from "@/lib/pricing";
import { Download } from "lucide-react";

export default function AdminReportsPage() {
  const { bookings, villas } = useSelat();

  const propertyStats = useMemo(() => {
    return villas.map((v) => {
      const vBookings = bookings.filter((b) => b.villaId === v.id);
      const active = vBookings.filter((b) => b.status !== "cancelled");
      const cancelled = vBookings.filter((b) => b.status === "cancelled");
      const demoBookingValue = active.reduce((acc, b) => acc + b.totalAmount, 0);
      const simulatedCollected = active.reduce((acc, b) => {
        if (b.paymentStatus === "paid-simulated") return acc + b.totalAmount;
        if (b.paymentStatus === "deposit-simulated") return acc + b.depositAmount;
        return acc;
      }, 0);
      const nightsBooked = active.reduce((acc, b) => acc + b.nights, 0);
      return {
        villa: v,
        totalCount: vBookings.length,
        activeCount: active.length,
        cancelledCount: cancelled.length,
        nightsBooked,
        demoBookingValue,
        simulatedCollected,
      };
    });
  }, [villas, bookings]);

  const handleExportReport = () => {
    const headers = [
      "Residence Code",
      "Residence Name",
      "Location",
      "Active Bookings",
      "Cancelled Bookings",
      "Total Nights Booked",
      "Demo Booking Value (IDR)",
      "Simulated Collected Payments (IDR)",
    ];
    const rows = propertyStats.map((s) => [
      s.villa.code,
      s.villa.name,
      s.villa.location,
      s.activeCount,
      s.cancelledCount,
      s.nightsBooked,
      s.demoBookingValue,
      s.simulatedCollected,
    ]);
    exportRowsToCsv("selat-property-performance-report.csv", headers, rows);
  };

  return (
    <AdminLayout>
      <div className="w-full bg-[#171A18]">
        <div className="w-full px-8 md:px-10 py-10 border-b border-[#EAE4D8]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#A48A63]">
              07 // ANALYTICAL SUMMARY • DETERMINISTIC DEMO DATA
            </p>
            <h1 className="font-serif text-4xl text-[#F8F6F0] mt-1">
              Residence Performance & Revenue Distribution
            </h1>
          </div>
          <button
            type="button"
            onClick={handleExportReport}
            className="bg-[#EAE4D8] text-[#171A18] hover:bg-[#C9BBA5] px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Performance CSV</span>
          </button>
        </div>

        <div className="w-full overflow-x-auto border-b border-[#EAE4D8]/15">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAE4D8]/15 bg-[#202420] text-[10px] uppercase tracking-[0.2em] text-[#C9BBA5]">
                <th className="py-4 px-8">Residence</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Active Stays</th>
                <th className="py-4 px-6">Cancelled</th>
                <th className="py-4 px-6">Nights Reserved</th>
                <th className="py-4 px-6">Demo Booking Value</th>
                <th className="py-4 px-8">Simulated Collected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4D8]/10">
              {propertyStats.map((row) => (
                <tr key={row.villa.id} className="hover:bg-[#202420]/70">
                  <td className="py-5 px-8 font-serif text-2xl text-[#F8F6F0]">
                    {row.villa.code} — {row.villa.name}
                  </td>
                  <td className="py-5 px-6 text-[#C9BBA5]">{row.villa.location}</td>
                  <td className="py-5 px-6 font-mono text-[#F8F6F0]">{row.activeCount}</td>
                  <td className="py-5 px-6 font-mono text-red-300">{row.cancelledCount}</td>
                  <td className="py-5 px-6 text-[#EAE4D8]">{row.nightsBooked} nights</td>
                  <td className="py-5 px-6 font-mono text-[#EAE4D8]">
                    {formatIdr(row.demoBookingValue)}
                  </td>
                  <td className="py-5 px-8 font-mono font-semibold text-[#A48A63]">
                    {formatIdr(row.simulatedCollected)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
