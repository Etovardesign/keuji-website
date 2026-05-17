# Keuji Website — Claude Context

## Project Overview

Two-page static website for **Keuji**, a technical AI partner for founders. No framework — vanilla HTML, CSS, and JS only.

| File | Purpose |
|---|---|
| `index.html` | Main homepage (seed-to-scale positioning) |
| `taggr.html` | Taggr landing page (accounting AI product) |
| `styles.css` | Shared design tokens, base styles, reusable components |
| `home.css` | Homepage-only section styles |
| `main.js` | Nav scroll, mouse glow orb, scroll reveals, hamburger menu, button glow trail, count-up stats |
| `assets/` | All images (logos, screenshots, background textures) |
| `fonts/` | All typefaces loaded locally via `@font-face` |

**Git remotes:**
- `origin` → `git@github.com:Keuji-Corp/keuji-website-landing.git` (client repo, main deploy target)
- `personal` → `git@github.com:Etovardesign/keuji-website.git`
- Active branch: `staging`

---

## Brand & Positioning

**Keuji** is a technical AI partner that helps founders go from idea to funded product. They are not a consultancy or agency — they embed with founders and build alongside them.

**Two audiences (ICPs):**
1. **Technical founders** — need to extend engineering capacity without slowing down
2. **Non-technical founders** — need a technical co-pilot to turn vision into product

**Flagship product:** Taggr — AI transaction classification for accounting firms. Automates categorization, integrates with QuickBooks, Xero, Sage, FreshBooks.

**Social proof:** Co-created with Hershey's, Snowflake, Pembina, First National Bank. $12M raised across client portfolio.

---

## Voice & Tone

- **Direct.** No filler words, no vague corporate-speak. Say what it does.
- **Founder-first.** Speak to founders as peers, not prospects. "We build with you" not "we deliver solutions."
- **Confident, not arrogant.** Make bold claims that are backed by proof (stats, logos, named products).
- **Concise.** Short sentences. Em-dashes for rhythm. Fragments are fine.
- **Italics signal humanity.** Italic serif text (blue) is used for the emotionally resonant phrase in each headline — the line the founder actually feels.

**Headline pattern:** Sentence case serif headline with a second line in italic blue.
```
Your Trusted
Technical AI Partner   ← italic blue
```

**Eyebrow pattern:** All-caps Retrograde font, used as a section label or sub-context before a heading. Always lowercase in HTML, uppercase enforced via CSS `text-transform`.

---

## Design System

### Colors
| Token | Hex | Use |
|---|---|---|
| `--color-black` | `#000000` | Page background |
| `--color-surface` | `#111111` | Slightly raised surface |
| `--color-card` | `#191919` | Card backgrounds |
| `--color-card-hover` | `#242424` | Card hover state |
| `--color-border` | `#2a2a2a` | Default border |
| `--color-border-hover` | `#4a4a4a` | Hover border |
| `--color-grey` | `#3B3B3B` | Strong border / outline |
| `--color-blue` | `#99AEEF` | Accent — italic headlines, focus rings, links |
| `--color-white` | `#FFFFFF` | Primary text |

Body text that's supporting/secondary uses `rgba(255,255,255,0.5–0.65)` — not a named token, just inline opacity.

### Typography

| Role | Font | Size | Weight | Notes |
|---|---|---|---|---|
| `h1 / .h1` | Instrument Serif | 80px | 400 | `line-height: 0.96` |
| `h2 / .h2` | Instrument Serif | 48px | 400 | `line-height: 1.2` |
| Eyebrow | Retrograde | 16px | 400 | `text-transform: uppercase`, `letter-spacing: 0` |
| Action large | Space Grotesk | 18px | 700 | Titles, card labels, nav |
| Action small | Space Grotesk | 12px | 700 | Tags, form labels |
| Body large | Inter | 18px | 400 | Hero body, approach body |
| Body small | Inter | 16px | 400 | Card bodies, captions |

All fonts are **loaded locally** from the `fonts/` directory — no Google Fonts CDN dependency.

**Italic blue** = `<em>` inside a heading. CSS auto-applies `font-style: italic` and the text inherits `color: var(--color-blue)` when set by parent.

### Spacing Scale
`--sp-8` through `--sp-240` in CSS variables. Use these, never magic numbers:
`8 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 120 / 160 / 240`

### Layout
- Max content width: `1280px` (`--max-w-content`)
- Page padding: `80px` desktop → `24px` tablet/mobile (`--content-px`)
- Nav height: `64px` (`--nav-h`)

---

## Component Patterns

### Buttons (`.btn`)
One unified class. Frosted glass feel + rainbow glow trail on hover (JS-injected `.btn-glow-circle` spans).
- `.btn--ghost` and `.btn--primary` exist as aliases but are visually identical — unify in future if needed
- Never remove `position: relative; isolation: isolate; overflow: hidden` — required for the trail effect

### Cards
Cards use `var(--color-card)` background + `rgba(255,255,255,0.07)` border + `border-radius: 12–16px`. On hover: `border-color: rgba(153,174,239,0.2)` + radial spotlight glow via CSS custom props `--gx / --gy` (set by JS mousemove).

### Scroll Reveals
Add `class="reveal"` to any element. JS (`initReveal` in `main.js`) adds `.in-view` when it enters the viewport. Use stagger modifiers for sequential delays: `reveal-d1` through `reveal-d6` (60ms increments).

Elements that should be visible on page load (hero content) get `reveal in-view` from the start.

### Section Eyebrow → H2 pattern
```html
<span class="eyebrow eyebrow--grey">Section Label Here</span>
<h2 class="h2">Main Headline<br><em>Italic Blue Line</em></h2>
```

### Tag chips (`.tag`)
Inline labels on capability/serve items. Dark bg, subtle border, Space Grotesk Bold 11px.

### Ambient Glow
- `<div class="glow-layer">` fixed full-screen layer at z-index 0
- `.glow-orb--cursor` follows mouse via JS transform
- On touch devices: hidden via `@media (hover: none)`
- Page content sits in `.page-wrapper` at z-index 1

---

## Page Structure

### index.html — Homepage
1. **Hero** — split 2-col, H1 left / body right, partner logos bottom
2. **Stats** — 24mo · 10+ · $12M, count-up animation on scroll
3. **Approach** — eyebrow + split H2/body, below: ICP cards (Technical / Non-Technical founders)
4. **Taggr Banner** — full-width card linking to `taggr.html`, image-driven height
5. **Go-to-Market** — 3 service tier cards (POC → MVP → Scale)
6. **Enterprise CTA** — centered H2 + button, full-viewport-height
7. **Technical Capabilities** — tall image card (MCP) left + 2 text cards right (Agentic, Voice)
8. **Right Expertise** — icon list left + text right (Data Eng, Tech Strategy, Full Stack/ML)
9. **Process** — sticky left heading + 4-step scroll list right
10. **Why Keuji** — 3 pain-point cards
11. **Contact** — 2-col: left (heading + email btn) / right (Web3Forms contact form), watermark

**Contact form:** Posts to `https://api.web3forms.com/submit`. The `access_key` hidden input needs a real key. Currently placeholder `YOUR_WEB3FORMS_ACCESS_KEY`.

### taggr.html — Taggr Landing Page
1. **Hero** — centered, 3-line bold H1, "See Our Capabilities" CTA
2. **Product** — Taggr eyebrow, H2, UI screenshot, integration logos
3. **Accounting Tech** — "AI-NATIVE" eyebrow, 6 feature cards (3×2 grid)
4. **Partnership** — "Interested?" centered CTA, "Request Beta Access" button
5. **Numbers Don't Lie** — 3 stats (<10mins · 90% · 100%)
6. **Banner** — Transaction Auto-Classification feature callout
7. **AI Capabilities** — 2-col header + capability table (3-col grid rows)
8. **We Serve** — left sticky heading + right 3 audience segments (Accounting Firms, Bookkeepers, Fintech)
9. **Final CTA** — "Ready to Become an AI-Native Firm?", watermark

---

## Responsive Breakpoints

| Breakpoint | Width | Key changes |
|---|---|---|
| Desktop | > 991px | Full layouts as described above |
| Tablet | ≤ 991px | `--content-px: 24px`, nav shrinks, some grids narrow |
| Mobile | ≤ 767px | Hamburger nav, single-col grids, tech tall card hidden (MCP text card shown instead), hero stacks |
| Small mobile | ≤ 479px | Tighter type scale, full-width CTA buttons |
| Touch | `hover: none` | Glow effects disabled, card hover states suppressed |

**Mobile nav:** Hamburger button reveals `.nav__mobile-menu` dropdown. Initialized in `main.js` `initHamburger()`.

**Tech section mobile quirk:** `.hp-tech__img-card` (the tall MCP image card) is hidden on mobile. `.hp-tech__card--mcp` (a duplicate text-only card) is shown instead. Do not remove either.

---

## Interaction Details

| Effect | Where | How |
|---|---|---|
| Nav frosted glass | After 20px scroll | `nav.scrolled` class → `background: rgba(0,0,0,0.55)` + `backdrop-filter: blur(20px)` |
| Cursor glow orb | Whole page | Fixed positioned, `transform: translate(mouseX, mouseY)`, hidden on touch |
| Card spotlight | GTM cards, feature cards, banner card | `--gx` / `--gy` CSS vars set by `mousemove`, `::after` radial gradient |
| Button rainbow trail | All `.btn` elements | JS spawns `.btn-glow-circle` spans at cursor position, auto-fade out |
| Scroll reveals | `.reveal` elements | `IntersectionObserver`, threshold 0.12, adds `.in-view` once |
| Count-up stats | `.stat-item__number[data-count-target]` | `IntersectionObserver`, threshold 0.4, easeOutExpo animation 1200ms |
| Hero animations | `.hero__eyebrow`, `.h1`, `.hero__body`, `.hero__cta` | CSS `animation: fadeUp` with staggered delays |

---

## Assets Reference

| File | Used in |
|---|---|
| `assets/logo-hersheys.png` | Homepage hero logos |
| `assets/logo-snowflake.png` | Homepage hero logos |
| `assets/logo-pembina.png` | Homepage hero logos |
| `assets/logo-fnb.png` | Homepage hero logos |
| `assets/tech-bg-tall.png` | Tech capabilities — tall left card (MCP) |
| `assets/tech-bg-mcp.png` | (available, not currently used in main layout) |
| `assets/tech-bg-voice.png` | (available, not currently used in main layout) |
| `assets/banner-image.png` | Taggr banner card (desktop) |
| `assets/banner-mobile.png` | Taggr banner card (mobile, via `<picture>`) |
| `assets/keuji-UI.png` | Taggr product section — desktop screenshot |
| `assets/keuji-ui-mobile.png` | Taggr product section — mobile screenshot |
| `assets/keuji-banner.png` | (available, not currently used) |
| `assets/keuji-ui-component.png` | (available) |
| `assets/hover-bg.png` | (available) |

Logo images are white-on-transparent PNGs — always apply `filter: brightness(0) invert(1)` to make them white on dark bg.

---

## Design Source Files

Located in `../design-assets/` (sibling to this folder on the Desktop):
- `Keuji Homepage/` — 9 Figma section exports (numbered 1–9)
- `Landing Page/` — annotated full-page export + 8 section slices
- `Landing Page/keuiji-styleguide.png` — official color/type/spacing spec
- `UI Images/keuji-logo.svg` — the wordmark SVG (use if switching from text logo to SVG)
- `Fonts/` — original font source files

---

## Rules for Building New Pages / Sections

1. **No frameworks.** Pure HTML + CSS + JS. No React, no Tailwind, no build step.
2. **Add page-specific CSS in a new `<pagename>.css` file**, imported after `styles.css`. Do not bloat `styles.css` with one-page styles.
3. **Reuse tokens.** Always use `--color-*` and `--sp-*` variables, never raw hex or px magic numbers.
4. **Responsive from the start.** Add mobile breakpoints at `767px` and `479px` for every new section. Test hamburger nav, touch glow suppression, and full-width CTAs.
5. **Every reveal-able element gets `class="reveal"`** and a stagger modifier as needed.
6. **Icons are inline SVGs.** No icon font, no external icon library. Keep SVGs small and simple (the Keuji design language uses bold geometric glyphs: shields, lotuses, sparkles, bowties, hourglasses).
7. **No new JS files.** Extend `main.js` for any new interaction patterns. Use IIFEs to keep scope clean.
8. **Contact form** uses Web3Forms (`https://api.web3forms.com/submit`). The `access_key` needs the real key from the Web3Forms dashboard before going live.
9. **Commit to `staging` branch**, then merge/push to trigger any deploy pipeline. Never force-push.
