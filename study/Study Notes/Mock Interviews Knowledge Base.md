---
title: Mock Interviews Knowledge Base
date: 2026-08-31
tags:
  - study
  - interview
  - promotion
  - javascript
  - react
  - web-platform
  - security
  - mock-interview
parent: "[[The Best Notes of the F Word]]"
source: Consolidation of Mock Interview Sessions 01–04, written in the format of [[Assessment Questions]]
---

# Mock Interviews Knowledge Base

Everything from [[Mock Interview Session 01]] · [[Mock Interview Session 02]] · [[Mock Interview Session 03]] · [[Mock Interview Session 04]], rewritten as a **question → answer** base, in the same format as [[Assessment Questions]], so it can be used the same way: read the question, answer it out loud, then uncover.

Related: [[Assessment Questions]] · [[Questions for interviews]] · [[Design Patterns]] · [[The Best Notes of the F Word]] · [[Soft Skills and Processes to study]]

> [!danger]- The one pattern behind four sessions (read this first)
> The diagnosis was **the same every session**:
> - **S01** — "you know the vocabulary but not the mechanism underneath."
> - **S02** — the mechanism arrives, but **the wrong word breaks the right idea** (said *"macro task queue"* for promises, called a **strategy** a **facade**).
> - **S03** — same as S01, plus **inventing a difference that does not exist** (`Object.assign` vs spread).
> - **S04** — the opening answer is right or half-right almost every time, and **the second layer never arrives**; twice the follow-up **drifted to an adjacent topic** (browser paint → React re-render, CSRF → XSS).
>
> So there are exactly **three failure modes**, and none of them is "I did not study enough topics":
> 1. **Label instead of mechanism.** One layer below the word is empty.
> 2. **Wrong name for the right idea.** The panel hears "he does not know the difference".
> 3. **Drift under pressure.** Answering an adjacent question instead of saying "I don't know".

> [!note] How to read this note
> Every entry is a real question from a session. The answer is the one that was **wanted**, not the one that was given. `> [!danger]` marks what was said wrong; `> [!question] Short answer for the interview` is the 3–5 sentences to memorise.

---

## Score history

| Session | Date | Format | Result | Level |
|---|---|---|---|---|
| [[Mock Interview Session 01]] | 2026-08-17 | 3 of 10 answered | 0.5 / 3 | **Mid** |
| [[Mock Interview Session 02]] | 2026-08-18 | 5 asked, 2 answered | 0 ✅ / 2 ⚠️ / 3 ❌ | **Mid** |
| [[Mock Interview Session 03]] | 2026-08-24 | 7 of 10 reached | 2 ✅ / 2 ⚠️ / 2 ❌ / 1 skip | **Mid** |
| [[Mock Interview Session 04]] | 2026-08-27 | 8 of 12 reached | 1 ✅ / 5 ⚠️ / 1 ❌ / 1 skip | **Mid**, one Senior answer |

**Four sessions, same band.** The score does not move because the failure modes do not move.

---

## 🔁 The vocabulary drill — the highest value table in this note

Say these out loud, every day, until the pair is automatic. Each row cost real points.

| What was said | What it is | The tell that separates them |
|---|---|---|
| promises → *"macro task queue"* | **microtask** queue | Task = timer / I-O / UI event. **Reaction of a promise is always a microtask** |
| *"my favourite is the **facade**"* about a provider map | **strategy** | Facade hides the **depth** of **one** thing. Strategy hides the **variation** between **N** interchangeable things. If there is nothing to swap, it is a facade |
| *"move it to a **service worker**"* | **Web Worker** | Web Worker = another thread for CPU. Service Worker = network proxy, cache, offline |
| *"Next.js has **SSL** built in"* | **SSR** | SSL = certificate and encryption. SSR = render on the server |
| CSRF follow-up answered with **XSS** | **CSRF** | XSS = the attacker runs **JS on my origin**. CSRF = the attacker's site makes the **browser send my cookie** |
| layout + paint dominating = *"a re-render"* | **browser pipeline** | Re-render is React building a tree. Layout/paint is the browser below React. Different layer |
| error boundaries for an **async** failure | boundaries catch **render-time only** | They do not catch async, promise rejections, or event handlers |
| *"`Object.assign` copies the full object"* | **both are shallow**, identically | Difference is setters vs define, and mutating a target vs a new literal |
| *"`let` has function scope"* | **block** scope | `var` is function-scoped and hoisted to `undefined`; `let`/`const` are block-scoped with a **TDZ** |
| *"hooks came in React 16"* | **16.8** | February 2019 |
| *"restart the sprint from zero"* | **only the PO can cancel**, and only if the Sprint Goal is dead | There is no restart rule. Scope is renegotiable, the **Goal** is not |

---

## The answer skeleton (use it every single time)

> [!tip] Four beats, said in this order
> **1. Definition** → **2. Mechanism one layer below** → **3. Trade-off / failure mode** → **4. When I would NOT do it, and how I measure it.**
>
> And three senior moves that were missing in all four sessions:
> - **Name the boundary.** Say what stays *out* of the abstraction. Knowing what **not** to centralise is a stronger signal than knowing what to.
> - **Quantify the payoff.** Not *"we can add providers easily"* → *"adding Apple was one module plus one key, no existing file was edited — that is open/closed"*.
> - **Question the requirement first.** 200 parallel requests is an N+1 over HTTP before it is a concurrency problem.
>
> And one rule: **if a question has two parts, say "two things" out loud and count them.** Half answers cost points in S02 Q1 and S04 Q1.

---

# 1. JS core & runtime

## How does the event loop really work — including the step your notes are missing?

The loop has **four** steps, not three:

1. Take **one** task (macrotask) and run it to the end.
2. Drain the **whole** microtask queue — including microtasks created while draining.
3. **Update the rendering**: `requestAnimationFrame` → recalculate style → layout → paint. About every 16.7 ms at 60 Hz, and skipped if nothing changed.
4. Repeat.

**Rendering is a step of the loop.** It is not something the browser does in parallel somewhere else.

- **Macrotask**: `setTimeout`, `setInterval`, `setImmediate`, I/O, `click`, `scroll`.
- **Microtask**: `.then` / `.catch` / `.finally`, the body after an `await`, `queueMicrotask`, `MutationObserver`.

> [!danger] What broke this in S02
> Said promises go to the *"macro tasck queue"*. It is written correctly in **three** places of this vault ([[The Best Notes of the F Word#Microtask queue]], [[Assessment Questions]], [[Questions for interviews#What is an event]]) and it still came out wrong under pressure. This is the number-one drill.

> [!question] Short answer for the interview
> "Rendering is a step of the event loop, not something in parallel. Each turn: one task, then the whole microtask queue drained, then style, layout and paint. Promise reactions are microtasks, so they always run before a `setTimeout(0)`, and they all run before the next paint."

## The page is frozen — no clicks, no scroll, and a pure-CSS spinner has stopped. The stack is empty most of the time. What is happening?

**Microtask starvation.** A microtask queues another microtask, so step 2 never finishes:

- The loop never reaches step 3 → no paint → **the CSS animation freezes**, because its frames are computed on the main thread.
- The loop never returns to step 1 → click and scroll stay in the task queue → **no input**.
- The stack looks empty because each microtask is tiny. **Memory stays flat.** Fingerprint: **100% CPU, normal memory** — starvation, not a leak.

```js
let n = 0;
setTimeout(() => console.log("timer fired, after n =", n), 0);
function loop() {
  n++;
  if (n < 100000) Promise.resolve().then(loop);   // microtask queues microtask
}
loop();
console.log("sync end, n =", n);
// sync end, n = 1
// timer fired, after n = 100000   ← the timer waited for ALL the microtasks
```

The same recursion with `setTimeout` does **not** starve — every timer is a separate task, so the loop breathes and paints between them.

| Recursion | Queue | Result |
|---|---|---|
| `setTimeout(loop, 0)` | task | Loop still reaches step 3 → page paints, spinner moves, CPU burns |
| `Promise.resolve().then(loop)` | **microtask** | Step 3 never arrives → page completely dead |

**Detection**: Performance tab → a long block with **no Frame markers and no Paint entries**. A normal long task is one big yellow block; starvation is many small ones with nothing between.

> [!tip] The follow-up they always ask
> *"Would a spinner using `transform: rotate()` also freeze?"* → Often **no**. `transform`, `opacity` and `filter` can be animated on the **compositor thread**, so they keep moving while the main thread is dead. Anything that needs layout (`width`, `left`, `top`, `margin`) freezes. This single fact proves you know which thread does what.

## What is a closure, at engine level?

A closure is **a function plus a live reference to the lexical environment where it was defined**, not where it is called. Privacy is one *use* of it, not the definition.

- Every function holds an internal `[[Environment]]` reference to the **Lexical Environment** of its definition.
- That environment is a **heap-allocated object** holding the bindings.
- When the outer function returns, its environment would normally be garbage — but if an inner function still references it, the environment **survives**.

### Execution context ≠ lexical environment

This is the distinction the whole answer stands on. They are **two different objects, in two different memories, with two different lifetimes**. Saying *"the context is not cleaned up"* is what breaks the answer, because the stack frame is **always** cleaned up.

| | **Execution context** | **Lexical Environment** (V8 calls it a `Context`) |
|---|---|---|
| Created | when the function is **called** | when the inner function is **defined** |
| Lives in | the **stack** | the **heap** |
| Dies | always, on `return` | only when nothing references it |

Step by step, for:

```js
function withClosure() {
  const big = new Array(2e6).fill('x'); // ~16MB
  return () => big.length;
}
const f = withClosure();
```

1. V8 parses the code and **before running it** already knows the arrow captures `big`. So `big` is **not** put in the stack frame — it goes into a `Context` object on the heap.
2. The execution context is created → a frame is pushed on the stack.
3. The arrow function object is created, with `[[Environment]]` pointing at that heap `Context`.
4. `return` → **the stack frame is popped and gone**. Always.
5. But `f` → arrow → `[[Environment]]` → `Context` → `big`. So `big` stays.

```
STACK (dies on return)          HEAP (survives)
┌────────────────────┐          ┌─────────────────┐
│ withClosure frame  │  ✗ pop   │ Context         │
└────────────────────┘          │   big: [16MB]   │
                                └────────▲────────┘
   f (global) ──► arrow fn ─────────────┘
                  [[Environment]]
```

So there is nothing to *clean* on the stack. There is something to **release** on the heap.

V8 normally retains only the variables the closure **actually references** (computed at parse time) — but closures created in the **same scope share one environment object**, and `eval` or `with` in that scope defeats the optimisation entirely.

> [!danger] Said in S01 and again in S03
> *"A safe place for private variables"* is a **use case**, not a mechanism. Two sessions in a row the follow-up ("give me a leak pattern") could not be answered.

## Name the closure-related memory leak patterns and their fixes

### First: the GC counts paths, not scopes

The collector never asks *"has this function finished?"*. It does **mark-and-sweep from the GC roots** — it marks everything reachable and deletes the rest. The roots that matter in the browser:

- the **global / module scope**
- the current **call stack**
- the **DOM tree** (nodes inside `document`)
- the browser's own lists: **active timers, registered listeners, observers, pending promises**

> [!important] The one sentence
> A leak is **an object you will never use again that still has a path from a root**.

Which makes the four patterns below the same bug four times. Only the root changes — and in the interview, **naming the root is the answer**.

| Pattern | The root that was not released |
|---|---|
| 1. Detached node | something still alive points at the node |
| 2. `setInterval` | the browser's timer list holds the callback |
| 3. Subscription | the emitter's subscribers array |
| 4. Shared environment | your own variable holds the whole `Context` |

**1. Detached DOM node held by a listener**

```js
function mount() {
  const node = document.getElementById('panel');
  const rows = new Array(1e6).fill('data'); // ~8MB
  node.addEventListener('click', () => console.log(rows.length));
  node.remove(); // out of the DOM — NOT out of memory
}
```

> [!danger] Correction — this example as written does **not** leak
> The listener is stored **on the node itself**. Once `mount()` returns, if nothing references `node`, the whole group (node + listener + `rows`) is unreachable from every root, and the browser collects it. `remove()` alone is not a leak.
>
> A detached node leaks **only when something alive still points at it**. Two real versions:
>
> ```js
> const cache = [];                  // ← module scope = a GC root
> function mount() {
>   const node = document.getElementById('panel');
>   const rows = new Array(1e6).fill('data');
>   node.addEventListener('click', () => console.log(rows.length));
>   cache.push(node);                // ← this is what leaks
>   node.remove();
> }
> ```
>
> ```js
> // the listener sits on something that never goes away
> window.addEventListener('resize', () => node.classList.add('x')); // window IS a root
> node.remove(); // node stays alive through the closure hanging off window
> ```
>
> Why this matters: if the answer is *"the detached node stays in memory"* and the follow-up is **"held by what?"**, the root has to be nameable. Otherwise it is failure mode 1 again — label instead of mechanism.

Fix: `removeEventListener`, or better an `AbortController`:

```js
const ac = new AbortController();
node.addEventListener('click', handler, { signal: ac.signal });
ac.abort(); // detaches every listener registered with this signal
```

**2. `setInterval` never cleared** — the interval is a GC root; everything the callback closes over lives until `clearInterval`.

**3. Subscriptions with no unsubscribe** — emitters, stores, websockets. Every `subscribe` needs a teardown (in React, the cleanup returned from `useEffect`).

**4. Shared lexical environment** — keeping a tiny closure can pin a huge variable used by a sibling closure in the same scope.

```js
function sharedScope() {
  const big = new Array(2e6).fill('x'); // ~16MB
  const small = 42;
  const usesBig   = () => big.length;   // the sibling that does use big
  const usesSmall = () => small;
  return usesSmall;                     // only this one is kept
}
```

Verified in Node ✅ (`--expose-gc`, `global.gc()` twice, 5 closures of ~16MB each):

| Case | Retained |
|---|---|
| the closure does **not** reference `big` | **0.0 MB** |
| the closure references `big` | **76.3 MB** |
| the closure only uses `small`, a **sibling** uses `big` | **76.3 MB** |

Row 1 is the V8 optimisation: `big` is never captured, so it is not in the `Context` at all. Row 3 is this pattern — the small closure retains the same 76 MB as the big one, because `usesBig` and `usesSmall` **share one `Context` object** and `big` is inside it.

Fix: put the big value in its own scope, or `big = null` when it is no longer needed.

**Detection**: DevTools → Memory → **heap snapshot**, take two, use *Comparison*, filter for **`Detached HTMLElement`** and `Closure` retainer chains.

**Names to drop**: `WeakMap`, `WeakRef`, `FinalizationRegistry` — references that do not prevent collection.

> [!question] Short answer for the interview
> "Calling a function creates an execution context on the stack, and that frame always dies on the return. Separately, V8 allocates a `Context` object on the heap holding the variables that some inner function captures — decided at parse time — and the function keeps a reference to it in `[[Environment]]`. So the leak is not that a context 'is not cleaned up': it is that the heap object is still reachable from a GC root — the timer list, an emitter's subscribers, or a variable of mine. The classic ones are a listener on a detached node, an interval never cleared, a subscription without teardown, and closures sharing one environment, so keeping the smallest one can pin the biggest variable. I find them with two heap snapshots in DevTools, comparing and filtering for detached nodes."

## Walk the prototype chain for `dog.speak()`

1. Own property `speak` on `dog`? No.
2. Follow `dog.[[Prototype]]` (`Object.getPrototypeOf(dog)`, legacy `__proto__`) → `Dog.prototype`. Found? No.
3. Follow `Dog.prototype.[[Prototype]]` → `Animal.prototype`. Found → call it with `this` bound to **`dog`** (the receiver, not the object where the method was found).
4. Otherwise continue → `Object.prototype` → `null`. Chain ends → `undefined` → `TypeError: dog.speak is not a function`.

**Reads walk up, writes land locally.** `dog.speak = fn` creates an **own** property that shadows the prototype's (unless a setter is found on the chain).

`class Dog extends Animal` creates **two** links, not one:

```js
Object.getPrototypeOf(Dog.prototype) === Animal.prototype; // instance methods
Object.getPrototypeOf(Dog)           === Animal;           // STATIC methods — the forgotten one
```

**What `class` gives that ES5 constructors cannot replicate:**

- **`#private` fields** — enforced by the engine, not a convention. `#x in obj` is the brand check.
- **Correct subclassing of built-ins** (`Array`, `Error`, `Map`) — `super()` allocates the exotic object via `new.target`.
- **Cannot be called without `new`** — `Dog()` throws.
- Methods are **non-enumerable**, so they do not appear in `for...in`.
- Class bindings are **not hoisted** — they sit in the TDZ, like `let`.
- `super.method()` uses `[[HomeObject]]`; the manual `Parent.prototype.method.call(this)` breaks in deeper hierarchies.

## `var`, `let`, `const` and the TDZ

| | Scope | Hoisting | Reassign | Mutate |
|---|---|---|---|---|
| `var` | **function** | hoisted, initialised `undefined` | ✅ | ✅ |
| `let` | **block** | hoisted but in the **TDZ** | ✅ | ✅ |
| `const` | **block** | hoisted but in the **TDZ** | ❌ | ✅ |

`const` blocks **reassignment**, not mutation — so `arr.push(x)` on a `const` array works. Touching a `let`/`const` before its declaration throws `ReferenceError: Cannot access 'x' before initialization` — that is the TDZ, and it is different from `var`, which gives `undefined`.

> [!note] S03 — self-correction counts
> First pass said `let` has function scope; the follow-up self-corrected fully. **Self-correcting is fine.** Asserting confidently and being wrong is what scores worse than "I don't know".

## Shallow vs deep copy — and the claim to unlearn

**`{...obj}` and `Object.assign({}, obj)` are both shallow, to exactly the same depth.**

```js
const obj = { a: 1, nested: { b: 2 } };
const s = { ...obj };
const a = Object.assign({}, obj);
s.nested === obj.nested; // true
a.nested === obj.nested; // true — identical
```

Both copy **own enumerable** properties (string and symbol keys), one level deep.

The differences that **do** exist:

- `Object.assign` **triggers setters** on the target; spread defines properties directly (`[[DefineOwnProperty]]`, no setters run).
- `Object.assign` mutates an existing target; spread always builds a fresh literal.
- Neither copies the **prototype** — a spread class instance becomes a plain object.
- Both **invoke getters** and flatten them to plain values.
- `Object.freeze` is also **shallow**.

**Deep copy today: `structuredClone()`** (native, modern browsers + Node ≥ 17). Handles `Date`, `Map`, `Set`, `RegExp`, `ArrayBuffer`/TypedArrays, `Blob`/`File`, `BigInt` and **circular references**. Throws `DataCloneError` on functions, DOM nodes and `Symbol`. Drops prototypes, getters/setters and property descriptors.

**What `JSON.parse(JSON.stringify(obj))` silently destroys:**

| Input | Becomes |
|---|---|
| `undefined` as an object value | key removed |
| `undefined` as an array element | `null` |
| function / `Symbol` value | key removed |
| `Date` | ISO **string** |
| `Map` / `Set` | `{}` |
| `NaN` / `Infinity` | `null` |
| `BigInt` | **throws** `TypeError` |
| circular reference | **throws** `TypeError` |
| class instance | plain object, methods gone |
| custom `toJSON()` | silently rewrites the output |

> [!danger] S03 — invented difference
> Claimed `Object.assign` copies the full object while spread is shallow. **Confident and wrong is worse than a skip.** When unsure, say "I would verify that".

## Debounce vs throttle — and when the framing itself is wrong

- **Debounce**: wait until the events **stop** for N ms, then fire once. Collapses a burst into its trailing edge.
- **Throttle**: fire at most once per N ms **during** the burst. Guarantees a steady rate.

| Case | Tool | Why |
|---|---|---|
| Autocomplete input | **Debounce** ~300 ms | Only the finished query matters. Must also **cancel the in-flight request** with `AbortController`, or a slow earlier response overwrites a newer one |
| Infinite scroll | **Throttle** ~100–200 ms | Updates are needed *during* the scroll. Better still: `IntersectionObserver` on a sentinel — zero scroll handlers |
| Double-clicked Save | **Neither** | Disable the button on submit + an **idempotency key**. Debounce is a UI-timing hack over a **correctness** problem — the network can duplicate the request regardless of the timer |

> [!tip] The seniority signal
> That last row. Recognising when debounce/throttle is the wrong frame entirely.

---

# 2. Async, concurrency and error handling

## 200 requests to fire: `Promise.all`, a sequential loop, or batches?

**Batches / a pool of 5–10** — because it **bounds concurrency**, not because it is "flexible".

| Option | The real trade-off |
|---|---|
| `Promise.all` | **Fastest**, but risks 429s and connection-pool exhaustion. Not "too slow" |
| Sequential `for...of` | Makes the **fewest** concurrent requests, not "a lot". Unusably slow: 200 × latency |
| Batched / pool | Bounds concurrency, gives one place for retries, backoff and cancellation |

> [!warning] `Promise.all` rejects fast but does NOT cancel
> When request 137 rejects, the other 199 **keep running to completion**. You just never see their results. Wasted bandwidth, and the side effects still fire. Promises have no cancellation — that is `AbortController`.

**The production failure modes** — this is the part that was missing in S01, S03 **and** S04:

*Client side*
- **HTTP/1.1 caps ~6 connections per origin.** 200 promises start instantly; 194 sit in the browser socket queue. You did not parallelise — you built an invisible queue you cannot control. HTTP/2 multiplexes, which changes but does not remove the limit.
- **Every timeout starts at t = 0.** Request #180 waits for 190 requests' worth of queue time and then times out although the server is healthy → cascading false failures.
- **Memory spike** — 200 in-flight responses buffered at once.
- **No cancellation** — the user navigates away and all 200 keep going.

*Server side*
- **429 rate limiting** — partial success where a pool would get 100%.
- **Thundering herd**, and a naive retry-all doubles the burst.
- Connection-pool / DB exhaustion if each request hits the DB.

**What the pool buys**: bounded memory, bounded in-flight time (so timeouts mean something), one place for retry with **exponential backoff + jitter**, respect for `Retry-After`, and one `AbortController` that kills the whole batch.

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
> "Before tuning concurrency I would ask why the client makes 200 calls at all. This is an **N+1 over HTTP**. The real fix is a batch endpoint — `GET /items?ids=1,2,3` — or cursor pagination. If I cannot change the backend, then a pool of 5–10 with backoff, jitter and a shared `AbortController`."
>
> **Senior = question the shape of the problem first, then engineer inside the constraint.**

> [!danger] 🔁 Recurring — three sessions
> S01 Q2, S03 Q3, S04 Q4. Every time the combinator was picked correctly and **zero** production reasoning followed. This is the single most repeated gap in the whole record.

## The four combinators

| | Resolves when | Rejects when | Use it for |
|---|---|---|---|
| `all` | **all** fulfil | the **first** rejection (others keep running) | all-or-nothing |
| `allSettled` | **all** settle | never | batches where survivors matter |
| `race` | the **first** to settle, either way | the first rejection if it is first | timeouts |
| `any` | the **first** fulfilment | only if **all** reject (`AggregateError`) | fallbacks / mirrors |

## Why does `try/catch` not catch an error thrown inside `setTimeout`?

```js
try {
  setTimeout(() => { throw new Error('boom'); }, 0);
} catch (e) {
  // never runs
}
```

`setTimeout` **returns immediately**. The `try` block completes and its stack frame is gone. The callback runs later, in a **new macrotask on a fresh, empty call stack** — there is no `catch` above it. It becomes an uncaught exception → `window.onerror` / `process.on('uncaughtException')`.

**`try/catch` catches lexically and synchronously, not temporally.** `await` works precisely because it resumes the *same* function frame:

```js
try { await delay(0).then(() => { throw new Error('boom'); }); } catch (e) { /* caught */ }
```

**Unhandled rejections**

- **Browser**: fires `unhandledrejection` on `window` (cancelable with `preventDefault()`), logs, the page keeps running. Hook it to the error tracker.
- **Node ≥ 15**: default is `throw` — it **crashes the process** with `ERR_UNHANDLED_REJECTION`. Correct handling is log + graceful shutdown, not swallow.

```js
process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'unhandled rejection');
  server.close(() => process.exit(1));
});
```

Trap: attaching `.catch()` **later, in a different tick**, is already too late.

## Which layer catches which error?

| Layer | Responsibility |
|---|---|
| **fetch wrapper** | Transport only. `!res.ok` → typed `HttpError(status)`, `AbortController` timeout, retry idempotent 5xx/429 with backoff + jitter. **Never** decides product behaviour |
| **service / domain layer** | Domain meaning. 404 → `null` or throw? Fall back to cache? Map `HttpError` → domain error. **Most `try/catch` belongs here** |
| **UI component** | Presentation only. Error boundary / toast / retry button. Catches to *render*, never to decide |

> [!tip] The rule to say out loud
> "Catch where you can actually do something about it. Everywhere else, let it propagate. A `catch` that only logs and continues is a swallowed bug."

> [!danger] Error boundaries — the S01 miss
> They only catch **render-time** errors. They do **not** catch async code, promise rejections, event handlers, or SSR. That is why they were the wrong answer to the token-refresh question.

## Five requests get a 401 at the same time. What breaks, and what is the fix?

Five parallel 401s → five parallel refresh calls. Most refresh endpoints **rotate** the token, so the first refresh invalidates it and the other four fail → **the user is logged out**. That is the bug.

Fix — **single-flight**: one shared in-flight promise.

```js
let refreshing = null;

async function getFreshToken() {
  if (!refreshing) {
    refreshing = doRefresh().finally(() => { refreshing = null; });
  }
  return refreshing; // all five await the same promise
}
```

> [!question] Short answer for the interview
> "Concurrent 401s each trigger their own refresh, and because refresh tokens rotate, the first one invalidates the token for the rest — so the user gets logged out. The fix is single-flight: the first caller starts the refresh and stores the promise, everyone else awaits the same promise, and it is cleared in `finally`. Same pattern as request deduplication."

## Design the API layer for a multi-team codebase

- **Transport layer** — one `fetch` wrapper. Owns timeouts (`AbortController`), retries with exponential backoff + jitter. Retries **only** idempotent methods and 5xx / network errors, **never** 4xx.
- **Auth layer** — interceptor: attach the token on request; on 401 → **single-flight** refresh → replay once; a second 401 → logout.
- **Domain / API layer** — typed functions per endpoint. Maps raw responses to domain objects and HTTP errors into typed app errors.
- **Feature layer** — decides *what the user sees*.

> [!important] What you deliberately do NOT centralise
> **UX decisions.** Toast vs inline field error vs retry button vs silent — that is per feature. **Centralise the mechanics, never the presentation.** Saying this out loud is the senior signal: naming what stays *out* of the abstraction.

---

# 3. React

## The setter is called three times in one click handler, each time with the current value plus one. State starts at 0. What is on screen?

**1** — and there are **two separate reasons**, and the panel wants both:

| | What it explains |
|---|---|
| **The closure** | Why the value is **1** and not 3 |
| **The batching** | Why there is **one** re-render and not three |

The state variable is **a constant of that render**, so the three calls do not see each other:

```js
const count = 0;                              // the value React gave to THIS render
const calls = [count + 1, count + 1, count + 1];   // [1, 1, 1]
```

With the functional form `setCount(c => c + 1)` the result is **3**, and there is **still only one re-render** — that is the proof the two things are independent, and the best way to show you understand it.

**React 17 vs React 18**

| | Inside a React event handler | Inside `setTimeout`, a promise, a native listener |
|---|---|---|
| **React 17** | Batched → 1 render | **Not batched** → 3 renders |
| **React 18** (`createRoot`) | Batched → 1 render | **Batched too** → 1 render |

React 18 calls this **automatic batching**. The escape hatch when a render is genuinely needed in the middle is `flushSync`.

> [!question] Short answer for the interview
> "The value is 1, for two separate reasons. The value is 1 because of the closure — the state is a constant of that render, so all three calls read the same 0. And there is one re-render because React batches. With the functional form the result is 3 and there is still one render, which shows the two are different things. In React 17 batching only happened inside React event handlers, so the same three calls inside a `setTimeout` gave three renders; React 18 added automatic batching everywhere, and `flushSync` is the escape hatch."

## A teammate says "React is safe against XSS by default". Where is he right and where is he wrong?

**Right**: React **escapes automatically** every value interpolated in JSX. `{userInput}` can never inject HTML.

**Wrong** — the escape hatches:

| Hole | Example | Fix |
|---|---|---|
| **`dangerouslySetInnerHTML`** | `<div dangerouslySetInnerHTML={{ __html: comment }} />` | Sanitize with **DOMPurify** first |
| **URL in `href` / `src`** | `<a href={userInput}>` with `javascript:alert(1)` | Validate the protocol: only `http:`, `https:`, `mailto:` |
| **Spreading props onto a DOM node** | `<div {...userObject} />` — the user sends `dangerouslySetInnerHTML` | Never spread an object that comes from outside |
| **A ref writing HTML** | `ref.current.innerHTML = userInput` | Same rule as `dangerouslySetInnerHTML` |
| **State serialized into SSR HTML** | `window.__STATE__ = ${JSON.stringify(state)}` where the state contains `</script>` | Escape `<`, `>`, `&` in the serialization |
| **Injection through `style`** | `style={{ background: userInput }}` with `url(javascript:...)` | Old browsers only, still on the list |
| **A third-party component** | The library uses `innerHTML` internally | Read the code, or trust nothing |

Angular is the same shape: safe by default, escape hatch `bypassSecurityTrustHtml`.

> [!question] Short answer for the interview
> "He is right that React escapes by default — everything interpolated in JSX is escaped. But that covers only text. The holes are the escape hatches: `dangerouslySetInnerHTML`, a `href` or `src` with a `javascript:` URL, spreading user-controlled props onto a DOM element, writing `innerHTML` through a ref, and the state serialized into the HTML in SSR. For rich text the answer is DOMPurify, for URLs protocol validation, and CSP as the second wall."

## Explain hydration to a non-technical PM

> The server sends a finished **picture** of the page, so it appears fast — but a picture has no buttons.
> The browser then downloads the app's JavaScript and walks the whole page attaching the behaviour to every element.
> Until that pass finishes, clicks land on something that **looks** like a button but has nothing wired to it yet.
> The bigger the page and the more JavaScript we ship, the longer that gap lasts.
> We shrink it by shipping less JavaScript, splitting it so the visible part wires up first, and prioritising what users touch soonest.
> The trade-off is real: server rendering buys the fast *appearance*, and we pay for it in that interactive delay.

**The technical layer behind it**: the gap is the **uncanny valley** — visible but not interactive — and it shows up as bad **INP**. Fixes: less JS, code splitting, islands / partial hydration, progressive hydration, RSC.

**One line each on the strategies**: CSR (ship JS, render in the browser) · SSR (HTML per request) · SSG (HTML at build time) · ISR (SSG + revalidation) · streaming SSR (send HTML in chunks) · RSC (components that never ship JS).

> [!danger] S04 — the answer drifted
> Answered *"server-side rendering has trade-offs, the server has to build the UI before showing you"*. That explains **TTFB**, not the dead-click gap. Re-prompted with "the page is already visible", the answer was `next`.

## Optimistic UI: three mutations in flight and one fails. How do you handle it?

The three steps: **write to the cache → fire the request → on error roll back to the snapshot**, then invalidate and refetch so the server stays the source of truth.

The part that was missing — **the concurrency**:

- **Per-item optimistic state**, never a global "saving" flag, so N in-flight mutations do not collide.
- **Out-of-order responses**: last-write-wins by request id, or cancel superseded requests.
- **Per-item rollback**, not a global rollback that would discard the two that succeeded.
- **Retry safely**: idempotency keys. Never blindly retry a non-idempotent write.
- **When not to be optimistic**: payments, irreversible actions, anything with server-side validation the client cannot predict.

## `useEffect` vs `useLayoutEffect`, and the dependency array

- **`useEffect`** runs **after** the browser paints. Does not block the paint.
- **`useLayoutEffect`** runs after React writes to the DOM but **before** the paint. Blocks the paint. Correct place for DOM measurements or for changes that would produce a visible jump.

The dependency array holds **any reactive value** used inside the effect — props, state, context, and derived values — not only props. `[]` = once after mount; `[a, b]` = when they change; no array = after every render. The **cleanup** returned from the effect is what runs on unmount; ignoring the array produces **stale closures**, and `react-hooks/exhaustive-deps` is the lint rule that catches it.

Full detail in [[Assessment Questions]] and [[The Best Notes of the F Word#Which methods replace useEffect]].

---

# 4. Patterns and architecture

## Facade vs Strategy — the pair that failed

| | What is behind the door | It hides | The test |
|---|---|---|---|
| **Facade** | **One** thing | The **depth** — many low-level calls become one call | There is **nothing to swap** |
| **Strategy** | **N** interchangeable things | The **variation** — the caller passes a key instead of writing a branch | I can **swap the implementation at runtime** and the caller does not change |

Both end in "one simple call". That is why they get confused.

## Give a real case where you used the strategy pattern

Social login with Google, Facebook and Apple. **The design had both patterns, and saying that is the senior answer:**

1. **A facade per provider** — `googleAuth`, `facebookAuth`, `appleAuth`, all with the same shape `signIn(): Promise<Session>`. Each hides the depth of one SDK: its redirect, its token format, its error codes.
2. **A strategy to select** — a map keyed by provider name. The click handler becomes `providers[name].signIn()`, with zero branching.

```js
const providers = {
  google:   { signIn: () => "session:google" },
  facebook: { signIn: () => "session:facebook" },
  apple:    { signIn: () => "session:apple" },
};
const signIn = (name) => providers[name].signIn();
```

**What it bought the team** — quantified, not "it is easier":

- **Open/closed** — adding Apple was **one new module plus one key**. **No existing file was edited.** That is the **O** of SOLID ([[Design Patterns#SOLID]]).
- **Testability** — the handler depends on the `AuthProvider` shape, so it can be tested with a fake instead of mocking three real SDKs.
- **Blast radius of one** — when a provider changes its SDK, one file changes.

**When it is the wrong choice** — "too much complexity" is a feeling, not a criterion:

- **The variants are not really interchangeable.** The moment one provider needs an extra argument or returns a different shape, the shared interface is a lie and `if (name === "apple")` comes back to the caller. **This is the one that kills the design.**
- **Two options that will never be three** — a normal `if` reads better. YAGNI.
- **The variants share 90% of the logic** — that is **template method**, or just a parameter.
- **The choice is fixed at build time** — that is configuration or DI, not strategy.

> [!tip] The follow-up they were going to ask
> *"Where is the new provider registered, and what stops two modules registering the same key?"* → **One registry module**, and the key typed as a **union of literals**, never `string`:
> ```ts
> type ProviderName = "google" | "facebook" | "apple";
> const providers: Record<ProviderName, AuthProvider> = { /* ... */ };
> ```
> `Record<ProviderName, ...>` forces every provider to be implemented, and a typo in a key is a compile error.

---

# 5. The browser platform (the biggest blind spot)

## Scrolling is janky. Layout and paint dominate the frame. What is happening and how do you fix it?

Long layout and paint bars mean the browser is recomputing **geometry** and repainting **pixels** every frame. **It is below React — it is not a re-render.**

The five phases: **JS → Style → Layout → Paint → Composite.** Budget: **16 ms** per frame at 60 Hz.

Fix in this order, re-recording after each change:

1. **Layout thrashing (forced synchronous layout)** — writing a style and then reading `offsetHeight` / `getBoundingClientRect` in the same loop forces a synchronous layout each pass. Batch reads, then writes.
2. **Scroll handler doing DOM work on every event** — batch into `requestAnimationFrame`, and register the listener as **passive**.
3. **Cost per row** — shadows, filters, blurs, huge images, or animating `top` / `height` instead of `transform` / `opacity`, which stay on the **compositor**.
4. **DOM size** — thousands of rows recalculate style and layout even off-screen. **Virtualization** or `content-visibility: auto`, plus `contain`.

Acceptance criterion: hold the frame budget at **16 ms**.

> [!danger] S04 — the drift
> The follow-up about layout/paint dominance was answered with *"a re-rendering problem, the scroll causes a re-render"* — **React vocabulary applied to a browser-pipeline symptom**. Layout thrashing, compositor and virtualization were never named.

> [!tip] The reflex that was already right
> The opener in S04 Q1 was *"do not change anything yet — console warnings first, then a Performance recording, find the phase."* **Diagnosis before code is a senior reflex. Keep it.**

## CDN caching and versioning on release day

The standard SPA recipe:

- **Hashed chunk filenames** → `Cache-Control: max-age=31536000, immutable` (cache forever).
- **`index.html`** → `no-cache` (revalidate every time). It is the only file that points at the new hashes.
- `no-cache` = revalidate before use. `no-store` = never write it down. `stale-while-revalidate` = serve stale, refresh in the background.
- **The old app keeps running after a deploy** because it already has its JS. Hence the "new version available, reload" pattern.
- **Chunk 404s after a deploy** — the running old app asks for a chunk that no longer exists. Keep **N previous builds** on the CDN and reload on a chunk-load error.
- `ETag` / `Last-Modified` for revalidation; CDN purge vs cache-busting by filename.

## Build an accessible modal

**`<dialog>` + `showModal()`** first — it gives the **top layer**, the **inert background** and **Escape** for free. That was the correct instinct in S04.

Then the layer that was missed — **focus**, in four rules:

1. **Move focus in** when it opens (the dialog, or the first meaningful control).
2. **Trap it** while open — Tab cycles inside.
3. **Restore it** to the trigger element on close.
4. **Never trap it forever** — Escape always works.

Only **after** that come the labels: `aria-modal`, `aria-labelledby` on the title, `aria-describedby` on the body. Visible focus indicators are mandatory — removing `outline` is a bug, not a design choice.

Audit loop: **keyboard only → screen reader (VoiceOver) → axe**.

> [!danger] S04 — the drift again
> The follow-up asked specifically about **focus** and the answer went to **ARIA labels**. Labels are the second layer, not the first.

---

# 6. Security

## XSS vs CSRF — never swap these two words again

| | XSS | CSRF |
|---|---|---|
| What it is | The attacker **runs JavaScript on my origin** | The attacker's site makes **the browser send my cookie** |
| What it needs | An injection sink | An authenticated session and automatic credentials |
| httpOnly cookie | **Mitigates it** (JS cannot read the token) | **Does nothing** — the browser still sends it |
| Defences | Escaping, DOMPurify, protocol validation, **CSP** | `SameSite`, anti-CSRF token, check `Origin`/`Referer`, no state changes on GET |

## Where do you store the token for a cross-domain app, and what does that create?

**httpOnly + `Secure` + `SameSite` cookie** — not readable by JS, sent automatically. Correct, and it is only half the answer:

> The automatic sending is exactly what creates **CSRF**. The browser attaches that cookie to *any* request to my API, including one triggered by `evil.com`. So an attacker's page can perform a state change while the user is authenticated, **without ever reading the token**.
> `SameSite=Lax` blocks cross-site sends except top-level navigations; `Strict` blocks them entirely.
> **Cross-domain forces `SameSite=None; Secure`, which turns SameSite off** — so add an anti-CSRF token and validate `Origin` on every state-changing request.
> And no state changes on GET, ever — CORS does not stop a simple request from being **sent**, only the **reading** of the response.

The alternative pattern: **token in memory + refresh token in an httpOnly cookie** — survives XSS reads better, costs a refresh round-trip on every reload. Third-party cookie deprecation is pushing everything toward same-site APIs or a BFF.

**Never in `localStorage`** — any XSS reads it. Never log tokens or sensitive data — not in `console.log`, not in error tracking, not in analytics, not in a query string (they end up in logs, history and referrers).

> [!danger] S04 — the loop
> The follow-up asked what the automatic sending creates. The answer was **XSS**, which is the thing httpOnly already mitigates — so the answer looped back to the defence instead of naming the new hole. **CSRF.**

---

# 7. Testing, process and quality

## The e2e suite takes 40 minutes and is flaky. What do you do?

> [!warning] This is a **process** question, not a bug question
> S04 answered with two plausible root causes (state contamination, short timeouts). Both are individual-bug answers. The senior scope is **policy**.

**Sources of flake**: shared or leaked state between tests, `sleep` instead of waiting for a condition, hitting the real network, non-deterministic seed data, parallel workers fighting over fixtures, animations and clocks.

**The policy**:

1. **Quarantine** — a flaky test is muted **within one day**, ticketed with an owner, and deleted if it is not fixed in two weeks.
2. **Flake tracking** — record pass/fail per test over time. The dashboard is what stops accumulation, not willpower.
3. **Ban "re-run until green"** — or at minimum make every re-run visible and counted.
4. **Rebalance the pyramid** — most e2e flakes are integration tests wearing a browser. Push them down.
5. **Cut the 40 minutes** — parallelism, sharding, and run the full suite only on `main`.

Pyramid baseline in [[Assessment Questions]]: most **unit** (cheap, fast, they **localise the failure**), fewer integration, fewest e2e (expensive, slow, fragile — they only say *something* in the flow is broken).

## The Product Owner says on day 7 that the feature has no customer. What does Scrum actually say?

- **Only the Product Owner can cancel a Sprint**, and only when the **Sprint Goal is no longer valid**. Not the Scrum Master, not the team, not a manager.
- The only question is: **is the Sprint Goal still valid?**
  - Goal dead → the PO **may** cancel. It is rare, and usually means the Sprint was too long.
  - Goal alive → the Sprint continues, and the **scope is renegotiated with the PO**, which Scrum explicitly allows.
- What can **never** change during the Sprint is the **Goal**.
- If it is cancelled: finished work is reviewed and can be accepted, the rest returns to the Product Backlog, and the team goes back to Sprint Planning.
- **There is no "restart from zero" and no penalty.**

> [!danger] This is correction #6 of [[Assessment Questions]]
> Answered in the real assessment as *"we should restart the sprint and start from scratch"*. That rule does not exist. Then skipped again in S02 Q5 — so it has now cost points **twice**.

---

# 8. Management and situational

## Tell me about a disagreement you pushed and how it was resolved

> [!tip] The best answer of the four sessions — Senior level, do not change it
> The case: product wanted notification state in **`localStorage`**; the repo rules forbade client storage (security + a server-driven-UI methodology). Researched it, presented the reasons, the proposal was dropped, and it moved to a small dedicated DB — and **a spike doc was written for future reference**.
>
> **Research → align → decide → document** is exactly the senior loop. The written artefact left behind for the next person is what makes it senior rather than merely correct.

Reuse this structure for any behavioural question: **the concrete case → the real constraint → the negotiated outcome → what was left behind in writing.**

---

# What to do before the next session

## 🔁 Recurring gaps, in order of what hurts most

| # | Gap | Sessions | Why it is first |
|---|---|---|---|
| 1 | **Vocabulary swaps** | Assessment, S02 ×2, S04 ×2 | Costs points on questions **already known**. Fixed by drilling out loud, 30 min/day — not by reading |
| 2 | **Concurrency production failure modes** | S01, S03, S04 | **Three sessions.** The combinator is always picked right and the reasoning never arrives |
| 3 | **The second layer / follow-up depth** | S01, S02, S03, S04 | **All four.** The opener is right, the layer below is empty. Use the four-beat skeleton |
| 4 | **The browser below React** | S04 | Rendering pipeline, CDN caching, focus management, hydration — four questions, one missing foundation |
| 5 | **Closures — concrete leak patterns** | S01, S03 | The theory is there now. Memorise the four patterns cold |
| 6 | **Process answers given as bug answers** | S04 | Answer "how do you stop X accumulating" with a **policy**, not a root cause |

## Notes still missing from the vault

- [ ] `Browser Rendering Pipeline and Jank`
- [ ] `HTTP Caching and CDN for SPA Releases`
- [ ] `Accessible Components — Focus Management`
- [ ] `Rendering Strategies and Hydration`
- [ ] `Frontend Auth — Cookies, CSRF and CSP`
- [ ] `Test Strategy — Flakiness as a Process Problem`
- [ ] `Optimistic UI and Client Cache`
- [ ] Add the **render step** to [[The Best Notes of the F Word#Everything together: how JS runs the code]] — the cycle there has no step 3
- [ ] Add a **Facade vs Strategy** callout to [[Design Patterns]] (it only has Facade vs Adapter)
- [ ] Add **React 18 automatic batching** next to the `useState` callout in [[Assessment Questions]]

## Still unanswered across all four sessions — expect them again

1. Token-refresh race as a **design** question (open since S01).
2. CDN caching and release versioning (skipped in S04).
3. `useMemo` / `React.memo`: when they do **nothing**, and how you measure that they helped.
4. TypeScript: why types do not validate an API response, and what you do about it (**zero** TS questions asked so far — it is 10% of the rubric).
5. `this` binding: the five rules, and why arrow functions have no `this` of their own.
6. Modules: ESM vs CJS, tree-shaking, circular imports, `import()` and code splitting.
7. Bundle size, design-system component API and versioning, observability and progressive rollout, monorepo vs multi-repo, GraphQL vs REST / BFF.

## What is already at senior level — do not touch it

- **Diagnosis before code** — "measure first, find the phase, then change one thing" (S04 Q1).
- **The first instinct is usually right** — microtask starvation, `<dialog>`, httpOnly cookies, optimistic update, the real architecture behind the social login.
- **Real examples from real work** — the social login case, the `localStorage` disagreement. Panels want these; keep bringing them.
- **"I don't remember" instead of inventing** — do it **more**, not less. It scores better than confident and wrong.
- **Self-correcting on a follow-up** — it counts in your favour.
