---
title: README
tags:
  - index
---

# Interview Study Vault

Reference notes for frontend interviews. Everything here is **verified** — no mock-interview transcripts, no "what I got wrong last time", no corrections in the margin. Where a note used to carry a correction, the corrected fact is now the text.

Code examples marked ✅ were run in Node v22.

---

# The notes

## Core language

| Note | What is in it |
|---|---|
| **[[JavaScript]]** | Event loop (four steps, rendering is step 3) · scope, hoisting, TDZ · closures at engine level and the four leak patterns · prototype chain · promises, combinators, concurrency, error layers · `fetch` and the 404 trap · debounce vs throttle · copying and equality · functions, DOM and events · dates |
| **[[TypeScript]]** | The two declaration spaces · `type` vs `interface` · unions, discriminated unions, `never` · `as` vs `satisfies` · narrowing and predicates · generics · utility types · branded types · tsconfig · **and OOP**: the four pillars, `class` as prototypes, `this`, inheritance, composition, OOP vs FP vs RP |
| **[[TypeScript Boundary]]** | Why the compiler cannot protect you from the network · `unknown` instead of `any` · parse don't validate · Zod in practice · what a parse failure should do · codegen vs contract tests vs runtime parsing |
| **[[Arrays]]** | What mutates and what does not · the ES2023 immutable four · `every`, `at`, `concat`, `fill` in depth · the eight traps that cost real time |

## Framework and UI

| Note | What is in it |
|---|---|
| **[[React]]** | Virtual DOM · hooks and the lifecycle mapping · `useEffect` vs `useLayoutEffect` · **re-renders and memoisation** in full (the three causes, every dead-memo case with code, what beats memoising, how to prove it) · rendering strategies and hydration · optimistic UI · XSS escape hatches |
| **[[State Management]]** | Why a container at all · Redux end to end · server state vs client state vs URL state · **libraries worth learning**, in order of payoff |
| **[[CSS]]** | Flexbox (the two axes, `flex: 1` is `1 1 0%`) · Grid (`fr` splits the **free** space, `repeat(auto-fit, minmax())`, bento, lines not tracks) · flex vs grid · 32 screenshots |

## Architecture and platform

| Note | What is in it |
|---|---|
| **[[Design Patterns]]** | The 23 by category, with runnable code · single-flight · functional patterns · anti-patterns · **SOLID, DRY/YAGNI/KISS, DIP vs DI vs IoC** · composition over inheritance |
| **[[Browser Platform]]** | The five rendering phases and the 16 ms budget · layout thrashing · compositor-only properties · Core Web Vitals · HTTP caching and the CDN on release day · accessible modals and the four focus rules |
| **[[Security]]** | XSS vs CSRF (the table) · the three kinds of XSS and the sinks to grep for · where the token goes and what that creates · sensitive data · vulnerable packages |
| **[[Testing and Process]]** | The pyramid · flakiness as a **policy** problem · CI vs delivery vs deployment · code review · technical debt · waterfall vs agile · what Scrum really says about a Sprint · estimation · delegation and the situational questions |

## Drilling

| Note | What is in it |
|---|---|
| **[[Interview Questions]]** | The whole question bank, ~110 questions across 12 areas, each with a one-line answer and a link to the depth. **Start here when revising.** |
| **[[Vocabulary Drill]]** | The 20 pairs of words that get swapped under pressure · the four-beat answer skeleton · the six recurring traps, ranked |

---

# How to use this

**Before an interview**, in this order:

1. **[[Vocabulary Drill]]** — ten minutes. The pairs are where points get lost, and they are the cheapest to fix.
2. **[[Interview Questions]]** — cover the answer column, answer out loud, follow the link on anything you half-knew.
3. The topic note for whatever the role actually asks for.

**The rule that matters**: recognising an answer is not retrieving it. If it did not come out of your mouth, you do not have it yet.

**The four beats** for any technical answer:

> **1. Definition → 2. Mechanism one layer below → 3. Trade-off / failure mode → 4. When I would NOT do it, and how I measure it.**

Beat 2 is what separates a mid answer from a senior one. Beat 4 is the one almost nobody reaches.

---

# Conventions in these notes

| Callout | Means |
|---|---|
| `[!question] Short answer for the interview` | Memorise this. It is the answer, out loud, in the words to use |
| `[!important]` | The mechanism, or the sentence the whole answer stands on |
| `[!danger]` / `[!warning]` | A trap, a footgun, or a fact that is counter-intuitive and true |
| `[!tip]` | The seniority signal — the thing that upgrades a correct answer |
| `# Still to study` | Open gaps, per note. Not a backlog of errors — a list of topics not written yet |

---

# Roadmap — what is not written yet

From the Level Up plan for Senior Software Engineer. Checked items have a note; unchecked ones do not exist yet. Each note also carries its own `# Still to study` section with the finer-grained gaps.

## Covered

- [x] **JavaScript** core, async, closures, prototypes → [[JavaScript]]
- [x] **TypeScript** type system and the boundary → [[TypeScript]] · [[TypeScript Boundary]]
- [x] **ReactJS** hooks, re-renders, rendering strategies → [[React]]
- [x] **CSS** layout: flexbox and grid → [[CSS]]
- [x] **Software Design**: patterns, SOLID, composition → [[Design Patterns]]
- [x] **Web Performance Analysis and Optimization** → [[Browser Platform]]
- [x] **Frontend Web Accessibility** — focus management, the audit loop → [[Browser Platform#3. Accessibility and focus management]]
- [x] **Common security knowledge** — XSS, CSRF, tokens, CSP → [[Security]]
- [x] **Software Engineering Practices** — testing, CI/CD, review, estimation → [[Testing and Process]]
- [x] **Work methodologies** — Scrum, waterfall, the situational questions → [[Testing and Process]]
- [x] **Browser APIs** — partially: `AbortController`, observers, `<dialog>`, Web Locks appear where they are used

## Not written yet

**Platform and browser**
- [ ] **HTML** — semantics, forms, metadata, the elements that replace a `div` with ARIA
- [ ] **CSS** beyond layout — box model, specificity and the cascade, units, positioning, stacking contexts, container queries, logical properties, custom properties ([[CSS#Still to fill]])
- [ ] **Browser APIs** in their own right — storage, `IntersectionObserver` / `ResizeObserver` / `MutationObserver`, History, Clipboard, File, Notification
- [ ] **Web Communication Protocols** — HTTP/2 and HTTP/3, WebSocket, SSE, long polling, gRPC-web
- [ ] **PWA** — manifest, Service Worker lifecycle, offline, install, push
- [ ] **Cross-browser compatible markup** — progressive enhancement, feature detection, what a polyfill costs

**Tooling and ecosystem**
- [ ] **JavaScript Development Tools** — bundlers (Vite, esbuild, Rollup, webpack), what tree shaking actually needs, source maps, monorepo tooling
- [ ] **CSS Preprocessors** — Sass, and what native CSS nesting made obsolete
- [ ] **CSS Methodologies** — BEM, utility-first, CSS modules, CSS-in-JS and why it moved to zero-runtime
- [ ] **CSS Frameworks** — Tailwind, and the design-token argument
- [ ] **Content Management Systems** — headless CMS, the preview problem, content modelling

**Other frameworks**
- [ ] **Angular** — DI, RxJS, signals, change detection, standalone components
- [ ] **VueJS** — the reactivity proxy, composition API, Nuxt
- [ ] **JavaScript Top Frameworks** — Svelte and Solid: compile-time reactivity and signals, and what they prove about the VDOM
- [ ] **Web Application Rendering Strategies** in depth — islands, partial and progressive hydration, RSC ([[React#The rendering strategies in one line each]] is the one-liner version)

**Backend-adjacent**
- [ ] **Node.js** and **Node.js Core** — streams, `cluster`, worker threads, `perf_hooks`, the module systems
- [ ] **Web Application Hosting** — CDN, edge functions, containers, CI deploys, blue-green and canary
- [ ] **Cloud Fundamentals** — the service model, IAM, object storage, managed databases, cost
- [ ] **JavaScript Cross-Mobile Platform** — React Native, the bridge and the new architecture, Expo

**Architecture and engineering**
- [ ] **Event-driven architecture**, messaging and integration patterns
- [ ] **Micro-frontends** — module federation, the shared-dependency problem, when the cost is worth it
- [ ] **Compound components** — the composition pattern still missing from these notes
- [ ] **Cross-cutting concerns** across a whole solution
- [ ] **Software Engineering Knowledge & Experience** — observability, incident process, DORA metrics ([[Testing and Process#Still to study]])

**Other**
- [ ] **Gen AI Assisted Development** — what to delegate, review discipline, and the failure modes
- [ ] **English B2+** — the interview vocabulary itself, and rehearsing the behavioural answers out loud

---

# Assets

`attachments/` — 32 screenshots used by [[CSS]] (`flex-01` to `flex-04`, `grid-01` to `grid-28`). Referenced with the short form `![[grid-01.png]]`, which Obsidian resolves by filename anywhere in the vault.

`_archive/` — the mock-interview sessions and the generator prompt that produced these notes. Kept for provenance, not for study. [[Study prompt]] is the live one.
