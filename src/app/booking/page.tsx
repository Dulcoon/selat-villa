"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EditorialFrame } from "@/components/EditorialFrame";
import { useSelat } from "@/context/SelatContext";
import { BOOKING_EXTRAS } from "@/data/seed";
import {
  formatIdr,
  calculateBookingQuote,
  checkVillaAvailability,
} from "@/lib/pricing";
import { Booking, PaymentMethod } from "@/types/selat";
import {
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Building2,
  Wallet,
  Printer,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

function BookingWizardContent() {
  const searchParams = useSearchParams();
  const {
    villas,
    pricingRules,
    promoCodes,
    blockedDates,
    bookings,
    settings,
    createBooking,
  } = useSelat();

  const publishedVillas = villas.filter((v) => v.published);
  const initialSlug = searchParams?.get("villa") || "layar-house";
  const initialVilla =
    publishedVillas.find((v) => v.slug === initialSlug) || publishedVillas[0];

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedVillaId, setSelectedVillaId] = useState(
    initialVilla?.id || "villa-layar"
  );
  const [checkIn, setCheckIn] = useState(
    searchParams?.get("checkIn") || "2026-11-12"
  );
  const [checkOut, setCheckOut] = useState(
    searchParams?.get("checkOut") || "2026-11-15"
  );
  const [guests, setGuests] = useState(
    Number(searchParams?.get("guests")) || 2
  );
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [paymentTier, setPaymentTier] = useState<"full" | "deposit">("full");
  const [simulatedError, setSimulatedError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const selectedVilla =
    villas.find((v) => v.id === selectedVillaId) || publishedVillas[0];

  const availability = useMemo(() => {
    if (!selectedVilla) return { available: false, conflictReason: "No residence selected" };
    return checkVillaAvailability({
      villaId: selectedVilla.id,
      checkIn,
      checkOut,
      blockedDates,
      bookings,
    });
  }, [selectedVilla, checkIn, checkOut, blockedDates, bookings]);

  const quote = useMemo(() => {
    if (!selectedVilla) return null;
    return calculateBookingQuote({
      villa: selectedVilla,
      checkIn,
      checkOut,
      guests,
      selectedExtras,
      promoCodeInput: appliedPromoCode,
      pricingRules,
      promoCodes,
      settings,
    });
  }, [
    selectedVilla,
    checkIn,
    checkOut,
    guests,
    selectedExtras,
    appliedPromoCode,
    pricingRules,
    promoCodes,
    settings,
  ]);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const validateGuestStep = () => {
    const errs: Record<string, string> = {};
    if (!guestName.trim() || guestName.trim().length < 2) {
      errs.guestName = "Please enter the primary registered guest's full name.";
    }
    if (!guestEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.trim())) {
      errs.guestEmail = "Please enter a valid email address for your booking confirmation.";
    }
    if (!guestPhone.trim() || guestPhone.trim().length < 7) {
      errs.guestPhone = "Please provide a reachable phone or WhatsApp contact number.";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSimulatePayment = (outcome: "success" | "failure") => {
    setSimulatedError(null);
    if (outcome === "failure") {
      setSimulatedError(
        "Simulated Payment Declined: This is a demonstration failure state. Click 'Simulate Successful Payment' to complete the reservation."
      );
      return;
    }

    if (!selectedVilla || !quote || !quote.valid) return;

    const bookingRecord = createBooking({
      villaId: selectedVilla.id,
      villaName: selectedVilla.name,
      villaSlug: selectedVilla.slug,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      checkIn,
      checkOut,
      nights: quote.nights,
      guests,
      nightlySubtotal: quote.nightlySubtotal,
      extraGuestSubtotal: quote.extraGuestSubtotal,
      extrasSubtotal: quote.extrasSubtotal,
      selectedExtras,
      promoCode: quote.appliedPromo?.code,
      discountAmount: quote.discountAmount,
      serviceFeeAmount: quote.serviceFeeAmount,
      taxAmount: quote.taxAmount,
      totalAmount: quote.totalAmount,
      depositAmount: paymentTier === "full" ? quote.totalAmount : quote.depositAmount,
      balanceAmount: paymentTier === "full" ? 0 : quote.balanceAmount,
      status: "confirmed",
      paymentStatus: paymentTier === "full" ? "paid-simulated" : "deposit-simulated",
      paymentMethod,
      specialRequests: specialRequests.trim() || undefined,
      internalNotes: "Created via public interactive booking prototype.",
    });

    setCreatedBooking(bookingRecord);
    setStep(5);
  };

  return (
    <div className="w-full bg-[#171A18]">
      {/* Full-Width Step Header Band */}
      <div className="w-full border-b border-[#EAE4D8]/15 px-8 md:px-14 pt-14 pb-12 md:pt-20 md:pb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#A48A63]">
            SIMULATED RESERVATION CONCIERGE
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#F8F6F0] mt-2">
            Reserve Your Flores Sanctuary
          </h1>
        </div>
        <div className="grid grid-cols-5 border border-[#EAE4D8]/20 divide-x divide-[#EAE4D8]/20 text-[10px] uppercase tracking-[0.18em]">
          {[
            { n: 1, label: "01 Dates" },
            { n: 2, label: "02 Review" },
            { n: 3, label: "03 Guest" },
            { n: 4, label: "04 Checkout" },
            { n: 5, label: "05 Receipt" },
          ].map((s) => (
            <div
              key={s.n}
              className={`px-4 py-2.5 text-center ${
                step === s.n
                  ? "bg-[#EAE4D8] text-[#171A18] font-semibold"
                  : step > s.n
                  ? "bg-[#25382F] text-[#EAE4D8]"
                  : "bg-[#202420] text-[#A5A69C]"
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Full-Width Split Content */}
      {step < 5 && selectedVilla && (
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 border-b border-[#EAE4D8]/15">
          {/* Left 7 Columns: Active Step Controls */}
          <div className="lg:col-span-7 px-10 md:px-16 py-14 md:py-20 border-b lg:border-b-0 lg:border-r border-[#EAE4D8]/15 space-y-10">
            {step === 1 && (
              <>
                <h2 className="font-serif text-3xl text-[#F8F6F0]">
                  01 // Select Residence, Dates & Party Size
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-[#EAE4D8]/15">
                  {publishedVillas.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedVillaId(v.id);
                        if (guests > v.maxGuests) setGuests(v.maxGuests);
                      }}
                      className={`p-6 border-r border-b border-[#EAE4D8]/15 text-left transition ${
                        selectedVilla.id === v.id
                          ? "bg-[#25382F] text-[#F8F6F0]"
                          : "bg-[#171A18] hover:bg-[#202420] text-[#C9BBA5]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-2xl">{v.name}</span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#A48A63]">
                          {v.code}
                        </span>
                      </div>
                      <p className="text-xs text-[#A5A69C] mt-1">
                        {v.location} • Max {v.maxGuests} guests
                      </p>
                      <p className="text-xs font-semibold text-[#EAE4D8] mt-3">
                        {formatIdr(v.baseNightlyRate)} / night
                      </p>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 border border-[#EAE4D8]/20 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE4D8]/20 bg-[#202420]">
                  <div className="p-4">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#A48A63] mb-1.5">
                      Check-In Date
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      min="2026-10-14"
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent text-xs text-[#EAE4D8]"
                    />
                  </div>
                  <div className="p-4">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#A48A63] mb-1.5">
                      Check-Out Date
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-transparent text-xs text-[#EAE4D8]"
                    />
                  </div>
                  <div className="p-4">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#A48A63] mb-1.5">
                      Guests (Max {selectedVilla.maxGuests})
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-[#202420] text-xs text-[#EAE4D8]"
                    >
                      {Array.from(
                        { length: selectedVilla.maxGuests },
                        (_, i) => i + 1
                      ).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {!availability.available && (
                  <div className="p-4 bg-[#A48A63]/20 border-l-2 border-[#A48A63] text-xs text-[#EAE4D8]">
                    {availability.conflictReason}
                  </div>
                )}

                {quote && !quote.valid && (
                  <div className="p-4 bg-red-950/60 border-l-2 border-red-400 text-xs text-red-200">
                    {quote.error}
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={!quote?.valid || !availability.available}
                    onClick={() => setStep(2)}
                    className="bg-[#EAE4D8] text-[#171A18] disabled:opacity-40 px-8 py-4 text-xs uppercase tracking-[0.22em] font-semibold flex items-center gap-3"
                  >
                    <span>Continue to Curated Experiences</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {step === 2 && quote && (
              <>
                <h2 className="font-serif text-3xl text-[#F8F6F0]">
                  02 // Curated Island Experiences & Privilege Code
                </h2>
                <div className="divide-y divide-[#EAE4D8]/15 border-y border-[#EAE4D8]/15">
                  {BOOKING_EXTRAS.map((extra) => {
                    const checked = selectedExtras.includes(extra.id);
                    return (
                      <label
                        key={extra.id}
                        className={`flex items-start justify-between gap-4 p-5 cursor-pointer transition ${
                          checked ? "bg-[#25382F]/60" : "bg-[#171A18] hover:bg-[#202420]"
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleExtra(extra.id)}
                            className="mt-1"
                          />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#F8F6F0]">
                              {extra.name}
                            </p>
                            <p className="text-xs text-[#A5A69C] mt-1">
                              {extra.description}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-[#EAE4D8] whitespace-nowrap font-mono">
                          {formatIdr(extra.priceIdr)}
                          {extra.perNight ? " / night" : ""}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63]">
                    Promotional Code (Try: SELAT10, FLORES2026, or ARCHITECT15)
                  </label>
                  <div className="flex border border-[#EAE4D8]/25">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE"
                      className="flex-1 bg-[#202420] px-4 py-3 text-xs text-[#EAE4D8] uppercase focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setAppliedPromoCode(promoInput)}
                      className="bg-[#EAE4D8] text-[#171A18] px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                  {quote.promoError && (
                    <p className="text-xs text-red-300">{quote.promoError}</p>
                  )}
                  {quote.appliedPromo && (
                    <p className="text-xs text-[#A48A63]">
                      Applied {quote.appliedPromo.code}: -{formatIdr(quote.discountAmount)}
                    </p>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs uppercase tracking-[0.2em] text-[#C9BBA5] flex items-center gap-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-[#EAE4D8] text-[#171A18] px-8 py-4 text-xs uppercase tracking-[0.22em] font-semibold flex items-center gap-3"
                  >
                    <span>Continue to Guest Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="font-serif text-3xl text-[#F8F6F0]">
                  03 // Primary Registered Guest Details
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Elena Rostova"
                      className="w-full bg-[#202420] border border-[#EAE4D8]/20 px-4 py-3 text-xs text-[#EAE4D8]"
                    />
                    {formErrors.guestName && (
                      <p className="text-xs text-red-300 mt-1">{formErrors.guestName}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="guest@domain.com"
                        className="w-full bg-[#202420] border border-[#EAE4D8]/20 px-4 py-3 text-xs text-[#EAE4D8]"
                      />
                      {formErrors.guestEmail && (
                        <p className="text-xs text-red-300 mt-1">{formErrors.guestEmail}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+62 812 0000 0000"
                        className="w-full bg-[#202420] border border-[#EAE4D8]/20 px-4 py-3 text-xs text-[#EAE4D8]"
                      />
                      {formErrors.guestPhone && (
                        <p className="text-xs text-red-300 mt-1">{formErrors.guestPhone}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.22em] text-[#A48A63] mb-2">
                      Flight Arrival & Dietary Preferences (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Komodo Airport (LBJ) flight number, dietary notes..."
                      className="w-full bg-[#202420] border border-[#EAE4D8]/20 p-4 text-xs text-[#EAE4D8]"
                    />
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs uppercase tracking-[0.2em] text-[#C9BBA5] flex items-center gap-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (validateGuestStep()) setStep(4);
                    }}
                    className="bg-[#EAE4D8] text-[#171A18] px-8 py-4 text-xs uppercase tracking-[0.22em] font-semibold flex items-center gap-3"
                  >
                    <span>Proceed to Simulated Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {step === 4 && quote && (
              <>
                <div className="p-5 bg-[#25382F]/50 border-l-2 border-[#A48A63] text-xs text-[#EAE4D8] flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#A48A63] shrink-0 mt-0.5" />
                  <div>
                    <strong className="uppercase tracking-wider block text-[#F8F6F0]">
                      Simulated Frontend Checkout
                    </strong>
                    No real payment credentials are collected. Completing this step generates a live reservation reference that immediately appears in the Backoffice Console.
                  </div>
                </div>

                <h2 className="font-serif text-3xl text-[#F8F6F0]">
                  04 // Select Simulated Settlement Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 border border-[#EAE4D8]/20 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE4D8]/20">
                  {[
                    { id: "card", label: "International Card", icon: CreditCard },
                    { id: "bank_transfer", label: "Bank Transfer / VA", icon: Building2 },
                    { id: "ewallet", label: "QRIS / E-Wallet", icon: Wallet },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                        className={`p-5 text-left flex flex-col gap-2 transition ${
                          paymentMethod === m.id
                            ? "bg-[#25382F] text-[#F8F6F0]"
                            : "bg-[#171A18] text-[#C9BBA5]"
                        }`}
                      >
                        <Icon className="w-4 h-4 text-[#A48A63]" />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          {m.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 border border-[#EAE4D8]/20 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE4D8]/20">
                  <button
                    type="button"
                    onClick={() => setPaymentTier("full")}
                    className={`p-5 text-left ${
                      paymentTier === "full"
                        ? "bg-[#202420] text-[#F8F6F0]"
                        : "bg-[#171A18] text-[#A5A69C]"
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-widest block text-[#A48A63]">
                      Full Settlement (Simulated)
                    </span>
                    <span className="font-serif text-2xl mt-1 block">
                      {formatIdr(quote.totalAmount)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentTier("deposit")}
                    className={`p-5 text-left ${
                      paymentTier === "deposit"
                        ? "bg-[#202420] text-[#F8F6F0]"
                        : "bg-[#171A18] text-[#A5A69C]"
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-widest block text-[#A48A63]">
                      {settings.depositPercent}% Deposit (Simulated)
                    </span>
                    <span className="font-serif text-2xl mt-1 block">
                      {formatIdr(quote.depositAmount)}
                    </span>
                  </button>
                </div>

                {simulatedError && (
                  <div className="p-4 bg-red-950/70 border-l-2 border-red-400 text-xs text-red-200 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{simulatedError}</span>
                  </div>
                )}

                <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#EAE4D8]/15">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs uppercase tracking-[0.2em] text-[#C9BBA5]"
                  >
                    ← Back
                  </button>
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleSimulatePayment("failure")}
                      className="border border-red-400/50 text-red-200 px-5 py-3.5 text-xs uppercase tracking-wider"
                    >
                      Simulate Declined Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulatePayment("success")}
                      className="bg-[#EAE4D8] text-[#171A18] hover:bg-[#C9BBA5] px-8 py-4 text-xs uppercase tracking-[0.22em] font-semibold"
                    >
                      Simulate Successful Payment
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right 5 Columns: Flush Architectural Summary */}
          <div className="lg:col-span-5 bg-[#202420] flex flex-col justify-between">
            <div>
              <div className="aspect-[16/10] w-full overflow-hidden border-b border-[#EAE4D8]/15">
                <img
                  src={selectedVilla.heroImage}
                  alt={selectedVilla.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-8 md:px-12 py-10 md:py-14 space-y-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.26em] text-[#A48A63]">
                    RESERVATION SUMMARY
                  </p>
                  <h3 className="font-serif text-3xl text-[#F8F6F0] mt-1">
                    {selectedVilla.name}
                  </h3>
                  <p className="text-xs text-[#C9BBA5] mt-1">
                    {checkIn} → {checkOut} • {guests} Guests
                  </p>
                </div>

                {quote && quote.valid && (
                  <div className="border-t border-[#EAE4D8]/15 pt-5 space-y-2.5 text-xs">
                    {quote.nightlyBreakdown.map((item) => (
                      <div key={item.date} className="flex justify-between text-[#A5A69C]">
                        <span>
                          {item.date} <em className="text-[10px]">({item.rule})</em>
                        </span>
                        <span className="text-[#EAE4D8]">{formatIdr(item.rate)}</span>
                      </div>
                    ))}
                    {quote.extraGuestSubtotal > 0 && (
                      <div className="flex justify-between text-[#C9BBA5] pt-1">
                        <span>Extra Guest Fees</span>
                        <span>{formatIdr(quote.extraGuestSubtotal)}</span>
                      </div>
                    )}
                    {quote.extrasSubtotal > 0 && (
                      <div className="flex justify-between text-[#C9BBA5]">
                        <span>Curated Experiences</span>
                        <span>{formatIdr(quote.extrasSubtotal)}</span>
                      </div>
                    )}
                    {quote.discountAmount > 0 && (
                      <div className="flex justify-between text-[#A48A63]">
                        <span>Privilege Discount ({quote.appliedPromo?.code})</span>
                        <span>-{formatIdr(quote.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#A5A69C]">
                      <span>Service Fee ({settings.serviceFeePercent}%)</span>
                      <span>{formatIdr(quote.serviceFeeAmount)}</span>
                    </div>
                    <div className="flex justify-between text-[#A5A69C]">
                      <span>Hospitality Tax ({settings.taxPercent}%)</span>
                      <span>{formatIdr(quote.taxAmount)}</span>
                    </div>
                    <div className="border-t border-[#EAE4D8]/20 pt-4 flex justify-between items-baseline">
                      <span className="uppercase tracking-[0.2em] text-[#EAE4D8] font-semibold">
                        Total Amount
                      </span>
                      <span className="font-serif text-3xl text-[#F8F6F0]">
                        {formatIdr(quote.totalAmount)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Full-Width Confirmation Ledger */}
      {step === 5 && createdBooking && (
        <div className="w-full p-8 md:p-16 bg-[#202420] border-b border-[#EAE4D8]/15">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE4D8]/15 pb-6">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-8 h-8 text-[#A48A63]" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.26em] text-[#A48A63]">
                    SIMULATED RESERVATION CONFIRMED
                  </p>
                  <h2 className="font-serif text-4xl text-[#F8F6F0]">
                    Reference: {createdBooking.reference}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="border border-[#EAE4D8]/30 px-6 py-3 text-xs uppercase tracking-[0.2em] flex items-center gap-2 text-[#EAE4D8]"
              >
                <Printer className="w-4 h-4" />
                <span>Print Confirmation</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 border-t border-l border-[#EAE4D8]/15 bg-[#171A18] text-xs">
              <div className="p-6 border-r border-b border-[#EAE4D8]/15">
                <span className="text-[10px] uppercase tracking-widest text-[#A5A69C] block">
                  Residence
                </span>
                <span className="font-serif text-2xl text-[#F8F6F0] mt-1 block">
                  {createdBooking.villaName}
                </span>
              </div>
              <div className="p-6 border-r border-b border-[#EAE4D8]/15">
                <span className="text-[10px] uppercase tracking-widest text-[#A5A69C] block">
                  Check-In / Out
                </span>
                <span className="text-[#EAE4D8] mt-1 block">
                  {createdBooking.checkIn} → {createdBooking.checkOut}
                </span>
              </div>
              <div className="p-6 border-r border-b border-[#EAE4D8]/15">
                <span className="text-[10px] uppercase tracking-widest text-[#A5A69C] block">
                  Registered Guest
                </span>
                <span className="text-[#EAE4D8] mt-1 block">{createdBooking.guestName}</span>
              </div>
              <div className="p-6 border-r border-b border-[#EAE4D8]/15">
                <span className="text-[10px] uppercase tracking-widest text-[#A5A69C] block">
                  Party Size
                </span>
                <span className="text-[#EAE4D8] mt-1 block">{createdBooking.guests} Guests</span>
              </div>
              <div className="p-6 border-r border-b border-[#EAE4D8]/15">
                <span className="text-[10px] uppercase tracking-widest text-[#A5A69C] block">
                  Total Simulated Amount
                </span>
                <span className="text-[#EAE4D8] font-semibold mt-1 block">
                  {formatIdr(createdBooking.totalAmount)}
                </span>
              </div>
              <div className="p-6 border-r border-b border-[#EAE4D8]/15">
                <span className="text-[10px] uppercase tracking-widest text-[#A5A69C] block">
                  Payment Status
                </span>
                <span className="text-[#A48A63] uppercase mt-1 block">
                  {createdBooking.paymentStatus}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <Link
                href={`/lookup?ref=${createdBooking.reference}&email=${encodeURIComponent(
                  createdBooking.guestEmail
                )}`}
                className="text-xs uppercase tracking-[0.2em] text-[#A48A63] hover:underline"
              >
                Inspect in Guest Booking Lookup →
              </Link>
              <Link
                href="/admin/bookings"
                className="bg-[#25382F] text-[#EAE4D8] border border-[#A48A63]/50 px-7 py-3.5 text-xs uppercase tracking-[0.2em]"
              >
                Inspect in Admin Reservations Console →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <EditorialFrame>
      <Suspense fallback={<div className="p-12 text-center text-xs">Loading Concierge...</div>}>
        <BookingWizardContent />
      </Suspense>
    </EditorialFrame>
  );
}
