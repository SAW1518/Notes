---
title: Browser Platform
tags:
  - study
  - interview
  - performance
  - accessibility
  - http
---

# Browser Platform

The layer **below** the framework: the rendering pipeline, HTTP caching on release day, and accessible focus management.

The mistake this note exists to prevent: answering a browser-pipeline symptom with React vocabulary. "The scroll causes a re-render" is the wrong layer — layout and paint happen underneath React, and a re-render is not what is costing the frame.

---

# 1. The rendering pipeline and jank

## The five phases

**JS → Style → Layout → Paint → Composite.** Budget: **16 ms** per frame at 60 Hz.

| Phase | What it does | DevTools colour |
|---|---|---|
| **JS** | Our code runs — handlers, framework render | yellow |
| **Style** | Recalculate which CSS rules apply, and the computed values | purple |
| **Layout** (reflow) | Compute **geometry**: position and size of every box | purple |
| **Paint** | Fill in **pixels** — text, colours, shadows, images | green |
| **Composite** | Assemble the painted layers on the GPU | grey / green |

This is also **step 3 of the event loop** — it is not something the browser does in parallel somewhere else ([[JavaScript#The event loop]]).

## Scrolling is janky — layout and paint dominate the frame

Long layout and paint bars mean the browser is recomputing **geometry** and repainting **pixels** every frame. **It is below React — it is not a re-render.**

Fix in this order, re-recording after each change:

1. **Layout thrashing (forced synchronous layout)** — writing a style and then reading `offsetHeight` / `getBoundingClientRect` in the same loop forces a synchronous layout on each pass. Batch all reads, then all writes.
2. **A scroll handler doing DOM work on every event** — batch into `requestAnimationFrame`, and register the listener as **passive**.
3. **Cost per row** — shadows, filters, blurs, huge images, or animating `top` / `height` instead of `transform` / `opacity`, which stay on the **compositor**.
4. **DOM size** — thousands of rows recalculate style and layout even off-screen. **Virtualization** or `content-visibility: auto`, plus `contain`.

Acceptance criterion: hold the frame budget at **16 ms**.

### Layout thrashing, concretely

```js
// ❌ forced synchronous layout, once PER ITEM
items.forEach(el => {
  el.style.width = '100px';           // write → invalidates layout
  console.log(el.offsetHeight);       // read  → forces layout NOW, synchronously
});

// ✅ batch: read everything, then write everything
const heights = items.map(el => el.offsetHeight);   // all reads
items.forEach((el, i) => {                           // all writes
  el.style.width = `${heights[i]}px`;
});
```

The properties that force a synchronous layout when read: `offsetTop/Left/Width/Height`, `scrollTop/Left/Width/Height`, `clientTop/Left/Width/Height`, `getBoundingClientRect()`, `getComputedStyle()`, `focus()`, `scrollIntoView()`.

### Compositor-only properties — the fact that proves you know which thread does what

| Animate this | Which phases run |
|---|---|
| `transform`, `opacity`, `filter` | **Composite only** — runs on the compositor thread |
| `color`, `background-color`, `box-shadow` | Paint + Composite |
| `width`, `height`, `top`, `left`, `margin`, `padding` | **Layout** + Paint + Composite — the expensive one |

Because `transform` and `opacity` live on the compositor, they keep animating **even when the main thread is completely blocked**. That is why a CSS spinner using `transform: rotate()` survives a frozen page while one animating `left` freezes ([[JavaScript#The page is frozen and a pure-CSS spinner has stopped. The stack is empty most of the time. What is happening?]]).

`will-change: transform` promotes an element to its own layer. Use it sparingly — every layer costs memory, and leaving it on permanently is worse than not using it.

### The cheap wins

```css
/* skip style, layout and paint for off-screen content */
.row { content-visibility: auto; contain-intrinsic-size: 0 48px; }

/* promise the browser that nothing inside affects the outside */
.card { contain: layout paint; }
```

- **Virtualize** long lists — render 20 rows, not 5.000 ([[React#A component with thousands of rows — how do you avoid the performance problem?]]).
- **Passive scroll listeners**: `{ passive: true }` tells the browser it does not need to wait to see whether we call `preventDefault()`.
- Avoid `box-shadow` and `filter` on rows that scroll.
- Cut DOM size. Every node costs style recalculation whether or not it is visible.

> [!tip] Diagnosis before code
> The right opener is: *"do not change anything yet — console warnings first, then a Performance recording, find the phase."* Naming the phase before naming a fix is the senior reflex, and it is what tells you whether the problem is even in your code.

## The metrics that matter

| Metric | What it measures | Good |
|---|---|---|
| **LCP** | When the largest content element paints | < 2.5 s |
| **INP** | Worst interaction latency across the visit (replaced FID) | < 200 ms |
| **CLS** | Unexpected layout shift | < 0.1 |
| **TTFB** | Time to the first byte | < 800 ms |

A **long task** is anything over 50 ms on the main thread; it is what makes INP bad. Render count is not a user-facing metric — INP is.

> [!question] Short answer for the interview
> "Long layout and paint bars mean the browser is recomputing geometry and repainting pixels every frame — it is below React, not a re-render. First suspect is layout thrashing: writing a style and then reading `offsetHeight` in the same loop forces a synchronous layout each pass. Second is a scroll handler doing DOM work on every event instead of batching into `requestAnimationFrame`, and it should be passive. Third is cost per row: shadows, filters, or animating `top`/`height` instead of `transform`/`opacity`, which stay on the compositor. Fourth is DOM size — thousands of rows recalculate style even off-screen, so virtualization or `content-visibility: auto`. I fix in that order, re-record after each change, and hold the 16 ms frame budget as the acceptance criterion."

---

# 2. HTTP caching and the CDN on release day

## The `Cache-Control` vocabulary

| Directive | Meaning |
|---|---|
| `max-age=N` | Fresh for N seconds; no request at all while fresh |
| `immutable` | Do not even revalidate on reload — the content can never change |
| `no-cache` | Store it, but **revalidate before every use** |
| `no-store` | Never write it down anywhere |
| `stale-while-revalidate=N` | Serve the stale copy immediately, refresh in the background |
| `private` / `public` | Browser-only vs shared caches (CDN) may store it |

`no-cache` and `no-store` are the pair that gets mixed up: `no-cache` means *revalidate*, not *do not cache*.

## The standard SPA recipe

- **Hashed chunk filenames** (`main.a3f91b.js`) → `Cache-Control: max-age=31536000, immutable`. Cache forever: a new build produces a new filename.
- **`index.html`** → `no-cache`. It is the only file that points at the new hashes, so it must be revalidated every time.

## What breaks on deploy day

**The old app keeps running** after a deploy, because it already has its JavaScript in memory. It will not pick up the new version until a reload. Hence the "new version available, reload" banner.

**Chunk 404s** — the running old app lazy-loads a chunk that no longer exists on the CDN. Two fixes, and you want both:

1. Keep **N previous builds** on the CDN. Deleting old assets on deploy is what causes this.
2. Catch the chunk-load error and reload the page.

```js
// React.lazy with a reload fallback
const Settings = lazy(() =>
  import('./Settings').catch(() => {
    window.location.reload();
    return { default: () => null };
  })
);
```

`ETag` / `Last-Modified` drive revalidation (a `304` with no body). CDN **purge** invalidates by URL; **cache-busting by filename** avoids needing a purge at all — which is why hashed filenames are the recipe.

---

# 3. Accessibility and focus management

## Build an accessible modal

**`<dialog>` + `showModal()`** first. It gives three things for free:

- the **top layer** (no `z-index` fight, no stacking-context surprise)
- the **inert background** (clicks and Tab cannot reach behind it)
- **Escape** to close

```html
<dialog id="dlg" aria-labelledby="dlg-title">
  <h2 id="dlg-title">Delete project</h2>
  <p id="dlg-body">This cannot be undone.</p>
  <button value="cancel">Cancel</button>
  <button value="confirm">Delete</button>
</dialog>
```

```js
dlg.showModal();   // modal: top layer + inert background + Escape
dlg.show();        // non-modal: none of that
```

## The four focus rules

This is the layer people skip, and it is the one the question is actually about:

1. **Move focus in** when it opens — to the dialog, or to the first meaningful control.
2. **Trap it** while open — Tab cycles inside the dialog.
3. **Restore it** to the trigger element on close.
4. **Never trap it forever** — Escape always works.

> [!important] Labels are the second layer, not the first
> `aria-modal`, `aria-labelledby` on the title and `aria-describedby` on the body come **after** focus is handled. A perfectly labelled dialog that strands the keyboard is still broken. If the follow-up asks about focus, do not answer with ARIA.

## Focus indicators

Removing `outline` is a **bug**, not a design choice. If the default ring is ugly, replace it — do not delete it:

```css
:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
```

`:focus-visible` shows the ring for keyboard users and not for mouse clicks, which is the behaviour people were trying to get by removing `outline` in the first place.

## The audit loop

**Keyboard only → screen reader (VoiceOver) → axe.** In that order, because the keyboard pass finds the structural problems that no automated tool reports, and axe only catches what is machine-checkable.

## The rest of the a11y baseline

- **Semantic HTML first.** A `<button>` is focusable, clickable with Enter and Space, and announced as a button. A `<div onClick>` is none of those, and `role="button"` + `tabindex="0"` + two key handlers is the price of skipping it.
- **One `<h1>`**, headings in order, no skipped levels.
- **Labels** tied to inputs (`<label for>` or wrapping), not placeholder text.
- **Alt text** that describes the purpose; `alt=""` for decorative images.
- **Colour contrast** 4.5:1 for body text, 3:1 for large text and UI boundaries.
- **Never colour alone** to convey meaning.
- **`prefers-reduced-motion`** — respect it for anything that moves.
- **Live regions** (`aria-live="polite"`) for content that updates without a navigation: toasts, validation, search results.

---

# 4. Recall triggers

| When I hear / say… | The words that must come out |
|---|---|
| "layout and paint dominate" | **below React** — not a re-render |
| "janky scroll" | layout thrashing → rAF + passive → cost per row → DOM size |
| "I read `offsetHeight`" | **forced synchronous layout** — batch reads, then writes |
| "animate it" | `transform` / `opacity` = **compositor**; `top` / `width` = layout |
| "the spinner kept spinning" | compositor thread, independent of the blocked main thread |
| "thousands of rows off-screen" | `content-visibility: auto`, `contain`, virtualization |
| "frame budget" | **16 ms** at 60 Hz |
| "the user-facing metric" | **INP**, not render count |
| "cache the bundle" | hashed names `immutable` forever + `index.html` `no-cache` |
| "`no-cache`" | means **revalidate**, not "do not store" — that is `no-store` |
| "chunk 404 after deploy" | keep **N previous builds** + reload on chunk-load error |
| "accessible modal" | `<dialog>` + `showModal()`, then the **four focus rules** |
| "ARIA labels" | that is the **second** layer — focus comes first |
| "we removed the outline" | that is a **bug** — use `:focus-visible` |

---

# 5. Drill — say these out loud

1. Five phases: **JS → Style → Layout → Paint → Composite**. Budget **16 ms**.
2. Rendering is **step 3 of the event loop**, not a parallel process.
3. Reading `offsetHeight` after a write **forces a synchronous layout**.
4. `transform` and `opacity` are **compositor-only** — they survive a blocked main thread.
5. `content-visibility: auto` skips style, layout and paint for off-screen content.
6. Passive listeners let the browser scroll without waiting on `preventDefault`.
7. **INP** is the interaction metric; a long task is **over 50 ms**.
8. Hashed chunks `immutable` forever; `index.html` `no-cache`.
9. `no-cache` = revalidate. `no-store` = never write it down.
10. The old app keeps running after a deploy — keep **N previous builds**.
11. `<dialog>` + `showModal()` gives top layer, inert background and Escape.
12. Four focus rules: **move in · trap · restore · never forever**.
13. Labels are the **second** layer. Focus is the first.
14. Deleting `outline` is a bug; `:focus-visible` is the answer.

---

# Still to study

- [ ] The critical rendering path: render-blocking CSS and JS, `preload` / `prefetch` / `preconnect`, `fetchpriority`
- [ ] Core Web Vitals in the field vs in the lab: CrUX, RUM, and why Lighthouse disagrees with reality
- [ ] HTTP/2 and HTTP/3: multiplexing, head-of-line blocking, and what changed about bundling advice
- [ ] Service Workers and the Cache API: offline, the update lifecycle, and `skipWaiting` footguns
- [ ] Image delivery: `srcset` / `sizes`, AVIF and WebP, `loading="lazy"`, aspect-ratio to avoid CLS
- [ ] Fonts: `font-display`, subsetting, and the FOIT/FOUT trade-off
- [ ] `IntersectionObserver`, `ResizeObserver`, `MutationObserver` — the three and what each one replaces
- [ ] WCAG 2.2 AA as an actual checklist, and what the new success criteria added
- [ ] Screen reader mental model: the accessibility tree, and how it differs from the DOM
