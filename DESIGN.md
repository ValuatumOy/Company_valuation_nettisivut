# DESIGN.md — Valuatum Arvonmääritys

Professional financial research with restrained Apple-design principles:
clear typography, related information grouped together, immediate feedback,
and quiet functional surfaces. Keep Valuatum's forest/green identity and Inter.
The homepage and company order page were simplified on 2026-10-09.

## Colors (CSS vars in globals.css, mapped to Tailwind via @theme)

- `--green` #2E805B — primary actions, accents; contrast for white button text
- `--green-deep` #246748 — hover, text on light green
- `--green-light` #6DBFA0 — accents on dark
- `--green-mist` #E3F5EE / `--green-faint` #F2FAF6 — tinted surfaces
- `--forest` #1B3028 — dark hero/section background
- `--charcoal` #1A2420 — text, footer; `--charcoal-mid` #2C3832 body text
- `--steel` #627069 — legible secondary text; `--mist` #E2E9E5 borders; `--off-white` #F4F7F5 alt sections
- `--gold` #C8963E + `--gold-faint` #FDF6E8 — launch badge, honesty notes
- `--lime` #C8FF31 — logo mark only

## Typography

Inter (300–700), optical sizing enabled. Use weight and spacing with size to
make the hierarchy clear; body text 15–17px with relaxed leading. Headings
have size-appropriate tracking around -0.02em. Avoid redundant uppercase
eyebrows above headings; labels are for data or controls that need them.

## Components

- Prefer plain rows, lists and subtle separators for content and processes.
- Reserve bordered surfaces for functional groups such as checkout and the
  honestly labelled sample document. Do not nest decorative cards.
- Buttons/CTAs: rounded-lg, green → green-deep, immediate press feedback.
- Avoid decorative chips, icon tiles, tilted documents, glows and grid textures.
- Fixed navigation uses a restrained translucent forest surface; reduced
  transparency and increased contrast preferences use a solid background.
- Desktop navigation starts at xl; smaller screens use an accessible menu with
  44px targets and Escape dismissal. Preserve all existing destinations.

## Section rhythm

Use max-w-7xl px-6 lg:px-10 with generous section separation and tighter related
groups. Forest hero and final CTA anchor the site; white/off-white reading
surfaces let the content lead. Avoid a fixed repeating grid of identical cards.

## Motion

Content is visible on the first render; `Reveal` is a plain semantic wrapper
that preserves callers' layout. No entrance staggering or hidden content.
Use short color/press transitions for controls and a reversible FAQ accordion.
Respect reduced motion, reduced transparency and increased contrast settings.

## Imagery

- Logo `/logo.svg` — lime Valuatum mark.
- Homepage/order flow use solid surfaces rather than decorative stock imagery.
- Existing imagery elsewhere and metadata remain available; do not remove
  public assets or report PDFs as a side effect of visual refinement.
