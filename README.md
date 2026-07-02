# NeO Nails & Beauty Bar — Website Redesign Concept

An unsolicited redesign concept for **NeO Nails & Beauty Bar**, a nail salon and beauty bar in
Prairieville, Louisiana — *"professional nail care for ladies & gentlemen; top-line products,
expert technique, affordable price."*

This is a single-page, fully static concept — no build step, no frameworks. It shows the owner
what a polished, editorial, boutique-feeling site could look like, built directly around the
**real online booking system they already use**.

## Why this redesign

The current site (neonailsbeautybar.com) undersells a business whose actual work is beautiful:

- **Dated, template-y look.** The current design reads like an off-the-shelf theme rather than a
  distinctive brand — it doesn't feel upscale, and it looks like many other salon sites.
- **Booking is buried.** They already take appointments online, but the booking flow isn't the
  star of the page. This concept makes "Book Online" the primary action everywhere.
- **The menu is hard to scan.** Their full, genuinely rich price list (five tiers of pedicures,
  extensions, lashes, dip/ombré sets) deserves a clean, confident menu layout.

This redesign is an **obvious upgrade in clarity, structure and polish** — not a clone of the
current layout. New direction: warm ivory + deep plum + muted rose & bronze, an editorial serif
(Fraunces) paired with a clean sans (Manrope), alternating image/text feature rows, a dark
full-menu section, and refined scroll/hover motion.

## Real business data used

Everything on the page is pulled from their live site:

- **Real photography** downloaded from their own site's gallery (hero + experience + gallery),
  optimized and stored in `assets/photos/`.
- **Real, complete menu & prices** — pedicures, natural nail care, enhancements/sets, lashes,
  waxing, add-ons, and kids' services.
- **Real hours:** Mon–Fri 9:00 AM–6:30 PM · Sat 9:00 AM–6:00 PM · Sun closed.
- **Real address:** 17385 Airline Hwy, Ste 3, Prairieville, LA 70769.
- **Real phone:** (225) 673-1093 (click-to-call).
- **Real online booking:** every "Book Online" button links to their actual scheduler
  (`nailsolutionplus.firebaseapp.com/...`). No mock/fake scheduler.

## What's included

- Sticky, shrink-on-scroll header with animated underline nav and a real mobile menu
- Hero with real photography and a primary **Book Online** CTA + click-to-call
- **Experience** — alternating editorial image/text rows (calm space, pedicure tiers, full beauty bar)
- **Menu & Prices** — a dark, scannable two-column real price menu
- **Gallery** — a mosaic of their real nail/salon photography
- **Book Online** — a feature panel linking straight to their live booking system
- Reviews, real hours table, address with map link, click-to-call phone
- Scroll-reveal, hover motion, and full `prefers-reduced-motion` support
- Responsive from 360px phones to widescreen

## How to view

Open **`index.html`** in any browser (double-click it) — everything runs locally, no server or
build step.

## SEO

On-page SEO is baked in for local search:

- **JSON-LD structured data** (`@type: BeautySalon`) in `<head>` with real name, phone, address,
  opening hours, `priceRange`, image, url, `sameAs` (their live booking system) and a `ReserveAction`.
- **Canonical**, complete **Open Graph** + **Twitter Card** tags, **`robots.txt`**, and **`sitemap.xml`**.
- One `<h1>`; keyword-aware `<title>`/meta description; descriptive `alt` on every image.

**Base URL placeholder:** the canonical link, `og:url`, `twitter:image`, sitemap `<loc>`,
`robots.txt` Sitemap line, and the JSON-LD `url`/`image` all use the literal placeholder
`https://REPLACE-WITH-DOMAIN.com/`. At deploy, do a single find/replace of `REPLACE-WITH-DOMAIN.com`
with the real domain across `index.html`, `sitemap.xml`, and `robots.txt`.

## Notes

- Fully static: `index.html` + `styles.css` + `script.js` + `assets/photos/`. The only external
  dependency is a single Google Fonts `<link>` (Fraunces + Manrope).
- Photos are the business's own images from their public website, used to represent their real work.
- This is an **unsolicited concept pitch**, not an official NeO Nails & Beauty Bar property.
