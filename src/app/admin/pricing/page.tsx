"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useSelat } from "@/context/SelatContext";
import { formatIdr } from "@/lib/pricing";
import { PricingRule, PromoCode } from "@/types/selat";
import { Trash2 } from "lucide-react";

export default function AdminPricingPage() {
  const {
    villas,
    pricingRules,
    promoCodes,
    updateVillaPricing,
    savePricingRule,
    deletePricingRule,
    savePromoCode,
    deletePromoCode,
  } = useSelat();

  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleType, setNewRuleType] = useState<"seasonal" | "override">("seasonal");
  const [newRuleVillaId] = useState<string>("ALL");
  const [newRuleStart, setNewRuleStart] = useState("2026-11-20");
  const [newRuleEnd, setNewRuleEnd] = useState("2026-11-30");
  const [newRuleMultiplier, setNewRuleMultiplier] = useState(1.15);
  const [newRuleFixedRate, setNewRuleFixedRate] = useState(7500000);

  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDesc, setNewPromoDesc] = useState("");
  const [newPromoType, setNewPromoType] = useState<"percentage" | "fixed">("percentage");
  const [newPromoVal, setNewPromoVal] = useState(10);
  const [newPromoMinNights] = useState(2);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;
    const rule: PricingRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName.trim(),
      type: newRuleType,
      villaId: newRuleVillaId,
      startDate: newRuleStart,
      endDate: newRuleEnd,
      multiplier: newRuleType === "seasonal" ? Number(newRuleMultiplier) : undefined,
      fixedNightlyRate:
        newRuleType === "override" ? Number(newRuleFixedRate) : undefined,
      minStayNights: 2,
      active: true,
      priority: newRuleType === "override" ? 1 : 2,
    };
    savePricingRule(rule);
    setNewRuleName("");
  };

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const promo: PromoCode = {
      id: `promo-${Date.now()}`,
      code: newPromoCode.trim().toUpperCase(),
      description: newPromoDesc.trim() || "Custom Promotional Privilege",
      discountType: newPromoType,
      discountValue: Number(newPromoVal),
      minNights: Number(newPromoMinNights),
      active: true,
    };
    savePromoCode(promo);
    setNewPromoCode("");
    setNewPromoDesc("");
  };

  return (
    <AdminLayout>
      <div className="w-full bg-[#171A18]">
        <div className="w-full px-8 md:px-10 py-10 border-b border-[#EAE4D8]/15">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#A48A63]">
            05 // YIELD & RATE ARCHITECTURE
          </p>
          <h1 className="font-serif text-4xl text-[#F8F6F0] mt-1">
            Pricing Rules, Base Rates & Promotional Codes
          </h1>
          <p className="text-xs text-[#C9BBA5] mt-3 bg-[#25382F]/45 border-l-2 border-[#A48A63] px-4 py-2.5">
            <strong className="text-[#F8F6F0] uppercase tracking-wider">Explicit Precedence Rule:</strong> 1. Active Date-Specific Override (Highest) → 2. Active Seasonal Multiplier → 3. Residence Weekend Multiplier (Fri/Sat) → 4. Residence Base Nightly Rate.
          </p>
        </div>

        <div className="w-full border-b border-[#EAE4D8]/15">
          <div className="px-8 md:px-10 py-5 bg-[#202420] border-b border-[#EAE4D8]/15">
            <h2 className="font-serif text-2xl text-[#F8F6F0]">
              01 // Residence Base Nightly Rates & Stay Rules
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EAE4D8]/15 bg-[#141715] text-[10px] uppercase tracking-[0.2em] text-[#A5A69C]">
                  <th className="py-4 px-8">Residence</th>
                  <th className="py-4 px-6">Base Nightly Rate (IDR)</th>
                  <th className="py-4 px-6">Weekend Multiplier</th>
                  <th className="py-4 px-6">Extra Guest Fee (IDR)</th>
                  <th className="py-4 px-8">Min. Stay (Nights)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4D8]/10">
                {villas.map((v) => (
                  <tr key={v.id} className="hover:bg-[#202420]/60">
                    <td className="py-4 px-8 font-serif text-xl text-[#F8F6F0]">
                      {v.code} — {v.name}
                    </td>
                    <td className="py-4 px-6">
                      <input
                        type="number"
                        value={v.baseNightlyRate}
                        step={100000}
                        onChange={(e) =>
                          updateVillaPricing(v.id, {
                            baseNightlyRate: Number(e.target.value),
                            weekendMultiplier: v.weekendMultiplier,
                            extraGuestFee: v.extraGuestFee,
                            minStayNights: v.minStayNights,
                          })
                        }
                        className="bg-[#202420] border border-[#EAE4D8]/25 px-3 py-2 text-[#EAE4D8] w-40"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <input
                        type="number"
                        step="0.01"
                        value={v.weekendMultiplier}
                        onChange={(e) =>
                          updateVillaPricing(v.id, {
                            baseNightlyRate: v.baseNightlyRate,
                            weekendMultiplier: Number(e.target.value),
                            extraGuestFee: v.extraGuestFee,
                            minStayNights: v.minStayNights,
                          })
                        }
                        className="bg-[#202420] border border-[#EAE4D8]/25 px-3 py-2 text-[#EAE4D8] w-28"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <input
                        type="number"
                        step={50000}
                        value={v.extraGuestFee}
                        onChange={(e) =>
                          updateVillaPricing(v.id, {
                            baseNightlyRate: v.baseNightlyRate,
                            weekendMultiplier: v.weekendMultiplier,
                            extraGuestFee: Number(e.target.value),
                            minStayNights: v.minStayNights,
                          })
                        }
                        className="bg-[#202420] border border-[#EAE4D8]/25 px-3 py-2 text-[#EAE4D8] w-36"
                      />
                    </td>
                    <td className="py-4 px-8">
                      <input
                        type="number"
                        min={1}
                        max={14}
                        value={v.minStayNights}
                        onChange={(e) =>
                          updateVillaPricing(v.id, {
                            baseNightlyRate: v.baseNightlyRate,
                            weekendMultiplier: v.weekendMultiplier,
                            extraGuestFee: v.extraGuestFee,
                            minStayNights: Number(e.target.value),
                          })
                        }
                        className="bg-[#202420] border border-[#EAE4D8]/25 px-3 py-2 text-[#EAE4D8] w-24"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE4D8]/15 border-b border-[#EAE4D8]/15">
          <div className="lg:col-span-7 p-8 md:p-10 space-y-6">
            <h2 className="font-serif text-2xl text-[#F8F6F0]">
              02 // Seasonal Periods & Date-Specific Overrides
            </h2>
            <div className="divide-y divide-[#EAE4D8]/15 border-y border-[#EAE4D8]/15">
              {pricingRules.map((rule) => (
                <div
                  key={rule.id}
                  className="py-4 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 bg-[#25382F] text-[#A48A63] mr-3">
                      Priority {rule.priority} • {rule.type}
                    </span>
                    <strong className="text-[#F8F6F0]">{rule.name}</strong>
                    <p className="text-[#A5A69C] mt-1.5">
                      Window: {rule.startDate} → {rule.endDate} •{" "}
                      {rule.type === "override"
                        ? `Fixed Rate: ${formatIdr(rule.fixedNightlyRate || 0)}`
                        : `Multiplier: ${rule.multiplier}x`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deletePricingRule(rule.id)}
                    className="text-red-300 p-2 hover:bg-red-950/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddRule} className="space-y-4 text-xs pt-2">
              <p className="uppercase tracking-[0.2em] text-[10px] text-[#A48A63]">
                Add Seasonal or Override Rule
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Rule Name (e.g. Peak Regatta Week)"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  required
                  className="bg-[#202420] border border-[#EAE4D8]/20 px-3.5 py-2.5 text-[#EAE4D8]"
                />
                <select
                  value={newRuleType}
                  onChange={(e) => setNewRuleType(e.target.value as any)}
                  className="bg-[#202420] border border-[#EAE4D8]/20 px-3.5 py-2.5 text-[#EAE4D8]"
                >
                  <option value="seasonal">Seasonal Multiplier (Priority 2)</option>
                  <option value="override">Date-Specific Override (Priority 1)</option>
                </select>
                <input
                  type="date"
                  value={newRuleStart}
                  onChange={(e) => setNewRuleStart(e.target.value)}
                  className="bg-[#202420] border border-[#EAE4D8]/20 px-3.5 py-2.5 text-[#EAE4D8]"
                />
                <input
                  type="date"
                  value={newRuleEnd}
                  onChange={(e) => setNewRuleEnd(e.target.value)}
                  className="bg-[#202420] border border-[#EAE4D8]/20 px-3.5 py-2.5 text-[#EAE4D8]"
                />
                {newRuleType === "seasonal" ? (
                  <input
                    type="number"
                    step="0.05"
                    value={newRuleMultiplier}
                    onChange={(e) => setNewRuleMultiplier(Number(e.target.value))}
                    className="bg-[#202420] border border-[#EAE4D8]/20 px-3.5 py-2.5 text-[#EAE4D8]"
                  />
                ) : (
                  <input
                    type="number"
                    step="100000"
                    value={newRuleFixedRate}
                    onChange={(e) => setNewRuleFixedRate(Number(e.target.value))}
                    className="bg-[#202420] border border-[#EAE4D8]/20 px-3.5 py-2.5 text-[#EAE4D8]"
                  />
                )}
                <button
                  type="submit"
                  className="bg-[#EAE4D8] text-[#171A18] px-5 py-2.5 uppercase tracking-[0.2em] font-semibold"
                >
                  + Add Rule
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 p-8 md:p-10 bg-[#202420]/50 space-y-6">
            <h2 className="font-serif text-2xl text-[#F8F6F0]">
              03 // Promotional Codes
            </h2>
            <div className="divide-y divide-[#EAE4D8]/15 border-y border-[#EAE4D8]/15">
              {promoCodes.map((p) => (
                <div
                  key={p.id}
                  className="py-4 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-[#A48A63]">{p.code}</span>
                    <span className="text-[#C9BBA5] ml-2">
                      ({p.discountType === "percentage" ? `${p.discountValue}%` : formatIdr(p.discountValue)} • Min {p.minNights}n)
                    </span>
                    <p className="text-[11px] text-[#A5A69C] mt-1">{p.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deletePromoCode(p.id)}
                    className="text-red-300 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddPromo} className="space-y-4 text-xs pt-2">
              <p className="uppercase tracking-[0.2em] text-[10px] text-[#A48A63]">
                Create Promotional Code
              </p>
              <input
                type="text"
                placeholder="CODE (E.G. KOMODO20)"
                value={newPromoCode}
                onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                required
                className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3.5 py-2.5 text-[#EAE4D8] uppercase"
              />
              <input
                type="text"
                placeholder="Privilege Description"
                value={newPromoDesc}
                onChange={(e) => setNewPromoDesc(e.target.value)}
                className="w-full bg-[#171A18] border border-[#EAE4D8]/20 px-3.5 py-2.5 text-[#EAE4D8]"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newPromoType}
                  onChange={(e) => setNewPromoType(e.target.value as any)}
                  className="bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2.5 text-[#EAE4D8]"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed IDR</option>
                </select>
                <input
                  type="number"
                  value={newPromoVal}
                  onChange={(e) => setNewPromoVal(Number(e.target.value))}
                  className="bg-[#171A18] border border-[#EAE4D8]/20 px-3 py-2.5 text-[#EAE4D8]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#EAE4D8] text-[#171A18] py-3 uppercase tracking-[0.2em] font-semibold"
              >
                + Save Promotional Code
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
