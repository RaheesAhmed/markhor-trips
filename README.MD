# Markhor Trips — Home page redesign

A premium, SEO-ready home page for markhortrips.com. Plain HTML + hand-written CSS + a small vanilla JS file, so it has
no build step and drops into the existing ASP.NET site.

```
index.html        page markup, meta tags, structured data (TravelAgency, WebSite, FAQPage)
css/main.css      all styles (brand tokens at the top in :root)
js/main.js        header, hero slideshow, search tabs, travellers picker, scroll reveals
images/hero/      hero photos (optimised .webp; original .png kept as source)
images/brand/     logo
images/packages/  ← drop generated images here (see below)
images/features/  ←
images/destinations/ ←
images/app/       ←
```

## Images

Added: Thailand, Armenia, Azerbaijan, Umrah coach, UAE staycation, Türkiye, Philippines, app mockup.
**Still needed:** `pakistan.webp`, `bangladesh.webp`, `united-kingdom.webp` (used as hover previews on the routes list).

### Prompts

Every image slot already has a designed gradient fallback, so the page looks finished without them. Save each image
as **.webp** with the **exact file name** below and push — it appears automatically, no code change.

Tips: keep each file under ~300 KB (export WebP at quality 75–80). Don't put text or logos inside the images.

| File | Size | Prompt |
|---|---|---|
| `images/packages/thailand.webp` | 1200×1500 (portrait) | Editorial travel photograph of Phang Nga Bay, Thailand: towering limestone karsts rising from emerald-turquoise water, a traditional wooden long-tail boat with coloured ribbons on the prow in the foreground, soft late-afternoon golden light, light haze, shot on a 35mm lens, rich but natural colours, luxury travel magazine style, no people facing camera, no text |
| `images/packages/armenia.webp` | 1200×800 | Cinematic photograph of Yerevan, Armenia at sunset with snow-capped Mount Ararat glowing pink and orange on the horizon, warm terracotta rooftops and the Cascade complex in the foreground, gentle evening haze, premium travel magazine style, no text |
| `images/packages/azerbaijan.webp` | 1200×800 | Blue-hour photograph of Baku, Azerbaijan: the three Flame Towers lit up above the ancient stone walls of the Old City (Icherisheher), deep blue sky, warm street lights, Caspian waterfront glimpse, elegant and moody, luxury travel style, no text |
| `images/features/umrah-bus.webp` | 1600×900 | A modern, spotless white luxury coach driving along a smooth desert highway at dawn towards Makkah, golden sunrise light over rocky Hejaz mountains, long soft shadows, calm and serene mood, wide cinematic composition, no logos, no text |
| `images/features/uae-staycation.webp` | 1400×1000 | A family of four (Middle-Eastern / South-Asian) relaxing at the edge of an infinity pool at a luxury UAE beach resort at golden hour, Dubai skyline softly visible in the distance, palm trees, loungers, warm natural light, candid and joyful, premium hospitality photography, no text |
| `images/destinations/pakistan.webp` | 900×1200 (portrait) | Hunza Valley, Pakistan in autumn: golden poplar trees, terraced fields and the jagged Karakoram peaks (Rakaposhi) with fresh snow, crisp blue sky, majestic and peaceful, vertical composition, travel editorial, no text |
| `images/destinations/bangladesh.webp` | 900×1200 | Lush rolling tea gardens of Sylhet, Bangladesh in morning mist, a tea picker in a colourful sari in the mid-ground, soft diffused light, vibrant greens, vertical composition, no text |
| `images/destinations/turkey.webp` | 900×1200 | Dozens of colourful hot-air balloons floating over the fairy chimneys of Cappadocia, Türkiye at sunrise, pastel pink and orange sky, vertical composition, dreamy and premium, no text |
| `images/destinations/philippines.webp` | 900×1200 | El Nido, Palawan, Philippines: crystal-clear turquoise lagoon between dramatic limestone cliffs, a small traditional bangka boat, bright tropical light, vertical composition, no text |
| `images/destinations/united-kingdom.webp` | 900×1200 | London at blue hour: the Thames with Tower Bridge illuminated, city lights reflecting on the water, slight long-exposure smoothness, elegant and cinematic, vertical composition, no text |
| `images/app/app-mockup.webp` | 900×1000, **transparent background** | Photorealistic 3D render of two modern smartphones floating at a slight angle, screens showing a clean travel-booking app with a navy (#081a3d) and orange (#f06a2a) colour scheme — a flight search screen and a boarding-pass screen — soft studio shadow, transparent background, no brand logos |
| `images/og-cover.jpg` | 1200×630 | (Optional, for social sharing) Same as the hero: turquoise alpine lake with snowy peaks, with generous empty sky on the left |

When `app-mockup.webp` exists, the built-in CSS phone illustration hides automatically.

## Using it on the live ASP site

1. Copy `css/`, `js/` and `images/` into the site (e.g. `/Content/Home/`) and update the three paths in `index.html`.
2. Put the `<body>` contents into the home view and the `<head>` meta/JSON-LD into the layout's head section.
   All styles are class-based, so they won't clash with Bootstrap.
3. Search forms currently send people to the matching search page on markhortrips.com
   (`/Cms?type=flight`, `hotel`, `visa`, `tour`). Once the page runs on the same domain, set
   `<html data-booking-base="">` and connect each form (`#panel-flight`, `#panel-hotel`, …) to the existing
   booking-engine search scripts so results open directly.
4. The page links to all existing site URLs (packages, login, B2B registration, CMS pages), so nothing breaks.

## Editing content

- Brand colours and fonts: `:root` at the top of `css/main.css`.
- Prices (Umrah AED 1,140 / 1,224 / 1,299, staycation from AED 295) appear in `index.html` **and** in the JSON-LD
  block at the top — update both.
- FAQ answers appear in the page **and** in the FAQPage JSON-LD — keep them identical (Google requires it).
