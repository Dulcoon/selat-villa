"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelat } from "@/context/SelatContext";
import {
  LayoutDashboard,
  CalendarCheck,
  Home,
  Calendar,
  Tag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ArrowUpRight,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { settings, isAdminLoggedIn, loginAdmin, logoutAdmin } = useSelat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { code: "01", href: "/admin", label: "Overview", icon: LayoutDashboard },
    { code: "02", href: "/admin/bookings", label: "Reservations", icon: CalendarCheck },
    { code: "03", href: "/admin/villas", label: "Residences", icon: Home },
    { code: "04", href: "/admin/calendar", label: "Availability", icon: Calendar },
    { code: "05", href: "/admin/pricing", label: "Yield & Pricing", icon: Tag },
    { code: "06", href: "/admin/guests", label: "Guest Ledger", icon: Users },
    { code: "07", href: "/admin/reports", label: "Analytics", icon: BarChart3 },
    { code: "08", href: "/admin/settings", label: "Estate Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen w-full bg-[#171A18] text-[#EAE4D8] flex flex-col lg:flex-row font-sans selection:bg-[#A48A63] selection:text-[#171A18]">
      {/* Dark Architectural Editorial Sidebar — Aligned with Public Brand */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#141715] text-[#EAE4D8] border-r border-[#EAE4D8]/15 flex flex-col justify-between transition-transform lg:translate-x-0 lg:static shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Top Brand Cell */}
          <div className="px-7 h-20 flex items-center justify-between border-b border-[#EAE4D8]/15">
            <Link href="/admin" className="flex items-center gap-3.5">
              <span className="w-8 h-8 border border-[#A48A63] flex items-center justify-center font-serif text-xs text-[#F8F6F0]">
                S
              </span>
              <div>
                <span className="font-serif text-lg tracking-[0.28em] text-[#F8F6F0] block leading-none">
                  {settings.brandName}
                </span>
                <span className="text-[9px] uppercase tracking-[0.24em] text-[#A48A63] block mt-1">
                  Backoffice Monograph
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#EAE4D8]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Architectural Navigation Matrix */}
          <nav className="divide-y divide-[#EAE4D8]/10 border-b border-[#EAE4D8]/15" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-7 py-4 text-[11px] tracking-[0.2em] uppercase transition ${
                    active
                      ? "bg-[#25382F] text-[#F8F6F0] border-l-2 border-[#A48A63] font-semibold"
                      : "text-[#C9BBA5] hover:bg-[#202420] hover:text-[#F8F6F0]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-[10px] font-mono text-[#A48A63]">{item.code}</span>
                    <span>{item.label}</span>
                  </div>
                  <Icon className="w-3.5 h-3.5 opacity-75" />
                </Link>
              );
            })}
          </nav>

          <div className="p-7 space-y-2 border-b border-[#EAE4D8]/10 bg-[#171A18]/60">
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#A48A63] block">
              State Synchronization
            </span>
            <p className="text-xs text-[#A5A69C] leading-relaxed">
              All rate edits, date blocks, and booking status changes persist in browser localStorage and update the public website immediately.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#EAE4D8]/15 border-t border-[#EAE4D8]/15">
          <Link
            href="/"
            className="flex items-center justify-between px-7 py-4 text-[11px] uppercase tracking-[0.2em] text-[#EAE4D8] hover:bg-[#202420] transition"
          >
            <span>Public Villa Website</span>
            <ArrowUpRight className="w-4 h-4 text-[#A48A63]" />
          </Link>
          <button
            type="button"
            onClick={() => {
              logoutAdmin();
              router.push("/admin/login");
            }}
            className="w-full flex items-center justify-between px-7 py-4 text-[11px] uppercase tracking-[0.2em] text-[#A5A69C] hover:text-[#F8F6F0] hover:bg-[#202420] transition"
          >
            <span>End Simulated Session</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Full-Width Dark Architectural Workspace */}
      <div className="flex-1 flex flex-col min-w-0 w-full bg-[#171A18]">
        <header className="h-20 bg-[#171A18] border-b border-[#EAE4D8]/15 px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 border border-[#EAE4D8]/20 text-[#EAE4D8]"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#A48A63]">
                Labuan Bajo Hospitality Operations • Simulated Console
              </p>
              <p className="font-serif text-xl text-[#F8F6F0]">
                {isAdminLoggedIn ? "Executive Director Session" : "Demonstration Preview Mode"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isAdminLoggedIn && (
              <button
                type="button"
                onClick={() => loginAdmin()}
                className="bg-[#25382F] border border-[#A48A63]/50 text-[#EAE4D8] px-4 py-2 text-[10px] uppercase tracking-[0.2em]"
              >
                Activate Admin Session
              </button>
            )}
            <Link
              href="/villas"
              className="hidden sm:inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] px-5 py-2.5 border border-[#EAE4D8]/25 text-[#EAE4D8] hover:bg-[#EAE4D8] hover:text-[#171A18] transition"
            >
              <span>Inspect Live Residences</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Subtle Architectural Status Bar */}
        <div className="bg-[#202420] border-b border-[#EAE4D8]/15 px-6 md:px-10 py-2.5 flex items-center justify-between text-[11px] text-[#C9BBA5]">
          <span className="flex items-center gap-2.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#A48A63] shrink-0" />
            <span>
              <strong className="text-[#F8F6F0] uppercase tracking-wider">Frontend Prototype Notice:</strong> All reservation ledgers, occupancy rates, and IDR figures are simulated demonstration data.
            </span>
          </span>
          <span className="hidden md:inline text-[10px] uppercase tracking-[0.22em] text-[#A48A63]">
            WITA • Oct 14, 2026
          </span>
        </div>

        {/* Full-Width Edge-to-Edge Main Canvas */}
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  );
}
