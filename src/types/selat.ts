export interface VillaImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
}

export interface Amenity {
  id: string;
  name: string;
  category: "architecture" | "wellness" | "hospitality" | "outdoor";
}

export interface Villa {
  id: string;
  slug: string;
  code: string;
  name: string;
  location: string;
  tagline: string;
  shortDescription: string;
  architecturalStory: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  areaSqm: number;
  baseNightlyRate: number;
  weekendMultiplier: number;
  extraGuestFee: number;
  baseIncludedGuests: number;
  minStayNights: number;
  published: boolean;
  featured: boolean;
  heroImage: string;
  gallery: VillaImage[];
  amenities: string[];
  features: string[];
  houseRules: string[];
  coordinates: string;
}

export interface PricingRule {
  id: string;
  name: string;
  type: "seasonal" | "override" | "weekend";
  villaId: string | "ALL";
  startDate?: string;
  endDate?: string;
  multiplier?: number;
  fixedNightlyRate?: number;
  minStayNights?: number;
  active: boolean;
  priority: number;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minNights: number;
  active: boolean;
}

export interface BlockedDate {
  id: string;
  villaId: string;
  date: string;
  reason: string;
}

export interface BookingExtra {
  id: string;
  name: string;
  description: string;
  priceIdr: number;
  perNight: boolean;
}

export type BookingStatus = "confirmed" | "pending" | "checked-in" | "completed" | "cancelled";
export type PaymentStatus = "paid-simulated" | "deposit-simulated" | "pending" | "refunded-simulated" | "failed-simulated";
export type PaymentMethod = "card" | "bank_transfer" | "ewallet";

export interface Booking {
  id: string;
  reference: string;
  villaId: string;
  villaName: string;
  villaSlug: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  nightlySubtotal: number;
  extraGuestSubtotal: number;
  extrasSubtotal: number;
  selectedExtras: string[];
  promoCode?: string;
  discountAmount: number;
  serviceFeeAmount: number;
  taxAmount: number;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  specialRequests?: string;
  internalNotes?: string;
  createdAt: string;
}

export interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  bookingsCount: number;
  lastStay: string;
  simulatedTotalValue: number;
  preferences: string;
}

export interface SiteSettings {
  brandName: string;
  fullBrandName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  instagramUrl: string;
  whatsappNumber: string;
  checkInTime: string;
  checkOutTime: string;
  serviceFeePercent: number;
  taxPercent: number;
  depositPercent: number;
  bookingPolicy: string;
  cancellationPolicy: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  guestName: string;
  context: string;
  residenceName: string;
  stayMonth: string;
  ratingLabel: string;
}
