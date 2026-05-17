# Design System: rss-feed-v0

_A library, not a dashboard._

> **Status:** This document is the **aspirational visual language** for rss-feed-v0. Foundation work — tokens, typography scale, layout scales, and refining the existing Button — is being migrated under [PRD #32](https://github.com/davidinoa/rss-feed-v0/issues/32). The component sections in §4 (Cards, Feed Items, Reading View, Sidebar, Tags, Toast, Empty States) describe **future product surfaces that do not exist in the codebase yet** — they are specs for future PRDs, not work to start under the foundation migration. See §6 for the full in-scope / out-of-scope breakdown.

## 1. Visual Theme & Atmosphere

rss-feed-v0 inhabits the visual register of a **quiet reading room** — a warm, deliberately understated interface where the written word commands attention and the chrome around it learns to disappear. The product is for people who read on their own terms, and the design language is built to reward sustained attention rather than compete for it.

The overall mood is **calm and editorial**. The canvas is a warm off-white reminiscent of fine book stock, anchored by deep espresso ink and a single muted amber accent reserved for the highest-signal moments. Color is used like punctuation, not decoration. Whitespace is generous; lines breathe; vertical rhythm is measured in 4rem section gaps rather than 8px tightenings. The interface feels **gallery-curated rather than feed-stuffed**, with each article positioned as an object worth considering rather than a unit to be consumed.

Where most reader products optimize for density and signal-throughput, this one optimizes for the conditions under which reading actually happens: low visual noise, confident typographic hierarchy, restraint with color, and a tone that trusts the reader to navigate without being prodded. Hairline borders are preferred over shadows. Pull quotes are set in italics, not boxed in chrome. The dark mode is deep and warm rather than cold and bluish — closer to the dimmed light of a study than the glow of a workstation.

**Key Characteristics:**
- Warm off-white canvas with deep, slightly warm ink for primary text
- A single warm accent (Burnt Amber) used sparingly across unread, primary actions, and links
- Serif display (Source Serif 4) paired with humanist sans (Inter) — typographic contrast doing the hierarchy work
- Hairline borders preferred over shadows for separation; shadows reserved for floating elements
- Generous vertical rhythm: feed items breathe, reading view sets line-height at 1.7
- Read/unread states distinguished by type weight and an indicator dot — never by background fade
- No gradients, no glassmorphism, no second accent color — the room has one lamp

## 2. Color Palette & Roles

Colors are organized in two tiers per [ADR-0003](docs/adr/0003-tiered-color-tokens.md): **primitives** (private, named by appearance) and **semantics** (public, exposed via Tailwind utilities, paired to primitives with a light/dark remap). Tailwind's default palette is disabled — only the semantic tokens below resolve to valid utilities (`bg-primary`, `text-muted-foreground`, etc.).

### Primitives — Warm Neutrals (Light Mode)

- **Warm Parchment** (`#FAF7F2`) – Primary canvas. The off-white of fine book stock, with a faint cream undertone that reads warmer than pure neutral without looking yellow.
- **Soft Vellum** (`#F0EBE2`) – Elevated surface color for cards, popovers, and content containers. One step warmer than the canvas, enough to delineate without shouting.
- **Antique Linen** (`#E6DFD2`) – Default border and divider color. Hairline-thin presence; signals separation rather than enclosure.
- **Aged Paper** (`#D8D0BF`) – Placeholder text and disabled-input surfaces. The faintest tier still readable against the canvas.
- **Muted Stone** (`#6B655D`) – Secondary text: bylines, timestamps, metadata, helper copy. Warm gray that holds its character against the parchment.
- **Pebble** (`#3F3A33`) – Strong UI text: button labels, navigation, form input values. Almost-black with the same warm undertone as the rest of the palette.
- **Ink Espresso** (`#1A1612`) – Primary text and high-emphasis content. Deep enough for confident hierarchy, soft enough to never feel printed-on-glass.

### Primitives — Deep Warm Neutrals (Dark Mode)

- **Midnight Slate** (`#15130F`) – Primary canvas. The dimmed light of a study, warm-leaning rather than cool. Never pure black.
- **Charcoal Mist** (`#1E1B16`) – Elevated surface color for cards in dark mode.
- **Smoke Veil** (`#2B2620`) – Borders and dividers in dark mode.
- **Dusk Mauve** (`#3A342C`) – Tertiary surfaces, disabled state backgrounds.
- **Ash Stone** (`#9A9286`) – Secondary text in dark mode.
- **Bone** (`#D6CFC2`) – Strong UI text in dark mode.
- **Cream Mist** (`#EDE6D6`) – Primary text in dark mode. Warm and slightly creamy to feel like read paper, not LCD pixel.

### Primitives — Accent (The Single Lamp)

The entire product runs on one accent hue. Four steps cover the interaction states.

- **Burnt Amber** (`#A85426`) – The primary accent. Used for unread indicators, primary CTAs, hyperlinks, and the focus ring. Borrowed from the warmth of an aged book cover.
- **Amber Glow** (`#D67E45`) – Hover state for primary buttons and links. Lifted in luminance to read brighter without losing the amber character. _Also used as the dark-mode remap for `--primary`, since Burnt Amber on Midnight Slate falls short of WCAG AA at body sizes._
- **Amber Hush** (`#F3E6D6`) – Soft tint background for selected rows, hovered cells, and inline highlights. Whispers presence without claiming attention.
- **Amber Deep** (`#8E4A22`) – Pressed/active state, and the foreground color on Amber Hush surfaces.

### Primitives — Functional Feedback

Used exclusively for system feedback. Never decorative.

- **Sage Read** (`#4F6E50`) – Success and "read" confirmations. A muted green that reads as quiet acknowledgment rather than vibrant celebration.
- **Brick Alert** (`#A8443C`) – Destructive actions and error states. Earthy, warm-leaning red that sits in the palette rather than fighting it.
- **Honey Caution** (`#8C691F`) – Warning states. Deep yellow-brown, distinguishable from Burnt Amber by its yellower bias.

### Semantics (Public API)

These follow the shadcn vocabulary established in [ADR-0002](docs/adr/0002-design-system-foundation.md) so that `npx shadcn add` outputs drop in without translation. Each token resolves to a primitive in light mode and a different primitive in dark mode.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background` | Warm Parchment | Midnight Slate | Primary canvas |
| `--foreground` | Ink Espresso | Cream Mist | Primary text |
| `--card` | Soft Vellum | Charcoal Mist | Elevated surface |
| `--card-foreground` | Ink Espresso | Cream Mist | Text on cards |
| `--popover` | Soft Vellum | Charcoal Mist | Floating surface |
| `--popover-foreground` | Ink Espresso | Cream Mist | Text on popovers |
| `--primary` | Burnt Amber | Amber Glow | The single accent |
| `--primary-foreground` | Warm Parchment | Midnight Slate | Text on accent |
| `--secondary` | Soft Vellum | Charcoal Mist | Low-emphasis surface |
| `--secondary-foreground` | Pebble | Bone | Text on secondary |
| `--muted` | Antique Linen | Smoke Veil | Subdued surface |
| `--muted-foreground` | Muted Stone | Ash Stone | Secondary text |
| `--accent` | Amber Hush | Dusk Mauve | Soft highlight surface |
| `--accent-foreground` | Amber Deep | Cream Mist | Text on accent surface |
| `--destructive` | Brick Alert | Brick Alert | Destructive actions |
| `--destructive-foreground` | Warm Parchment | Warm Parchment | Text on destructive |
| `--success` | Sage Read | Sage Read | Success state |
| `--success-foreground` | Warm Parchment | Warm Parchment | Text on success |
| `--warning` | Honey Caution | Honey Caution | Warning state |
| `--warning-foreground` | Warm Parchment | Warm Parchment | Text on warning |
| `--border` | Antique Linen | Smoke Veil | Hairline borders |
| `--input` | Antique Linen | Smoke Veil | Form input borders |
| `--ring` | Burnt Amber | Amber Glow | Focus ring |
| `--unread-indicator` | Burnt Amber | Amber Glow | Unread dot/bar |
| `--accent-subtle` | Amber Hush | Dusk Mauve | Cell-level highlight |

Note that `--primary`, `--ring`, and `--unread-indicator` all resolve to the same accent. This is deliberate: the eye trains on one color across the product to mean _"this wants your attention."_

The feedback foregrounds (`--success-foreground`, `--warning-foreground`, `--destructive-foreground`) stay at **Warm Parchment in both modes** rather than swapping to Cream Mist in dark. Cream Mist fails WCAG AA contrast against Honey Caution (#8C691F), and using inconsistent foregrounds across the three feedback colors would be more confusing than the slight aesthetic inconsistency of using the lighter cream in dark mode for feedback surfaces only.

## 3. Typography Rules

Two typefaces carry the entire system, with one monospace family reserved for code excerpts.

**Display family:** **Source Serif 4** — Adobe's open-source humanist serif, designed for on-screen reading. Open apertures, generous x-height, and a warm character that pairs naturally with the parchment canvas. Loaded via `@fontsource-variable/source-serif-4`.

**UI family:** **Inter** — neutral grotesque optimized for interface use. Already in place via `--font-sans`. Carries all body copy, controls, navigation, and any heading below 20px.

**Mono family:** **JetBrains Mono** — used inside reading-view code excerpts. Loaded only on routes that render article content.

The typographic system leans on **contrast between families** rather than weight pyramids. Headings are serif; everything else is sans. Weight is rarely the answer — almost nothing in the system goes above 500 (medium).

### Hierarchy & Scale

Display (Source Serif 4):

- **Display XL** — 3.5rem (56px), weight 400, line-height 1.05, letter-spacing -0.02em. Hero headlines, reading-view article titles.
- **Display L** — 2.5rem (40px), weight 400, line-height 1.1, letter-spacing -0.015em. Page-level H1, primary section headers.
- **Display M** — 1.875rem (30px), weight 500, line-height 1.2, letter-spacing -0.01em. Article titles in feed cards.
- **Display S** — 1.5rem (24px), weight 500, line-height 1.25. Feed names in the subscription list, dialog titles.

UI (Inter):

- **Title L** — 1.25rem (20px), weight 500, line-height 1.4. Card titles, sidebar group headers.
- **Title M** — 1.125rem (18px), weight 500, line-height 1.4. Settings section headers.
- **Title S** — 1rem (16px), weight 500, line-height 1.5. Small headers, primary button labels.
- **Body L** — 1.0625rem (17px), weight 400, line-height 1.7. Reading-view body. The wider line-height is non-negotiable: it is the difference between a feed reader and a reading instrument.
- **Body M** — 1rem (16px), weight 400, line-height 1.55. Default UI body, feed item excerpts.
- **Body S** — 0.875rem (14px), weight 400, line-height 1.5. Secondary copy, item metadata.
- **Caption** — 0.8125rem (13px), weight 500, line-height 1.4. Timestamps, source attributions, reading time.
- **Caption Uppercase** — 0.75rem (12px), weight 600, line-height 1.4, letter-spacing 0.08em, all caps. Section labels ("UNREAD", "CATEGORY", source names above article titles).
- **Code** — 0.875rem (14px), weight 400, line-height 1.65, JetBrains Mono. Inline and block code in reading view.

### Character Notes

- **Reading-view body is sacred.** 17px Inter at line-height 1.7 is the system's most-tuned value. Do not change it per-route or per-component.
- **Display sizes use negative letter-spacing** (`-0.01em` to `-0.02em`) for optical tightness at large sizes.
- **All-caps labels use expanded letter-spacing** (`0.08em`) for legibility — never set caps without it.
- **Italics are reserved** for emphasis within body text, source publication names (`via _The Atlantic_`), and pull quotes. Avoid italicizing UI controls.
- **No weight 700/800.** The heaviest weight in routine use is 500 (medium). Bold is achieved through size, color contrast, and serif/sans switching — not through ink-density.

## 4. Component Stylings

> **Scope note:** **Buttons** and **Inputs & Forms** exist in the codebase today and are refined under the foundation migration ([PRD #32](https://github.com/davidinoa/rss-feed-v0/issues/32)). All other sections below — **Cards & Containers**, **Feed Item**, **Reading View**, **Navigation (Sidebar)**, **Tags & Pills**, **Toast & Inline Notifications**, **Empty States** — describe **aspirational future components** that do not exist in the codebase yet. They are design vocabulary for when those surfaces get built under separate PRDs. Do not start work on them under the foundation migration.

### Buttons

- **Shape:** Subtly rounded corners (8px / `--radius-md`) — approachable but not playful, signaling a control without resorting to pills.
- **Height:** 40px standard. 32px for compact contexts (inline toolbars), 48px for marketing-page primaries.
- **Padding:** 0.625rem vertical × 1.125rem horizontal.

**Primary CTA:** Burnt Amber background, Warm Parchment text, Title S weight. Used **sparingly** — a screen rarely has more than one. Examples: "Add Feed", "Mark All Read", "Save Settings".
- *Hover:* Amber Glow background over 180ms ease-out. No scale, no lift.
- *Pressed:* Amber Deep, instant (no transition).
- *Focus:* 2px Burnt Amber ring, 2px offset from the button edge.

**Secondary:** Soft Vellum background, Pebble text. Used for non-critical actions ("Cancel", "Edit").

**Ghost:** Transparent background, Pebble text. Hover fills with Amber Hush. The default for toolbar icons and inline controls.

**Destructive:** Brick Alert background, Warm Parchment text. Reserved for actions like "Unsubscribe", "Delete Feed". Always confirmed via secondary modal — never one-click.

**Icon button:** 36px square, ghost styling by default. Used for theme toggle, mark-as-read, share. Always has a `title` and `aria-label`.

### Cards & Content Containers

- **Corner style:** Gently rounded (12px / `--radius-lg`) — softer than buttons, signaling "container of content".
- **Background:** Soft Vellum in light mode, Charcoal Mist in dark.
- **Edge treatment:** Hairline border (1px Antique Linen / Smoke Veil) by default. Shadows reserved for floating elements (popovers, dialogs, command palette).
- **Padding:** 1.5–2rem internal. Reading-view content cards get 2.5rem.
- **Hover (clickable cards):** Border shifts to Burnt Amber at 30% opacity over 180ms. No translateY, no shadow swap — the cursor change is enough feedback.

### Feed Item (the timeline's atomic unit)

The single most-used surface in the product. Composition, top to bottom:

1. **Source line** — Caption Uppercase. Source name in source's identifying color (when known) or Muted Stone. May include a 6px source dot to the left.
2. **Article title** — Display M when unread, weight shifts to 400 (regular) when read. Color remains Ink Espresso in both states.
3. **Excerpt** — Body M in Muted Stone. Two lines maximum, ~160 characters, truncated with a trailing ellipsis (no fadeout gradient).
4. **Metadata row** — Body S Muted Stone. Relative timestamp · reading time · optional category pill.
5. **Unread indicator** — 4px Burnt Amber dot positioned at the left edge of the item, vertically centered. Disappears when read.

- **Padding:** 1.25rem vertical × 1.5rem horizontal.
- **Separation:** 1px Antique Linen hairline between items. No gaps, no shadow stacks.
- **Density:** Comfortable. ~6–8 items visible per 900px viewport. Optimized for thoughtful skimming, not firehose scrolling.
- **Read/unread distinction:** Type weight on the title + presence/absence of the indicator dot. Background never changes — read items remain fully legible.

### Reading View

The reading-view article container is the product's photographic-quality surface. Treat it with reverence.

- **Layout:** Single column, `max-width: 64ch` (~640px at Body L), horizontally centered. Does not stretch on wide viewports — readability beats real-estate efficiency.
- **Article title:** Display XL, Source Serif 4, weight 400. 2rem bottom margin.
- **Byline/metadata:** Caption, Muted Stone. Source · author · published date · reading time, separated by `·`.
- **Body:** Body L (17px Inter, line-height 1.7), Ink Espresso. Paragraph spacing 1.5em.
- **Pull quotes:** Display M Source Serif italic, with a 4px Burnt Amber left border and 1.5rem left padding. No background fill.
- **Inline links:** Burnt Amber, underlined with a 1px hairline that skips descenders (`text-underline-offset: 0.15em`).
- **Images:** Full-bleed within the column. Caption below in Body S italic Muted Stone, centered.
- **Code blocks:** Code style, JetBrains Mono. Soft Vellum background, 1rem padding, 8px radius. No syntax highlighting in v1.
- **Page padding:** 2.5rem horizontal at any viewport ≥ mobile.

### Navigation (Sidebar)

- **Width:** 280px on desktop (≥1024px); becomes a slide-in drawer below.
- **Background:** Warm Parchment — matches the canvas. The sidebar is part of the room, not a panel hovering above it. No elevation, no shadow on its right edge.
- **Section labels** ("Categories", "Subscriptions"): Caption Uppercase, Muted Stone. 0.75rem horizontal padding, 1.25rem top margin.
- **Feed entries:** Body M Pebble. 0.625rem vertical × 0.875rem horizontal padding.
- **Selected state:** Amber Hush background, Amber Deep text, 3px Burnt Amber bar on the left edge.
- **Hover state:** Amber Hush background at 50% opacity, no left bar.
- **Unread counts:** Caption font, right-aligned. Muted Stone color at zero; Pebble + weight 600 when > 0.
- **Mobile drawer:** Slides in from left over 240ms ease-out. Backdrop is Midnight Slate at 60% opacity (light mode) or 70% (dark mode).

### Inputs & Forms

- **Stroke:** 1px Antique Linen border.
- **Background:** Warm Parchment in light, Charcoal Mist in dark.
- **Corner style:** 8px (`--radius-md`) — matches buttons for visual consistency.
- **Padding:** 0.625rem vertical × 0.875rem horizontal.
- **Placeholder:** Aged Paper, regular weight.
- **Focus state:** Border shifts to Burnt Amber + 2px outer ring of Amber Hush at 80% opacity.
- **Error state:** Border shifts to Brick Alert. Error message below in Body S Brick Alert, with a small icon to the left.
- **Labels:** Always present (never placeholder-as-label). Title S, positioned above the input, 0.375rem bottom margin.

### Tags & Pills (Categories)

- **Shape:** Pill (`9999px` radius).
- **Default:** Amber Hush background, Amber Deep text, Caption font.
- **Padding:** 0.25rem vertical × 0.625rem horizontal.
- **Use cases:** Category labels on feeds, content type indicators ("Newsletter", "Podcast"), filter chips in the timeline header.
- **Interactive variant:** Adds a hover state (Amber Hush at 80% saturation) and a focus ring.

### Toast & Inline Notifications

- **Shape:** 8px corner, 1px Smoke Veil border.
- **Surface:** Soft Vellum.
- **Padding:** 1rem.
- **Icon + message + optional action button** layout.
- **Duration:** 4 seconds for success, indefinite for errors (user-dismissed).
- **Animation:** Slides up from bottom-right over 200ms ease-out.

### Empty States

- **Layout:** Centered, single column, max-width 28rem.
- **Composition:** Optional illustration (line-art, single-stroke amber on parchment) · Display S title · Body M Muted Stone description · primary action.
- **Tone:** Plain-spoken, never apologetic. ("You haven't added any feeds yet.") No exclamation marks.

## 5. Layout Principles

### Grid & Structure

- **Max content width:** 1280px at the widest viewport. Content beyond does not expand — it gains margin instead.
- **Sidebar:** 280px fixed on ≥1024px; drawer below.
- **Reading view:** Single column, 64ch (~640px) max-width, centered. Does not stretch on a 1920px monitor.
- **Timeline view:** Two-pane (sidebar | timeline | optional preview) above 1440px; single-pane (sidebar | timeline) at 1024–1440px; stacked vertically below 1024px.

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640–1024px
- Desktop: 1024–1440px
- Wide: > 1440px

### Whitespace Strategy

Base unit: 4px. The full spacing scale:

| Token | Value | Use |
|---|---|---|
| `2xs` | 4px | Adjacent inline items |
| `xs` | 8px | Closely related elements |
| `sm` | 12px | Within a tight cluster |
| `md` | 16px | Default component padding |
| `lg` | 24px | Between distinct elements |
| `xl` | 32px | Between subsections |
| `2xl` | 48px | Between major page sections |
| `3xl` | 80px | Reading-view top/bottom padding |

**Edge padding** scales with viewport: 1rem (mobile), 1.5rem (tablet), 2rem (desktop). Reading view uses 2.5rem at all sizes above mobile.

**Vertical rhythm** snaps to 8px / 16px / 24px increments. Avoid arbitrary spacing values — they fight the eye's pattern-recognition.

### Alignment & Visual Balance

- **Left-aligned by default** for all reading content (line-start consistency aids readability).
- **Centered alignment** reserved for: page-level empty states, success modals, error states, marketing hero sections.
- **Image-to-text ratio** in feed items: text-forward (~20% image area for thumbnails when present). In reading view, images are treated as primary content (full column width).
- **Asymmetric balance** preferred over geometric symmetry. The sidebar + timeline + content layout intentionally weights the right side.

### Depth & Elevation

Three levels — used minimally. The room is well-lit; objects don't cast dramatic shadows.

- **Level 0 (Flat):** Default. The canvas, sidebar, most surfaces.
- **Level 1 (Hairline):** 1px Antique Linen border (or Smoke Veil in dark). Cards, dividers, container edges. Preferred over shadows.
- **Level 2 (Floating):** `0 8px 24px rgba(26, 22, 18, 0.08)`. Only popovers, dialogs, the command palette, and the mobile drawer. In dark mode, pair the shadow with a 1px Smoke Veil border so the edge stays defined.

No stacked or multi-layer shadows. No inner shadows.

### Responsive Behavior

- **Mobile-first foundation.** All layouts designed and verified at 375px first, then expanded.
- **Touch targets:** Minimum 44×44px (WCAG AAA). Buttons and icon buttons enforce this via padding/hit area even when visually smaller.
- **Image handling:** Native `loading="lazy"`. Article thumbnails use `aspect-ratio: 16 / 9`, cropped from the original.
- **Sidebar:** Slides in as a drawer below 1024px. Animation 240ms ease-out, backdrop fade 180ms.
- **Reading view:** Padding scales but the 64ch max-width is preserved at every breakpoint.

## 6. Agent Prompt Guide

This section gives Claude, Cursor, Antigravity, and other coding agents the exact phrasings and tokens to reach for when generating new screens or components for rss-feed-v0.

### Current vs. Aspirational

This DESIGN.md describes the **target state** of the visual language. The codebase currently implements the tier architecture from ADRs 0002/0003, but with GitHub-style neutral palette and blue accent — not the warm parchment / Burnt Amber values described here.

**Foundation migration — in scope for [PRD #32](https://github.com/davidinoa/rss-feed-v0/issues/32):**

1. Replace primitive hex values in `src/styles.css` `:root` and `.dark` blocks with the values from §2.
2. Update `src/design-system/tokens.ts` to reflect new descriptive names alongside hexes.
3. Add Source Serif 4 via `@fontsource-variable/source-serif-4` and the typography utility scale from §3.
4. Add the spacing scale, depth scale, and verified radius scale from §5.
5. Refine the existing Button component to the spec in §4.

Once the foundation migration lands, semantic tokens like `bg-primary` resolve to Burnt Amber, the typography utilities (`text-display-xl`, `text-body-l`, etc.) are available, and the existing Button is on-spec.

**Future component work — out of scope for the foundation migration:**

The component sections in §4 — **Cards & Containers**, **Feed Item**, **Reading View**, **Navigation (Sidebar)**, **Tags & Pills**, **Toast & Inline Notifications**, **Empty States** — describe components that **do not exist in the codebase yet**. They are aspirational specs for when product work needs those surfaces. Each will get its own scoping under a future PRD before any are built. **Do not start work on them as part of the foundation migration.** Six issues that would have built them were closed as out-of-scope (see [PRD #32](https://github.com/davidinoa/rss-feed-v0/issues/32) for the history).

Until the foundation migration lands, semantic tokens like `bg-primary` resolve to the legacy blue, not Burnt Amber. The Storybook tokens catalog reflects the live state; this document reflects the target.

### Atmosphere — Phrases to Use

- "Library-calm, reading-first interface"
- "Generous breathing room around words"
- "Single warm accent used sparingly"
- "Hairline borders, not shadows"
- "The interface recedes; the content speaks"
- "Warm off-white canvas with deep, warm ink"

### Atmosphere — Phrases to Avoid

- ❌ "Vibrant", "playful", "punchy", "energetic" — wrong vibe
- ❌ "Gradient", "glassmorphism", "frosted" — wrong era
- ❌ "Dense", "compact", "data-dense" — we chose generosity
- ❌ "Bold", "loud", "punchy" — restraint is the point
- ❌ "Dashboard", "control panel" — we are not a dashboard

### Color References

Always pair the descriptive name with the hex code in design conversation; reference the semantic token in code.

- Use **"Burnt Amber (#A85426)"** in prose, **`bg-primary`** / **`text-primary`** in code.
- Use **"Warm Parchment (#FAF7F2)"** in prose, **`bg-background`** in code.
- Use **"Soft Vellum (#F0EBE2)"** in prose, **`bg-card`** in code.
- Use **"Muted Stone (#6B655D)"** in prose, **`text-muted-foreground`** in code.
- Use **"Ink Espresso (#1A1612)"** in prose, **`text-foreground`** in code.

Never hand-roll hex values inside component code. If a token doesn't exist for the color you need, the right move is to add it to the semantic layer, not inline the hex.

### Component Prompts (Ready to Use)

- _Feed item:_ "Add a feed item to the timeline using the established pattern: source name in Caption Uppercase, Display M article title (weight 400 if read, 500 if unread), two-line excerpt in Body M Muted Stone, metadata row with relative timestamp and reading time. Place a 4px Burnt Amber dot at the left edge for unread items."

- _Reading view:_ "Create a reading-view article container: single column, max-width 64ch, centered. Article title in Source Serif 4 Display XL, byline in Caption Muted Stone, body in Inter Body L (17px / line-height 1.7). Pull quotes use Display M italic with a 4px Burnt Amber left border."

- _Sidebar entry:_ "Add a sidebar feed entry: Body M Pebble text, 0.625rem vertical padding. Selected state shows Amber Hush background, Amber Deep text, and a 3px Burnt Amber bar on the left edge."

- _Primary button:_ "Render a primary CTA button in Burnt Amber (#A85426) with subtly rounded corners (8px), Warm Parchment text, 40px height, Title S weight. Hover shifts to Amber Glow (#D67E45) over 180ms."

- _Card:_ "Create a content card with Soft Vellum background, gently rounded corners (12px), 1px Antique Linen hairline border, and 1.5rem internal padding. No shadow."

- _Empty state:_ "Build an empty state: centered, max-width 28rem. Optional single-stroke amber line illustration, Display S title in plain-spoken voice (no exclamation marks), Body M Muted Stone description, single primary CTA."

### Typography Prompts

- "Use Source Serif 4 for any heading above 18px; Inter for everything else."
- "Reading-view body text uses 17px Inter at line-height 1.7 — do not change this per-route."
- "Section labels are Caption Uppercase: 12px, weight 600, letter-spacing 0.08em, in Muted Stone."
- "Never set body text below 14px. Never set body weight above 500."

### Density & Restraint Rules

- **One primary CTA per screen.** If you're tempted to add a second, demote one to secondary.
- **One accent color.** If you're reaching for a second hue, the system says no. Use Burnt Amber + neutrals only.
- **Hairlines over shadows.** Only popovers, dialogs, and the mobile drawer get shadows. Cards, sidebars, and section dividers use 1px borders.
- **No background-color shift for read/unread.** Use type weight and the indicator dot.
- **No emoji in UI copy.** Empty states, error messages, and buttons are emoji-free.

### Accessibility Requirements

- All color pairs in this system are verified for WCAG AA contrast in both light and dark modes. The dark-mode `--primary` remap from Burnt Amber → Amber Glow exists specifically to maintain 4.5:1 ratio against Midnight Slate.
- Focus rings are **always visible** (2px Burnt Amber, 2px offset) — never `outline: none` without a replacement.
- Touch targets are minimum 44×44px on mobile, enforced via padding even when visually smaller.
- Color is **never** the only indicator. Unread state uses dot + type weight, not just color. Error state uses border + icon + message, not just border color.
- Every icon-only button has a `title` and `aria-label`.

### Where the Tokens Live

- **Token CSS (source of truth):** `src/styles.css` — primitives in `:root`, dark-mode remap in `.dark`.
- **Token TypeScript exports:** `src/design-system/tokens.ts`.
- **Storybook catalog:** `src/design-system/` (run `pnpm storybook`). Reflects live token state.
- **Human-facing engineering reference:** `docs/design-system.md`.
- **Architecture decisions:** `docs/adr/0002-design-system-foundation.md` (shadcn vocabulary + brand kit), `docs/adr/0003-tiered-color-tokens.md` (two-tier structure rationale).

### Iteration Discipline

When refining an existing surface:

1. Touch **one component at a time** ("Update the feed item excerpt color"), not three.
2. Reference the existing descriptive language: "Increase the internal padding on cards from 1.5rem to 2rem", not "make it bigger".
3. If a change conflicts with a principle in this document, **flag the conflict in your response** before making the change. The principles in Section 6 (Density & Restraint Rules) and the typography rules in Section 3 are intentional and rarely correct to violate.
