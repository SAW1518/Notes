---
title: Vocabulary Drill
tags:
  - study
  - interview
  - drill
---

# Vocabulary Drill

The pairs of words that are easy to swap under pressure. Each row is a place where knowing the concept is not enough — the **wrong word** comes out and the answer reads as a gap.

Say these out loud until the pair is automatic. This is the highest-value page in the vault per minute spent.

---

# The pairs

| The word that comes out wrong | What it actually is | The tell that separates them |
|---|---|---|
| promises → *"macrotask queue"* | **microtask** queue | Task = timer / I-O / UI event. **A promise reaction is always a microtask** |
| *"my favourite is the **facade**"* about a provider map | **strategy** | Facade hides the **depth** of **one** thing. Strategy hides the **variation** between **N** interchangeable things. If there is nothing to swap, it is a facade |
| *"move it to a **service worker**"* | **Web Worker** | Web Worker = another thread for CPU. Service Worker = network proxy, cache, offline |
| *"Next.js has **SSL** built in"* | **SSR** | SSL = certificate and encryption. SSR = render on the server |
| the CSRF follow-up answered with **XSS** | **CSRF** | XSS = the attacker runs **JS on my origin**. CSRF = the attacker's site makes the **browser send my cookie** |
| layout + paint dominating = *"a re-render"* | the **browser pipeline** | A re-render is React building a tree. Layout and paint are the browser **below** React. Different layer |
| error boundaries for an **async** failure | boundaries catch **render-time only** | They do not catch async code, promise rejections, or event handlers |
| *"`Object.assign` copies the full object"* | **both are shallow**, identically | The difference is setters vs define, and mutating a target vs building a new literal |
| *"`let` has function scope"* | **block** scope | `var` is function-scoped and hoisted to `undefined`; `let`/`const` are block-scoped with a **TDZ** |
| *"hooks came in React 16"* | **16.8** | February 2019 |
| *"restart the sprint from zero"* | **only the PO can cancel**, and only if the Sprint Goal is dead | There is no restart rule. Scope is renegotiable; the **Goal** is not |
| *"`React.memo` dependency array"* | **there is none** | A deps array is a **hook** API. `React.memo` wraps from the outside and compares **all** props |
| *"`useState` is asynchronous"* | **batching + a closure** | The state is a constant of that render. Not a timer |
| *"the detached node stays in memory"* | **held by what?** | A leak needs a **path from a GC root** — name the root: timer list, subscribers, DOM, a variable of mine |
| *"the types validate the API response"* | **types are erased** | Zero bytes emitted. `res.json()` returns `any` |
| *"`as` checks it"* | `as` is a **claim**; `satisfies` is a **check** | `as` is never verified. `satisfies` validates and keeps the literal type |
| *"`fetch` threw on the 404"* | **it resolved** | `fetch` only rejects on **network** errors. Check `res.ok` |
| *"`Promise.all` cancelled the rest"* | **nothing was cancelled** | The other requests run to completion. Cancellation is `AbortController` |
| *"`private` makes it private"* | **erased at compile time** | A cast reads it at runtime. `#field` is the engine-enforced one |
| *"we sanitize the input"* | escape on **output**, per **context** | HTML body, attribute, URL, JS and CSS each need different escaping |

---

# The answer skeleton

> [!tip] Four beats, said in this order
> **1. Definition** → **2. Mechanism one layer below** → **3. Trade-off / failure mode** → **4. When I would NOT do it, and how I measure it.**

Beat 2 is what separates a mid answer from a senior one, and beat 4 is what most people never reach.

## Three senior moves

- **Name the boundary.** Say what stays *out* of the abstraction. Knowing what **not** to centralise is a stronger signal than knowing what to. (Example: centralise the transport mechanics, never the UX decision — [[JavaScript#Design the API layer for a multi-team codebase]].)
- **Quantify the payoff.** Not *"we can add providers easily"* → *"adding Apple was one module plus one key, and no existing file was edited — that is open/closed"* ([[Design Patterns#The real case — social login]]).
- **Question the requirement first.** 200 parallel requests is an **N+1 over HTTP** before it is a concurrency problem ([[JavaScript#200 requests to fire: `Promise.all`, a sequential loop, or batches?]]).

## One hard rule

**If a question has two parts, say "two things" out loud and count them.** Half answers are the cheapest points to lose: the question *"what is on screen, and how many renders?"* has two independent answers (the closure, and the batching), and answering only one reads as not knowing the other.

---

# The recurring traps, ranked

The ones that come back most often, in order of how much they cost:

1. **Correct combinator, zero production reasoning.** Picking `Promise.all` or a pool correctly and then saying nothing about HTTP/1.1 connection limits, timeouts starting at t=0, 429s or cancellation. → [[JavaScript#200 requests to fire: `Promise.all`, a sequential loop, or batches?]]
2. **A label instead of a mechanism.** "A closure is a safe place for private variables" is a *use case*. The mechanism is the heap `Context` and `[[Environment]]`. → [[JavaScript#What is a closure, at engine level]]
3. **React vocabulary for a browser symptom.** → [[Browser Platform#Scrolling is janky — layout and paint dominate the frame]]
4. **Naming the defence instead of the new hole.** `httpOnly` protects against XSS; the question was what the automatic sending *creates*. → [[Security#Where do you store the token, and what does that create?]]
5. **Answering the second layer when asked about the first.** Asked about focus management, answering ARIA labels. → [[Browser Platform#The four focus rules]]
6. **An individual-bug answer to a policy question.** → [[Testing and Process#The e2e suite takes 40 minutes and is flaky. What do you do?]]

---

# Two meta-rules

> [!important] Self-correcting is fine. Confident and wrong is not.
> Catching yourself mid-answer and fixing it reads as rigour. Asserting something confidently and being wrong scores **worse than "I don't know"**, because it makes everything else you said unverifiable.

> [!important] "I would verify that" is a complete answer
> When unsure of a detail, say so and say how you would check it. Inventing a plausible difference — like claiming `Object.assign` is deeper than spread — is the single most expensive habit, because the panel now has to doubt the rest.
