import {
  Villa,
  PricingRule,
  PromoCode,
  BlockedDate,
  Booking,
  SiteSettings,
  BookingExtra,
} from "@/types/selat";
import { BOOKING_EXTRAS } from "@/data/seed";

export function formatIdr(amount: number): string {
  return "IDR " + Math.round(amount).toLocaleString("en-US");
}

export function getDatesInRange(checkIn: string, checkOut: string): string[] {
  const dates: string[] = [];
  const start = new Date(checkIn + "T00:00:00");
  const end = new Date(checkOut + "T00:00:00");
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    return dates;
  }
  const curr = new Date(start);
  while (curr < end) {
    const yyyy = curr.getFullYear();
    const mm = String(curr.getMonth() + 1).padStart(2, "0");
    const dd = String(curr.getDate()).padStart(2, "0");
    dates.push(`${yyyy}-${mm}-${dd}`);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

export function isWeekendDate(dateStr: string): boolean {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay();
  return day === 5 || day === 6;
}

export function calculateNightlyRateForDate(
  villa: Villa,
  dateStr: string,
  pricingRules: PricingRule[]
): { rate: number; appliedRuleLabel: string } {
  const activeRules = pricingRules.filter(
    (r) =>
      r.active &&
      (r.villaId === villa.id || r.villaId === "ALL") &&
      (!r.startDate || dateStr >= r.startDate) &&
      (!r.endDate || dateStr <= r.endDate)
  );

  const overrideRule = activeRules.find((r) => r.type === "override" && r.fixedNightlyRate);
  if (overrideRule && overrideRule.fixedNightlyRate) {
    return {
      rate: overrideRule.fixedNightlyRate,
      appliedRuleLabel: overrideRule.name,
    };
  }

  let rate = villa.baseNightlyRate;
  const labels: string[] = [];

  const seasonalRule = activeRules.find((r) => r.type === "seasonal" && r.multiplier);
  if (seasonalRule && seasonalRule.multiplier) {
    rate = Math.round(rate * seasonalRule.multiplier);
    labels.push(seasonalRule.name);
  }

  if (isWeekendDate(dateStr)) {
    rate = Math.round(rate * villa.weekendMultiplier);
    labels.push(`Weekend (+${Math.round((villa.weekendMultiplier - 1) * 100)}%)`);
  }

  return {
    rate,
    appliedRuleLabel: labels.length > 0 ? labels.join(" • ") : "Base Nightly Rate",
  };
}

export interface PriceBreakdown {
  valid: boolean;
  error?: string;
  nights: number;
  nightlyBreakdown: { date: string; rate: number; rule: string }[];
  nightlySubtotal: number;
  extraGuestCount: number;
  extraGuestSubtotal: number;
  extrasSubtotal: number;
  appliedPromo?: PromoCode;
  promoError?: string;
  discountAmount: number;
  serviceFeeAmount: number;
  taxAmount: number;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
}

export function calculateBookingQuote(params: {
  villa: Villa;
  checkIn: string;
  checkOut: string;
  guests: number;
  selectedExtras: string[];
  promoCodeInput?: string;
  pricingRules: PricingRule[];
  promoCodes: PromoCode[];
  settings: SiteSettings;
  availableExtras?: BookingExtra[];
}): PriceBreakdown {
  const {
    villa,
    checkIn,
    checkOut,
    guests,
    selectedExtras,
    promoCodeInput,
    pricingRules,
    promoCodes,
    settings,
    availableExtras = BOOKING_EXTRAS,
  } = params;

  const dates = getDatesInRange(checkIn, checkOut);
  if (dates.length === 0) {
    return {
      valid: false,
      error: "Check-out date must follow check-in date.",
      nights: 0,
      nightlyBreakdown: [],
      nightlySubtotal: 0,
      extraGuestCount: 0,
      extraGuestSubtotal: 0,
      extrasSubtotal: 0,
      discountAmount: 0,
      serviceFeeAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
      depositAmount: 0,
      balanceAmount: 0,
    };
  }

  const nights = dates.length;
  if (nights < villa.minStayNights) {
    return {
      valid: false,
      error: `${villa.name} requires a minimum stay of ${villa.minStayNights} nights.`,
      nights,
      nightlyBreakdown: [],
      nightlySubtotal: 0,
      extraGuestCount: 0,
      extraGuestSubtotal: 0,
      extrasSubtotal: 0,
      discountAmount: 0,
      serviceFeeAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
      depositAmount: 0,
      balanceAmount: 0,
    };
  }

  if (guests > villa.maxGuests) {
    return {
      valid: false,
      error: `${villa.name} accommodates up to ${villa.maxGuests} guests.`,
      nights,
      nightlyBreakdown: [],
      nightlySubtotal: 0,
      extraGuestCount: 0,
      extraGuestSubtotal: 0,
      extrasSubtotal: 0,
      discountAmount: 0,
      serviceFeeAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
      depositAmount: 0,
      balanceAmount: 0,
    };
  }

  const nightlyBreakdown = dates.map((d) => {
    const res = calculateNightlyRateForDate(villa, d, pricingRules);
    return { date: d, rate: res.rate, rule: res.appliedRuleLabel };
  });

  const nightlySubtotal = nightlyBreakdown.reduce((acc, item) => acc + item.rate, 0);
  const extraGuestCount = Math.max(0, guests - villa.baseIncludedGuests);
  const extraGuestSubtotal = extraGuestCount * villa.extraGuestFee * nights;

  const extrasSubtotal = selectedExtras.reduce((acc, extraId) => {
    const found = availableExtras.find((e) => e.id === extraId);
    if (!found) return acc;
    return acc + (found.perNight ? found.priceIdr * nights : found.priceIdr);
  }, 0);

  let appliedPromo: PromoCode | undefined;
  let promoError: string | undefined;
  let discountAmount = 0;

  if (promoCodeInput && promoCodeInput.trim() !== "") {
    const cleanCode = promoCodeInput.trim().toUpperCase();
    const foundPromo = promoCodes.find((p) => p.code.toUpperCase() === cleanCode && p.active);
    if (!foundPromo) {
      promoError = `Promo code "${cleanCode}" is invalid or inactive.`;
    } else if (nights < foundPromo.minNights) {
      promoError = `Code "${cleanCode}" requires at least ${foundPromo.minNights} nights.`;
    } else {
      appliedPromo = foundPromo;
      if (foundPromo.discountType === "percentage") {
        discountAmount = Math.round(nightlySubtotal * (foundPromo.discountValue / 100));
      } else {
        discountAmount = Math.min(nightlySubtotal, foundPromo.discountValue);
      }
    }
  }

  const netBeforeTax = Math.max(
    0,
    nightlySubtotal + extraGuestSubtotal + extrasSubtotal - discountAmount
  );
  const serviceFeeAmount = Math.round(netBeforeTax * (settings.serviceFeePercent / 100));
  const taxAmount = Math.round((netBeforeTax + serviceFeeAmount) * (settings.taxPercent / 100));
  const totalAmount = netBeforeTax + serviceFeeAmount + taxAmount;
  const depositAmount = Math.round(totalAmount * (settings.depositPercent / 100));
  const balanceAmount = totalAmount - depositAmount;

  return {
    valid: true,
    nights,
    nightlyBreakdown,
    nightlySubtotal,
    extraGuestCount,
    extraGuestSubtotal,
    extrasSubtotal,
    appliedPromo,
    promoError,
    discountAmount,
    serviceFeeAmount,
    taxAmount,
    totalAmount,
    depositAmount,
    balanceAmount,
  };
}

export function checkVillaAvailability(params: {
  villaId: string;
  checkIn: string;
  checkOut: string;
  blockedDates: BlockedDate[];
  bookings: Booking[];
}): { available: boolean; conflictReason?: string } {
  const { villaId, checkIn, checkOut, blockedDates, bookings } = params;
  const dates = getDatesInRange(checkIn, checkOut);
  if (dates.length === 0) {
    return { available: false, conflictReason: "Invalid date selection" };
  }

  for (const d of dates) {
    const blocked = blockedDates.find((b) => b.villaId === villaId && b.date === d);
    if (blocked) {
      return {
        available: false,
        conflictReason: `Blocked on ${d} (${blocked.reason})`,
      };
    }

    const activeBooking = bookings.find(
      (bk) =>
        bk.villaId === villaId &&
        bk.status !== "cancelled" &&
        d >= bk.checkIn &&
        d < bk.checkOut
    );
    if (activeBooking) {
      return {
        available: false,
        conflictReason: `Reserved on ${d} (${activeBooking.reference})`,
      };
    }
  }

  return { available: true };
}

export function exportRowsToCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escapeCell = (val: string | number) => {
    const s = String(val ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const csvLines = [
    headers.map(escapeCell).join(","),
    ...rows.map((r) => r.map(escapeCell).join(",")),
  ];
  const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
