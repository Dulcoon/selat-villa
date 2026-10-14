"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useSelat } from "@/context/SelatContext";
import { RotateCcw, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, updateSettings, resetDemoData } = useSelat();
  const [formState, setFormState] = useState(settings);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
  };

  return (
    <AdminLayout>
      <div className="w-full bg-[#171A18]">
        <div className="w-full px-8 md:px-10 py-10 border-b border-[#EAE4D8]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#A48A63]">
              08 // BRAND & OPERATIONAL CONFIGURATION
            </p>
            <h1 className="font-serif text-4xl text-[#F8F6F0] mt-1">
              Estate Settings & Demo State Reset
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="border border-red-400/50 text-red-200 hover:bg-red-950/50 px-6 py-3 text-xs uppercase tracking-[0.2em] flex items-center gap-2.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="w-full p-8 md:p-10 space-y-6 text-xs border-b border-[#EAE4D8]/15"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
                Brand Wordmark
              </label>
              <input
                type="text"
                value={formState.brandName}
                onChange={(e) =>
                  setFormState({ ...formState, brandName: e.target.value })
                }
                className="w-full bg-[#202420] border border-[#EAE4D8]/20 px-4 py-3 text-[#EAE4D8]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
                Full Brand Title
              </label>
              <input
                type="text"
                value={formState.fullBrandName}
                onChange={(e) =>
                  setFormState({ ...formState, fullBrandName: e.target.value })
                }
                className="w-full bg-[#202420] border border-[#EAE4D8]/20 px-4 py-3 text-[#EAE4D8]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
                Editorial Tagline
              </label>
              <input
                type="text"
                value={formState.tagline}
                onChange={(e) =>
                  setFormState({ ...formState, tagline: e.target.value })
                }
                className="w-full bg-[#202420] border border-[#EAE4D8]/20 px-4 py-3 text-[#EAE4D8]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
                Concierge Email (Demo)
              </label>
              <input
                type="email"
                value={formState.contactEmail}
                onChange={(e) =>
                  setFormState({ ...formState, contactEmail: e.target.value })
                }
                className="w-full bg-[#202420] border border-[#EAE4D8]/20 px-4 py-3 text-[#EAE4D8]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
                Concierge Phone (Demo)
              </label>
              <input
                type="text"
                value={formState.contactPhone}
                onChange={(e) =>
                  setFormState({ ...formState, contactPhone: e.target.value })
                }
                className="w-full bg-[#202420] border border-[#EAE4D8]/20 px-4 py-3 text-[#EAE4D8]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
                Service Fee (%)
              </label>
              <input
                type="number"
                value={formState.serviceFeePercent}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    serviceFeePercent: Number(e.target.value),
                  })
                }
                className="w-full bg-[#202420] border border-[#EAE4D8]/20 px-4 py-3 text-[#EAE4D8]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
                Regional Hospitality Tax (%)
              </label>
              <input
                type="number"
                value={formState.taxPercent}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    taxPercent: Number(e.target.value),
                  })
                }
                className="w-full bg-[#202420] border border-[#EAE4D8]/20 px-4 py-3 text-[#EAE4D8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
              Booking Policy
            </label>
            <textarea
              rows={2}
              value={formState.bookingPolicy}
              onChange={(e) =>
                setFormState({ ...formState, bookingPolicy: e.target.value })
              }
              className="w-full bg-[#202420] border border-[#EAE4D8]/20 p-4 text-[#EAE4D8]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
              Cancellation Policy
            </label>
            <textarea
              rows={2}
              value={formState.cancellationPolicy}
              onChange={(e) =>
                setFormState({ ...formState, cancellationPolicy: e.target.value })
              }
              className="w-full bg-[#202420] border border-[#EAE4D8]/20 p-4 text-[#EAE4D8]"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-[#EAE4D8] text-[#171A18] hover:bg-[#C9BBA5] px-8 py-4 text-xs uppercase tracking-[0.22em] font-semibold flex items-center gap-2.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings to Live Prototype</span>
            </button>
          </div>
        </form>

        {confirmResetOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#202420] border border-[#EAE4D8]/30 max-w-md w-full p-8 space-y-5 text-[#EAE4D8]">
              <h3 className="font-serif text-3xl text-[#F8F6F0]">
                Reset All Demonstration Data?
              </h3>
              <p className="text-xs text-[#C9BBA5] leading-relaxed">
                This will clear browser localStorage changes and restore the initial seeded Labuan Bajo villas, real architectural photography, bookings, blocked dates, pricing rules, promo codes, and brand settings.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmResetOpen(false)}
                  className="px-5 py-2.5 border border-[#EAE4D8]/25 text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetDemoData();
                    setConfirmResetOpen(false);
                  }}
                  className="bg-red-800 text-white px-6 py-2.5 text-xs uppercase tracking-wider"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
