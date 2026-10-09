---
title: Mock Interview Session 01
date: 2026-08-17
tags:
  - study
  - interview
  - promotion
  - javascript
  - mock-interview
parent: "[[The Best Notes of the F Word]]"
source: Mock senior interview session — 3 of 10 questions answered
---

# Mock Interview Session 01 — Senior JS

Related: [[Mock Interview Session 02]] · [[Assessment Questions]] · [[Questions for interviews]] · [[The Best Notes of the F Word]]

Session ended early. 3 questions answered, Q4 unanswered.

> [!danger]- Read this first — the pattern behind every miss
> You know the **vocabulary** (closure, middleware, `Promise.all`) but not the **mechanism underneath**.
> Senior interviews always probe exactly one layer below the vocabulary. That layer is currently empty.
> This is a study gap, not a capability gap.

## 1. Results

| # | Topic | Verdict | Note |
|---|---|---|---|
| 1 | Closures + memory | **Incorrect** | Described module pattern, not the mechanism. No mention of scope/environment record retention. Leak answer hand-wavy. |
| 2 | Async concurrency trade-offs | **Partial** | Right pick (batching), wrong reasoning. Corrected to `allSettled` on follow-up, but did not answer what happens to in-flight requests. |
| 3 | API layer architecture | **Incorrect** | "Middleware" is the right word, no architecture behind it. Follow-up on token-refresh race went to error boundaries — unrelated concept. |
| 4 | Event loop | Not answered | — |

**Score: 0.5 / 3 answered. Estimated level: Mid** (below the Mid-Senior boundary).

## 2. Correct answers

### Q1 — Closures at engine level

A closure is **not** a privacy technique. Privacy is one *use* of it.

The mechanism:

- Every function, when created, holds an internal reference `[[Environment]]` pointing at the **Lexical Environment** where it was defined.
- That environment is a **heap-allocated object** holding the variable bindings.
- When the outer function returns, its environment normally becomes garbage — but if an inner function still references it, the environment **survives**.

> [!tip] The nuance most mid-level answers miss
> V8 only retains the variables **actually referenced** by the inner function (computed at parse time).
> But if any inner function in the same scope uses `eval`, or if several closures **share one environment**, the whole environment stays alive.

Classic leak:

```js
function setup() {
  const hugeBuffer = new Array(1e6).fill('data'); // ~8MB

  const onClick = () => console.log('clicked'); // references nothing

  document.getElementById('btn').addEventListener('click', onClick);
}
```

If `onClick` shares the environment with another closure in that scope, `hugeBuffer` never frees — and the listener holds the DOM node, which holds the environment.

**Detection:** Chrome DevTools → Memory → **heap snapshot**. Take two snapshots, use *Comparison* view, look at `Detached HTMLElement` and `Closure` retainer chains.

### Q2 — Failure semantics of concurrency

> [!warning] `Promise.all` rejects fast but does NOT cancel
> When request 137 rejects, the other 199 **keep running to completion**. You just never see their results.
> Wasted bandwidth, and any side effects still fire. Promises have no cancellation — you need `AbortController`.

Batched, with survivors preserved:

```js
async function batched(items, size, fn) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    const chunk = items.slice(i, i + size);
    const results = await Promise.allSettled(chunk.map(fn));
    out.push(...results);
  }
  return {
    ok:     out.filter(r => r.status === 'fulfilled').map(r => r.value),
    failed: out.filter(r => r.status === 'rejected').map(r => r.reason),
  };
}
```

Correct reasoning for the three options:

| Option | Real trade-off |
|---|---|
| `Promise.all` | **Fastest**, but risks rate-limiting (429s) and connection-pool exhaustion. Not "too slow" — that reasoning was wrong. |
| Sequential `for...of` | Makes the **fewest** requests, not "a lot". Unusably slow: 200 × latency. |
| Batched | Correct because it **bounds concurrency** — not because it is "flexible". |

### Q3 — The token-refresh race

Five parallel 401s → five parallel refresh calls. Most refresh-token endpoints **rotate** the token, so the first refresh invalidates it and the other four fail → **user gets logged out**. That is the bug.

Fix — a single in-flight refresh promise, shared:

```js
let refreshing = null;

async function getFreshToken() {
  if (!refreshing) {
    refreshing = doRefresh().finally(() => { refreshing = null; });
  }
  return refreshing; // all five await the same promise
}
```

The architecture that was being asked for:

- **Transport layer** — one `fetch` wrapper. Owns timeouts (`AbortController`), retries with exponential backoff + jitter. Retry **only** on idempotent methods and 5xx/network errors, **never** on 4xx.
- **Auth layer** — interceptor: attach token on request; on 401 → single-flight refresh → replay once; second 401 → logout.
- **Domain/API layer** — typed functions per endpoint. Maps raw responses to domain objects, converts HTTP errors into typed app errors.
- **Feature layer** — decides *what the user sees*.

> [!important] What you deliberately do NOT centralize
> **UX decisions.** Toast vs inline field error vs retry button vs silent — that is per-feature.
> Centralize the **mechanics**, never the **presentation**.
> Error boundaries live here, and they only catch **render-time** errors — they do **not** catch async/promise rejections. That is why they were the wrong answer to that question.

## 3. What was missing for senior

1. **Mechanism over label.** You name the right tool; you don't explain why it works. Go one level down: not "middleware", but *which layer, what it owns, what it hands off*.
2. **Failure-first thinking.** You reasoned about the happy path and performance. Senior reasoning starts with *what breaks, what's the blast radius, what's the recovery*.
3. **Concurrency awareness.** The five-parallel-401s race is the exact class of problem that separates mid from senior. It was not on your radar.
4. **Naming the boundary.** No answer stated what stays *out* of the abstraction. Knowing what **not** to centralize is a stronger senior signal than knowing what to.

## 4. Topics to reinforce — in priority order

> [!note] All five are gaps outside the studied base. No knowledge base was pasted this session.

### 1. Closures, scope chain, and memory — highest priority
Everything else in JS sits on this.
- **Study:** Lexical Environment vs Execution Context · `[[Environment]]` · what V8 retains · garbage collection (mark-and-sweep, generational)
- **Practice:** take a heap snapshot in DevTools on a real app, find one detached node
- **Source:** MDN "Closures", then the V8 blog on memory

### 2. Event loop, microtasks, macrotasks
This was the question you did not reach.
- **Study:** call stack → task queue → microtask queue → render · why microtasks drain fully before the next macrotask · `queueMicrotask` · `requestAnimationFrame` · starvation
- **Source:** Jake Archibald, *In The Loop* (JSConf) — 35 min, single best resource
- **Cross-ref:** [[Assessment Questions]] already flags this ("promises do NOT go to the callback queue")

### 3. Async patterns and failure semantics
- **Study:** `all` / `allSettled` / `race` / `any` and their exact rejection behavior · `AbortController` and why promises can't be cancelled · concurrency limiting · exponential backoff with jitter
- **Build it yourself:** a `pLimit(n)` function from scratch, no library

### 4. Frontend architecture and layering
- **Study:** interceptor pattern · single-flight / deduplication · typed error hierarchies
- **Read the source of:** `axios` interceptors and TanStack Query's retry logic — both short, both the reference implementations of what was asked

### 5. Error handling boundaries
- **Study:** what error boundaries catch and what they don't (async, event handlers, SSR) · `try/catch` with `await` · `unhandledrejection` · `error.cause` · custom `Error` subclasses

## 5. Next session

- Event loop ordering (the unreached question — a variant of it)
- `pLimit` design from scratch
- Single-flight token refresh, as a design question
- Heap-snapshot debugging walkthrough
- One `this` / prototype question to check fundamentals
- **Two from the knowledge base — paste [[Assessment Questions]] before starting**
