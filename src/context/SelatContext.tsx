"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Villa,
  Booking,
  PricingRule,
  PromoCode,
  BlockedDate,
  GuestProfile,
  SiteSettings,
  BookingStatus,
  PaymentStatus,
} from "@/types/selat";
import {
  INITIAL_VILLAS,
  INITIAL_BOOKINGS,
  INITIAL_PRICING_RULES,
  INITIAL_PROMO_CODES,
  INITIAL_BLOCKED_DATES,
  INITIAL_GUESTS,
  INITIAL_SETTINGS,
} from "@/data/seed";

interface SelatContextType {
  hydrated: boolean;
  villas: Villa[];
  bookings: Booking[];
  pricingRules: PricingRule[];
  promoCodes: PromoCode[];
  blockedDates: BlockedDate[];
  guests: GuestProfile[];
  settings: SiteSettings;
  isAdminLoggedIn: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  loginAdmin: (email?: string) => void;
  logoutAdmin: () => void;
  createBooking: (newBooking: Omit<Booking, "id" | "reference" | "createdAt">) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus, paymentStatus?: PaymentStatus) => void;
  updateBookingNotes: (bookingId: string, notes: string) => void;
  saveVilla: (villa: Villa) => void;
  deleteVilla: (villaId: string) => void;
  toggleVillaPublished: (villaId: string) => void;
  toggleBlockedDate: (villaId: string, date: string, reason?: string) => void;
  savePricingRule: (rule: PricingRule) => void;
  deletePricingRule: (ruleId: string) => void;
  savePromoCode: (promo: PromoCode) => void;
  deletePromoCode: (promoId: string) => void;
  updateVillaPricing: (
    villaId: string,
    updates: {
      baseNightlyRate: number;
      weekendMultiplier: number;
      extraGuestFee: number;
      minStayNights: number;
    }
  ) => void;
  updateSettings: (newSettings: SiteSettings) => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = "selat_flores_demo_state_v2";

const SelatContext = createContext<SelatContextType | undefined>(undefined);

export function SelatProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [villas, setVillas] = useState<Villa[]>(INITIAL_VILLAS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(INITIAL_BLOCKED_DATES);
  const [guests, setGuests] = useState<GuestProfile[]>(INITIAL_GUESTS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.villas) && parsed.villas.length > 0) setVillas(parsed.villas);
        if (Array.isArray(parsed.bookings)) setBookings(parsed.bookings);
        if (Array.isArray(parsed.pricingRules)) setPricingRules(parsed.pricingRules);
        if (Array.isArray(parsed.promoCodes)) setPromoCodes(parsed.promoCodes);
        if (Array.isArray(parsed.blockedDates)) setBlockedDates(parsed.blockedDates);
        if (Array.isArray(parsed.guests)) setGuests(parsed.guests);
        if (parsed.settings && parsed.settings.brandName) setSettings(parsed.settings);
        if (typeof parsed.isAdminLoggedIn === "boolean") setIsAdminLoggedIn(parsed.isAdminLoggedIn);
      }
    } catch (err) {
      console.warn("SELAT demo storage recovery: using default seeded state", err);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload = {
        villas,
        bookings,
        pricingRules,
        promoCodes,
        blockedDates,
        guests,
        settings,
        isAdminLoggedIn,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn("Could not persist SELAT demo state to localStorage", err);
    }
  }, [hydrated, villas, bookings, pricingRules, promoCodes, blockedDates, guests, settings, isAdminLoggedIn]);

  const loginAdmin = () => {
    setIsAdminLoggedIn(true);
    showToast("Entered SELAT Simulated Management Dashboard");
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    showToast("Signed out of simulated admin view");
  };

  const createBooking = (newBookingData: Omit<Booking, "id" | "reference" | "createdAt">): Booking => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const reference = `SLT-${randomDigits}`;
    const createdAt = "2026-10-14";
    const fullBooking: Booking = {
      ...newBookingData,
      id: `bk-${Date.now()}`,
      reference,
      createdAt,
    };

    setBookings((prev) => [fullBooking, ...prev]);

    setGuests((prev) => {
      const existingIdx = prev.findIndex(
        (g) => g.email.toLowerCase() === fullBooking.guestEmail.toLowerCase()
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        const existing = updated[existingIdx];
        updated[existingIdx] = {
          ...existing,
          bookingsCount: existing.bookingsCount + 1,
          lastStay: fullBooking.checkOut,
          simulatedTotalValue: existing.simulatedTotalValue + fullBooking.totalAmount,
        };
        return updated;
      }
      return [
        {
          id: `gst-${Date.now()}`,
          name: fullBooking.guestName,
          email: fullBooking.guestEmail,
          phone: fullBooking.guestPhone,
          country: "International Guest",
          bookingsCount: 1,
          lastStay: fullBooking.checkOut,
          simulatedTotalValue: fullBooking.totalAmount,
          preferences: fullBooking.specialRequests || "Private coastal residence stay",
        },
        ...prev,
      ];
    });

    showToast(`Simulated reservation ${reference} created`);
    return fullBooking;
  };

  const updateBookingStatus = (
    bookingId: string,
    status: BookingStatus,
    paymentStatus?: PaymentStatus
  ) => {
    setBookings((prev) =>
      prev.map((bk) => {
        if (bk.id !== bookingId) return bk;
        const nextPayment =
          paymentStatus ||
          (status === "cancelled" ? "refunded-simulated" : bk.paymentStatus);
        return { ...bk, status, paymentStatus: nextPayment };
      })
    );
    showToast(`Updated booking status to ${status}`);
  };

  const updateBookingNotes = (bookingId: string, internalNotes: string) => {
    setBookings((prev) =>
      prev.map((bk) => (bk.id === bookingId ? { ...bk, internalNotes } : bk))
    );
    showToast("Saved internal reservation notes");
  };

  const saveVilla = (villa: Villa) => {
    setVillas((prev) => {
      const exists = prev.some((v) => v.id === villa.id);
      if (exists) {
        return prev.map((v) => (v.id === villa.id ? villa : v));
      }
      return [...prev, villa];
    });
    showToast(`Saved residence: ${villa.name}`);
  };

  const deleteVilla = (villaId: string) => {
    setVillas((prev) => prev.filter((v) => v.id !== villaId));
    showToast("Removed residence from demo collection");
  };

  const toggleVillaPublished = (villaId: string) => {
    setVillas((prev) =>
      prev.map((v) => (v.id === villaId ? { ...v, published: !v.published } : v))
    );
    showToast("Updated residence publication status");
  };

  const toggleBlockedDate = (
    villaId: string,
    date: string,
    reason = "Admin manual hold"
  ) => {
    setBlockedDates((prev) => {
      const existing = prev.find((b) => b.villaId === villaId && b.date === date);
      if (existing) {
        showToast(`Unblocked ${date}`);
        return prev.filter((b) => b.id !== existing.id);
      }
      showToast(`Blocked ${date} (${reason})`);
      return [
        ...prev,
        { id: `blk-${Date.now()}`, villaId, date, reason },
      ];
    });
  };

  const savePricingRule = (rule: PricingRule) => {
    setPricingRules((prev) => {
      const exists = prev.some((r) => r.id === rule.id);
      if (exists) {
        return prev.map((r) => (r.id === rule.id ? rule : r));
      }
      return [...prev, rule];
    });
    showToast(`Saved pricing rule: ${rule.name}`);
  };

  const deletePricingRule = (ruleId: string) => {
    setPricingRules((prev) => prev.filter((r) => r.id !== ruleId));
    showToast("Deleted pricing rule");
  };

  const savePromoCode = (promo: PromoCode) => {
    setPromoCodes((prev) => {
      const exists = prev.some((p) => p.id === promo.id);
      if (exists) {
        return prev.map((p) => (p.id === promo.id ? promo : p));
      }
      return [...prev, promo];
    });
    showToast(`Saved promotional code: ${promo.code}`);
  };

  const deletePromoCode = (promoId: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== promoId));
    showToast("Removed promotional code");
  };

  const updateVillaPricing = (
    villaId: string,
    updates: {
      baseNightlyRate: number;
      weekendMultiplier: number;
      extraGuestFee: number;
      minStayNights: number;
    }
  ) => {
    setVillas((prev) =>
      prev.map((v) => (v.id === villaId ? { ...v, ...updates } : v))
    );
    showToast("Updated residence base rates & stay rules");
  };

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    showToast("Saved brand and site settings");
  };

  const resetDemoData = () => {
    setVillas(INITIAL_VILLAS);
    setBookings(INITIAL_BOOKINGS);
    setPricingRules(INITIAL_PRICING_RULES);
    setPromoCodes(INITIAL_PROMO_CODES);
    setBlockedDates(INITIAL_BLOCKED_DATES);
    setGuests(INITIAL_GUESTS);
    setSettings(INITIAL_SETTINGS);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    showToast("Restored initial seeded Labuan Bajo demonstration data");
  };

  return (
    <SelatContext.Provider
      value={{
        hydrated,
        villas,
        bookings,
        pricingRules,
        promoCodes,
        blockedDates,
        guests,
        settings,
        isAdminLoggedIn,
        toastMessage,
        showToast,
        loginAdmin,
        logoutAdmin,
        createBooking,
        updateBookingStatus,
        updateBookingNotes,
        saveVilla,
        deleteVilla,
        toggleVillaPublished,
        toggleBlockedDate,
        savePricingRule,
        deletePricingRule,
        savePromoCode,
        deletePromoCode,
        updateVillaPricing,
        updateSettings,
        resetDemoData,
      }}
    >
      {children}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#25382F] text-[#EAE4D8] border border-[#A48A63]/50 px-5 py-3.5 text-xs tracking-wider uppercase shadow-2xl flex items-center gap-3"
        >
          <span className="w-2 h-2 rounded-full bg-[#A48A63]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </SelatContext.Provider>
  );
}

export function useSelat() {
  const ctx = useContext(SelatContext);
  if (!ctx) {
    throw new Error("useSelat must be used within a SelatProvider");
  }
  return ctx;
}
