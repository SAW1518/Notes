---
title: Mock Interview Session 03
date: 2026-08-24
tags:
  - study
  - interview
  - promotion
  - javascript
  - mock-interview
parent: "[[The Best Notes of the F Word]]"
source: Mock senior interview session — 7 of 10 questions answered, conceptual format (no code-reading)
---

# Mock Interview Session 03 — Senior JS

Related: [[Mock Interview Session 01]] · [[Mock Interview Session 02]] · [[Assessment Questions]] · [[Questions for interviews]] · [[The Best Notes of the F Word]]

Format: conceptual only (code-reading and debugging questions removed at candidate request).
Knowledge base was never pasted — all 10 questions drawn from general senior JS scope.
Session ended early at Q8.

> [!danger]- Read this first — same pattern as Session 01, two sessions running
> Session 01 diagnosis was: *"you know the vocabulary but not the mechanism underneath."*
> **That is still the exact result today.** Closures, prototypes, `Promise.all`, `Object.assign` — every
> answer named the right word and then stopped one layer above the mechanism.
> New this session: **you invented a difference that does not exist** (`Object.assign` vs spread).
> Confident-and-wrong scores worse in a promotion panel than "I don't know."
> The fix is not more topics. It is going one layer deeper on the topics you already half-know.

## 1. Results

| # | Topic | Verdict | Note |
|---|---|---|---|
| 1 | Closures + memory leaks | **Partial** | "Safe place for private variables" = a *use case*, not a definition. Got the leak direction right (GC can't collect the retained context) but could not name a single concrete leak pattern on follow-up. |
| 2 | Event loop | **Correct** | Best answer of the session. Stack / macrotask / microtask roles right, `then/catch/finally` and `await` bodies correctly placed as microtasks. Follow-up correct: full microtask drain before next macrotask, paint after the queue empties. |
| 3 | 200-request concurrency trade-off | **Partial** | Picked `allSettled` and justified it correctly (parallel, one failure doesn't stop the rest). Zero production reasoning — skipped the failure modes entirely. **Repeat of Session 01 Q2.** |
| 4 | Prototype chain + `class` internals | **Incorrect** | "A space in every object where we can add things." Could not walk a single lookup step on follow-up. Skipped. |
| 5 | `var` / `let` / `const`, TDZ | **Correct** | First pass said `let` has function scope — wrong. Fully self-corrected on follow-up: block scope for both, `const` blocks reassignment not mutation, hence `push` works. Self-correction counts. |
| 6 | Async error handling | **Not answered** | Skipped. |
| 7 | Shallow vs deep copy | **Incorrect** | Claimed `Object.assign` copies the full object while spread is shallow — **both are shallow, identically**. Could not name anything the `JSON` round-trip destroys. |
| 8 | Debounce vs throttle | Not answered | Session ended. |

**Score: 2 correct, 2 partial, 2 incorrect, 1 skipped — 3 / 7 answered.**
**Estimated level: Mid.** Same band as Session 01. Not yet Mid-Senior.

---

## 2. Correct answers

### Q1 — Closures: the leak patterns you could not name

The mechanism is in [[Mock Interview Session 01]]. What was missing today is the **concrete list**. Memorise these four — they are what an interviewer is fishing for:

**1. Detached DOM node held by a listener**

```js
function mount() {
  const node = document.getElementById('panel');
  const rows = new Array(1e6).fill('data'); // ~8MB

  node.addEventListener('click', () => console.log(rows.length));
  node.remove(); // removed from the DOM — but NOT from memory
}
```

The listener closes over `rows`, the node holds the listener, and your JS still holds the node. Removing it from the document frees nothing. Fix: `removeEventListener`, or better:

```js
const ac = new AbortController();
node.addEventListener('click', handler, { signal: ac.signal });
ac.abort(); // detaches every listener registered with this signal
```

**2. `setInterval` that is never cleared** — the interval is a GC root. Everything the callback closes over lives until `clearInterval`.

**3. Subscriptions with no unsubscribe** — event emitters, stores, websockets. Every `subscribe` needs a matching teardown (React: the cleanup returned from `useEffect`).

**4. Shared lexical environment**

```js
function make() {
  const huge = new Array(1e6);   // only used by heavy()
  const heavy = () => huge.length;
  const light = () => 'hi';      // uses nothing
  return light;                  // may still retain `huge`
}
```

V8 normally retains only the variables a closure actually references — but closures created in the **same scope share one environment object**, so keeping `light` can pin `huge`. Also defeated entirely by `eval` or `with` in that scope.

> [!tip] The one-liner definition to use in an interview
> "A closure is a function plus a live reference to the lexical environment where it was **defined**, not where it is called. Privacy is one thing you can build with that; the mechanism is the retained environment."

Escape hatch to know by name: `WeakMap`, `WeakRef`, `FinalizationRegistry` — keys/refs that do not prevent collection.

---

### Q3 — What actually breaks with 200 parallel requests

You said "`allSettled`, parallel, one failure doesn't stop the rest." Correct and insufficient. The failure modes:

**Client side**
- **HTTP/1.1 caps ~6 connections per origin.** 200 promises start instantly; 194 sit in the browser's socket queue. You did not parallelise — you built an invisible queue with no control over it.
- **Every request's timeout starts at t=0.** Request #180 waits 190 requests' worth of queue time, then times out even though the server is healthy. Cascading false failures.
- **Memory spike** — 200 in-flight responses buffered at once.
- **No cancellation.** User navigates away, all 200 keep running.

**Server side**
- **429 rate limiting** — you get partial success where a pool would get 100%.
- **Thundering herd**, and worse: naive retry-all on failure doubles the burst.
- Connection-pool / DB-connection exhaustion if each request hits the DB.

**What the pool buys you:** bounded memory, bounded in-flight time (so timeouts mean something), a place to put retry-with-exponential-backoff-and-jitter, respect for `Retry-After`, and one `AbortController` that kills the whole batch.

```js
async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      try {
        results[i] = { status: 'fulfilled', value: await worker(items[i], i) };
      } catch (reason) {
        results[i] = { status: 'rejected', reason };
      }
    }
  });

  await Promise.all(runners);
  return results;
}
```

> [!important] The answer that actually reads as senior
> "Before tuning concurrency I'd ask why the client makes 200 calls at all. This is an N+1 over HTTP.
> The real fix is a batch endpoint — `GET /items?ids=1,2,3` — or a cursor-paginated list.
> If I can't change the backend, then a pool of 5–10 with backoff and a shared `AbortController`."
>
> Senior = questioning the requirement first, then engineering within the constraint.

---

### Q4 — Prototype chain, step by step

You call `dog.speak()`:

1. Does `dog` have an **own** property `speak`? No.
2. Follow `dog.[[Prototype]]` (readable via `Object.getPrototypeOf(dog)`, legacy `__proto__`). For `new Dog()` this is `Dog.prototype`. Found? No.
3. Follow `Dog.prototype.[[Prototype]]` → `Animal.prototype`. Found → call it, with `this` bound to `dog` (the **receiver**, not the object where the method was found).
4. If not found, continue → `Object.prototype` → `null`. Chain ends. Result: `undefined`, and calling it throws `TypeError: dog.speak is not a function`.

Writes do **not** walk the chain the same way: `dog.speak = fn` creates an **own** property that shadows the prototype's. Reads walk up, writes land locally (unless a setter is found on the chain).

**What `class Dog extends Animal` sets up — two links, not one:**

```js
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // instance methods
Object.getPrototypeOf(Dog)           === Animal;           // STATIC methods — the link people forget
```

**What `class` gives you that `function` constructors cannot replicate:**

- **`#private` fields** — genuinely inaccessible, enforced by the engine, not a naming convention. `#x in obj` is the brand check.
- **Correct subclassing of built-ins** (`Array`, `Error`, `Map`). `super()` allocates the exotic object via `new.target`; an ES5 constructor calling `Array.call(this)` cannot produce a real array exotic object.
- **Cannot be called without `new`** — `Dog()` throws `TypeError`. A function constructor silently ruins `this`.
- Methods are **non-enumerable** by default, so they don't leak into `for...in`.
- Class bindings are **not hoisted** — they sit in the TDZ, like `let`. Ties back to Q5.
- `super.method()` uses `[[HomeObject]]`, which has no ES5 equivalent — manual `Parent.prototype.method.call(this)` breaks with deeper hierarchies.

---

### Q6 — Async error handling (skipped)

**1. Why `try/catch` misses `setTimeout`**

```js
try {
  setTimeout(() => { throw new Error('boom'); }, 0);
} catch (e) {
  // never runs
}
```

`setTimeout` **returns immediately**. The `try` block completes and its stack frame is gone. The callback runs later, in a **new macrotask, on a fresh empty call stack** — there is no `catch` above it. It becomes an uncaught exception → `window.onerror` / `process.on('uncaughtException')`.

`try/catch` catches **lexically and synchronously**, not temporally. `await` works precisely because it resumes the *same* function frame:

```js
try { await delay(0).then(() => { throw new Error('boom'); }); } catch (e) { /* caught */ }
```

**2. Unhandled rejections**

- **Browser:** fires the `unhandledrejection` event on `window` (cancelable with `preventDefault()`), logs to console, page keeps running. Hook it to send to Sentry.
- **Node ≥ 15:** default mode is `throw` — it **crashes the process** with `ERR_UNHANDLED_REJECTION`. Correct production handling is log + graceful shutdown, not swallow:

```js
process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'unhandled rejection');
  server.close(() => process.exit(1));
});
```

Note the trap: attaching `.catch()` **later in a different tick** is already too late.

**3. Where the `try/catch` goes — all three layers, different jobs**

| Layer | Responsibility |
|---|---|
| fetch wrapper | Transport only. Turn `!res.ok` into a typed `HttpError(status)`, apply `AbortController` timeout, retry idempotent 5xx/429 with backoff. Never decide product behaviour. |
| service layer | Domain meaning. 404 → `null` vs throw? Fall back to cache? Map `HttpError` → domain error. **This is where most `try/catch` belongs.** |
| UI component | Presentation only. Error boundary / toast / retry button. Catches to *render*, never to decide. |

> [!tip] The rule to state out loud
> "Catch where you can actually do something about it. Everywhere else, let it propagate.
> A `catch` that only logs and continues is a swallowed bug."

---

### Q7 — Shallow vs deep copy

**The claim to unlearn: `{...obj}` and `Object.assign({}, obj)` are both shallow, to exactly the same depth.**

```js
const obj = { a: 1, nested: { b: 2 } };
const s = { ...obj };
const a = Object.assign({}, obj);

s.nested === obj.nested; // true
a.nested === obj.nested; // true — identical behaviour
```

Both copy **own enumerable** properties (string and symbol keys), one level deep. Nested objects are copied **by reference** — mutating `s.nested.b` mutates the original.

The differences that *do* exist (know these, they're the real interview follow-up):

- `Object.assign` **triggers setters** on the target; spread defines properties directly (`[[DefineOwnProperty]]`, no setters run).
- `Object.assign` mutates an existing target; spread always builds a fresh object literal.
- Neither copies the **prototype** — a class instance spread becomes a plain object.
- Both **invoke getters** and flatten them to plain values.

**Deep copy in 2026 — `structuredClone()`** (native, all modern browsers + Node ≥ 17):

```js
const deep = structuredClone(obj);
```

Handles what JSON cannot: `Date`, `Map`, `Set`, `RegExp`, `ArrayBuffer`/TypedArrays, `Blob`/`File`, `BigInt`, and **circular references**.
Throws `DataCloneError` on: functions, DOM nodes, `Symbol`. Drops: prototypes (class instance → plain object), getters/setters (flattened), property descriptors.

**What `JSON.parse(JSON.stringify(obj))` silently destroys:**

| Input | Becomes |
|---|---|
| `undefined` (object value) | key removed entirely |
| `undefined` (array element) | `null` |
| function / `Symbol` value | key removed |
| `Date` | ISO **string** — no longer a Date |
| `Map` / `Set` | `{}` |
| `NaN` / `Infinity` | `null` |
| `BigInt` | **throws** `TypeError` |
| circular reference | **throws** `TypeError` |
| class instance | plain object, methods gone |
| custom `toJSON()` | silently rewrites the output |

It is also the slowest option. Use it only for known-flat, JSON-shaped data; reach for `structuredClone` otherwise; use a library (`lodash.cloneDeep`) only when you need functions or prototypes preserved.

---

### Q8 — Debounce vs throttle (not reached)

- **Debounce:** wait until the events **stop** for N ms, then fire once. Collapses a burst into its trailing edge.
- **Throttle:** fire at most once per N ms **during** a burst. Guarantees a steady rate.

| Case | Tool | Why |
|---|---|---|
| (a) autocomplete input | **Debounce** ~300ms | You only want the query the user finished typing. Must also **cancel the in-flight request** (`AbortController`) — otherwise a slow earlier response overwrites a newer one (race). |
| (b) infinite scroll | **Throttle** ~100–200ms | You need updates *during* the scroll, not after it stops. Better still: `IntersectionObserver` on a sentinel — zero scroll handlers. |
| (c) double-clicked Save | **Neither** | Disable the button on submit + an idempotency key on the request. Debounce is a UI-timing hack over a **correctness** problem; the network can duplicate the request regardless of your timer. |

That last row is the seniority signal: recognising when the debounce/throttle framing is the wrong frame entirely.

---

## 3. What was missing for senior

1. **One layer below the vocabulary — for the second session in a row.** Every answer stopped at the label. Senior interviews *always* probe one layer down; that is the whole test.
2. **Production failure modes.** Never mentioned: rate limits, connection limits, backpressure, memory, cancellation, retries. Question 3 was purely about this and got a purely theoretical answer.
3. **Precision.** Inventing a `Object.assign` vs spread difference is worse than a skip. So is "`let` has function scope" — even self-corrected. Say "I'd verify" instead of asserting.
4. **No API names.** A senior answer name-drops the tools: `AbortController`, `structuredClone`, `WeakRef`, `unhandledrejection`, `IntersectionObserver`, `Object.getPrototypeOf`. You used none of them.
5. **Never questioned a requirement.** Q3 was an N+1 over HTTP. Nobody asked why 200 calls exist. Seniors push back on the shape of the problem before optimising it.
6. **Answer length.** Every answer was one run-on sentence. Structure it: *definition → mechanism → trade-off → when I'd use it*.

---

## 4. Topics to reinforce (priority order)

### 1. Prototype chain and `class` internals — **from the knowledge base** ([[Assessment Questions]], [[Design Patterns]])
Hardest miss of the session and unavoidable in any senior JS interview. Everything else (inheritance, `this`, `instanceof`, method borrowing, why `extends Error` misbehaves in transpiled code) sits on top of it.
**Study exactly:** `[[Prototype]]` vs `.prototype`; `Object.getPrototypeOf` / `Object.create` / `Object.setPrototypeOf`; how `new` works in four steps; the two links `extends` creates; `#private` fields; `super` and `[[HomeObject]]`; `instanceof` walking the chain. Be able to draw the chain for `class Dog extends Animal` on a whiteboard.

### 2. Copying, immutability and `structuredClone` — **from the knowledge base** ([[Array Notes]], [[Utils]])
Daily-driver knowledge, and you asserted something false about it. Directly underpins React state updates and Redux reducers.
**Study exactly:** shallow vs deep with nested objects; spread vs `Object.assign` (setters vs define); the full `JSON` round-trip loss table above; `structuredClone` support and limits; `Object.freeze` is also shallow; immutable update patterns for nested state.

### 3. Async error handling — **gap, outside the knowledge base**
Full skip. Non-negotiable at senior level: it is the difference between an app that degrades and one that white-screens.
**Study exactly:** why `try/catch` can't cross a task boundary; `unhandledrejection` (browser) vs Node's crash-by-default; `Promise.allSettled` result shapes; typed error classes and `cause`; `AbortController` + `AbortSignal.timeout()`; retry with exponential backoff **and jitter**; which layer catches what; React error boundaries and what they do *not* catch (async, event handlers).

### 4. Concurrency control and production failure modes — **gap — REPEAT from [[Mock Interview Session 01]]**
Second session in a row this exact area was thin. Escalate it.
**Study exactly:** browser per-origin connection limits (HTTP/1.1 vs HTTP/2 multiplexing); writing a concurrency pool by hand; `p-limit` / `p-queue`; the four `Promise` combinators and when each is right; request cancellation and dedup; idempotency keys; when to demand a batch endpoint instead.

### 5. Closures at engine level — **from the knowledge base — REPEAT from [[Mock Interview Session 01]]**
Improved from Session 01 (you got the GC direction) but still not concrete. Nearly there — needs the pattern list, not more theory.
**Study exactly:** the four leak patterns above, cold; `AbortController` for listener cleanup; `WeakMap` / `WeakRef` / `FinalizationRegistry`; and do one hands-on pass with Chrome DevTools → Memory → heap snapshot, filtering for **Detached** nodes.

---

## 5. Next session (Session 04)

Direct re-tests, no warning, no easier phrasing:

1. **Prototype chain** — walk a lookup out loud; the two links `extends` creates.
2. **Deep vs shallow copy** — plus the `JSON` loss table from memory.
3. **Async error handling** — the three-layer question again.
4. **Concurrency** — same 200-request scenario, third attempt. Failure modes required this time.
5. **Closures** — name three leak patterns and their fixes, no theory.

New ground, assuming the above holds:

6. `this` binding — the five rules, and why arrow functions have no `this` of their own.
7. Event loop, level two — `await` resumption points, microtask starvation, `requestAnimationFrame` vs `requestIdleCallback` (Q2 was strong, so it gets harder).
8. Module systems — ESM vs CJS, static analysis, tree-shaking, circular imports, `import()` and code splitting.
9. Security — XSS sinks (`innerHTML`, `dangerouslySetInnerHTML`), CSP, token storage: `localStorage` vs httpOnly cookie, CSRF and SameSite.
10. Architecture / design — structure a shared API client for a multi-team codebase: auth refresh (with the token-refresh race, still unanswered since Session 01), caching, retries, cancellation, typing.

> [!warning] Session rule for next time
> **Paste the knowledge base first.** It has not been pasted for two sessions, so the questions are
> unweighted toward what you actually studied — which makes the score read lower than your real coverage.
