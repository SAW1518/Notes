---
title: Mock Interview Session 04
date: 2026-08-27
tags:
  - study
  - interview
  - promotion
  - javascript
  - react
  - web-platform
  - mock-interview
parent: "[[The Best Notes of the F Word]]"
source: Mock promotion panel (Mid → Senior Frontend) — 8 of 12 questions reached, ~80% outside the vault
---

# Mock Interview Session 04 — Senior Frontend (web platform focus)

Related: [[Mock Interview Session 01]] · [[Mock Interview Session 02]] · [[Mock Interview Session 03]] · [[Assessment Questions]] · [[The Best Notes of the F Word]]

Format: verbal, conceptual only. No code reading, no debugging.
Question mix: ~80% topics **not** in the vault (browser, network, a11y, security, testing process), ~20% vault topics pushed past the note.
Session ended at Q8 by request.

> [!danger]- Read this first — the pattern from Sessions 01–03 repeated again
> Three sessions in a row the diagnosis was: **the first answer names the right word, the follow-up never reaches the mechanism.**
> Today it happened five times out of six answered questions. The opening answer was right or half-right almost every time —
> `<dialog>`, optimistic UI, httpOnly cookies, DevTools performance tab — and then the second layer did not arrive.
> **New this session: two answers drifted to the wrong topic under pressure** (browser paint → React re-render; CSRF → XSS).
> Drifting to an adjacent topic reads to a panel as "does not know where the boundary is."
> The gap to Senior is not more topics. It is the second layer of the topics already half-known.

## 1. Results

| # | Topic | In vault? | Verdict | Note |
|---|---|---|---|---|
| 1 | Scroll jank diagnosis / rendering pipeline | No | **Partial** | Strong process opener (console warnings → Performance recording → find the phase). Follow-up said layout+paint dominance = "a re-rendering problem, the scroll causes a re-render" — that is React vocabulary applied to a browser-pipeline symptom. No layout thrashing, no compositor, no virtualization. |
| 2 | CDN caching + release versioning | No | **Skipped** | — |
| 3 | Accessible modal | No | **Partial** | `<dialog>` named immediately — correct and the best possible first move. Follow-up asked specifically about focus and the answer went to ARIA labels instead. Focus trap, initial focus, focus restore, Escape, background `inert` — none named. |
| 4 | Optimistic UI + failed mutation | Partial ([[Design Patterns]] state mgmt) | **Partial** | Correctly named optimistic update and confirm-on-response. Failure handling: retry, then roll back and notify — right instinct. Nothing about the concurrency in the question (3 in flight, out-of-order responses, per-item vs global rollback, retrying a non-idempotent write). |
| 5 | Disagreement pushed and resolved | No (soft skills in [[Soft Skills and Processes to study]]) | **Correct — best answer of the session** | Real case: product wanted notification state in `localStorage`; repo rules forbade client storage (security + server-driven-UI methodology). Researched, presented the reasons, proposal dropped, moved to a small dedicated DB, **wrote a spike doc for future reference**. Research → align → decide → document is exactly the senior loop. |
| 6 | Explain hydration to a non-technical PM | No | **Incorrect / abandoned** | Answered "server-side rendering has trade-offs, the server has to build the UI before showing you" — that explains TTFB, not the dead-click gap. Re-prompted with "the page is already visible", answer was `next`. |
| 7 | Cross-domain token storage | Partial (security in [[Assessment Questions]]) | **Partial** | httpOnly cookie, not readable by JS, sent automatically — correct and well stated. Follow-up asked what the *automatic sending* creates. Answer: XSS. **The answer is CSRF.** XSS is the thing httpOnly already mitigates, so the follow-up looped back to the defence instead of the new hole. |
| 8 | 40-minute flaky e2e suite | No | **Partial** | Two plausible causes (state/memory contamination between runs, timeouts shorter than the work). Both are individual-bug answers. The question was a process question and the process follow-up was not answered — session ended. |

**Score: 1 correct, 5 partial, 1 incorrect, 1 skipped — 8 of 12 reached.**
**Estimated level: Mid**, with one clearly Senior answer (Q5).

---

## 2. Verdict

**Not yet ready for Senior.**

Breadth is real — every question got a relevant opening move, and nothing was invented out of thin air this time (unlike Session 03).
What blocks the promotion is depth on follow-up: five of six answered questions stopped at the vocabulary layer, and two drifted into an adjacent topic when pushed.
The behavioural answer (Q5) was genuinely senior — ownership, research, alignment, documented outcome. If the technical depth matched that answer, this would be a pass.

## 3. Top 3 strengths

1. **Diagnosis before code.** Q1 opened with "do not change anything yet, measure first, console then Performance tab." That is the right reflex and it is a senior reflex.
2. **Correct first moves on unfamiliar ground.** `<dialog>` for modals, httpOnly cookies for cross-domain sessions, optimistic update for instant UI — three topics with no note in the vault, three correct instincts.
3. **Real ownership in the behavioural answer.** Q5 had a concrete case, a real constraint (repo security rules + server-driven UI), a negotiated outcome, and a written spike left behind for the next person.

## 4. Top 3 gaps

1. **The browser is a black box.** Rendering pipeline, layout vs paint vs composite, what makes a frame drop, what the CDN and the cache headers do on release day. Everything below React is missing.
2. **Follow-ups drift instead of going deeper.** Asked for the layer under the answer, the response changes topic (paint → re-render, CSRF → XSS). A panel reads that as not knowing the boundary of the concept.
3. **Process answers given as bug answers.** Q8 asked how to stop flakiness accumulating; the answer listed two possible root causes. Senior scope is quarantine policy, flake tracking, test-data determinism, pyramid rebalancing — not the individual bug.

---

## 5. Review these notes (already in the vault)

| Note | Why |
|---|---|
| [[The Best Notes of the F Word]] — *Still to study* → Browser APIs, Web Performance Analysis and Optimization, Frontend Web Accessibility, Common security knowledge | The four sections that were fumbled today are literally already listed there as pending. |
| [[Mock Interview Session 02]] — Q1 *Where the rendering sits in the event loop* | Directly covers the Q1 follow-up that was missed. |
| [[Mock Interview Session 02]] — Q4 *Is React safe against XSS?* | XSS was reached for again in Q7; re-read so XSS and CSRF stop being the same word. |
| [[Assessment Questions]] — *Explain server-side rendering* / *Which libraries for SSR* | Q6 lives here; the note explains SSR but not hydration, which is exactly the missing layer. |
| [[Assessment Questions]] — *How do you handle security threats* / *sensitive data* | Q7 baseline. |
| [[Assessment Questions]] — *What is the testing pyramid* / *Why more unit tests* | Q8 process answer starts from the pyramid. |
| [[Design Patterns]] — *State management* | Q4 optimistic UI and cache invalidation belong next to this section. |

## 6. You have no notes on these — create them

### 1. `Browser Rendering Pipeline and Jank`
- The five phases: JS → Style → Layout → Paint → Composite, and which DevTools colour is which.
- Layout thrashing / forced synchronous layout: reading `offsetHeight` after a write, inside a loop.
- Compositor-only properties (`transform`, `opacity`) vs properties that force layout (`top`, `width`, `height`).
- The 16ms frame budget, long tasks, and why a passive scroll listener matters.
- Cheap wins: `content-visibility`, `contain`, list virtualization, cutting DOM size, avoiding `box-shadow`/`filter` on scrolling rows.

### 2. `HTTP Caching and CDN for SPA Releases`
- `Cache-Control` vocabulary: `max-age`, `immutable`, `no-cache` vs `no-store`, `stale-while-revalidate`.
- The standard SPA recipe: hashed chunk filenames cached forever + `index.html` never cached.
- Why the old app keeps running after a deploy, and the "new version available, reload" pattern.
- Chunk 404s after deploy: keep N previous builds on the CDN, and reload on chunk-load error.
- ETag / `Last-Modified` revalidation, and CDN purge vs cache-busting.

### 3. `Accessible Components — Focus Management`
- `<dialog>` + `showModal()`: what it gives free (top layer, `inert` background, Escape).
- The four focus rules: move focus in, trap it while open, restore it to the trigger on close, never trap it forever.
- `aria-modal`, `aria-labelledby` on the title, `aria-describedby` for the body — labels are the *second* layer, not the first.
- Visible focus indicators and why removing `outline` is a bug, not a design choice.
- Quick audit loop: keyboard only, then VoiceOver, then axe.

### 4. `Rendering Strategies and Hydration`
- CSR / SSR / SSG / ISR / streaming SSR / RSC — one line each, what each optimises.
- What hydration actually is: the server HTML is a picture, JS has to attach the listeners to make it work.
- The uncanny valley: visible but not interactive, and how it shows up as bad INP.
- Fixes: less JS, code splitting, islands / partial hydration, progressive hydration, RSC.
- The non-technical explanation, rehearsed in one sentence (see model answer below).

### 5. `Frontend Auth — Cookies, CSRF and CSP`
- httpOnly / `Secure` / `SameSite` (Lax, Strict, None) and what each flag actually blocks.
- **XSS vs CSRF**: XSS = attacker runs JS on your origin; CSRF = attacker's site makes the *browser* send your cookie.
- CSRF defences: `SameSite`, anti-CSRF token, checking `Origin`/`Referer`, not using cookies for state-changing GETs.
- Cross-domain specifics: CORS with `credentials`, why `SameSite=None; Secure` is needed, and third-party cookie deprecation.
- Token-in-memory + refresh-cookie as the alternative pattern, and its trade-offs.
- CSP as the second wall behind React's escaping.

### 6. `Test Strategy — Flakiness as a Process Problem`
- Common flake sources: shared/leaked state between tests, `sleep` instead of waiting for a condition, real network, non-deterministic seed data, parallel workers fighting over fixtures, animations and clocks.
- Quarantine policy: a flaky test is muted within one day, ticketed with an owner, deleted if not fixed in two weeks.
- Flake tracking: record pass/fail per test over time; the dashboard is what stops accumulation, not willpower.
- Ban "re-run until green" — make the re-run itself visible and counted.
- Rebalance the pyramid: most e2e flakes are integration tests wearing a browser.
- Cut the 40 minutes: parallelism, sharding, and only running the full suite on main.

### 7. `Optimistic UI and Client Cache`
- The three steps: write to cache → fire request → on error roll back to the snapshot.
- Per-item optimistic state, not a global "saving" flag, so N in-flight mutations do not collide.
- Out-of-order responses: last-write-wins, request ids, cancelling superseded requests.
- Retry safely: idempotency keys, and never blindly retry a non-idempotent write.
- Invalidate and refetch after the mutations settle, so the server stays the source of truth.
- When *not* to be optimistic: payments, irreversible actions, anything with server-side validation the client cannot predict.

---

## 7. Model answers — the three weakest

### Q6 — Hydration, explained to a non-technical PM (6 lines)

> The server sends a finished picture of the page, so it appears fast — but a picture has no buttons.
> The browser then downloads the app's JavaScript and walks the whole page attaching the behaviour to every element.
> Until that pass finishes, clicks land on something that looks like a button but has nothing wired to it yet.
> The bigger the page and the more JavaScript we ship, the longer that gap lasts.
> We shrink it by sending less JavaScript, splitting it so the visible part wires up first, and prioritising the parts users touch soonest.
> The trade-off is real: server rendering buys us the fast *appearance*, and we pay for it in that interactive delay.

### Q7 — What automatic cookie sending creates (6 lines)

> httpOnly protects the token from **XSS** — JavaScript on my page cannot read it. That part was right.
> The new hole is **CSRF**: the browser attaches that cookie to *any* request to my API, including one triggered by `evil.com`.
> So an attacker's page can make the user's browser perform a state change while authenticated, without ever reading the token.
> Defence one is `SameSite` — `Lax` blocks cross-site sends for anything but top-level navigations, `Strict` blocks them entirely.
> Cross-domain forces `SameSite=None; Secure`, which turns SameSite off, so I add an anti-CSRF token and validate `Origin` on state-changing requests.
> And no state changes on GET, ever — CORS does not protect a simple request from being *sent*, only the reading of the response.

### Q1 — Layout and paint dominating the frame (6 lines)

> Long layout and paint bars mean the browser is recomputing geometry and repainting pixels every frame — it is below React, not a re-render.
> First suspect is layout thrashing: code that writes a style and then reads `offsetHeight`/`getBoundingClientRect` in the same loop, forcing a synchronous layout each pass.
> Second is a scroll handler doing DOM work on every event instead of batching into `requestAnimationFrame` — and it should be a passive listener.
> Third is cost per row: shadows, filters, blurs, huge images, or animating `top`/`height` instead of `transform`/`opacity`, which stay on the compositor.
> Fourth is DOM size — thousands of rows recalculate style and layout even when off-screen; virtualization or `content-visibility: auto` cuts that.
> I would fix in that order, re-record after each change, and hold the frame budget at 16ms as the acceptance criterion.

---

## 8. Priorities before Session 05

1. **Browser rendering pipeline** — highest priority, it is the gap under three different questions today.
2. **XSS vs CSRF** — two words, two different attacks, must never be swapped again.
3. **Hydration** — rehearse the non-technical explanation out loud until it is one clean paragraph.
4. **Flakiness as process** — practise answering "how do you stop X accumulating" with a policy, not a root cause.
5. **Repeat from Session 01/03**: still no production failure-mode reasoning on concurrency (Q4 today, Q3 in Session 03, Q2 in Session 01). **Third time.**

## 9. Next session (Session 05)

Run the same 12-question format and re-ask: rendering pipeline, CDN caching (skipped today), focus management, CSRF, flaky-suite process, hydration.
Add untouched Senior surface: bundle size / code splitting, design-system component API and versioning, observability and progressive rollout, monorepo vs multi-repo, GraphQL vs REST / BFF.
