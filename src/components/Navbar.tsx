"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useSelat } from "@/context/SelatContext";

const SECTION_IDS = ["experiences", "story", "contact"];

export function Navbar() {
  const pathname = usePathname();
  const { settings } = useSelat();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hash, setHash] = useState("");

  // Track hash: clicks, back/forward, and direct loads with #fragment
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  // Scroll-spy: highlight Experiences / Architecture / Concierge
  // while scrolling the home page, even without clicking.
  useEffect(() => {
    if (pathname !== "/") return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        let current = "";
        for (const id of SECTION_IDS) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom > 140) current = `#${id}`;
        }
        // Footer contact at page bottom
        if (
          !current &&
          window.innerHeight + window.scrollY >= document.body.scrollHeight - 160
        ) {
          if (document.getElementById("contact")) current = "#contact";
        }
        setHash((prev) => (prev === current ? prev : current));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" && (hash === "" || hash === "#");
    if (href === "/villas")
      return pathname === "/villas" || pathname.startsWith("/villas/");
    if (href === "/lookup") return pathname === "/lookup";
    if (href.startsWith("/#")) return pathname === "/" && hash === href.slice(1);
    return pathname === href;
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/villas", label: "Residences" },
    { href: "/#experiences", label: "Experiences" },
    { href: "/#story", label: "Architecture" },
    { href: "/lookup", label: "Manage Stay" },
    { href: "/#contact", label: "Concierge" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EAE4D8]/15 bg-[#171A18]/95 backdrop-blur-md">
      <div className="w-full h-20 grid grid-cols-12 items-stretch">
        {/* Left Brand Cell */}
        <div className="col-span-6 lg:col-span-3 px-6 md:px-10 flex items-center border-r border-[#EAE4D8]/15">
          <Link href="/" className="flex items-center gap-4 group">
            <span className="w-8 h-8 border border-[#A48A63] flex items-center justify-center text-[#EAE4D8] text-xs font-serif tracking-widest group-hover:bg-[#A48A63] group-hover:text-[#171A18] transition">
              S
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-[0.32em] text-[#F8F6F0] leading-none">
                {settings.brandName}
              </span>
              <span className="text-[9px] tracking-[0.26em] text-[#A5A69C] uppercase mt-1">
                Labuan Bajo • Flores
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation Cell */}
        <nav
          className="hidden lg:flex lg:col-span-6 px-8 items-center justify-center gap-8 border-r border-[#EAE4D8]/15"
          aria-label="Primary Navigation"
        >
          {navLinks.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-[11px] uppercase tracking-[0.22em] py-1 transition border-b ${
                  active
                    ? "text-[#F8F6F0] border-[#A48A63]"
                    : "text-[#C9BBA5] hover:text-[#F8F6F0] border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Flush Action Cells */}
        <div className="hidden lg:grid lg:col-span-3 grid-cols-2 items-stretch">
          <Link
            href="/admin"
            className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#C9BBA5] hover:text-[#F8F6F0] hover:bg-[#202420] border-r border-[#EAE4D8]/15 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#A48A63]" />
            <span>Backoffice</span>
          </Link>
          <Link
            href="/booking"
            className="bg-[#EAE4D8] text-[#171A18] hover:bg-[#C9BBA5] flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.22em] font-semibold transition"
          >
            <span>Reserve</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="col-span-6 lg:hidden flex items-center justify-end px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[#EAE4D8] p-2.5 border border-[#EAE4D8]/25"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#171A18] border-t border-[#EAE4D8]/15 divide-y divide-[#EAE4D8]/10">
          {navLinks.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`block px-6 py-4 text-xs uppercase tracking-[0.22em] transition border-l-2 ${
                  active
                    ? "text-[#F8F6F0] bg-[#202420] border-[#A48A63]"
                    : "text-[#EAE4D8] hover:bg-[#202420] border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="grid grid-cols-2 divide-x divide-[#EAE4D8]/15">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="py-4 text-center text-xs uppercase tracking-[0.2em] text-[#C9BBA5]"
            >
              Admin Console
            </Link>
            <Link
              href="/booking"
              onClick={() => setMobileOpen(false)}
              className="py-4 text-center bg-[#EAE4D8] text-[#171A18] text-xs uppercase tracking-[0.2em] font-semibold"
            >
              Reserve Stay
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
