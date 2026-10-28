---
title: Assessment Plan
tags:
  - plan
  - assessment
source: "Level Up → My plans → [Assessment] Senior Software Engineer (JavaScript, Frontend)"
assessed: 2026-09-25
extracted: 2026-10-20
status: in progress
---

# Assessment Plan — Senior Software Engineer (A3)

The study plan for the next A2 → A3 assessment, **self-contained**: everything needed to study each topic is on this page. The only links go to the **retos** — hands-on challenges in `Retos/` where a topic is learnt step by step: predict → break → fix → client case → say it out loud.

Built from two sources:

- **The Level Up development plan** generated after the 2026-09-25 assessment: 20 items — 1 required skill, 2 recommended skills, 6 resources, and feedback on 11 skills already at level.
- **The transcript of that assessment** (the session log `2026-09-25 Assessment Transcript` in `Sesiones/`): the 40 questions the panel actually asked. The plan says *what* is missing; the transcript says *how it gets asked*. Timestamps below point into it.

> [!important] What the committee reviews next time
> Progress on the **Improve required skills** item — TypeScript, the only tracked one — plus the attached materials and the written **Development Justification** for each item. The recommended skills and the feedback are not tracked, but they are where the next panel will dig. An item is closed with **evidence**: a finished reto, a justification text — not with "I read about it".

---

# The plan at a glance

| Item                               | Plan section | Assessed → target           | What the committee wants to see                                                                                                      | Topic · reto                                                 |
| ---------------------------------- | ------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| **TypeScript**                     | **Required** | Intermediate → **Advanced** | Union and discriminated unions, conditional and mapped types, `infer`, generics, declaration merging, tsconfig and module resolution | 1 · [[03 TypeScript unions and a typed API client\|Reto 03]] |
| **Browser APIs**                   | Recommended  | Intermediate → Advanced     | Critical rendering path, feature detection and fallbacks, memory and performance of API-heavy features                               | 2, 10 · [[04 Critical rendering path\|Reto 04]]              |
| **Software Engineering Practices** | Recommended  | Intermediate → Advanced     | Test pyramid, FIRST, Git workflows, performance testing, design reviews, AI evaluation in the pipeline, deployment strategies        | 4, 8 · Retos 06 and 09                                       |
| Critical Rendering Path            | Resource     | —                           | web.dev/critical-rendering-path                                                                                                      | 2 · [[04 Critical rendering path\|Reto 04]]                  |
| WebSockets vs Long Polling         | Resource     | —                           | ably.com/topic/websockets-vs-long-polling                                                                                            | 3 · [[05 Polling, SSE and WebSockets\|Reto 05]]              |
| Test Pyramid                       | Resource     | —                           | martinfowler.com/bliki/TestPyramid.html                                                                                              | 4 · [[06 Test pyramid and FIRST\|Reto 06]]                   |
| FIRST Principles                   | Resource     | —                           | medium.com/@tasdikrahman/f-i-r-s-t-principles-of-testing-1a497acda8d6                                                                | 4 · [[06 Test pyramid and FIRST\|Reto 06]]                   |
| SOLID in depth                     | Resource     | —                           | engineering.dept.global/guide-solid-principles                                                                                       | 5 · [[07 SOLID by refactoring\|Reto 07]]                     |
| How to delegate a half-done task   | Resource     | —                           | juliofalbo.medium.com/beyond-the-one-pager-a-staff-engineers-guide-to-effective-delegation-f3abc084e65f                              | 6 · [[10 Hand-off and hard conversations\|Reto 10]]          |
| JavaScript                         | Feedback     | Advanced = target           | Prototypes, execution context, event loop, ES module composition                                                                     | 14                                                           |
| JavaScript Top Frameworks          | Feedback     | Advanced = target           | When Vue vs React vs Angular, with technical reasons                                                                                 | 9                                                            |
| Design patterns                    | Feedback     | Intermediate = target       | DI/IoC used consistently, GoF breadth, composing patterns                                                                            | 5 · [[07 SOLID by refactoring\|Reto 07]]                     |
| Leadership                         | Feedback     | Novice = target             | Leadership across more than one team                                                                                                 | 11                                                           |
| Software Design                    | Feedback     | Advanced = target           | Name the pattern when describing a design; SOLID; architecture diagrams                                                              | 5 · [[07 SOLID by refactoring\|Reto 07]]                     |
| SE Knowledge & Experience          | Feedback     | Advanced = target           | Algorithms and data structures, DB query optimisation, network troubleshooting, containers                                           | 13                                                           |
| Web Communication Protocols        | Feedback     | Intermediate = target       | Long polling vs WebSockets trade-offs, header and caching diagnosis, HTTP/2 beyond "more connections"                                | 3 · [[05 Polling, SSE and WebSockets\|Reto 05]]              |
| Conflict management                | Feedback     | Intermediate = target       | How to push for the best decision in the end                                                                                         | 11 · [[10 Hand-off and hard conversations\|Reto 10]]         |
| Delegation                         | Feedback     | Novice = target             | KT session, done vs pending, expectations, support                                                                                   | 6 · [[10 Hand-off and hard conversations\|Reto 10]]          |
| Gen AI Assisted Development        | Feedback     | Intermediate = target       | Chunking and overlap, embedding models, how vectors are used, RAG beyond docs, evals                                                 | 7 · [[08 RAG and agents from scratch\|Reto 08]]              |
| ReactJS                            | Feedback     | Advanced = target           | Custom hooks and HOCs, VDOM/Fiber, code splitting and build optimisation, security                                                   | 12                                                           |

Two things the plan does not list but the panel recorded: the reviewers before the assessment rated **communication 3/5** while everything else was 4–5, and several questions had to be repeated before the term was recognised (pyramid, long polling, RAG, quality gates, hand-off). Section 15 is about that.

---

# Priority order

**Tier 1 — tracked; must be closed with evidence**
1. TypeScript

**Tier 2 — asked by the panel and not answered; they will be asked again**
2. Critical rendering path
3. Polling, SSE, WebSockets; HTTP/1.1 vs 2 vs 3
4. Test pyramid and FIRST
5. SOLID, and naming patterns
6. Handing off a half-done task
7. Gen AI: agents, skills, subagents, MCP, RAG, evals
8. Quality gates, ADRs, Git workflows, deployments

**Tier 3 — feedback on skills already at level; the follow-ups a panel chains**
9. Angular vs Vue vs React
10. Browser APIs: feature detection, memory, storage, observers
11. Conflict, feedback, explaining, leadership
12. React: re-renders, rendering strategies, micro-frontends, internals
13. Software engineering knowledge
14. JavaScript internals

**Every day** — 15. English and answer structure. Plus 16, security and accessibility answers that came up in the transcript.

---

# 1. TypeScript — Tier 1

**Why.** Assessed Intermediate, target Advanced. The committee's first line: the union type was not explained. Gaps: conditional types, mapped types, `infer`; tsconfig, module resolution and build settings; generics, discriminated unions and declaration merging in production code.

**The panel's question** (00:12:09, follow-up 00:13:29): *"An endpoint returns different shapes depending on status — or user data with or without bookings depending on a parameter. Model it so developers are forced to handle every case — at compile time, not at runtime."*

**What a complete answer covers**
- A **union** `A | B` is a value that is one of its members; you can use only what they share until you **narrow** it. An **intersection** `A & B` has every property of both.
- A **discriminated union**: every member carries a field with a different **literal type** (`status: 'ok' | 'error' | 'not_found'`). Comparing that field narrows the union to one member, so inside `case 'ok'` the compiler knows `data` exists.
- **Exhaustiveness**: handle the cases in a `switch`, and in `default` pass the value to `assertNever(x: never)`. Each case removes a member; when all are handled, what is left is `never`. A new status makes that call stop compiling — at every handler that forgot it.
- **A return type that depends on a parameter**: function **overloads** (clear, no cast), or a generic with a **conditional type** `B extends true ? UserWithBookings : User` (scales, but the implementation needs a cast; with a plain `boolean` it distributes to a union).
- **The boundary**: types are erased, so the JSON is also **parsed at runtime** — usually a Zod `discriminatedUnion`, with the type inferred from the schema so they can't drift. Union first, runtime validation second: validation complements the model, it doesn't replace it.
- **The Advanced vocabulary**: `infer` captures part of a type inside a conditional (`ReturnType`, `Awaited` are built with it); **mapped types** loop over keys (`Partial`, `Record`), with **key remapping** via `as` and template literal types; `Extract` picks union members; **declaration merging** works on `interface` (not `type`), which is how you augment `Window` or a library.
- **tsconfig**: `strict` (strictNullChecks, noImplicitAny, …), plus `noUncheckedIndexedAccess` (index access includes `undefined`) and `exactOptionalPropertyTypes`; `moduleResolution: "bundler"` when a bundler resolves imports, `"nodenext"` when the output runs directly in Node.

> [!question] Short answer for the interview
> "A discriminated union with a literal `status` on every member, handled in a `switch` with a `never` check in `default` — so a new status is a compile error everywhere it's not handled. And because types are erased, a Zod discriminated union at the boundary parses the real JSON, with the type inferred from the schema."

**Reto:** [[03 TypeScript unions and a typed API client]] — builds all of it on one API client, and is the artifact to attach in Level Up.

**Done when**
- [ ] Reto 03 finished, levels 0–6.
- [ ] The 00:12:09 question answered out loud in under two minutes.
- [ ] Development Justification written in Level Up, with the reto attached.

---

# 2. Critical rendering path — Tier 2

**Why.** A resource, and a Browser APIs gap: the principles and optimisation strategies were not given.

**The panel's question** (00:41:08, again at 00:42:28): *"What is the critical rendering path, and how can you optimise it for high-traffic web applications?"*

**What a complete answer covers**
- **Definition**: the steps from the first byte of HTML to the first pixels — HTML → **DOM**, CSS → **CSSOM**, both → **render tree**, **layout**, **paint**, composite.
- **What blocks it**: CSS is **render-blocking** (no paint without the CSSOM). A classic `<script>` is **parser-blocking**, and it also waits for the stylesheets before it.
- **Three levers**: fewer critical resources, fewer critical bytes, a shorter critical path (fewer round trips in a row).
- **Tactics**: server-render or statically generate the first screen; put the LCP image in the HTML with `fetchpriority="high"`; inline critical CSS and load the rest non-blocking; `defer` (runs after parsing, in order, before `DOMContentLoaded`) or `async` (runs on arrival, any order); `preload` for late-discovered critical assets; `preconnect` to the CDN and font hosts; `font-display: swap`; compression and a CDN.
- **Not to confuse**: `prefetch` is for the **next** navigation; it does not help the current page.
- **Measure**: FCP and LCP in Lighthouse and the Performance panel; field data from real users; a performance budget in CI so it doesn't regress.

> [!question] Short answer for the interview
> "It's the path from HTML bytes to first pixels: DOM, CSSOM, render tree, layout, paint. CSS blocks rendering and classic scripts block parsing, so I cut the number of critical resources, their bytes and the round trips: server-rendered first screen with the LCP image in the HTML, inline critical CSS, every script deferred, `preconnect` to the CDN. I check it with Lighthouse and field data, and a performance budget in CI keeps it from regressing."

**Reto:** [[04 Critical rendering path]] — blocking, fixed and late-hero pages with measured FCP and LCP.

**Done when**
- [ ] Reto 04 finished.

---

# 3. Polling, SSE, WebSockets; HTTP versions — Tier 2

**Why.** The resource "WebSockets vs Long Polling"; Web Communication Protocols feedback: confusion between long polling and WebSockets in trade-offs, no header or caching diagnosis, HTTP/2 explained only as "more simultaneous connections".

**The panel's questions**: 00:52:27 *"When would you use a long polling strategy over a web socket, and what would you take into consideration?"* · 00:55:44 *"HTTP/1.1 vs HTTP/2 — what were the improvements?"*

**What a complete answer covers**
- **Short polling** asks every N seconds; **long polling** holds each request until there is data or a timeout, then the client asks again; **SSE** is one long HTTP response the server streams events into (server → client only, reconnects and resumes with `Last-Event-ID`); a **WebSocket** is one upgraded connection, both directions, and you write the reconnection.
- **Long polling wins** for low-frequency updates, behind proxies and firewalls that break WebSockets, and when you want stateless HTTP (normal auth, any instance behind any load balancer); it is also the classic fallback.
- **A WebSocket wins** for bidirectional, high-frequency, latency-sensitive traffic — chat, collaboration. Its cost: a stateful connection per client, so sticky sessions or a pub-sub backplane, heartbeats, reconnection with backoff and jitter.
- **For one-way notifications**, SSE is usually the right default.
- **Upload progress** is `XMLHttpRequest`'s `upload.onprogress`; `fetch` has no upload progress events.
- **HTTP/1.1** carries one request at a time per connection, so browsers open about six per host and queue the rest. **HTTP/2**: one connection with **multiplexed** binary streams, **HPACK** header compression, stream prioritisation; server push was removed from Chrome in 2022 (`103 Early Hints` replaced it). **HTTP/3**: the same over **QUIC** on UDP, so a lost packet stalls only its own stream (no TCP head-of-line blocking), with a faster handshake.
- **Diagnosing headers and caching in production**: DevTools Network (Protocol column, timing, `Cache-Control`, `ETag`, `Vary`, `Age`), `curl -I`, and comparing what the CDN returns with what the origin returns.

> [!question] Short answer for the interview
> "Long polling is the client asking and the server holding the request until there's news or a timeout. It beats a WebSocket when updates are infrequent, when proxies break WebSockets, and when I want plain stateless HTTP behind any load balancer — notifications are the classic case. For one-way streams I'd usually go to SSE, which reconnects and resumes by itself. I keep WebSockets for bidirectional, high-frequency traffic, because each client is a stateful connection I have to scale."

**Reto:** [[05 Polling, SSE and WebSockets]] — the same feed four ways, upload progress, and the six-connection limit seen live.

**Done when**
- [ ] Reto 05 finished.

---

# 4. Test pyramid and FIRST — Tier 2

**Why.** Two resources, and Software Engineering Practices gaps: no mention of the pyramid, FIRST not known.

**The panel's questions**: 00:51:17 *"FIRST principles in testing?"* · 00:51:39 *"the testing pyramid?"* · 00:30:25 *"after the Cypress migration, how did you decide which tests should be unit, component, integration or end-to-end?"*

**What a complete answer covers**
- **FIRST** (Ottinger and Langr): **F**ast, **I**ndependent (no shared state, no order dependence), **R**epeatable (no real clock, randomness or live server), **S**elf-validating (passes or fails by itself), **T**imely (written with the code; some versions say **T**horough).
- **The pyramid** (Mike Cohn; Martin Fowler): many unit tests, fewer integration tests, few end-to-end tests — because going up, tests get slower, flakier, more expensive and worse at locating the bug.
- The **ice-cream cone** is the inverted anti-pattern; the **testing trophy** (Kent C. Dodds) is the frontend variant with static analysis at the base and the thickest layer in integration.
- **Cypress component tests** sit in the middle: one real component in a real browser, dependencies mocked.
- **The fix for untestable code** is to inject what it reaches for — the clock, the network, the randomness — as parameters with defaults, or to control it with fake timers and a mocked `fetch`.

> [!question] Short answer for the interview
> "FIRST is what makes a unit test worth having: fast, independent, repeatable, self-validating, and written in time with the code. The pyramid is about where tests go: many fast unit tests, fewer integration tests, a few end-to-end tests for the critical journeys, because the higher you go the slower, flakier and less precise a test gets."

**Reto:** [[06 Test pyramid and FIRST]] — a suite that breaks every letter, fixed; twelve tests placed on the pyramid; the Cypress story retold.

**Done when**
- [ ] Reto 06 finished.

---

# 5. SOLID, and naming patterns — Tier 2

**Why.** The resource "SOLID in depth"; Software Design feedback: gaps in SOLID, and no design patterns named when describing solution design; Design Patterns feedback: DI/IoC not used consistently, little GoF breadth.

**The panel's question** (00:49:36): *"Explain the SOLID principles, briefly."* And 00:26:29: *"an architectural decision you influenced — the alternatives, and why yours was preferred."*

**What a complete answer covers**
- **S**ingle responsibility — one reason to change (hooks for data, pure functions for rules, components that render). **O**pen/closed — extend without modifying (a strategy map instead of a growing `switch`). **L**iskov substitution — a subtype works wherever its parent does (never throw on what the parent supports). **I**nterface segregation — don't depend on what you don't use (small props, composition). **D**ependency inversion — depend on abstractions that the high-level code owns (an injected payment gateway).
- **Inversion vs injection vs IoC**: inversion is the principle, injection is the technique (constructor, parameter, props, context), IoC is the framework calling your code and supplying dependencies (Angular's DI container).
- **Pattern names inside your stories**: the legacy-brand interceptor was a **proxy / middleware** with a **strangler-fig** migration; the universal profile is a **facade** with configuration over code; cloud-agnostic storage is an **adapter** behind an interface; payment methods are a **strategy**.

> [!question] Short answer for the interview
> "Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion. In frontend terms: hooks for data, pure functions for rules, components that only render; strategy maps instead of growing switches; subtypes that never throw on what the parent supports; small composable components instead of fat props; and services that receive their dependencies, so a test passes a fake."

**Reto:** [[07 SOLID by refactoring]] — one refactor per letter, verified with tests, and three stories retold with pattern names.

**Done when**
- [ ] Reto 07 finished.

---

# 6. Handing off a half-done task — Tier 2

**Why.** The resource on delegating a half-done task; Delegation feedback: prerequisites mentioned, but not how to delegate — no done vs pending, no KT session, no expectations or support.

**The panel's question** (01:14:03): *"You're 60% through a feature and a production-critical bug needs you. Hand the feature to a junior engineer."*

**What a complete answer covers**
1. **A written hand-off**: goal and acceptance criteria; branch and state; **done**; **pending** as sized sub-tasks; **decisions and why**; **traps**; how to run and test; deadline and **level of autonomy**; who to ask.
2. **A short KT session** where the junior drives — runs it and explains it back.
3. **Expectations**: deadline, check-ins, what they decide alone.
4. **Support**: when you're reachable during the incident, who else can help, a first check-in the next morning, PR review.
5. **Close the loop**: tell the PM the owner changed and what that means for the date, with a plan B ready.

> [!question] Short answer for the interview
> "A written hand-off in the ticket — goal, branch, what's done, what's pending as sized sub-tasks, the decisions not to undo, the traps, how to run it, the deadline and what they can decide alone. Then a short KT call where they drive. Then a check-in the next morning, when I'm reachable during the incident, and who else can help. And I tell the PM the owner changed and what that means for the date."

**Reto:** [[10 Hand-off and hard conversations]], levels 0–3.

**Done when**
- [ ] Reto 10 levels 0–3 finished.

---

# 7. Gen AI assisted development — Tier 2

**Why.** Feedback gaps: chunks and chunk overlap; RAG only mentioned as document storage; embedding models and how vectors are used; evals. Four of the six positions in `Vacantes/` also ask for Gen AI.

**The panel's questions**: 00:19:28 agent vs prompt · 00:21:43 skills · 00:23:27 subagents · 00:25:01 MCP · 00:45:34 prompt structure · 00:47:15 RAG under the hood · 01:08:28 AI pointed you the wrong way · 01:10:46 checking AI outside your expertise · 01:12:25 when not to use AI.

**What a complete answer covers**
- **Agent vs prompt**: a prompt is one request and one response; an agent is a loop — the model calls a tool, the program runs it, the result goes back, until an answer or a step limit.
- **Skills**: packaged instructions loaded only when the task matches; worth it when a procedure repeats or must be shared and versioned. **Subagents**: a clean context for a self-contained, noisy sub-task; only the summary comes back. **MCP**: an open protocol where servers expose tools, resources and prompts to any client — N×M integrations become N+M.
- **RAG**: chunk the documents (size and **overlap**, ideally split on structure) → **embed** each chunk with an embedding model (a vector where similar meaning is close) → store in a vector DB → embed the question → retrieve top-k by **cosine similarity** (hybrid with keywords, plus a reranker) → prompt with "answer only from these sources, cite them, say you don't know" → generate. Uses beyond docs: support bots, code search, product search, grounding agents.
- **Evals**: a golden set; retrieval **recall@k**; answer **faithfulness**; deterministic checks, LLM-as-judge calibrated by people; run in CI on every prompt, model or chunking change.
- **When not to use AI**: data policy forbids it; you need to understand the thing yourself; a confident wrong answer is expensive and hard to verify.
- **A real story** for "AI pointed you the wrong way", with the signal you noticed and what you changed afterwards.

> [!question] Short answer for the interview — RAG
> "RAG grounds a model in documents it wasn't trained on. Index once: chunk the documents with overlap, embed each chunk, store the vectors. Per question: embed it, retrieve the nearest chunks by cosine similarity — usually hybrid with keywords and a reranker — and give them to the model with instructions to answer only from them and cite them. Then I measure it: retrieval recall on a golden set and answer faithfulness, in CI on every change."

**Reto:** [[08 RAG and agents from scratch]] — a RAG pipeline in ~150 lines with a measured eval (toy embeddings 7/9, real embeddings 9/9), and an agent loop.

**Done when**
- [ ] Reto 08 finished, including your own "AI was wrong" story.

---

# 8. Quality gates, ADRs, Git workflows, deployments — Tier 2

**Why.** Recommended skill, Intermediate → Advanced: Git workflows (hooks, tags, pruning), performance testing, design reviews, AI code evaluation in the pipeline, deployment strategies.

**The panel's questions**: 00:28:44 *"document the move to Kafka so a later engineer understands why"* · 00:35:00 *"quality gates before a PR can be merged"* · 00:57:23 *"code-quality tools and their impact"* · 00:58:33 *"handle and distribute technical debt"*.

**What a complete answer covers**
- **Quality gates** are blocking, ordered cheapest first: lint → type-check → unit and component tests (coverage on changed lines) → SonarQube gate → dependency and secret scan → build → e2e smoke on a preview → bundle and performance budget → required review, under **branch protection**. Hooks (Husky + lint-staged) give fast local feedback but can be skipped, so they are not the gate.
- **ADRs** in the repository: context, decision, alternatives, consequences; never edited, superseded by a newer ADR. Big changes go through an **RFC / design review** first.
- **Git**: trunk-based with feature flags for continuous delivery, or GitFlow for scheduled versioned releases; **tags** with semantic versioning mark releases.
- **Deployments**: rolling, **blue-green** (instant switch back), **canary** (a small share first, automatic rollback on metrics), **feature flags** (separate deploy from release); **expand and contract** for schema changes.
- **AI in the pipeline**: AI review as a first pass, not a gate; evals with thresholds for AI features.
- **Technical debt**: a debt epic with the cost of not fixing each item, a fixed share of every sprint (often 15–20%) assigned in planning, the boy-scout rule, and big debt as its own project.

> [!question] Short answer for the interview — quality gates
> "Cheapest first and all blocking: lint, types, unit and component tests with coverage on changed lines, Sonar, dependency and secret scans, the build, e2e smoke on a preview, a performance budget — as required checks under branch protection, plus a human review for what tools can't judge. Then a canary rollout with automatic rollback."

**Reto:** [[09 Quality gates, ADRs and deployments]] — a gate chain built and broken gate by gate (one error only the build catches), a CI file, an ADR, five deployment decisions.

**Done when**
- [ ] Reto 09 finished.

---

# 9. Angular vs Vue vs React — Tier 3

**Why.** Frameworks feedback: explain better when to use Vue vs React vs Angular, with the technical strengths and weaknesses of Angular and Vue.

**The panel's questions** (01:05:13, 01:06:19, 01:07:46): *"How would you decide which framework to use? You and a tech lead define the stack — how? In which scenario would you choose Vue?"*

**Start with the criteria, not the framework**: the team's skills and the hiring market; the size and lifespan of the app; how much structure the organisation needs; rendering needs (SSR, SEO); ecosystem needs (mobile with React Native, component libraries); and the code that already exists.

| | Angular | Vue | React |
|---|---|---|---|
| **What it is** | A complete, opinionated **framework** | A **progressive** framework | A UI **library** |
| **Comes with** | Router, forms (template and reactive), HttpClient, DI, CLI, testing setup | Router (Vue Router), state (Pinia), CLI tooling (Vite) — official, but optional | The view layer; routing, data and state come from the ecosystem |
| **Reactivity** | **Signals** (since v16), RxJS observables for streams; change detection moving from zone.js to zoneless | Proxy-based `ref` / `reactive`: dependencies tracked per property, so updates are fine-grained with no manual memoising | State changes re-render the component subtree; memoisation (or the React Compiler) limits it |
| **Templates** | HTML templates with Angular syntax, TypeScript-first | HTML-based templates in single-file components (`.vue`), compiled and optimised | JSX — JavaScript all the way down |
| **Full-stack / SSR** | Angular SSR (formerly Universal) | Nuxt | Next.js, Remix; Server Components |
| **Strengths** | One way of doing things across a large org; DI and strong typing scale to big teams; batteries included | Gentle learning curve; can be dropped into an existing server-rendered page and grow from there; fine-grained reactivity by default | Largest ecosystem and hiring pool; React Native; most flexibility |
| **Costs** | Steeper learning curve, more ceremony, major-version upgrades to plan | Smaller enterprise and hiring pool than React | Decision fatigue — consistency depends on the team's own conventions |

**When each one**
- **Angular**: a large enterprise application, many teams, long lifespan, where consistency and built-in structure matter more than flexibility — banking, internal platforms, heavy forms.
- **Vue**: adding interactivity progressively to an existing server-rendered app (Laravel, Rails, Django) without a rewrite; a small or mixed team that needs to be productive quickly; template-centric teams coming from HTML.
- **React**: when you need the ecosystem, React Native for mobile, Next.js for SSR, or the hiring market — and the team has the discipline to set its own conventions.

> [!question] Short answer for the interview
> "I'd start from the team and the product, not the framework: who we can hire, how big and long-lived the app is, how much structure we need, SSR and mobile needs. Angular is a full opinionated framework — DI, forms, router, RxJS and signals — that pays off for large enterprise teams that need one way of doing things. Vue is progressive: I'd choose it to add interactivity to an existing server-rendered app without a rewrite, or for a small team that needs to be productive fast; its proxy-based reactivity is fine-grained by default. React gives the biggest ecosystem, React Native and Next.js, at the cost of making more decisions ourselves."

**Done when**
- [ ] The "you and the tech lead choose" answer said out loud, criteria first, under two minutes.

---

# 10. Browser APIs — Tier 3

**Why.** Recommended skill: limited evidence of systematic feature detection and fallbacks across engines; no examples of memory and performance management for API-heavy features.

**Feature detection and fallbacks**
- Detect the **feature**, never the browser: `'IntersectionObserver' in window`, `CSS.supports('display: grid')`, `@supports (container-type: inline-size)` in CSS, `typeof navigator.share === 'function'`.
- **Progressive enhancement**: the core works with the baseline (a form posts, a link navigates); richer APIs layer on top when detected.
- **Polyfills** cost bytes and parse time for everyone — load them **conditionally** (`if (!('IntersectionObserver' in window)) await import('intersection-observer')`), and check real support data (Baseline, caniuse) before adding one.

**Memory and performance in API-heavy features**
- **Remove what you add**: event listeners (pass `{ signal }` from an `AbortController` and abort once), `observer.disconnect()`, `clearInterval`, `URL.revokeObjectURL()`, closing sockets and `EventSource`s on unmount.
- **3D and media**: Three.js geometries, materials, textures and the renderer must be `.dispose()`d — the GPU memory is not garbage-collected with the JavaScript object.
- **Off the main thread**: Web Workers for heavy computation (parsing a scan, image processing), with **transferable** objects (`ArrayBuffer`) to avoid copying; `OffscreenCanvas` to render in a worker.
- **Caches that don't leak**: `WeakMap` keyed by objects lets entries disappear with their keys.
- **Long work in slices**: yield to the browser between chunks (`scheduler.yield()` where available, `setTimeout` otherwise) so input stays responsive.
- **Prove it**: DevTools Memory → heap snapshot before and after, compare, and look for **detached DOM nodes** and growing arrays; Performance panel for long tasks.

**The observers**: `IntersectionObserver` (visibility — lazy loading, infinite scroll, analytics impressions; replaces scroll listeners plus `getBoundingClientRect`), `ResizeObserver` (an element's size; replaces `window.resize` for component-level layout), `MutationObserver` (DOM changes; replaces the deprecated mutation events).

**Storage**: cookies (small, sent with every request; `HttpOnly` for session), `localStorage` (synchronous, about 5 MB, strings only — blocks the main thread), `sessionStorage` (per tab), **IndexedDB** (asynchronous, large, structured — for offline data), the **Cache API** (request/response pairs, with Service Workers); `navigator.storage.estimate()` for quotas.

**Done when**
- [ ] One example of each — feature detection, cleanup, a worker — explained out loud using the 3D viewer at Johnson & Johnson as the case.

---

# 11. Conflict, feedback, explaining, leadership — Tier 3

**Why.** Conflict feedback: has not mentioned how to push for the best decision in the end. Leadership feedback (at target): limited evidence across multiple teams.

**The panel's questions**: 00:37:24 a disagreement with a senior developer — and was your solution chosen? · 01:19:57 tough feedback · 01:21:50 repeated under-delivery · 01:23:42 explaining to a non-technical PO · 01:25:20 the PO who quotes ChatGPT.

**What a complete answer covers**
- **Pushing to a decision**: agree on the criteria first; replace opinions with evidence (a time-boxed spike, benchmarks); name a decision owner and a deadline; if still split, write both options down for the owner; then **disagree and commit**, and record it in an ADR. And say the **outcome**.
- **Feedback** with SBI — situation, behaviour, impact — then a question and an agreement; the second time it is a pattern, so closer follow-up, a lower delegation level, and the manager involved.
- **Explaining to non-technical people**: what the user sees → why, in one everyday sentence → what we change → why it costs what it costs; then check understanding.
- **The PO and ChatGPT**: take it seriously and verify it against the real constraints (compatibility, security, licence, maintenance); present options with their trade-offs; let the PO choose scope; escalate with the written comparison only if it's unsafe.
- **Every behavioural answer** is a STAR story — situation, task, action, **result** — not a description of a process.
- **Leadership beyond one team**: a cross-team initiative you led (the accessibility fixes, the test migration), with how you got other teams to adopt it.

**Reto:** [[10 Hand-off and hard conversations]], levels 4–8 — scripts for each conversation and a bank of five stories.

**Done when**
- [ ] Reto 10 levels 4–8 finished.

---

# 12. React — Tier 3

**Why.** ReactJS feedback (at target): advanced reuse patterns (custom hooks, HOCs), VDOM/reconciliation and Fiber, build optimisation and code splitting, deeper security.

**The panel's questions**: 00:10:12 *one change to global state re-renders hundreds of components — investigate and fix* · 00:39:53 *why hydration is critical in SSR* · 00:17:28 *SSR vs SSG vs CSR in Next.js* · 00:42:56 *micro-frontends, pros and cons*.

**Re-renders from global state (00:10:12)**
- **Investigate first**: React DevTools → Profiler, record the interaction, and read *why did this render* per component; "Highlight updates when components render" to see the blast radius.
- **The three causes** of a re-render: its own state changed, its parent re-rendered, or a **context it consumes** changed.
- **The usual culprit**: one big context whose `value` is a new object on every render — every consumer re-renders.
- **Fixes, in order**: split the context (state and dispatch apart; by domain); memoise the provider `value`; move state down to where it's used; use a store with **selectors** (Zustand, Redux `useSelector`, `useSyncExternalStore`) so each component subscribes to its slice only; keep server data in a server-state cache (TanStack Query). `React.memo` / `useMemo` / `useCallback` last, where the profiler shows it pays; the React Compiler memoises automatically. Redux Saga manages side effects — it doesn't change what re-renders.

**Hydration (00:39:53)**: the server sends HTML so the user sees content early; **hydration** is React, in the browser, attaching its fibers and event handlers to that existing HTML instead of rebuilding it. Until it finishes, the page is visible but not interactive. It requires the first client render to match the server HTML exactly; a mismatch makes React discard and re-render that part. With `Suspense` boundaries, React 18+ hydrates selectively and prioritises what the user interacts with.

**Rendering strategies in the Next.js App Router (00:17:28)**
- **Static (SSG)** by default, built once and served from the CDN — marketing and content pages.
- **ISR** — static, regenerated after `revalidate` seconds or on demand — catalogues and hotel pages that change hourly.
- **Dynamic SSR** per request when the page reads cookies, headers or search params, or uses uncached data — personalised pages that still need SEO.
- **CSR** inside Client Components — dashboards and internal tools behind login, where SEO doesn't matter.
- **Server Components** render on the server and ship no JavaScript for themselves; Client Components (`'use client'`) are server-rendered **and** hydrated.

**Micro-frontends (00:42:56)**
- **How**: build-time (npm packages — simple, but every change needs a release of the host), or runtime (Module Federation, import maps, web components; iframes for hard isolation).
- **Pros**: independent teams and deploys, incremental migration of a legacy app, smaller codebases per team.
- **Cons**: duplicated dependencies and a bigger bundle, version skew of shared libraries (two Reacts), a consistent UX needs a shared design system, cross-app communication (prefer URL, custom events and explicit contracts to shared global state), and more operational work.
- **When**: several teams that need independent release cadences on one product. Not for one team — that is a monolith with extra steps.

**Reuse patterns**: **custom hooks** for stateful logic (`useCartLines`, `useOnline`); **HOCs** still fit cross-cutting wrappers (`withAuth`, analytics); **render props** were mostly replaced by hooks; **compound components** (`<Tabs><Tabs.List/>…`) share implicit state through context; **error boundaries** are still class components.

**Internals in one paragraph**: an **element** is a description; a **fiber** is React's unit of work per component, holding its state and hooks. The **render phase** walks the fiber tree and diffs it (keys identify children across renders) — it is interruptible in concurrent mode, prioritised by **lanes**. The **commit phase** applies the DOM changes synchronously, then runs layout effects, then passive effects. React keeps two trees — `current` and `workInProgress` — and swaps them on commit.

**Build optimisation**: route-based **code splitting** is automatic in Next.js; `next/dynamic` or `React.lazy` + `Suspense` for heavy components (a 3D viewer, a chart); analyse the bundle (`@next/bundle-analyzer`); tree shaking needs ES modules and side-effect-free packages; images through `next/image`; fonts through `next/font`.

**Security**: React escapes text by default; the escape hatches are `dangerouslySetInnerHTML` (sanitise with DOMPurify), user-provided URLs in `href`/`src` (validate the protocol — `javascript:` is an XSS vector), and server-rendered data serialised into the page. Plus CSP (topic 16).

**Done when**
- [ ] The four panel questions answered out loud, each under two minutes.

---

# 13. Software engineering knowledge — Tier 3

**Why.** Feedback (at target): algorithms and data structures, database query optimisation, network troubleshooting, containers. Lowest priority for a frontend A3; one paragraph each is enough.

- **Data structures**: an array lookup by value is O(n); a `Map` or `Set` lookup is O(1) on average — turning a nested `find` inside a loop (O(n·m)) into a `Map` built once (O(n+m)) is the most common real win. Sorting is O(n log n). Know when a tree, a queue or a heap is the natural shape.
- **Databases**: an **index** (a B-tree) turns a full scan into a lookup, at the cost of slower writes; `EXPLAIN` shows whether a query uses it. The **N+1 problem**: one query for a list, then one per item — fix with a join, a batched `IN` query, or a DataLoader. **Pagination**: keyset (`WHERE id > last`) beats `OFFSET` on large tables.
- **Network troubleshooting**: a request goes DNS → TCP → TLS → HTTP, and each fails differently. DevTools → Network → Timing shows where the time went; `curl -v` shows the TLS handshake and headers; `dig` checks DNS. CORS errors are the browser enforcing the server's headers — fixed on the server, never by the client.
- **Containers**: an **image** is the packaged filesystem and command (built from a Dockerfile in cached layers); a **container** is a running instance of it. **Kubernetes** schedules containers into pods, keeps the desired number running (Deployments), exposes them (Services), restarts what fails health checks, and scales on load.

**Done when**
- [ ] Each paragraph said out loud once.

---

# 14. JavaScript internals — Tier 3

**Why.** JavaScript feedback (at target): no explicit evidence of prototype inheritance, execution context or the event loop; few examples of ES module composition.

- **Execution context**: every call creates one. In the **creation phase**, declarations are registered — function declarations fully (hoisted), `var` as `undefined`, `let`/`const`/`class` uninitialised (the **temporal dead zone**) — and `this` and the scope chain are set. Then the **execution phase** runs the code. Contexts stack on the **call stack**.
- **Closures**: a function keeps a reference to the lexical environment where it was created (its `[[Environment]]` slot), so it can read those variables after the outer function returned. That is also how closures leak memory — a long-lived callback keeping a large object alive.
- **The event loop**: run one task (a script, a timer callback, an event); then drain **all** microtasks (promise reactions, `queueMicrotask`); then the browser may render (`requestAnimationFrame` callbacks, style, layout, paint); repeat. So `Promise.resolve().then(a)` runs before `setTimeout(b, 0)`, and an infinite chain of microtasks freezes the page without ever rendering.
- **Prototypes**: every object has a hidden `[[Prototype]]` link; property lookup walks that chain until it finds the property or reaches `null`. `class` is syntax over this: methods live on `Class.prototype`, and `extends` links the prototypes (and the constructors). `Object.create(proto)` makes an object with a chosen prototype.
- **ES modules**: imports are **static** (analysable, so bundlers can tree-shake), **live bindings** (an importer sees the exporter's current value), evaluated **once** and cached, strict mode by default, and they support top-level `await`. `import()` is the dynamic, lazy form — the basis of code splitting. CommonJS (`require`) is synchronous and copies values; mixing the two is where most Node packaging pain comes from.

**Done when**
- [ ] The event-loop order of `console.log`, `setTimeout`, `Promise.then` and `queueMicrotask` predicted and explained out loud.

---

# 15. English and answer structure — every day

The reviewers before the assessment rated communication 3/5. In the transcript it costs points in three ways: terms not recognised by ear, answers that start from an example instead of the definition, and answers that drift to a neighbouring question.

- **Recognise the terms by ear**: pyramid, long polling, RAG, quality gates, hand-off, knowledge transfer, critical rendering path, header compression, chunk overlap, discriminated union. Say each one aloud until hearing it triggers the answer.
- **Restate the question in one line** before answering — "So, how I'd hand it off to a junior…". If unsure, ask once, early: "Do you mean X or Y?"
- **Four beats** on every technical answer: definition → mechanism one layer below → trade-off or failure mode → when not to, and how to measure it.
- **Stories, not processes**, on every behavioural answer — and always reach the result.
- **Ten minutes a day**: one recorded answer from this plan, played back once.

---

# 16. Security and accessibility answers from the transcript

Not plan items, but the panel asked them and they were answered partially.

**SSO and sessions across brands and domains** (00:14:48)
- **Design**: a central **identity provider**; each brand app is an OIDC client using the **authorization code flow with PKCE**. The session lives on the IdP's domain; a brand app redirects there and gets back a code it exchanges for tokens.
- **Cookies**: the app's session in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie. A cookie set for one domain never reaches another (`expedia.com` vs `hotels.com`) — which is why cross-brand SSO goes through redirects to the IdP. Browsers blocking third-party cookies is why silent re-authentication in hidden iframes no longer works reliably.
- **Risks**: **XSS** stealing tokens kept in JavaScript-readable storage (so `HttpOnly` cookies); **CSRF** when sessions ride on cookies (`SameSite`, an anti-CSRF token, checking `Origin`); **open redirects** through `redirect_uri` (exact allowlist); tokens leaking through URLs or logs; and **logout** that must propagate to every brand (front- or back-channel logout).

**Content Security Policy** (00:54:49): a **response header**, `Content-Security-Policy` (or a `<meta>` tag), that tells the browser which sources of scripts, styles, images, connections and frames are allowed. Its main job is to limit **XSS** and data injection: an injected script from an unlisted source, or an inline script without the right **nonce**, does not run. `frame-ancestors` also stops clickjacking. Modern CSP is nonce- or hash-based with `'strict-dynamic'`; `'unsafe-inline'` defeats it. Roll it out with `Content-Security-Policy-Report-Only` first.

**Accessible custom modal** (00:32:05): focus moves **into** the dialog when it opens; focus is **trapped** inside while it's open; **Escape** closes it; focus **returns** to the element that opened it; the background is inert and not reachable by screen readers; the dialog has `role="dialog"`, `aria-modal="true"` and an accessible name from its title (`aria-labelledby`). The native `<dialog>` element with `showModal()` provides most of this — making the rest of the page inert, Escape to close, top-layer rendering — so prefer it to a styled `div`.

**Testing with screen readers** (00:34:12): automated checks (axe, Lighthouse, Testing Library's role queries) catch only part of the problems. The rest needs a real screen reader on the main pairs: **VoiceOver** with Safari on macOS and iOS (`Cmd+F5`), **NVDA** with Chrome or Firefox on Windows, **TalkBack** on Android. Check that every control is announced with its role and name, that focus order makes sense, and that dynamic changes are announced (live regions).

**Done when**
- [ ] SSO, CSP and the accessible modal each answered out loud in under two minutes.

---

# Six-week schedule

About an hour on weekdays and a longer block at the weekend. Every week ends with one `Study prompt.md` session on that week's questions, logged in `Sesiones/`, and with the Level Up items updated (learning materials and justification).

| Week | Focus | Work |
|---|---|---|
| 1 | **TypeScript** (Tier 1) | Reto 03 · TypeScript justification written in Level Up |
| 2 | Browser: rendering and APIs | Reto 04 · topic 10 |
| 3 | Protocols | Reto 05 · topic 16 (SSO, CSP) |
| 4 | Testing, SOLID and practices | Retos 06, 07 and 09 |
| 5 | Gen AI | Reto 08 · topics 9 and 13 |
| 6 | People, React and JavaScript | Reto 10 · topics 12 and 14 · **full replay of the 40 assessment questions** |

**Exit criterion before requesting the next assessment**: the week-6 replay — every question of the transcript answered out loud in the four beats — with Tier 1 and Tier 2 fully checked.

---

# Still to study

- [ ] Write the Development Justification for each Level Up item as it closes — TypeScript first.
