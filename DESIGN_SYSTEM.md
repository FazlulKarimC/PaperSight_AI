# PaperSight AI — Design System

> **Style**: Editorial Tech — high-end digital publication × developer tool.  
> **Mood**: Authoritative, precise, calm. Never playful or bouncy.

---

## Colors (oklch)

All colors are CSS custom properties in `app/globals.css`. Dark-mode-first.

| Token | Role | Value |
|-------|------|-------|
| `--background` | Page background | `oklch(0.13 0.01 260)` — deep navy-charcoal |
| `--foreground` | Primary text | `oklch(0.95 0.005 80)` — warm off-white |
| `--card` | Surface/card bg | `oklch(0.16 0.008 260)` |
| `--accent` | **THE** accent color | `oklch(0.78 0.16 55)` — warm amber |
| `--muted-foreground` | Secondary text | `oklch(0.65 0.01 260)` |
| `--secondary` | Input/control bg | `oklch(0.20 0.008 260)` |
| `--border` | Borders/dividers | `oklch(0.26 0.008 260)` |
| `--destructive` | Errors | `oklch(0.577 0.245 27.325)` |

**Rules**:
- ONE accent color (amber). Use sparingly: CTAs, active states, RAG indicators, links.
- No gradients on UI chrome. Only subtle radial glows on card backgrounds (`from-accent/5`).
- No rainbow palettes. All grays derive from the navy-charcoal hue (260°).

---

## Typography

| Class | Font | Use For |
|-------|------|---------|
| `heading-display` | Instrument Serif 400 italic, `letter-spacing: -0.02em`, `line-height: 1.1` | Page titles, hero text, section headings |
| `heading-ui` | Geist 600, `letter-spacing: -0.025em` | Card titles, UI headings, feature names |
| `mono-label` | Geist Mono 0.75rem, uppercase, `letter-spacing: 0.04em` | Section labels, metadata, badges, timestamps |
| `font-sans` (default) | Geist | Body text, UI elements |
| `prose-editorial` | Mixed (1.05rem, `line-height: 1.85`) | Long-form reading views (summary content) |

**Font loading** — `next/font/google` in `app/layout.tsx`:
```
Geist → --font-geist (sans)
Instrument_Serif 400 normal+italic → --font-instrument-serif (serif)
```

---

## Surfaces

| Class | Use |
|-------|-----|
| `surface-raised` | Cards, panels, elevated content. 1px border + subtle inset highlight + layered shadows |
| `surface-sunken` | Inputs, recessed areas. Darker bg + inset shadow |
| `surface-hover` | Add to `surface-raised` for hover lift effect (translateY(-1px) + accent border glow) |

**Rule**: Flat or barely elevated. Thin 1px borders over heavy shadows. No glassmorphism.

---

## Spacing & Layout

- Max content width: `max-w-7xl` (1280px) with `px-4 sm:px-6 lg:px-8`
- Section padding: `py-24` between major sections
- Card padding: `p-6` standard, `p-8 sm:p-12` for hero/upload panels
- Component gap: `gap-4` in grids, `gap-2` for tight groups

---

## Animations

### Timing Tokens (CSS)
```css
--dur-instant: 80ms    /* tooltip show/hide */
--dur-fast: 150ms      /* button hover, micro feedback */
--dur-normal: 250ms    /* panel open/close, content fade */
--dur-slow: 400ms      /* max — page transitions */
```

### Rules
- Nothing exceeds 400ms for functional UI.
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` or `ease-out`. Never spring/bounce/elastic.
- Entrance: `opacity: 0 → 1` + `translateY(8px) → 0`
- Exit: fast fade only
- Stagger: 50-100ms between sibling items
- **Must** respect `prefers-reduced-motion` — global rule in `globals.css` kills all animations.

### Framer Motion Conventions
```tsx
// Standard entrance
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
```

---

## Interactive States

| State | Treatment |
|-------|-----------|
| **Hover (buttons)** | `.btn-editorial` — pseudo-element sweep fill from left, 150ms |
| **Active/press** | `scale(0.98)` + `opacity: 0.9` |
| **Focus** | `box-shadow: 0 0 0 2px var(--background), 0 0 0 4px accent/50` |
| **Disabled** | `opacity: 0.5` + `pointer-events: none` |
| **Drag-over (dropzone)** | `border-accent` solid + `surface-sunken` bg + icon turns accent |

---

## Component Patterns

### Buttons
- Primary CTA: `bg-accent text-accent-foreground hover:bg-accent/90 font-medium`
- Secondary: `variant="outline"` with `border-border hover:bg-secondary`
- Ghost: `variant="ghost"` for nav/toolbar actions
- Add `btn-editorial` class for the sweep hover + press microinteraction

### Cards
- Always use `surface-raised` + `rounded-xl`
- Optional: `surface-hover` for interactive cards
- Accent glow overlay: `bg-[radial-gradient(ellipse_at_top,...)] from-accent/5 via-transparent to-transparent`

### Badges/Labels
- `mono-label` for section labels (e.g., "Capabilities", "Upload", "Your Workspace")
- Status pill: `.rag-badge` for inline status indicators
- `Badge` component with `variant="outline"` + `bg-accent/10 text-accent border-accent/30`

### Icons
- Source: `lucide-react`
- Size: `h-4 w-4` (inline), `h-5 w-5` (cards), `h-7 w-7` (empty states)
- Color: `text-accent` for emphasis, `text-muted-foreground` for secondary

---

## RAG-Specific UI

| Element | Class/Pattern |
|---------|---------------|
| RAG status badge | `.rag-badge` — monospace uppercase pill with accent border |
| Source citation card | `.source-card` — left accent border, dark bg, hover reveals more border |
| Stagger-enter sources | `.source-card-enter` with `animation-delay: ${index * 50}ms` |
| Streaming cursor | `.streaming-cursor` — 1.5px blinking amber bar |
| Pipeline status | Monospace text cycling: "Retrieving context…" → "Ranking passages…" → "Generating response…" |

---

## File Reference

| File | Purpose |
|------|---------|
| `app/globals.css` | All CSS custom properties, utility classes, global styles |
| `app/layout.tsx` | Font loading, providers, mesh gradient overlay |
| `components/ui/button.tsx` | Button variants (cva) |
| `components/ui/card.tsx` | Card primitives |
| `lib/animations.ts` | Framer Motion variants (`fadeIn`, `slideUp`, `staggerContainer`, `scale`) |
