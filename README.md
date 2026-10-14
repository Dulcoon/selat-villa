# SELAT PRIVATE ISLAND VILLAS — Labuan Bajo, Flores, Indonesia

**Next.js 14 (App Router) + TypeScript + Tailwind CSS + Recharts + Lucide React**  
*Frontend-Only Luxury Hospitality Website, Booking Engine & Property Management Showcase*

---

## 1. Project Overview

**SELAT Private Island Villas** is a complete, high-fidelity villa booking website and administrative console prototype designed for a fictional luxury hospitality collection in **Labuan Bajo, Flores, East Nusa Tenggara, Indonesia**.

The design follows a **dark architectural editorial aesthetic** (`#171A18` deep charcoal, `#202420` secondary charcoal, `#25382F` forest green, `#EAE4D8` warm ivory, and `#A48A63` antique bronze) presented inside a refined warm-ivory architectural frame with oversized `SELAT` hero typography, custom coastal imagery, and full client-side state synchronization between the public website and the administrative dashboard.

> **Important Note:** This project is a **100% frontend-only mock prototype** built for portfolio demonstration and direct Vercel deployment. It requires **no database, no backend server, no API keys, and no real payment gateway**. All interactive changes persist locally in browser `localStorage` and can be reset to the deterministic seed state at any time.

---

## 2. Included Routes & Features

### Public Experience
- **`/` (Editorial Homepage)**:
  1. **Navigation & Cinematic Hero** with oversized `SELAT` wordmark, foreground architectural villa overlooking the Flores Sea, and right-side statistics panel (`04 Private Residences`, `∞ Ocean Horizons`, `FLORES Indonesia`).
  2. **About SELAT** (`"Rooted in the land. Drawn to the sea."`, three core values, and framed architectural photography).
  3. **Signature Experiences** (`"Thoughtful Details. Unforgettable Stays."` — 6 interactive horizontal feature tiles with modal details).
  4. **Selected Residences** (`"Distinct Places. One Extraordinary Setting."` — 4-card gallery for *Layar House*, *Batu Villa*, *Sora Residence*, and *Teras Bajo*).
  5. **Featured Residence** (`"An Open Horizon. Your Own Sanctuary."` — asymmetric spotlight on *Layar House*).
  6. **Guest Notes** (`"Made for Moments Worth Remembering."` — interactive testimonial switcher).
  7. **Final Booking CTA** (`"Your Island Story Starts Here."`).
  8. **Compact Framed Footer** with Privacy & Terms modals.
- **`/villas` (Public Villa Discovery)**:
  - Live filters by check-in/out dates, guest capacity, minimum bedrooms, location, and amenities, plus price sorting and real-time availability badges.
- **`/villas/[slug]` (Individual Villa Detail Pages)**:
  - Dedicated pages for `/villas/layar-house`, `/villas/batu-villa`, `/villas/sora-residence`, and `/villas/teras-bajo` (plus any newly added residences).
  - Includes hero gallery + lightbox, architectural narrative, features, amenities, house rules, 14-day simulated availability strip, sticky pricing calculator, and related residences.
- **`/booking` (5-Step Interactive Booking & Simulated Checkout)**:
  - Step 1: Residence, Date & Guest validation
  - Step 2: Night-by-night rate breakdown, curated island extras, and promo codes (`SELAT10`, `FLORES2026`, `ARCHITECT15`)
  - Step 3: Guest details with client-side validation
  - Step 4: Simulated checkout (Card, Bank Transfer, QRIS/E-Wallet; Full vs. 50% Deposit; Simulate Success or Declined payment)
  - Step 5: Confirmation receipt with generated `SLT-XXXXXX` reference & print view
- **`/lookup` (Booking Lookup)**:
  - Look up any seeded or newly created reservation by Reference ID and Guest Email (e.g., `SLT-731944` / `clara.vance@atelier-paris.demo`).

### Administrative Console
- **`/admin/login`**: Simulated login with one-click **"Enter Demo Dashboard"** shortcut.
- **`/admin` (Overview)**: 8 operational KPIs, Revenue Trend & Occupancy charts, and recent reservations.
- **`/admin/bookings`**: Search, status/property/date filters, pagination, status switcher, cancellation simulation, internal concierge notes, and CSV export.
- **`/admin/villas`**: Add, edit, publish/unpublish, preview, or delete residences with instant sync to public pages.
- **`/admin/calendar`**: Interactive monthly calendar (`Oct 2026 – Jan 2027`) with villa selector, reservation inspector, and click-to-block/unblock dates.
- **`/admin/pricing`**: Base nightly rates, weekend multipliers, seasonal multipliers, date-specific overrides, promo code manager, and explicit pricing precedence (`Override > Seasonal > Weekend > Base`).
- **`/admin/guests`**: Guest directory, search, and associated reservation history.
- **`/admin/reports`**: Property popularity, Demo Booking Value vs. Simulated Collected Payments, and CSV export.
- **`/admin/settings`**: Live brand settings, check-in/out times, fees/taxes, and **"Reset Demo Data"** confirmation modal.

---

## 3. Local Development & Vercel Deployment

### Run Locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### Production Build & Vercel Deployment
```bash
npm run build
npm run start
```
To deploy to **Vercel**, push this folder to a Git repository and import it into Vercel with default Next.js settings (zero environment variables required).
# selat-villa
