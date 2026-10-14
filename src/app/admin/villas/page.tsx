"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/AdminLayout";
import { useSelat } from "@/context/SelatContext";
import { formatIdr } from "@/lib/pricing";
import { Villa } from "@/types/selat";
import { Plus, Edit3, Trash2, ExternalLink, Eye, EyeOff, X } from "lucide-react";

export default function AdminVillasPage() {
  const { villas, saveVilla, deleteVilla, toggleVillaPublished } = useSelat();
  const [editingVilla, setEditingVilla] = useState<Villa | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleCreateNew = () => {
    const nextNum = villas.length + 1;
    const newVilla: Villa = {
      id: `villa-${Date.now()}`,
      slug: `residence-${nextNum}`,
      code: `0${nextNum}`,
      name: "Kanawa Cliff Residence",
      location: "Waecicu North Ridge",
      tagline: "Elevated Timber Sanctuary Above the Reef.",
      shortDescription:
        "An intimate cliffside residence with panoramic views across the northern Komodo channel.",
      architecturalStory:
        "Designed with cantilevered ironwood decks and porous limestone breezeways overlooking Kanawa Island.",
      bedrooms: 3,
      bathrooms: 3,
      maxGuests: 6,
      areaSqm: 410,
      baseNightlyRate: 5900000,
      weekendMultiplier: 1.15,
      extraGuestFee: 750000,
      baseIncludedGuests: 4,
      minStayNights: 2,
      published: true,
      featured: false,
      heroImage:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85",
      gallery: [
        {
          id: `gal-${Date.now()}`,
          url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85",
          alt: "Kanawa Cliff Residence view",
          caption: "Cliffside horizon pool overlooking the northern reef.",
        },
      ],
      amenities: [
        "Private Infinity Pool",
        "Direct Oceanfront Access",
        "Dedicated Residence Host",
        "Sunset Deck",
        "High-Speed Satellite Wi-Fi",
      ],
      features: [
        "18m cliff-edge infinity pool",
        "Three ocean-facing king suites",
        "Private sunset dining pergola",
      ],
      houseRules: [
        "Check-in from 15:00 WITA; check-out by 11:00 WITA",
        "Maximum occupancy 6 guests",
      ],
      coordinates: "8°26'11.0″S 119°51'42.0″E",
    };
    setEditingVilla(newVilla);
  };

  return (
    <AdminLayout>
      <div className="w-full bg-[#171A18]">
        <div className="w-full px-8 md:px-10 py-10 border-b border-[#EAE4D8]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#A48A63]">
              03 // PORTFOLIO INVENTORY
            </p>
            <h1 className="font-serif text-4xl text-[#F8F6F0] mt-1">
              Residence Management ({villas.length})
            </h1>
          </div>
          <button
            type="button"
            onClick={handleCreateNew}
            className="bg-[#EAE4D8] text-[#171A18] hover:bg-[#C9BBA5] px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Residence</span>
          </button>
        </div>

        {/* Full-Width Edge-to-Edge Residence Rows */}
        <div className="w-full divide-y divide-[#EAE4D8]/15 border-b border-[#EAE4D8]/15">
          {villas.map((v) => (
            <div
              key={v.id}
              className="w-full grid grid-cols-1 lg:grid-cols-12 bg-[#171A18] hover:bg-[#202420]/50 transition"
            >
              <div className="lg:col-span-4 relative min-h-[240px] border-b lg:border-b-0 lg:border-r border-[#EAE4D8]/15">
                <img
                  src={v.heroImage}
                  alt={v.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 bg-[#171A18]/90 px-4 py-2 text-[10px] uppercase tracking-widest text-[#EAE4D8] border-r border-b border-[#EAE4D8]/20">
                  {v.code} // {v.location}
                </div>
                <div className="absolute top-0 right-0">
                  <span
                    className={`px-3.5 py-2 text-[10px] uppercase tracking-widest block ${
                      v.published
                        ? "bg-[#25382F] text-[#EAE4D8]"
                        : "bg-[#A48A63] text-[#171A18] font-semibold"
                    }`}
                  >
                    {v.published ? "Published" : "Hidden Draft"}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-8 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <h2 className="font-serif text-3xl text-[#F8F6F0]">{v.name}</h2>
                    <span className="font-serif text-2xl text-[#A48A63]">
                      {formatIdr(v.baseNightlyRate)} / night
                    </span>
                  </div>
                  <p className="text-xs text-[#C9BBA5] leading-relaxed max-w-2xl">
                    {v.shortDescription}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-6 text-[11px] uppercase tracking-wider text-[#A5A69C]">
                    <span>{v.bedrooms} Bedrooms</span>
                    <span>•</span>
                    <span>{v.bathrooms} Baths</span>
                    <span>•</span>
                    <span>Max {v.maxGuests} Guests</span>
                    <span>•</span>
                    <span>{v.areaSqm} m²</span>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#EAE4D8]/15 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingVilla({ ...v })}
                      className="bg-[#EAE4D8] text-[#171A18] px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center gap-2"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Residence</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleVillaPublished(v.id)}
                      className="border border-[#EAE4D8]/25 text-[#EAE4D8] px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-[#202420]"
                    >
                      {v.published ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Unpublish</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Publish</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/villas/${v.slug}`}
                      className="border border-[#EAE4D8]/25 px-4 py-2.5 text-[10px] uppercase tracking-widest text-[#C9BBA5] hover:text-white flex items-center gap-1.5"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(v.id)}
                      className="border border-red-400/40 text-red-300 px-3.5 py-2.5 hover:bg-red-950/40"
                      title="Delete Residence"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {editingVilla && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#202420] border border-[#EAE4D8]/30 max-w-2xl w-full p-8 space-y-5 my-8 text-[#EAE4D8]">
              <div className="flex items-center justify-between border-b border-[#EAE4D8]/15 pb-4">
                <h2 className="font-serif text-3xl text-[#F8F6F0]">
                  Edit Residence — {editingVilla.name}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditingVilla(null)}
                  className="text-[#A5A69C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A48A63] mb-1.5">
                    Residence Name
                  </label>
                  <input
                    type="text"
                    value={editingVilla.name}
                    onChange={(e) =>
                      setEditingVilla({ ...editingVilla, name: e.target.value })
                    }
                    className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2.5 text-[#EAE4D8]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A48A63] mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingVilla.slug}
                    onChange={(e) =>
                      setEditingVilla({ ...editingVilla, slug: e.target.value })
                    }
                    className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2.5 text-[#EAE4D8]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A48A63] mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingVilla.location}
                    onChange={(e) =>
                      setEditingVilla({ ...editingVilla, location: e.target.value })
                    }
                    className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2.5 text-[#EAE4D8]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A48A63] mb-1.5">
                    Base Nightly Rate (IDR)
                  </label>
                  <input
                    type="number"
                    value={editingVilla.baseNightlyRate}
                    onChange={(e) =>
                      setEditingVilla({
                        ...editingVilla,
                        baseNightlyRate: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2.5 text-[#EAE4D8]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A48A63] mb-1.5">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={editingVilla.bedrooms}
                    onChange={(e) =>
                      setEditingVilla({
                        ...editingVilla,
                        bedrooms: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2.5 text-[#EAE4D8]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A48A63] mb-1.5">
                    Max Guest Capacity
                  </label>
                  <input
                    type="number"
                    value={editingVilla.maxGuests}
                    onChange={(e) =>
                      setEditingVilla({
                        ...editingVilla,
                        maxGuests: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2.5 text-[#EAE4D8]"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[10px] uppercase tracking-wider text-[#A48A63] mb-1.5">
                  Hero Photograph URL (Unsplash / CDN)
                </label>
                <input
                  type="text"
                  value={editingVilla.heroImage}
                  onChange={(e) =>
                    setEditingVilla({ ...editingVilla, heroImage: e.target.value })
                  }
                  className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2.5 text-[#EAE4D8]"
                />
              </div>

              <div className="text-xs">
                <label className="block text-[10px] uppercase tracking-wider text-[#A48A63] mb-1.5">
                  Short Editorial Description
                </label>
                <textarea
                  rows={2}
                  value={editingVilla.shortDescription}
                  onChange={(e) =>
                    setEditingVilla({
                      ...editingVilla,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full bg-[#171A18] border border-[#EAE4D8]/20 p-3 text-[#EAE4D8]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE4D8]/15">
                <button
                  type="button"
                  onClick={() => setEditingVilla(null)}
                  className="px-5 py-2.5 border border-[#EAE4D8]/25 text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    saveVilla(editingVilla);
                    setEditingVilla(null);
                  }}
                  className="bg-[#EAE4D8] text-[#171A18] px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold"
                >
                  Save Residence
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#202420] border border-[#EAE4D8]/30 max-w-md w-full p-8 space-y-5 text-[#EAE4D8]">
              <h3 className="font-serif text-2xl text-[#F8F6F0]">
                Remove Residence from Demo?
              </h3>
              <p className="text-xs text-[#C9BBA5] leading-relaxed">
                This will remove the property from the active frontend collection. You can restore all original villas at any time via Estate Settings → Reset Demo Data.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 border border-[#EAE4D8]/25 text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteVilla(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="bg-red-800 text-white px-5 py-2 text-xs uppercase tracking-wider"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
