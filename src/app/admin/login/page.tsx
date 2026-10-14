"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelat } from "@/context/SelatContext";
import { EDITORIAL_IMAGES } from "@/data/seed";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { settings, loginAdmin } = useSelat();
  const [email, setEmail] = useState("director@selat-flores.demo");
  const [password, setPassword] = useState("••••••••••••");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(email);
    router.push("/admin");
  };

  const handleShortcut = () => {
    loginAdmin("demo@selat-flores.demo");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen w-full bg-[#171A18] text-[#EAE4D8] grid grid-cols-1 lg:grid-cols-12">
      {/* Left 7-Column Full-Bleed Architectural Photograph */}
      <div className="hidden lg:block lg:col-span-7 relative border-r border-[#EAE4D8]/15 overflow-hidden">
        <img
          src={EDITORIAL_IMAGES.heroMain}
          alt="SELAT Private Island Villas"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171A18] via-[#171A18]/45 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#A48A63]">
            ESTATE BACKOFFICE MONOGRAPH
          </p>
          <h2 className="font-serif text-5xl text-[#F8F6F0] leading-tight">
            {settings.fullBrandName}
          </h2>
          <p className="text-sm text-[#C9BBA5] max-w-lg">
            {settings.tagline} Unified hospitality operations, yield architecture, and residence management console.
          </p>
        </div>
      </div>

      {/* Right 5-Column Flush Login Console */}
      <div className="lg:col-span-5 flex flex-col justify-between p-8 md:p-14 lg:p-20 bg-[#171A18]">
        <div className="flex items-center justify-between border-b border-[#EAE4D8]/15 pb-6">
          <div className="flex items-center gap-3.5">
            <span className="w-8 h-8 border border-[#A48A63] flex items-center justify-center font-serif text-xs text-[#F8F6F0]">
              S
            </span>
            <span className="font-serif text-xl tracking-[0.28em] text-[#F8F6F0]">
              {settings.brandName}
            </span>
          </div>
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.22em] text-[#C9BBA5] hover:text-[#F8F6F0]"
          >
            ← Public Website
          </Link>
        </div>

        <div className="my-12 space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#A48A63]">
              01 // EXECUTIVE ACCESS
            </p>
            <h1 className="font-serif text-4xl text-[#F8F6F0]">
              Estate Management Console
            </h1>
          </div>

          <div className="bg-[#202420] border-l-2 border-[#A48A63] p-5 text-xs text-[#C9BBA5] leading-relaxed">
            <strong className="text-[#EAE4D8] block uppercase tracking-wider text-[10px] mb-1">
              Simulated Frontend Access
            </strong>
            This console is a frontend demonstration for prospective villa owners. No backend authentication or external server requests occur.
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
                Administrator Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#202420] border border-[#EAE4D8]/20 px-4 py-3.5 text-xs text-[#EAE4D8]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
                Simulated Passkey
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#202420] border border-[#EAE4D8]/20 px-4 py-3.5 text-xs text-[#EAE4D8]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#EAE4D8] text-[#171A18] hover:bg-[#C9BBA5] py-4 text-xs uppercase tracking-[0.22em] font-semibold transition"
            >
              Sign In to Console
            </button>
          </form>

          <div className="pt-4 border-t border-[#EAE4D8]/15 space-y-3">
            <span className="block text-[10px] uppercase tracking-[0.24em] text-[#A5A69C]">
              Instant Portfolio Preview Shortcut
            </span>
            <button
              type="button"
              onClick={handleShortcut}
              className="w-full bg-[#25382F] hover:bg-[#25382F]/80 text-[#EAE4D8] border border-[#A48A63]/60 py-4 text-xs uppercase tracking-[0.22em] font-medium flex items-center justify-center gap-3 transition"
            >
              <ShieldCheck className="w-4 h-4 text-[#A48A63]" />
              <span>Enter Demo Dashboard Directly</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-[#EAE4D8]/15 pt-5 text-[10px] uppercase tracking-[0.2em] text-[#A5A69C] flex justify-between">
          <span>Labuan Bajo • Flores</span>
          <span>Frontend State v2</span>
        </div>
      </div>
    </div>
  );
}
