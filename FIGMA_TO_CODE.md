# Figma → Code Implementation Guide
## H.Studio Portfolio — April 2026 Sprint

This document records every layout decision, positioning formula, and correction made during implementation. Use it as the reference before writing any code from this Figma file to avoid repeat corrections.

---

## 1. Project Setup

| Item | Value |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| Styling | Tailwind CSS v4 |
| Dev server | `http://localhost:3002` |
| Design file | `wWkukqmAnLw6DDjm0kfnx4` |
| Target viewport | 1440px |
| Content area width | `1440 - 64 = 1376px` (section uses `px-8` = 32px each side) |

### Fonts loaded in `layout.tsx`

```ts
Geist        → --font-geist-sans   (body fallback)
Geist_Mono   → --font-geist-mono   (all bracket labels, numbers)
Inter        → --font-inter        (all display + body text)
Playfair_Display (italic 400) → --font-playfair  (the "&" in Born & raised)
```

**Rule:** Always set `fontFamily: "var(--font-inter), sans-serif"` on each section wrapper, not on `body`. Geist Mono is explicitly set inline wherever a monospaced label appears.

---

## 2. Critical Layout Rules (Learned the Hard Way)

### 2.1 mix-blend-overlay requires NO new stacking context on the container

**Problem:** Wrapping the hero content div in `z-10` creates a new CSS stacking context. `mix-blend-overlay` on child text then blends with the content div's white background — not the photo behind it.

**Fix:**
1. Add `isolation: "isolate"` to the `<section>` (creates a bounded compositing group).
2. Remove `z-index` entirely from the content wrapper `<div>`. DOM order handles stacking.
3. Add `WebkitBackdropFilter` alongside `backdropFilter` for Safari.

```tsx
// CORRECT
<section style={{ isolation: "isolate" }}>
  <div className="absolute inset-0"> {/* background image — no z-index */}
  <div className="absolute bottom-0 h-[349px]" style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }} />
  <div className="relative flex flex-col ..."> {/* content — NO z-index! */}
    <h1 className="mix-blend-overlay ...">Harvey Specter</h1>
```

### 2.2 Title + label + description must share ONE container

**Problem:** When the title (left-aligned) and description (right-aligned) lived in separate sibling `<div>`s inside a flex column, their right/left edges used different layout references. The description's `justify-end` snapped to the content box but the overflowing title text ran further right.

**Fix:** Put ALL three elements — label, title, description — inside a single `relative w-full` div. Then:
- Label: `position: absolute, left: 0, top: 0`
- Title: normal block flow, `text-left`, fills `w-full`
- Description: `flex justify-end w-full` → right edge guaranteed = same container boundary

```tsx
<div className="relative w-full">  {/* ONE container */}
  <p className="absolute top-0 left-0 ...">[ Hello i'm ]</p>
  <div className="w-full"><p style={{ fontSize: "calc(14.39vw - 9.21px)" }}>Harvey   Specter</p></div>
  <div className="flex justify-end w-full">
    <div style={{ width: "20.4vw" }}>description...</div>
  </div>
</div>
```

### 2.3 Font size formula to exactly fill the content area

**Problem:** Using `font-size: 13.75vw` caused "Harvey Specter" to overflow the `1376px` content area at viewports smaller than 1455px because the padding (64px fixed) isn't proportional to vw.

**Formula:**
```
content_width = 100vw - 64px
text_width    = font_size × K   (K = text_width / font_size from Figma)
font_size     = (100vw - 64px) / K
```

For "Harvey   Specter" (3 spaces) in Inter Medium with `letter-spacing: -0.07em`:
- K = 1376 / 198 = **6.949**
- font-size = `calc(14.39vw - 9.21px)`

Verification:
| Viewport | Font | Text width | Container | ✓ |
|---|---|---|---|---|
| 1440px | 198px | 1376px | 1376px | exact |
| 1536px | 211px | 1467px | 1472px | fits |
| 768px  | 101px | 702px  | 704px  | fits |
| 375px  | 45px  | 311px  | 311px  | exact |

**Critical:** Use `white-space: pre` (not `nowrap`) to preserve the 3 spaces AND prevent wrapping. Use `letter-spacing: -0.07em` (em-relative), NOT the Figma's fixed `-13.86px`, so the K ratio stays constant at all sizes.

### 2.4 Use `%` for section indents, not fixed `px`

Figma exports indents as fixed pixels (e.g. `pl-[214px]`). These break at non-1440px viewports. Convert all indents to `%` of the content area width (`1376px`):

```
214 / 1376 = 15.55%
610 / 1376 = 44.33%
606 / 1376 = 44.04%
1079 / 1376 = 78.41%   ← for absolute positioned labels
```

Use these as `padding-left: "X%"` or `left: "X%"` on `position: absolute` children. Because `%` on padding/left is relative to the containing block's width, and the containing block spans the full content area, these percentages produce the exact Figma pixel values at 1440px and scale proportionally elsewhere.

### 2.5 Images: use local `/public` assets, not Figma CDN URLs

Figma MCP asset URLs expire after **7 days**. Always download images immediately:

```bash
curl -s -o public/hero.png "https://www.figma.com/api/mcp/asset/..."
```

Check the image's actual pixel dimensions before writing positioning code:
```bash
sips -g pixelWidth -g pixelHeight public/hero.png
```

**Hero image was 1440×847** — the same dimensions as the section. This means:
- Do NOT use the Figma-generated overflow trick (`left: -34.79%, right: -34.79%, aspect-ratio: 2291/1346`). That was designed for a 2291×1346 stock photo, not the pre-cropped asset.
- Instead use `<div className="absolute inset-0"><Image fill className="object-cover object-top" /></div>`

### 2.6 `leading-[0]` wrapper pattern (Figma text positioning)

Figma often exports large text wrapped like this:
```jsx
<div style={{ lineHeight: 0 }}>       {/* outer: line-height: 0 */}
  <p style={{ lineHeight: 1.1 }}>Harvey Specter</p>  {/* inner: actual line-height */}
</div>
```
This removes the default half-leading space above/below the text block, giving precise vertical control. Always replicate this pattern when the Figma export shows `leading-[0]` on the outer wrapper.

---

## 3. Section-by-Section Reference

### Hero (node `1:10`) — `app/components/Hero.tsx`

| Property | Value |
|---|---|
| Height | `847px` fixed |
| Background | `/public/hero.png` (1440×847, `object-cover object-top`) |
| Frosted glass | `absolute bottom-0 h-[349px]` = Figma `y=498, h=349` |
| Nav padding | `py-6` (24px top/bottom) |
| Content gap (nav→text) | `240px` fixed |
| Section font | `var(--font-inter)` |

**Label "[ Hello i'm ]":**
- `position: absolute, top: 0, left: 0` inside a `relative` container
- Geist Mono, 14px, `lineHeight: 1.1`, `letterSpacing: 0`, `textTransform: uppercase`
- Appears in the half-leading gap above the name's cap-height (same visual as Figma y=0 overlap)

**"Harvey   Specter" (3 spaces):**
- `fontSize: "calc(14.39vw - 9.21px)"`
- `letterSpacing: "-0.07em"` (em-relative, not fixed px)
- `lineHeight: 1.1` on inner `<p>`, `lineHeight: 0` on outer wrapper
- `white-space: pre` (preserves spaces, no wrap)
- `text-align: left`

**Description block:**
- `flex justify-end w-full` → right edge = same container boundary as title
- Width: `20.4vw` with `minWidth: 240px`
- Letter spacing: `-0.56px` (fixed, from Figma)

---

### Tagline (node `1:33`) — `app/components/Tagline.tsx`

Staggered 5-line typographic section.

| Property | Value |
|---|---|
| Background | `#fafafa` |
| Padding | `px-8 py-[120px]` |
| Font | Inter Light (300), `6.67vw`, `letter-spacing: -0.08em`, `line-height: 0.84` |
| Gap between lines | `8px` |
| Divider | `<div className="w-full h-px bg-[#1f1f1f]" />` |

**Stagger indents (% of 1376px content area):**
| Line | Text | Indent |
|---|---|---|
| 1 | A creative director / | none |
| 2 | Photographer | `padding-left: 15.55%` |
| 3 | Born & raised | `padding-left: 44.33%` |
| 4 | on the south side | none |
| 5 | of chicago. | `padding-left: 44.04%` |

**"[ creative freelancer ]" label:**
- `position: absolute, left: "78.41%", top: "26px"` inside Line 5's `relative w-full` wrapper
- 78.41% is relative to the full content-area-width wrapper (= 1079px at 1440px) ✓
- Geist Mono, 14px

**"&" character:**
- `font-family: var(--font-playfair), serif`, `font-style: italic`, `font-weight: 400`
- Wrapped in `<em>` inside the Line 3 paragraph

---

### About (node `1:51`) — `app/components/About.tsx`

| Property | Value |
|---|---|
| Background | `#fafafa` |
| Padding | `px-8 py-[80px]` |
| Layout | `flex items-start justify-between` |
| Right block width | `71.44%` (= 983 / 1376) |

**Corner bracket decorator:**
```tsx
function Corner({ pos }: { pos: "tl"|"tr"|"bl"|"br" }) {
  // CSS border on a 14×14px div — top/bottom + left/right combinations
  // Replaces the Figma SVG vector assets (which expire)
}
```
Left brackets column: `flex flex-col justify-between h-full w-4`

**Portrait image:** `436×614px` fixed, `/public/about-portrait.jpg`

---

### Services (node `1:68`) — `app/components/Services.tsx`

| Property | Value |
|---|---|
| Background | `bg-black` |
| Padding | `px-8 py-[80px]` |
| Header font | Inter Light, `6.67vw`, `letter-spacing: -0.08em` |
| Service title | Inter Bold Italic, `36px`, `letter-spacing: -0.04em`, uppercase |
| Divider | `<div className="w-full h-px bg-white/20" />` |
| Thumbnail | `151×151px`, `object-cover` |
| Description width | `393px` fixed |

---

### Portfolio (node `1:110`) — `app/components/Portfolio.tsx`

| Property | Value |
|---|---|
| Background | `#fafafa` |
| Padding | `px-8 py-[80px]` |
| Grid | `flex gap-6 items-end` — 2 equal flex-1 columns |
| Right column offset | `padding-top: 240px` |
| Left col: Surfers Paradise image height | `744px` |
| Left col: Cyberpunk Caffe image height | `699px` |
| Right col: Agency 976 image height | `699px` |
| Right col: Minimal Playground image height | `744px` |
| Gap between right col items | `117px` |
| Category tag style | `backdrop-blur(10px)`, `bg-[rgba(255,255,255,0.3)]`, `rounded-full` |
| Project title | Inter Black (900), `36px`, uppercase, `letter-spacing: -0.04em` |
| Arrow icon | Custom SVG `M8 24L24 8M24 8H8M24 8V24` (↗ shape) |

**CTA bracket block (bottom of left column):**
- Width `465px`
- Same `Corner` component pattern as About section
- Text: italic, 14px

---

### Testimonials (node `1:175`) — `app/components/Testimonials.tsx`

| Property | Value |
|---|---|
| Background | `#fafafa` |
| Section height | `min-height: 987px` |
| "Testimonials" font | Inter Medium, `calc(14.39vw - 9.21px)`, centered, `letter-spacing: -0.07em` |

**Absolute card positions (% of section — scales at any viewport):**

| Card | Left | Top | Rotation |
|---|---|---|---|
| Marko Stojković | 7.08% | 14.39% | -6.85deg |
| Lukas Weber | 46.94% | 27.56% | +2.90deg |
| Sarah Jenkins | 21.18% | 56.03% | +2.23deg |
| Sofia Martínez | 68.54% | 55.32% | -4.15deg |

Derivation: `left = figma_left_px / 1440`, `top = figma_top_px / 987`

**Card style:** `bg-[#f1f1f1]`, `border border-[#ddd]`, `rounded p-6`, company logo image + quote (18px, Inter Regular) + name (16px, Inter Black, uppercase)

---

### News (node `1:238`) — `app/components/News.tsx`

| Property | Value |
|---|---|
| Background | `bg-[#f3f3f3]` |
| Padding | `px-8 py-[120px]` |
| Layout | `flex items-end justify-between` |
| Heading container | `width: 110px, height: 706px` — child text is `rotate(-90deg)` |
| Heading font | Inter Light, `64px`, `letter-spacing: -0.08em`, `line-height: 0.86` |
| Article columns area | `width: 1020px` (= 1376 - 110 - gap) |
| Each column width | `353px` |
| Column 2 offset | `padding-top: 120px` |
| Image height | `469px` |
| Divider between columns | `1px` CSS border / bg |
| "Read more" | border-bottom underline + `↗` SVG icon |

---

### Footer (node `1:265`) — `app/components/Footer.tsx`

| Property | Value |
|---|---|
| Background | `bg-black` |
| Padding | `pt-[48px] px-8` (no bottom padding — wordmark bleeds) |
| Top gap | `gap-[120px]` between top block and bottom wordmark |
| "Have a PROJECT" font | Inter Light Italic 24px + Inter Black for "project" |
| CTA button | `border border-white`, `rounded-[24px]`, transparent bg |
| Social links | 18px, `letter-spacing: -0.72px`, uppercase |
| Divider | `h-px bg-white/20` |
| Wordmark container | `width: 1093px, height: 219px, overflow: hidden` |
| Wordmark font | Inter SemiBold, `290px`, `letter-spacing: -0.06em`, `line-height: 0.8` |
| "[ Coded By Claude ]" | Geist Mono 14px, `rotate(-90deg)`, absolute left of wordmark |
| Links | `12px`, `underline`, `letter-spacing: -0.48px` |

---

## 4. Reusable Patterns

### Mono label style (used in every section)
```ts
const mono: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: 14, fontWeight: 400, lineHeight: 1.1,
  color: "#1f1f1f", textTransform: "uppercase",
  letterSpacing: 0, margin: 0, whiteSpace: "nowrap",
};
// On dark backgrounds: change color to "#fff"
```

### Horizontal rule (replaces Figma SVG line assets)
```tsx
<div className="w-full h-px bg-[#1f1f1f]" />      // light sections
<div className="w-full h-px bg-white/20" />         // dark sections
```

### Corner bracket (replaces Figma SVG vector assets)
```tsx
function Corner({ pos }: { pos: "tl"|"tr"|"bl"|"br" }) {
  const borders = {
    tl: { borderTop: "1px solid #1f1f1f", borderLeft: "1px solid #1f1f1f" },
    tr: { borderTop: "1px solid #1f1f1f", borderRight: "1px solid #1f1f1f" },
    bl: { borderBottom: "1px solid #1f1f1f", borderLeft: "1px solid #1f1f1f" },
    br: { borderBottom: "1px solid #1f1f1f", borderRight: "1px solid #1f1f1f" },
  };
  return <div style={{ width: 14, height: 14, flexShrink: 0, ...borders[pos] }} />;
}
// Usage: left column = [tl, bl], right column = [tr, br], with justify-between between them
```

### Arrow icon (replaces Figma fi_10486523 asset)
```tsx
function ArrowIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M8 24L24 8M24 8H8M24 8V24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
```

### Large display text pattern
```tsx
// Figma's leading-[0] + leading-[1.1] wrapper pattern for precise vertical spacing:
<div style={{ lineHeight: 0 }}>
  <p className="m-0 font-light uppercase" style={{ fontSize: "6.67vw", letterSpacing: "-0.08em", lineHeight: 0.84 }}>
    Text here
  </p>
</div>
```

---

## 5. vw Conversion Reference (1440px baseline)

| Figma px | vw value | Use case |
|---|---|---|
| 96px | 6.67vw | Section big text (Tagline, Services) |
| 198px | 13.75vw | Hero name (use formula instead, see §2.3) |
| 64px | 4.44vw | News heading |
| 290px | 20.14vw | Footer wordmark |
| 240px | 16.67vw | Hero nav→text gap |
| 120px | 8.33vw | Section vertical padding (py) |

**For fill-container sizing:** always use `calc(14.39vw - 9.21px)` — not a plain vw — to account for the fixed `64px` padding. This ensures the text right-edge = container right-edge at any viewport.

---

## 6. Background Colors

| Section | Color |
|---|---|
| Hero | transparent (photo bg) |
| Tagline | `#fafafa` |
| About | `#fafafa` |
| Full-bleed image | — (image) |
| Services | `#000000` (black) |
| Portfolio | `#fafafa` |
| Testimonials | `#fafafa` |
| News | `#f3f3f3` |
| Footer | `#000000` (black) |
| `<body>` / `--background` | `#fafafa` |

---

## 7. Common Mistakes to Avoid

1. **Do NOT wrap text containers with `z-index`** if those containers hold `mix-blend-overlay` children. Use DOM order instead.
2. **Do NOT use fixed `px` indents for staggered typography.** Convert to `%` of the content area.
3. **Do NOT assume Figma asset dimensions.** Always `sips` check before writing positioning code.
4. **Do NOT use `whitespace-nowrap` with multi-space text** — use `white-space: pre` to preserve spaces.
5. **Do NOT use fixed `letter-spacing` in px** for display text that uses a fill-container formula — use `em` so the ratio stays constant.
6. **Do NOT put sibling elements in separate containers** when you need their left/right edges to align. One shared `relative w-full` container is the source of truth.
7. **Do NOT download Figma CDN URLs at runtime.** Always `curl` them to `/public` immediately — they expire in 7 days.
8. **Do NOT use `isolation: isolate`** if the section also contains `backdrop-filter` children — isolation can break backdrop-filter compositing. Use DOM order + no-z-index on the content wrapper instead.

---

## 8. Mobile Implementation Lessons (Learned the Hard Way)

These are issues that required **3+ repeated prompts** to fix. Read before touching any mobile layout.

---

### 8.1 ALWAYS fetch the full mobile frame first

**Problem:** Implementing desktop first and then "adapting" mobile led to repeated rework across every section.

**Rule:** When a Figma link is provided, immediately fetch **both** the desktop frame AND the mobile frame (`node-id` for the full-page mobile view) before writing a single line. Map out every section's differences upfront. Example:

```
Desktop node: 1:2   → get_design_context
Mobile node:  1:282 → get_design_context  ← do this FIRST, not later
```

**Never assume mobile = scaled-down desktop.** In this project, mobile had completely different layouts: stacked labels, full-width images, sliders instead of grids, different font sizes.

---

### 8.2 Hero section: mobile image requires separate treatment

**Problem:** The hero background image was fixed `h-[635px]` on mobile instead of 100vh, and repeated attempts to center the subject failed.

**Root causes and fixes:**

| Issue | Wrong approach | Correct approach |
|---|---|---|
| Height not 100vh | `h-[635px]` | `h-[100dvh]` (dynamic viewport, accounts for iOS browser chrome) |
| Image not centered | Extended container `right: -80%` with `object-top` | Separate `md:hidden` / `hidden md:block` image divs; mobile uses `object-cover object-center` or `object-[50%_20%]` |
| Desktop broken by mobile fix | Single `<div className="absolute inset-0">` for both | Two divs: one `md:hidden`, one `hidden md:block` — never share image containers across breakpoints |

**Rule: Always use two separate image divs for mobile/desktop when the image treatment differs:**
```tsx
{/* Mobile only */}
<div className="md:hidden absolute inset-0">
  <Image src="/Mobile Hero Image.png" fill className="object-cover object-center" priority />
</div>
{/* Desktop only */}
<div className="hidden md:block absolute inset-0">
  <Image src="/hero-subject.png" fill className="object-contain object-top" priority />
</div>
```

---

### 8.3 H1 centering: `whitespace-pre-line` breaks `text-align: center`

**Problem:** Using `{"Harvey\nSpecter"}` with `whitespace-pre-line` and `text-align: center` looked left-aligned in browser.

**Root cause:** `whitespace-pre-line` interacts unpredictably with `text-align` on large font sizes — the browser renders the text block at its natural width and centers that block, but the natural width at 96px may overflow and anchor left.

**Fix:** Split into two separate `<p>` elements. Each is a full-width block and centers independently:
```tsx
<p className="m-0 font-medium text-white mix-blend-overlay hero-title w-full">Harvey</p>
<p className="m-0 font-medium text-white mix-blend-overlay hero-title w-full">Specter</p>
```

Apply `text-align: center` in the CSS class (`.hero-title`), not just as a Tailwind class on the element — CSS class wins over utility conflicts.

---

### 8.4 `mix-blend-overlay`: apply to each element, not a wrapper div

**Problem:** Wrapping both `[ Hello i'm ]` and the H1 in a single `<div className="mix-blend-overlay">` worked inconsistently — the blend sometimes applied to the div's own background, not the photo.

**Fix:** Apply `mix-blend-overlay` directly to each `<p>` tag:
```tsx
<p className="m-0 text-white uppercase mix-blend-overlay ...">[ Hello i'm ]</p>
<p className="m-0 font-medium text-white mix-blend-overlay hero-title w-full">Harvey</p>
<p className="m-0 font-medium text-white mix-blend-overlay hero-title w-full">Specter</p>
```

---

### 8.5 Never change shared CSS classes for mobile without a desktop `@media` override

**Problem:** Changing `.hero-title` base styles (line-height, text-align) broke the desktop layout.

**Rule:** Mobile styles go in the base class. Desktop overrides go in `@media (min-width: 768px)`:
```css
.hero-title {
  /* mobile base */
  font-size: 96px; line-height: 0.85; text-align: center;
}
@media (min-width: 768px) {
  .hero-title {
    /* desktop override */
    font-size: calc(14.39vw - 9.21px); line-height: 1.1; text-align: left; white-space: pre;
  }
}
```

---

### 8.6 Filenames with spaces need URL encoding

**Problem:** `src="/Mobile Hero Image.png"` shows a grey background — Next.js `<Image>` silently fails on unencoded spaces.

**Fix:** Always URL-encode spaces in filenames passed to `src`:
```tsx
<Image src="/Mobile%20Hero%20Image.png" ... />
```

**Better fix:** Rename files without spaces before saving to `/public`. Use hyphens: `mobile-hero.png`.

---

### 8.7 Equal-height cards in a horizontal scroll slider

**Problem:** `items-stretch` + `h-full` on cards creates a circular height reference — the container height = tallest child, but `h-full` = container height = undefined → browser ignores it.

**Fix:** Use `useEffect` to measure and set heights in JS after render:
```tsx
useEffect(() => {
  const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
  const max = Math.max(...cards.map(c => c.offsetHeight));
  cards.forEach(c => { c.style.height = `${max}px`; });
}, [data]);
```

---

### 8.8 Scroll-snap slider: `gap` breaks `goTo` math

**Problem:** Adding `gap: 10px` to the slider container makes `goTo(i)` scroll to the wrong position because `scrollLeft` for slide `i` is `i * (slideWidth + gap)`, not `i * slideWidth`.

**Fix:** Define gap as a constant and use it in both layout and scroll calculations:
```tsx
const GAP = 10;

// layout
<div style={{ gap: GAP, scrollSnapType: "x mandatory" }}>

// scroll math
function onScroll() {
  const idx = Math.round(scrollLeft / (clientWidth + GAP));
}
function goTo(i: number) {
  scrollTo({ left: i * (clientWidth + GAP) });
}
```

---

### 8.9 Mobile-only layout changes: always use `md:hidden` / `hidden md:block`

**Problem:** Changing image containers, flex direction, or positioning without breakpoint guards repeatedly broke the desktop layout.

**Rule:** Every mobile-specific element gets `md:hidden`. Every desktop-specific element gets `hidden md:block` (or `hidden md:flex`). Never modify shared elements without adding a responsive guard.

```tsx
{/* Mobile version */}
<div className="flex md:hidden flex-col ..."> ... </div>

{/* Desktop version — untouched */}
<div className="hidden md:flex ..."> ... </div>
```

If a shared CSS class needs different values, use `@media` in globals.css — not inline styles that only target one breakpoint.

---

### 8.10 Vercel deployment: env vars must be set for ALL environments

**Problem:** Sanity env vars were set for Production only. `vercel deploy` (without `--prod`) creates a Preview deployment which doesn't have the vars → build fails with `Configuration must contain projectId`.

**Fix:** Either:
- Always deploy to production: `vercel deploy --prod --yes --scope <team>`
- Or add vars to Preview too: `vercel env add VAR_NAME preview --value "..." --yes --scope <team>`
