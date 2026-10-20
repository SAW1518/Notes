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

The study plan for the next A2 → A3 assessment. It is built from two sources:

- **The Level Up development plan** the committee generated after the 2026-09-25 assessment. 20 items: 1 required skill, 2 recommended skills, 6 resources, 11 pieces of feedback on skills already at level.
- **[[2026-09-25 Assessment Transcript]]** — the 40 questions the panel actually asked. The plan says *what* is missing; the transcript says *how it gets asked*.

> [!important] What the committee reviews next time
> Progress on the **Improve required skills** items (TypeScript only), plus the attached materials and the written **Development Justification** for each item. The recommended skills and the feedback are not tracked, but they are where the next panel will dig. A plan item is closed with *evidence* — a note, a reto, a justification text — not with "I read about it".

---

# The plan at a glance

| Item | Plan section | Assessed → target | What the committee wants to see | In this vault |
|---|---|---|---|---|
| **TypeScript** | **Required** | Intermediate → **Advanced** | Union and discriminated unions, conditional/mapped types, `infer`, generics, declaration merging, tsconfig and module resolution | Written in [[TypeScript]] — needs drilling and an artifact |
| **Browser APIs** | Recommended | Intermediate → Advanced | Critical rendering path, feature detection and fallbacks, memory/performance of API-heavy features | Partial — CRP and observers are only in `# Still to study` |
| **Software Engineering Practices** | Recommended | Intermediate → Advanced | Test pyramid, FIRST, Git workflows, performance testing, design reviews, AI evaluation in the pipeline, deployment strategies | Partial — pyramid and CI written; the rest missing |
| Critical Rendering Path | Resource | — | web.dev/critical-rendering-path | Missing |
| WebSockets vs Long Polling | Resource | — | ably.com/topic/websockets-vs-long-polling | Missing |
| Test Pyramid | Resource | — | martinfowler.com/bliki/TestPyramid.html | Written |
| FIRST Principles | Resource | — | medium.com/@tasdikrahman/f-i-r-s-t-principles-of-testing-1a497acda8d6 | Missing |
| SOLID in depth | Resource | — | engineering.dept.global/guide-solid-principles | Table only, no examples |
| How to delegate a half-done task | Resource | — | juliofalbo.medium.com/beyond-the-one-pager-a-staff-engineers-guide-to-effective-delegation-f3abc084e65f | Missing (delegation levels are written, the hand-off is not) |
| JavaScript | Feedback | Advanced = target | Prototypes, execution context, event loop, ES module composition | Written in [[JavaScript]] |
| JavaScript Top Frameworks | Feedback | Advanced = target | When Vue vs React vs Angular, with technical reasons | Missing (Angular and Vue on the roadmap) |
| Design patterns | Feedback | Intermediate = target | DI/IoC used consistently, GoF breadth, composing patterns | Written in [[Design Patterns]] |
| Leadership | Feedback | Novice = target | Leadership across more than one team | — |
| Software Design | Feedback | Advanced = target | Name the pattern when describing a design; SOLID; architecture diagrams | Written; the habit is what is missing |
| SE Knowledge & Experience | Feedback | Advanced = target | Algorithms and data structures, DB query optimisation, network troubleshooting, containers | Missing (low priority) |
| Web Communication Protocols | Feedback | Intermediate = target | Long polling vs WebSockets trade-offs, header/caching diagnosis, HTTP/2 beyond "more connections" | Missing |
| Conflict management | Feedback | Intermediate = target | How to push for the best decision in the end | Partial |
| Delegation | Feedback | Novice = target | KT session, done vs pending, expectations, support | Partial |
| Gen AI Assisted Development | Feedback | Intermediate = target | Chunking and overlap, embedding models, how vectors are used, RAG beyond docs, evals | Missing — also needed by 4 positions |
| ReactJS | Feedback | Advanced = target | Custom hooks and HOCs, VDOM/Fiber, code splitting and build optimisation, security | Written in [[React]] and [[React Internals]] |

Two things the plan does not list but the panel recorded: the reviewers before the assessment rated **communication 3/5** while everything else was 4–5, and several questions had to be repeated before the term was recognised (pyramid, long polling, RAG, quality gates, hand-off).

---

# Priority order

**Tier 1 — tracked, must be closed with evidence**
1. TypeScript

**Tier 2 — the panel asked and the answer was not there; these will be asked again**
2. Critical rendering path
3. WebSockets vs long polling (and SSE), HTTP/1.1 vs HTTP/2 vs HTTP/3
4. FIRST principles, test pyramid
5. SOLID with an example per letter
6. Handing off a half-done task
7. Gen AI: agents, skills, subagents, MCP, RAG under the hood, evals
8. Software engineering practices: Git workflows, deployment strategies, design reviews and ADRs, AI in the pipeline

**Tier 3 — feedback on skills already at level; the follow-ups a panel chains**
9. Angular vs Vue vs React — when and why
10. Browser APIs: feature detection, memory management
11. Conflict: pushing to a decision · tough feedback · explaining to non-technical people
12. React advanced patterns and build optimisation (mostly drilling)
13. SE knowledge: DB queries, network troubleshooting, containers

**Cross-cutting, every day** — English and answer structure (see the last section).

---

# Topic by topic

Each block: **why** (the committee's words, summarised) · **the panel's question** (timestamp in the transcript) · **a complete answer covers** · **where it lives** · **done when**.

## 1. TypeScript — Tier 1

**Why.** Assessed Intermediate, target Advanced. The committee's first line: the union type was not explained. Gaps listed: conditional types, mapped types, `infer`; tsconfig, module resolution and build settings; generics, discriminated unions and declaration merging in production code.

**The panel's question** (00:12:09, follow-up 00:13:29): *an endpoint returns different shapes depending on status — or user data with or without bookings depending on a parameter. Model it so the compiler forces every case to be handled — at compile time, not at runtime.*

**A complete answer covers**
- A **discriminated union**: every variant carries a literal tag (`status: 'ok' | 'error'`, or `kind`), so `switch (res.status)` narrows each branch to its exact shape.
- **Exhaustiveness**: the `default` branch assigns to `never`, so adding a variant breaks the build everywhere it is not handled.
- **Function overloads or a generic conditional return type** for the parameter case: `getUser(id, { withBookings: true })` returns `UserWithBookings`, otherwise `User`.
- Then — and only then — the boundary: types are erased, so the union is *also* parsed at runtime with Zod (`z.discriminatedUnion`). Runtime validation complements the compile-time model; it does not replace it.
- The Advanced vocabulary: conditional types and `infer` (extract the payload type from a response type), mapped types with key remapping (derive an endpoint map), declaration merging (augmenting a library's types, `Window`), `strict` and the flags that matter, `moduleResolution: "bundler"` vs `"node16"`.

**Where.** [[TypeScript#Unions and intersections]] · [[TypeScript#Generics — the part that actually comes up]] · [[TypeScript#Mapped and conditional types, and type manipulation]] · [[TypeScript#tsconfig — the flags that shrink the lie surface]] · [[TypeScript Boundary]]. All written — the work is retrieval, not reading.

**Done when**
- [ ] The 00:12:09 question answered out loud in the four beats, under two minutes, union → discriminant → `never` → Zod at the boundary.
- [ ] **Reto 03 — typed API client** in `Retos/retos-sandbox/`: a discriminated-union response by status, an exhaustive handler, an overloaded `getUser`, an endpoint map built with a mapped type, `infer` to extract the payload, `strict` tsconfig. Predict → break (add a variant, watch the build fail) → fix.
- [ ] Development Justification for the TypeScript item written in Level Up, with the reto attached as the artifact.

## 2. Critical rendering path — Tier 2

**Why.** Listed as a resource and as a Browser APIs gap: the principles and the optimisation strategies were not given.

**The panel's question** (00:41:08, again at 00:42:28): *what is the critical rendering path and how do you optimise it for a high-traffic web application?*

**A complete answer covers**
- **The definition**: the sequence of steps from bytes to the first pixels — HTML → DOM, CSS → CSSOM, DOM + CSSOM → render tree → layout → paint (and composite).
- **What blocks it**: CSS is render-blocking (no render tree without the CSSOM); a classic `<script>` is parser-blocking, and it also waits for pending CSS.
- **The three levers** (web.dev's framing): fewer critical resources, fewer critical bytes, shorter critical path length (round trips).
- **Tactics**: inline the critical CSS, load the rest non-blocking; `defer` / `async` / `type="module"`; `preload` for late-discovered critical assets, `preconnect` to third-party origins; `fetchpriority="high"` on the LCP image; compression and a CDN; SSR or SSG so the first HTML already has content.
- **How to measure**: Lighthouse and the Performance panel waterfall; the metrics it moves are FCP and LCP.

**Where.** Write it as a section of [[Browser Platform]], next to the five rendering phases (already in its `# Still to study`).

**Done when**
- [ ] Section written; the two-minute answer said out loud, ending with how it is measured.

## 3. Web communication protocols — Tier 2

**Why.** Resource "WebSockets vs Long Polling"; feedback on Web Communication Protocols: confusion between long polling and WebSockets in trade-offs, no header/caching diagnosis, HTTP/2 explained only as "more simultaneous connections" — missing header compression, prioritisation, server push.

**The panel's questions**: 00:52:27 *when would you use long polling over a WebSocket, and what do you weigh?* · 00:55:44 *HTTP/1.1 vs HTTP/2 — what did version 2 improve?*

**A complete answer covers**
- **The four options**: short polling (ask on an interval), long polling (the server holds the request open until there is data or a timeout, then the client re-asks), SSE (one long HTTP response the server streams events into, server → client only, auto-reconnect), WebSocket (one upgraded TCP connection, full duplex).
- **When long polling wins**: low-frequency events such as notifications, environments where proxies or corporate firewalls break WebSockets, when you want plain HTTP semantics (auth headers, load balancers, stateless servers, no sticky sessions), and as the fallback transport (what Socket.IO does).
- **When a WebSocket wins**: high-frequency, low-latency, bidirectional traffic (chat, collaborative editing, live prices). Its cost is a stateful connection per client: scaling, sticky sessions or a pub-sub backplane, heartbeats, reconnection with backoff.
- **For one-way notifications, SSE** is usually the right default: plain HTTP, and HTTP/2 removes the old six-connection limit that hurt it.
- **Upload progress** does not need a socket: `XMLHttpRequest`'s `upload.onprogress` reports bytes sent.
- **HTTP/1.1 → HTTP/2**: one TCP connection with **multiplexed** streams instead of about six parallel connections per host; binary framing; **HPACK** header compression; stream **prioritisation**; **server push**, now effectively dead (Chrome removed it in 2022; `103 Early Hints` replaced the use case). Consequence: domain sharding and aggressive bundling stop being best practice.
- **HTTP/3**: HTTP/2's head-of-line blocking moved down to TCP — one lost packet stalls every stream. HTTP/3 runs over **QUIC** on UDP, so streams are independent, and the handshake is faster (0-RTT/1-RTT).
- **Diagnosing in production**: DevTools Network (protocol column, timing, `Cache-Control`, `ETag`, `Vary`, `Age`), `curl -I`, comparing CDN and origin headers.

**Where.** New note **Web Communication Protocols** (a roadmap item in [[README]]); the caching half links to [[Browser Platform#2. HTTP caching and the CDN on release day]].

**Done when**
- [ ] Note written, with a decision table (polling / long polling / SSE / WebSocket × direction, frequency, infrastructure, cost).
- [ ] Both questions answered out loud; the long-polling one opens with *when it wins*, not with what a WebSocket is.

## 4. Testing: the pyramid and FIRST — Tier 2

**Why.** Two resources, plus the Software Engineering Practices gaps: no mention of the test pyramid, FIRST principles not known.

**The panel's questions**: 00:51:17 *FIRST principles in testing?* · 00:51:39 *the testing pyramid?* · and earlier, 00:30:25 *after the Cypress migration, how did you decide what is a unit, component, integration or e2e test?* — which is the pyramid asked in practical form.

**A complete answer covers**
- **The pyramid** (Mike Cohn; Fowler's bliki): many fast, isolated unit tests at the base, fewer integration/service tests, few slow e2e tests at the top — because cost and flakiness grow and failure localisation shrinks as you go up. The **ice-cream cone** is the anti-pattern; the **testing trophy** (Kent C. Dodds) is the frontend variant that weights integration tests most.
- **FIRST** — the properties of a good unit test: **F**ast, **I**ndependent/isolated (no order dependence, no shared state), **R**epeatable (same result in any environment — no real network, clock or random seed), **S**elf-validating (passes or fails on its own, no human reading logs), **T**imely (written with the code, or before it in TDD; some versions say **T**horough).
- **The Cypress story told through the pyramid**: component tests sit between unit and integration — a real browser render of one component; what moved there, what stayed unit, what stays e2e.

**Where.** [[Testing and Process#The testing pyramid]] is written; add FIRST next to it.

**Done when**
- [ ] FIRST added to [[Testing and Process]].
- [ ] The 00:30:25 question re-answered with the pyramid as its spine.

## 5. SOLID in depth — Tier 2

**Why.** Resource "SOLID in depth"; Software Design feedback: gaps in SOLID; patterns not mentioned when describing designs.

**The panel's question** (00:49:36): *explain the SOLID principles, briefly.*

**A complete answer covers**
- The five, with the right names: **S**ingle responsibility, **O**pen/closed, **L**iskov substitution, **I**nterface segregation, **D**ependency inversion.
- **One example and one violation per letter, in frontend code**: S — a component that fetches, transforms and renders → split into a hook, a pure function and a view. O — a strategy map of payment methods: adding one is adding a key. L — a subtype that throws on a method the parent supports breaks every caller. I — a `props` interface with 30 optional fields → smaller components. D — the component receives the API client (props, context, DI) instead of importing the concrete one.
- **Naming patterns while describing designs**: the legacy-brand redirect interceptor is a **proxy / middleware (chain of responsibility)** in front of untouched code; the new brands got the direct change. Saying the pattern name is what the Software Design gap asks for.

**Where.** [[Design Patterns#SOLID]] has the table; add the example-and-violation per letter. DI vs IoC is already at [[Design Patterns#Dependency inversion vs dependency injection vs inversion of control]].

**Done when**
- [ ] Examples added; the five said out loud in under ninety seconds with one example each.
- [ ] The architectural-decision story (00:26:29) rehearsed with the pattern named.

## 6. Handing off a half-done task — Tier 2

**Why.** Resource "How to delegate a half-done task"; Delegation feedback: prerequisites were described, but not how to delegate — no explanation of what is done and what is pending, no KT session, no expectations or support.

**The panel's question** (01:14:03): *you are 60% through a feature, a production-critical bug needs you; hand the feature to a junior engineer.*

**A complete answer covers** — in this order:
1. **A written hand-off** before the call: the goal and acceptance criteria; **what is done** (branch, commits, open PR, what is tested); **what is pending**, broken into sub-tasks each with its own acceptance criteria; the **decisions taken and why**; the **known traps**; how to run and test it locally; who else to ask.
2. **A short KT session** walking through that document and the code — the junior drives, so gaps show up now.
3. **Expectations**: deadline, check-in points, and the delegation level (close monitoring for a junior — see the levels in [[Testing and Process#5. Management and situational]]).
4. **Support**: "I am on the bug, but here is when I am reachable"; a first check-in the same day; review of the PR.
5. **Close the loop**: tell the PM/lead the owner changed and what that does to the date.

**Where.** Add to [[Testing and Process#5. Management and situational]], next to the delegation levels.

**Done when**
- [ ] Section written; the answer said out loud covering all five steps.

## 7. Gen AI assisted development — Tier 2

**Why.** Feedback gaps: chunks and chunk overlap; RAG only mentioned as document storage; embedding models and how vectors are used; evals. The panel also asked four questions on agents, skills, subagents and MCP. And four of the six positions in `Vacantes/` ask for Gen AI ([[README]]'s shared-gaps list), so this note pays twice.

**The panel's questions**: 00:19:28 *what makes an agent different from sending a prompt to an LLM?* · 00:21:43 *what is an agent skill, and when a reusable skill instead of more prompt instructions?* · 00:23:27 *when delegate to subagents?* · 00:25:01 *what problem does MCP solve?* · 00:45:34 *how do you structure a prompt?* · 00:47:15 *what is RAG, what does it solve, how does it work under the hood?* · 01:08:28 *a time AI pointed you the wrong way* · 01:10:46 *how do you check AI in a field you are not expert in?* · 01:12:25 *when should you not use AI?*

**A complete answer covers**
- **Agent vs prompt**: a prompt is one request–response. An agent is a loop: the model chooses a **tool**, the harness runs it, the **observation** goes back into the context, and it repeats until the goal is met — with autonomy, state, and a stopping condition.
- **Skills**: packaged instructions (and scripts) loaded **on demand** — only the description sits in context until the task matches. Use one when the same procedure repeats across sessions or people, or needs to be versioned and shared; a one-off constraint stays in the prompt.
- **Subagents**: a fresh context for a self-contained subtask; only the result comes back. Use them for parallel independent work and to keep exploratory noise out of the main context. Cost: they start cold and duplicate reading.
- **MCP**: an open protocol (client ↔ server) that exposes **tools, resources and prompts** to any compatible host. It turns N×M custom integrations into N+M.
- **RAG under the hood**: ingest → **chunk** (size, plus **overlap** so a fact cut at a boundary survives in one chunk) → **embed** each chunk with an embedding model into a vector → store in a vector DB → at query time embed the question, retrieve the top-k by **similarity** (cosine), optionally hybrid with keyword search and a reranker → put the chunks into the prompt → generate with citations. It solves stale or private knowledge without retraining, and it reduces hallucination by grounding.
- **RAG beyond docs**: support bots over tickets, code search across repositories, product search, personalisation, grounding agents on internal APIs.
- **Evals**: a golden dataset of questions with expected answers; retrieval metrics (recall@k, precision) and answer metrics (faithfulness to the sources, relevance); LLM-as-judge with a rubric, spot-checked by humans; run in CI on every prompt or model change.
- **When not to**: where regulation or data policy forbids it; when you need to *understand* the material yourself; where the cost of a confident wrong answer is high and unverifiable.
- **A real story** for 01:08:28: one concrete case — what the AI proposed, the signal that it was wrong (a failing test, docs contradicting it, a version mismatch), how it was verified, what changed in the workflow afterwards.

**Where.** New note **Gen AI Assisted Development** (roadmap item in [[README]]); link it from the positions that need it.

**Done when**
- [ ] Note written, with the RAG pipeline as a diagram and an evals section.
- [ ] The nine questions answered out loud; the wrong-direction story written down and rehearsed.

## 8. Software engineering practices — Tier 2

**Why.** Recommended skill, Intermediate → Advanced. Gaps: Git workflows (hooks, tags, pruning), project-wide performance testing, design review sessions, AI code evaluation in the pipeline, deployment strategies.

**The panel's questions**: 00:28:44 *your team moves two services to Kafka; how do you document the decision so a new engineer understands why?* · 00:35:00 *what quality gates before a PR can merge?* · 00:57:23 *which code-quality tools, and their impact?* · 00:58:33 *how do you handle and distribute technical debt?*

**A complete answer covers**
- **Documenting decisions**: an **ADR** (Architecture Decision Record) in the repository — context, decision, alternatives considered, consequences, status — short, immutable, superseded by a newer ADR rather than edited. Bigger changes go through an **RFC / design review** before the decision.
- **Quality gates**, split into before and after merge: lint, type-check, unit and component tests, coverage threshold on changed lines, SonarQube quality gate, dependency/security scan, build, preview deploy with e2e smoke tests, required reviewers, and a performance budget (Lighthouse CI). A gate only counts if it **blocks** ([[Testing and Process#2. CI, delivery and deployment]]).
- **Git workflows**: trunk-based with short-lived branches and feature flags vs GitFlow; hooks with Husky + lint-staged locally, enforced again in CI; release **tags** with semver and generated changelogs; pruning merged branches.
- **Deployment strategies**: rolling, **blue-green** (two environments, switch traffic, instant rollback), **canary** (a small percentage first, watch error and latency metrics, then widen), feature flags (decouple deploy from release), and always a rollback plan.
- **Performance testing**: budgets in CI, load tests (k6) before peak events, real-user monitoring after.
- **AI in the pipeline**: AI review bots as a first pass, not a gate on their own; evals for AI features; secrets and licence scanning of generated code.
- **Technical debt distribution**: a debt epic with tickets that are sized and prioritised against business value; a fixed share of sprint capacity (often 15–20%); the boy-scout rule when touching code anyway; an owner per item.

**Where.** [[Testing and Process]] — CI and code review are written; add ADRs, Git workflows and deployment strategies (the last also on the roadmap under hosting).

**Done when**
- [ ] Sections added; the four questions answered out loud.

## 9. Angular vs Vue vs React — Tier 3

**Why.** Frameworks feedback: explain better when to use Vue vs React vs Angular, with technical strengths and weaknesses of Angular and Vue.

**The panel's questions** (01:05:13, 01:06:19, 01:07:46): *how would you decide which framework for a new project? You and a tech lead choose the stack — how? When would you choose Vue?*

**A complete answer covers**
- **The decision criteria first**: the team's skills and hiring market, app size and lifespan, how much structure the org needs, ecosystem needs (mobile → React Native), SSR/SEO needs, and existing code.
- **Angular**: a complete, opinionated framework — DI, router, forms, HTTP, RxJS, signals, CLI, TypeScript-first. Fits large enterprise teams that benefit from one way of doing things. Costs: learning curve, verbosity, heavier upgrades.
- **Vue**: progressive — can be dropped into an existing page or scale to a full SPA with Nuxt; single-file components; a proxy-based reactivity system with fine-grained tracking; gentle learning curve. Fits small-to-mid teams, incremental migration of server-rendered apps. Costs: smaller enterprise and hiring pool than React.
- **React**: a library, not a framework — you choose router, state and data layers; the largest ecosystem and hiring market; React Native; Next.js for SSR/RSC. Costs: decision fatigue, and consistency depends on the team's conventions.

**Where.** New section — the roadmap has Angular and Vue as separate items; a comparison section is enough for this gap.

**Done when**
- [ ] Comparison written; the "you and the tech lead choose" answer said out loud, criteria first.

## 10. Browser APIs — Tier 3

**Why.** Recommended skill: limited evidence of systematic feature detection and fallbacks across engines; no examples of memory/performance management for API-heavy features.

**A complete answer covers**
- **Feature detection**: `'IntersectionObserver' in window`, `CSS.supports()` and `@supports`, try-and-catch for APIs that throw; progressive enhancement; loading polyfills conditionally and what they cost in bytes.
- **Memory and performance**: disconnecting observers and removing listeners (`AbortController` signals on `addEventListener`), revoking object URLs, `WeakMap`/`WeakRef` for caches, moving heavy work off the main thread (Web Workers, `OffscreenCanvas` for 3D viewers), chunking work with `requestIdleCallback` or `scheduler.yield()`, heap snapshots in DevTools to prove a leak is gone.
- The three observers and what each replaces; storage options and their limits.

**Where.** The roadmap item **Browser APIs** in [[README]]; the leak patterns already in [[JavaScript]] are the starting point.

**Done when**
- [ ] Note or section written, with the 3D-viewer work (Three.js) as the worked example.

## 11. Conflict, feedback, explaining — Tier 3

**Why.** Conflict feedback: has not mentioned how to push for the best decision in the end.

**The panel's questions**: 00:37:24 *a strong disagreement with a senior developer — how was it resolved, and was your solution chosen?* · 01:19:57 *giving tough feedback* · 01:21:50 *the same person under-delivers sprint after sprint* · 01:23:42 *explaining something technical to a non-technical PO* · 01:25:20 *the PO says ChatGPT disagrees with your estimate and library choice.*

**A complete answer covers**
- **Pushing to a decision**: move from opinions to criteria agreed up front; gather evidence (a timeboxed spike or PoC, benchmarks, docs); name a decision owner and a deadline; if still split, escalate to the owner with both options written down; then **disagree and commit** and record it (ADR).
- **The PO and ChatGPT**: take it seriously and verify it — check the library against our constraints (compatibility, security, licence, maintenance); show the comparison; if it holds, adopt it; if not, explain with evidence. The decision rests on facts, not on who said it.
- **Repeated under-delivery**: a private one-to-one with facts (dates, what was said vs delivered); ask what is blocking; agree on smaller tasks with daily visibility; if nothing changes, involve the manager — that is not optional after two sprints.
- **Every story ends with the outcome**, including whether my solution was chosen.

**Where.** [[Testing and Process#5. Management and situational]] has the disagreement question; add the others there.

**Done when**
- [ ] Each of the five has a STAR story written down and rehearsed out loud.

## 12. React — Tier 3

**Why.** Gaps: advanced code reuse (custom hooks, HOCs), VDOM/reconciliation and Fiber, build optimisation and code splitting, deeper security.

**The panel's questions**: 00:10:12 *one global-state change re-renders hundreds of components — investigate and fix* · 00:39:53 *why is hydration critical in SSR?* · 00:17:28 *SSR vs SSG vs CSR in Next.js* · 00:42:56 *micro-frontends, pros and cons.*

**What is mostly drilling**: re-renders and memoisation ([[React#2. Re-renders and memoisation]]), the context fan-out and the fix through selectors and store splitting ([[State Management]]), Fiber ([[React Internals]]), rendering strategies ([[React#3. Rendering strategies and performance]]), security ([[Security]]).

**What is still to write**: micro-frontends (module federation, shared dependencies, when they are worth it — in [[Design Patterns]]'s `# Still to study`); bundlers and code splitting (roadmap: JavaScript Development Tools).

**Done when**
- [ ] The four questions answered out loud from the notes.
- [ ] The micro-frontends section written.

## 13. Software engineering knowledge — Tier 3

**Why.** Gaps: algorithms and data structures, deep database query optimisation, network-level troubleshooting, container orchestration. Lowest priority for a frontend A3, but cheap to cover at one-paragraph depth.

**A complete answer covers**: Big-O of the common structures and when a `Map`/`Set` beats an array scan; indexes, `EXPLAIN`, the N+1 problem; DNS → TCP → TLS → HTTP and where each fails; what a container is versus an image, and what Kubernetes adds (scheduling, scaling, self-healing).

**Done when**
- [ ] One paragraph each, written somewhere it will be read again.

---

# The cross-cutting habit: English and structure

The reviewers before the assessment gave communication 3/5. The transcript shows where it costs points: terms not recognised by ear, answers that start with an example instead of the definition, and long answers that never return to the question.

- **Recognise the terms by ear**: pyramid, long polling, RAG, quality gates, hand-off, critical rendering path, header compression, chunk overlap. Say each one aloud until hearing it triggers the answer.
- **The four beats** from [[README]] on every answer: definition → mechanism → trade-off → when not / how to measure.
- **Ask to rephrase once, early**: "Do you mean X or Y?" is a senior move. Starting an answer to a different question is not.
- **Ten minutes a day** with [[Vocabulary Drill]], and one recorded answer a day, played back.

---

# Six-week schedule

Assuming about an hour on weekdays and a longer block at the weekend. Every week ends with a [[Study prompt]] session on that week's questions, logged in `Sesiones/`, and with the Level Up item updated (learning materials and justification).

| Week | Focus | Output |
|---|---|---|
| 1 | **TypeScript** (Tier 1) | Reto 03 typed API client · TypeScript justification drafted |
| 2 | Critical rendering path · Browser APIs | Sections in [[Browser Platform]] · Browser APIs note |
| 3 | Web communication protocols | Web Communication Protocols note |
| 4 | Testing (pyramid, FIRST) · SOLID · engineering practices | Additions to [[Testing and Process]] and [[Design Patterns]] |
| 5 | Gen AI assisted development | Gen AI note · wrong-direction story |
| 6 | Behavioural (hand-off, conflict, feedback, PO) · frameworks compared | STAR stories · comparison · **full replay of the 40 assessment questions** |

**Exit criterion before requesting the next assessment**: the replay in week 6 — every question in the transcript answered out loud in the four beats, with no item from this plan left unchecked in Tier 1 or Tier 2.

---

# Still to study

- [ ] Write the Development Justification for each Level Up item as it closes — Tier 1 first.
- [ ] SSO across brands and domains (00:14:48): OIDC with a central identity provider, cookie scope and `SameSite`, third-party-cookie restrictions, silent re-authentication — not on the plan, but the question was asked and [[Security]] does not cover it yet.
- [ ] Screen-reader testing in practice (00:34:12): VoiceOver and NVDA, what automated checks miss — already listed in [[Browser Platform]]'s `# Still to study`.
