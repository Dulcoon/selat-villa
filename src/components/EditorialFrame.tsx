"use client";

import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function EditorialFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#171A18] text-[#EAE4D8] flex flex-col selection:bg-[#A48A63] selection:text-[#171A18]">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
