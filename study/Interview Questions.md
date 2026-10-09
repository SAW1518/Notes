---
title: Interview Questions
tags:
  - study
  - interview
  - drill
---

# Interview Questions

The question bank. Every question that has come up, with the answer compressed to one or two lines and a link to the depth.

How to use it: read the question, answer **out loud**, then open the link and check what you left out. The gap between "I know this" and "I said this" is the whole point of the page — the words have to come out under pressure, not just be recognisable.

For the words that get swapped under pressure, go to [[Vocabulary Drill]] first.

---

# 1. JavaScript — runtime

| Question | The answer, compressed | Depth |
|---|---|---|
| How does the event loop work? | Four steps: one task → drain **all** microtasks → **render** (style, layout, paint) → repeat. Rendering is a step of the loop, not parallel | [[JavaScript#The event loop]] |
| Microtasks vs macrotasks — which has priority? | Microtasks. The whole queue drains before **one** task is taken | [[JavaScript#Microtask queue]] |
| Where does a `fetch` callback go? | **Microtask** queue — it is a promise. Not the task queue | [[JavaScript#Task queue (macrotasks)]] |
| What is the call stack? | **LIFO**, and there is only one — JS is single-threaded | [[JavaScript#Call stack]] |
| Why does `setTimeout(fn, 0)` not run now? | It means "queue it as soon as possible". It still waits for an empty stack **and** all microtasks | [[JavaScript#Everything together: how JS runs the code]] |
| The page is frozen, memory is flat, CPU is 100% | **Microtask starvation** — a microtask queues another, so the loop never reaches the render step | [[JavaScript#The page is frozen and a pure-CSS spinner has stopped. The stack is empty most of the time. What is happening?]] |
| How does the event loop work in Node? | libuv **phases**: timers → pending → poll → check → close. Microtasks drain between phases; `process.nextTick` goes first. No render step | [[JavaScript#The event loop in Node.js]] |
| What is the DOM? | A **tree** representation of the document — the bridge that lets JS read and modify the HTML and CSS | [[JavaScript#What is the DOM]] |
| What is an event, and who manages it? | A user action or an API progress signal; `addEventListener`. Capture → target → bubble | [[JavaScript#Who manages an event in JS]] |
| `window` vs `global`? | Same concept, different environment. `globalThis` works in both | [[JavaScript#`window` vs `global`]] |

# 2. JavaScript — scope, closures, prototypes

| Question | The answer, compressed | Depth |
|---|---|---|
| `let` vs `var` vs `const`? | `var` = **function** scope, hoisted to `undefined`. `let`/`const` = **block** scope, in the **TDZ**. `const` blocks reassignment, not mutation | [[JavaScript#`var`, `let`, `const` and the TDZ]] |
| What is hoisting? | Declarations are registered before execution. Function declarations hoist whole; `var` hoists as `undefined`; `let`/`const`/`class` hoist into the TDZ | [[JavaScript#Hoisting]] |
| What is a closure, at engine level? | A function **plus a live reference to the lexical environment where it was defined**. Privacy is a use, not the definition | [[JavaScript#What is a closure, at engine level]] |
| Name a closure memory-leak pattern | Detached node held by something alive · uncleared `setInterval` · subscription with no teardown · siblings sharing one `Context`. **Name the GC root** | [[JavaScript#Memory leak patterns with closures, and their fixes]] |
| Walk the prototype chain for `dog.speak()` | own → `Dog.prototype` → `Animal.prototype` → `Object.prototype` → `null`. Reads walk up, **writes land locally** | [[JavaScript#The prototype chain, step by step]] |
| What is a prototype? | The object a lookup delegates to. `class` is syntax over it; `extends` links **both** the prototype and the constructor | [[TypeScript#`class` is prototypes — what the keyword really does]] |
| How does `this` work? | The **call site** decides: `new` → explicit (`call`/`bind`) → implicit (left of the dot) → default. An arrow has **none** of its own | [[TypeScript#`this` — the five rules]] |
| What are classes in JS? | Prototypal delegation with syntax. `#private` is real; TS `private` is erased | [[TypeScript#2. OOP in JavaScript and TypeScript]] |

# 3. JavaScript — async

| Question | The answer, compressed | Depth |
|---|---|---|
| What is a promise? | An object for a value we do not have yet. Three states: pending → fulfilled / rejected. Once **settled** it cannot change | [[JavaScript#How promises work]] |
| The four combinators? | `all` (all, first rejection) · `allSettled` (never rejects) · `race` (first to settle) · `any` (first fulfilment, `AggregateError`) | [[JavaScript#The four combinators]] |
| 200 requests — `Promise.all`, a loop, or batches? | First: **it is an N+1 over HTTP**, ask for a batch endpoint. Then a pool of 5–10 with backoff, jitter and one `AbortController` | [[JavaScript#200 requests to fire: `Promise.all`, a sequential loop, or batches?]] |
| Does `Promise.all` cancel the others on rejection? | **No.** They run to completion. Cancellation is `AbortController` | [[JavaScript#200 requests to fire: `Promise.all`, a sequential loop, or batches?]] |
| Why does `try/catch` not catch a throw inside `setTimeout`? | It catches **lexically and synchronously**, not temporally. The callback runs on a fresh stack. `await` works because it resumes the same frame | [[JavaScript#Why does `try/catch` not catch an error thrown inside `setTimeout`?]] |
| Which layer catches which error? | Transport = typed `HttpError` only · domain = meaning, most `try/catch` · UI = presentation. Catch where you can **do** something | [[JavaScript#Which layer catches which error]] |
| Five requests get a 401 at once. What breaks? | Five refreshes; the token **rotates**, so the first wins and the user is logged out. Fix: **single-flight** | [[Design Patterns#Single-flight]] |
| Does `fetch` reject on a 404? | **No** — it resolves. Only network errors reject. Check `res.ok` | [[JavaScript#Calling an API: `fetch` does not fail with a 404]] |
| Debounce vs throttle? | Debounce waits for the events to **stop**; throttle fires at a steady rate. And sometimes **neither** — a double-clicked Save is a correctness problem | [[JavaScript#Debounce vs throttle]] |
| Shallow vs deep copy? | Spread and `Object.assign` are **equally** shallow. `structuredClone` for deep. `JSON.parse(JSON.stringify())` destroys ten things | [[JavaScript#Shallow vs deep copy]] |
| `==` vs `===`? | `===` compares value **and** type. `==` coerces. Always `===`, except `x == null` | [[JavaScript#`==` vs `===`]] |

# 4. JavaScript — functions and arrays

| Question | The answer, compressed | Depth |
|---|---|---|
| What is a callback? | A function passed as an argument, executed inside the other function | [[JavaScript#Callbacks]] |
| Arrow / lambda functions? | Concise function expression with **no own** `this`, `arguments`, `super` or `new.target` | [[JavaScript#Arrow functions]] |
| What is a pure function? | Same input → same output, **and** no side effects. Both halves | [[JavaScript#Pure functions]] |
| Template literals? | Back-tick strings with `${}` expressions and multi-line support | [[JavaScript#Template literals]] |
| What is destructuring? | Unpacking by name (objects) or position (arrays), with rename, default and rest | [[JavaScript#Destructuring]] |
| What is a generator? | A function that **pauses** and resumes. `function*` + `yield`; `next(value)` sends a value back in | [[JavaScript#Generators]] |
| How do you get the modulo? | `%`. For a always-positive result, `((a % n) + n) % n` | [[JavaScript#6. Functions and syntax]] |
| Which array methods mutate? | `push`/`pop`, `shift`/`unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin` | [[Arrays#Mutates or not — the table to know cold]] |
| What does `every` return on `[]`? | **`true`** — vacuous truth | [[Arrays#every]] |
| `slice` vs `splice`? | `slice` copies, `splice` **cuts and mutates** | [[Arrays#`slice` vs `splice`]] |
| What is wrong with `new Array(3).fill([])`? | All three positions share **one** array. Use `Array.from({length:3}, () => [])` | [[Arrays#fill]] |

# 5. TypeScript

| Question | The answer, compressed | Depth |
|---|---|---|
| Pros and cons of TS vs JS? | Errors at compile time, autocomplete, safe refactors vs learning curve, setup, a build step. And the types are **erased** | [[JavaScript#8. JS vs TS — pros and cons]] |
| `type` or `interface`? | Interfaces **merge** and are implemented; types **compute** and union | [[TypeScript#`interface` vs `type`]] |
| How do you model a fetch state? | A **discriminated union** + `assertNever` — impossible states become unrepresentable and a missing branch fails the build | [[TypeScript#Discriminated (tagged) unions — the single most useful shape in a frontend]] |
| `as` vs `satisfies`? | `as` is a **claim**, never verified. `satisfies` is a **check** that keeps the literal type | [[TypeScript#`as` vs `satisfies` — the pair that gets asked]] |
| `any` vs `unknown` vs `never`? | `unknown` = everything, unusable. `never` = nothing, unassignable. `any` = the leak | [[TypeScript#`any`, `unknown`, `never` — the three that get swapped]] |
| When does a generic earn its place? | When it **links two positions**. A type parameter used once is decoration | [[TypeScript#Generics — the part that actually comes up]] |
| Enum or union of literals? | Union + an `as const` array. Erased completely, and it matches what arrives in JSON | [[TypeScript#Enums — and why a union usually wins]] |
| Two IDs got swapped and it compiled | TS is **structural** — use **branded types** | [[TypeScript#Structural vs nominal typing, and branded types]] |
| Does TypeScript validate an API response? | **No.** Types are erased and `res.json()` returns `any`. Parse at the boundary with a schema | [[TypeScript Boundary#Why the compiler cannot help here]] |
| You generate types from OpenAPI — still need runtime validation? | **Yes.** Generated types are erased too; they encode a promise, not a response | [[TypeScript Boundary#Contracts: codegen and contract tests]] |
| Parse or validate? | **Parse** — return a better type, not a boolean | [[TypeScript Boundary#Parse, don't validate]] |
| Is TS `private` private? | **No** — erased. `#field` is engine-enforced | [[TypeScript#Encapsulation: four levels, only two of them real]] |

# 6. React

| Question | The answer, compressed | Depth |
|---|---|---|
| What is the Virtual DOM? | An in-memory tree that gets diffed, so the API can be **declarative**. Not "faster than the DOM" | [[React#The Virtual DOM]] |
| What is a hook, and what problem does it solve? | State and React features in a function component. Solves **logic reuse** (no wrapper hell) and **separation of concerns**. React **16.8** | [[React#Hooks — what they are and what problem they solve]] |
| The most used built-in hooks? | `useState` and `useEffect` | [[React#The most used built-in hooks]] |
| Is `useState` asynchronous? | **No** — batching plus a **closure** over a render constant. Not a timer | [[React#"useState is asynchronous" — careful with that phrase]] |
| Three setter calls in one handler, state at 0 — what is on screen? | **1**, and **two reasons**: the closure (why 1) and batching (why one render). Functional form gives 3, still one render | [[React#The setter is called three times in one click handler, each with the current value plus one. State starts at 0. What is on screen?]] |
| `useEffect` vs `useLayoutEffect`? | `useEffect` after the paint; `useLayoutEffect` **before** it, so it blocks. Measurements and jump-prevention go in the second | [[React#`useEffect` vs `useLayoutEffect`]] |
| Which lifecycle methods does `useEffect` replace? | `componentDidMount` `[]` · `componentDidUpdate` `[deps]` · `componentWillUnmount` = the returned cleanup | [[React#Which lifecycle methods useEffect replaces]] |
| And the ones it does **not** replace? | `shouldComponentUpdate`, `PureComponent`, `componentDidCatch`, `getDerivedStateFromProps`, `forceUpdate`. An **error boundary must be a class** | [[React#The lifecycle methods useEffect does NOT replace]] |
| Explain the dependency array | **Any reactive value** used inside — props, state, context, derived. `[]` once, `[a,b]` on change, no array every render | [[React#The dependency array]] |
| What if you ignore it? | **Stale closures.** `react-hooks/exhaustive-deps` catches it | [[React#The dependency array]] |
| What is `useRef` for? | A DOM handle, **or** a mutable box that does not trigger a render | [[React#`useRef`]] |
| Why does a component re-render? | Three causes: **own state · parent · context**. `React.memo` stops only the parent one | [[React#First: why does a component re-render at all?]] |
| What does `React.memo` compare? | **All** props, shallowly, `Object.is` per key. There is **no deps array** | [[React#What it generates underneath]] |
| When is a memo dead? | Inline arrow · object/array/style literal · `children` · own state · context · trivial component · remount by key | [[React#When `React.memo` does genuinely nothing]] |
| What does `areEqual` return to skip the render? | `true` = equal = **skip**. The inverse of `shouldComponentUpdate` | [[React#The second argument]] |
| Is `useMemo` a guarantee? | **No.** React may discard the cache — the code must stay correct if it recomputes | [[React#`useMemo`]] |
| `useCallback` in one line? | `useMemo(() => fn, deps)`. The arrow is still **allocated** every render | [[React#`useCallback`]] |
| What beats memoising? | Move state down · pass the heavy part as `children` · split the context · a store with selectors · virtualise · stable keys | [[React#What beats memoising (the senior half of the answer)]] |
| How do you prove a memo pays? | Profiler, **production build**, same interaction, commit duration before and after | [[React#How I prove the memo is paying for itself]] |
| Explain SSR | Render HTML on the server, so the browser gets content not an empty div. Costs: two flows to test, and no browser APIs on the server | [[React#Server-side rendering]] |
| SSR libraries? | React → Next.js, Remix. Angular → Universal. Vue → Nuxt | [[React#Libraries and frameworks for SSR]] |
| Explain hydration to a non-technical PM | The server sends a **picture**; a picture has no buttons. JS then wires every element, and until it finishes clicks land on nothing | [[React#Hydration, explained to a non-technical PM]] |
| The rendering strategies? | CSR · SSR · SSG · ISR · streaming SSR · RSC | [[React#The rendering strategies in one line each]] |
| Thousands of rows — how do you fix it? | **Measure** first, then **virtualise**. Memoisation is last, not first. Heavy compute → **Web** Worker | [[React#A component with thousands of rows — how do you avoid the performance problem?]] |
| How did you improve a React app's performance? | The **process**: detect → measure → find the cause → fix → prove → share. Never a list of tricks | [[React#How I improved the performance of a React app]] |
| Optimistic UI with three mutations and one failure? | Per-item state, per-item rollback, out-of-order handling, idempotency keys. Never a global saving flag | [[React#Optimistic UI: three mutations in flight and one fails]] |
| PropTypes vs Flow vs TypeScript? | PropTypes = runtime, dev only, gone in React 19. Flow = dead. TS = the standard, and **erased** | [[React#PropTypes vs Flow vs TypeScript]] |
| Is React safe against XSS by default? | For **interpolated text**, yes. The holes are the escape hatches — `dangerouslySetInnerHTML`, `javascript:` URLs, spreading user props, a ref writing `innerHTML`, SSR state serialization | [[React#Is React safe against XSS by default?]] |

# 7. State management

| Question | The answer, compressed | Depth |
|---|---|---|
| What is Redux? | A single read-only store, changed only by dispatching actions through pure reducers | [[State Management#What is Redux]] |
| Store, action, reducer, dispatch, middleware, selector? | Store = the state · action = `{type, payload}` describing what happened · reducer = pure function returning new state · dispatch = send · middleware = sits before the reducer · selector = read a slice | [[State Management#Redux]] |
| Why Redux if React has state and Context? | Single source of truth, named actions, devtools and time travel, **selectors**, pure reducers. Context has **no selectors** | [[State Management#Why a container, if React already has state and Context]] |
| Is Redux a GoF pattern? | **No** — it is **Flux**. Built from Command, Observer and a chain of decorators | [[State Management#Why a container, if React already has state and Context]] |
| Which state library would you pick? | Ask **who owns the truth** first: server → TanStack Query; URL → the router; what is left → `useState` or Zustand | [[State Management#The real question: server state vs client state]] |

# 8. Patterns and principles

| Question | The answer, compressed | Depth |
|---|---|---|
| What categories of patterns exist? | **Creational** (how objects are made) · **Structural** (how they compose) · **Behavioral** (how they communicate) | [[Design Patterns#Quick reference — the three categories]] |
| Your favourite pattern? | **Strategy** — an object of functions with one interface replaces a `switch`, so adding a case is adding a key. And have the **real example** ready | [[Design Patterns#Strategy]] |
| Where did you use it? | Social login: a **facade per provider** + a **strategy to select**. Adding Apple was one module plus one key, no existing file edited | [[Design Patterns#The real case — social login]] |
| Facade or strategy? | Facade hides the **depth** of one thing — nothing to swap. Strategy hides the **variation** between N interchangeable things | [[Design Patterns#Facade vs Strategy — the pair that gets confused]] |
| What pattern is behind RxJS? | **Observer** — and it is **not** the same as pub-sub, which has a broker in the middle | [[Design Patterns#Pub-sub]] |
| Singleton in JavaScript? | An ES module — evaluated once and cached. No `getInstance()` needed | [[Design Patterns#Singleton]] |
| Name some anti-patterns | God object · Blob / Swiss Army Knife · spaghetti · callback hell · prop drilling · magic numbers · premature optimization | [[Design Patterns#Anti-patterns]] |
| Functional patterns? | Pure functions · immutability · composition (`pipe`) · currying · higher-order functions · monads (`Maybe`) | [[Design Patterns#Functional patterns]] |
| Is a `Promise` a monad? | **Close, not one.** `then` flattens automatically, so `Promise<Promise<T>>` cannot exist | [[Design Patterns#Functional patterns]] |
| Explain SOLID | S one thing · O open to extension, closed to modification · L subtypes substitutable · I small interfaces · D depend on abstractions | [[Design Patterns#SOLID]] |
| DIP vs DI vs IoC? | IoC = the **principle** (the framework calls me) · DIP = the **design principle** (depend on abstractions) · DI = a **technique** | [[Design Patterns#Dependency inversion vs dependency injection vs inversion of control]] |
| Why composition over inheritance in React? | Loose coupling. Inheritance makes the base class API for every descendant, and Liskov breaks on the first special case | [[Design Patterns#Composition over inheritance]] |
| What is good code, in your view? | One thing per unit · **measurable** complexity · testable without mocking the world · boring to read | [[Design Patterns#What is good code]] |
| What are non-functional requirements? | Performance, scalability, availability, security, accessibility, maintainability, observability, localisation, compliance, cost | [[Testing and Process#Non-functional requirements]] |

# 9. Browser platform

| Question | The answer, compressed | Depth |
|---|---|---|
| Layout and paint dominate the frame — what is happening? | The browser is recomputing geometry and repainting. **Below React, not a re-render.** Layout thrashing → rAF + passive → cost per row → DOM size | [[Browser Platform#Scrolling is janky — layout and paint dominate the frame]] |
| The five rendering phases? | **JS → Style → Layout → Paint → Composite**, in a 16 ms budget | [[Browser Platform#The five phases]] |
| What is layout thrashing? | Writing a style then reading `offsetHeight` in the same loop — a forced **synchronous** layout each pass. Batch reads, then writes | [[Browser Platform#Layout thrashing, concretely]] |
| Why does a `transform` spinner survive a frozen page? | `transform`, `opacity` and `filter` run on the **compositor thread** | [[Browser Platform#Compositor-only properties — the fact that proves you know which thread does what]] |
| What is the user-facing metric? | **INP**, not render count. A long task is over 50 ms | [[Browser Platform#The metrics that matter]] |
| How do you cache an SPA on a CDN? | Hashed chunks `immutable` forever + `index.html` `no-cache` | [[Browser Platform#The standard SPA recipe]] |
| `no-cache` vs `no-store`? | `no-cache` = **revalidate before use**. `no-store` = never write it down | [[Browser Platform#The `Cache-Control` vocabulary]] |
| Chunk 404s after a deploy? | The old app is still running. Keep **N previous builds** and reload on a chunk-load error | [[Browser Platform#What breaks on deploy day]] |
| Build an accessible modal | `<dialog>` + `showModal()` for the top layer, inert background and Escape. Then the **four focus rules**. Labels are the **second** layer | [[Browser Platform#The four focus rules]] |

# 10. Security

| Question | The answer, compressed | Depth |
|---|---|---|
| XSS vs CSRF? | XSS = the attacker runs **JS on my origin**. CSRF = the attacker's site makes the **browser send my cookie** | [[Security#XSS vs CSRF — never swap these two words]] |
| How do you protect against XSS? | Escape on **output** per context · DOMPurify for rich text · validate URL protocols · **CSP** · `httpOnly` cookies | [[Security#XSS — Cross-Site Scripting]] |
| How do you protect against CSRF? | `SameSite` · anti-CSRF token · validate `Origin`/`Referer` · **no state changes on GET** | [[Security#CSRF — Cross-Site Request Forgery]] |
| Where do you store the token? | `httpOnly` + `Secure` + `SameSite` cookie. **Never `localStorage`** | [[Security#Where do you store the token, and what does that create?]] |
| And what does the automatic sending create? | **CSRF.** Not XSS — that is what `httpOnly` already mitigates | [[Security#Where do you store the token, and what does that create?]] |
| Does CORS protect us? | It blocks **reading the response**, not **sending the request** | [[Security#Ways to protect ourselves]] |
| How do you handle sensitive data? | Not in `localStorage` · HTTPS + HSTS · never log it · minimise and mask · short-lived tokens · careful with query strings | [[Security#Handling sensitive data]] |
| How do you find vulnerable packages? | `npm audit` · Snyk with reachability · Dependabot/Renovate · and a **critical breaks the build** | [[Security#Vulnerable packages]] |
| How do you handle security threats generally? | The **loop**: automated gate in the pipeline → framework guidelines → code review → OWASP Top 10 training | [[Security#How do you handle security threats in the app?]] |

# 11. Testing, process and quality

| Question | The answer, compressed | Depth |
|---|---|---|
| What is the testing pyramid? | Most unit, fewer integration, fewest e2e | [[Testing and Process#The testing pyramid]] |
| Why more unit tests? | Cheap, fast, and they **localise the failure** | [[Testing and Process#Why more unit tests than the other types]] |
| The e2e suite is 40 min and flaky — what do you do? | A **policy**: quarantine in a day, delete at two weeks, track the flake rate, ban free re-runs, rebalance the pyramid | [[Testing and Process#The e2e suite takes 40 minutes and is flaky. What do you do?]] |
| CI vs CD vs CD? | Each needs the previous. The only difference between delivery and deployment is **whether a human presses the button** | [[Testing and Process#2. CI, delivery and deployment]] |
| How would you set up code review? | Automated gates **first**, so humans only review what machines cannot. Then a priority-ordered checklist and real PR descriptions | [[Testing and Process#How would you establish a code review process on a new project?]] |
| How do you handle technical debt? | Refactor when the code must be **touched anyway** — there it has business value. If it works and nobody touches it, leave it | [[Testing and Process#How do you handle technical debt?]] |
| When is waterfall better than agile? | Long project, requirements known from the start, fixed regulation or a closed contract | [[Testing and Process#When does waterfall work better than agile?]] |
| Estimation techniques? | Story points + planning poker + velocity · T-shirt for high level · three-point for high uncertainty | [[Testing and Process#Estimation techniques]] |
| Story points or T-shirt? | Points for small and specific; T-shirt/three-point for long term. The vaguer the horizon, the vaguer the unit — honestly | [[Testing and Process#Story points or T-shirt sizing — which one?]] |

# 12. Management and situational

| Question | The answer, compressed | Depth |
|---|---|---|
| How do you delegate? | It is a **level**, chosen by the person's experience with that task. Delegate what makes them **grow** | [[Testing and Process#How do you delegate properly, and what can be delegated?]] |
| Convincing a customer to change framework? | Requirements + **team capability** → benefits, honest cons, success stories, other experts, documented comparison. Never "X is better" | [[Testing and Process#How would you convince a customer to use a different framework?]] |
| Critical production issue on a Friday evening? | **Verify → mitigate (rollback) → communicate.** The support window comes last, not first | [[Testing and Process#Friday evening, the customer reports a critical production issue]] |
| An urgent hotfix is stuck in review? | Find the **impediment**, ask **publicly** with the reason, explain the priority, then fix why the channels did not surface it | [[Testing and Process#A hotfix is stuck in code review and it is urgent]] |
| The PO adds an urgent task mid-sprint? | Make it visible as **not normal** → renegotiate **scope** → the triangle → flag the risk → escalate. **Not** a restarted sprint | [[Testing and Process#Mid-sprint, the PO asks to add an urgent task]] |
| What does Scrum say about cancelling a sprint? | **Only the PO**, and only if the **Sprint Goal** is dead. Scope is renegotiable; the Goal is not. There is no restart rule | [[Testing and Process#What Scrum actually says about changing a Sprint]] |
| A disagreement you pushed? | Case → constraint → outcome → **the artefact left behind**. Research → align → decide → **document** | [[Testing and Process#Tell me about a disagreement you pushed, and how it was resolved]] |

---

# Questions that still have no answer here

Expect these — they came up and were never fully answered. Each one is a note that does not exist yet.

- [ ] `useDeferredValue` and `startTransition` — the React 18 priority model
- [ ] Micro-frontends: when they are worth the cost, and what breaks
- [ ] Event-driven architecture and messaging patterns
- [ ] Compound components as a composition pattern
- [ ] Cross-cutting concerns across a whole solution
- [ ] tRPC and end-to-end type safety when both ends are mine
- [ ] Monorepo tooling: project references, remote caching, task graphs

---

# How to drill this page

1. **Cover the middle column.** Read the question, answer out loud, uncover.
2. **Count the parts.** If the question has two answers, say "two things" and count them. Half answers are the cheapest points to lose.
3. **Follow the four beats** — definition → mechanism one layer down → trade-off → when I would not do it ([[Vocabulary Drill#The answer skeleton]]).
4. **Anything you half-knew goes to [[Vocabulary Drill]]**, not back onto this page. Recognising is not retrieving.
