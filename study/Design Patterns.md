---
title: Design Patterns
tags:
  - study
  - interview
  - design-patterns
  - principles
---

# Design Patterns

Patterns, the principles behind them, and where each one already lives in a front-end stack.

All the code examples are verified in Node v22 ✅

---

# Quick reference — the three categories

The Gang of Four defined three categories:

| Category | What it solves | Typical in JS |
|---|---|---|
| **Creational** | How the objects are created | Factory, Singleton, Builder |
| **Structural** | How the objects are composed | **Facade** (wrapping an API), Adapter, Proxy, Decorator |
| **Behavioral** | How the objects communicate | **Strategy**, Observer, Command |

In architectural terms, the pattern of **state management** is the one most used in front-end applications — see [[State Management]].

> [!tip] Where we already use them in front-end
> This is the follow-up question after the categories:
>
> | Pattern | Where it already is in our stack |
> |---|---|
> | Factory | `createStore`, the custom hooks that build objects |
> | Singleton | An ES module that exports a configured client |
> | Facade | A `services/api.ts` that hides `fetch`, the headers and the errors |
> | Adapter | The mappers from the API response to the view model |
> | Proxy | The `Proxy` object, and the reactivity of Vue 3 / MobX |
> | Decorator | The HOCs of React, `React.memo`, the decorators of Angular |
> | Strategy | An object of functions selected by a key |
> | Observer | RxJS, the `subscribe` of the Redux store |
> | Command | The Redux actions, undo/redo |
> | Single-flight | The refresh interceptor, the deduplication of TanStack Query |

---

# Creational

## Factory

One function decides **which object** to create, and the caller does not know the details.

```js
function createUser(role) {
  const base = { name: "ana" };
  if (role === "admin") return { ...base, canDelete: true };
  return { ...base, canDelete: false };
}

createUser("admin"); // { name: 'ana', canDelete: true }
createUser("guest"); // { name: 'ana', canDelete: false }
```

## Singleton

One instance shared by all the application.

```js
let instance = null;

function getConfig() {
  if (!instance) instance = { api: "/api" };
  return instance;
}

getConfig() === getConfig(); // true
```

But in JavaScript we almost never write this, because **the modules are already singletons**. An ES module is evaluated **one time** and cached, so exporting an object already gives us a singleton — we do not need the `getInstance()` class of Java:

```js
// config.mjs — this file is evaluated only one time
export const counter = { value: 0 };

// a.mjs and b.mjs import it — the two receive the SAME object
```

Verified in Node ✅ — importing the module two times evaluated it one time and the two importers shared the same object.

> [!question] Short answer for the interview
> "The singleton gives one single instance for all the app. In JavaScript we get it almost for free, because an ES module is evaluated one time and the result is cached, so if I export an object every file that imports it receives the same one. The problem of the singleton is the global state: it is hard to test, because the tests share the instance, and that is why in Angular I prefer to register the service in the DI container instead."

## Builder

We build a complex object step by step. Every method returns `this`, and that is why we can chain them.

```js
class QueryBuilder {
  constructor() { this.parts = ["SELECT *"]; }
  from(table) { this.parts.push(`FROM ${table}`); return this; }
  where(condition) { this.parts.push(`WHERE ${condition}`); return this; }
  build() { return this.parts.join(" "); }
}

new QueryBuilder().from("users").where("age > 18").build();
// 'SELECT * FROM users WHERE age > 18'
```

---

# Structural

## Facade

**Wrapping an API.** We give one simple interface over several low level calls.

```js
const storage = {
  save(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  read(key) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  },
};

storage.save("user", { name: "ana" }); // the caller does not know about JSON
```

Verified in Node ✅ (with a `Map` in the place of `localStorage`, which only exists in the browser)

The same idea appears in SSR: the browser APIs do not exist in the server, so we need **a guard or a facade of the platform** — see [[React#Server-side rendering]].

## Adapter

We convert one shape into another shape. In front-end it is the mapper between the API and the component.

```js
const apiUser = { first_name: "ana", last_name: "lopez" };
const toViewModel = (u) => ({ fullName: `${u.first_name} ${u.last_name}` });

toViewModel(apiUser); // { fullName: 'ana lopez' }
```

> [!note] Facade vs Adapter
> The **facade** simplifies — it hides many calls behind one. The **adapter** translates — it makes two incompatible interfaces work together. The facade is for us, the adapter is for the compatibility.

## Proxy

An object that sits in front of another one and controls the access. JavaScript has it in the language.

```js
const user = { name: "ana" };

const safeUser = new Proxy(user, {
  get: (target, prop) => (prop in target ? target[prop] : "unknown"),
});

safeUser.name;  // 'ana'
safeUser.email; // 'unknown'
```

The **Service Worker** is also a proxy, but of the network — see [[Security]].

## Decorator

We add behavior to a function or a component **without modifying it**.

```js
const withLog = (fn) => (...args) => {
  const result = fn(...args);
  console.log(fn.name, args, "→", result);
  return result;
};

const sum = (a, b) => a + b;
withLog(sum)(2, 3); // logs 'sum [2,3] → 5', returns 5
```

In React this is the **HOC** (higher order component), and `React.memo` is a decorator too: it receives a component and returns the same component with the memoization added.

---

# Behavioral

## Strategy

We have several algorithms with the **same interface** and we choose one in runtime.

JavaScript, and specially TypeScript, are very good for it, because a strategy can be simply an object of functions with a shared interface, without any hierarchy of classes.

```js
const shipping = {
  standard: (weight) => weight * 1,
  express: (weight) => weight * 2.5,
  free: () => 0,
};

const getCost = (type, weight) => shipping[type](weight);

getCost("express", 4); // 10
getCost("free", 4);    // 0
```

In TypeScript the shared interface becomes explicit, and this is the part worth saying out loud:

```ts
type ShippingStrategy = (weight: number) => number;
const shipping: Record<string, ShippingStrategy> = { /* ... */ };
```

> [!question] Short answer for the interview
> "My favorite is the strategy pattern, a behavioral one. It replaces a big `switch` with an object of functions that share the same interface, so adding a new case is adding a key, not modifying the existing code — it respects the open/closed principle. In JavaScript I do not need a hierarchy of classes for it, and in TypeScript I can type the interface of the strategy with a `type`, so the compiler checks that every strategy has the same signature."

### Facade vs Strategy — the pair that gets confused

| | What is behind the door | It hides | The test |
|---|---|---|---|
| **Facade** | **One** thing | The **depth** — many low-level calls become one call | There is **nothing to swap** |
| **Strategy** | **N** interchangeable things | The **variation** — the caller passes a key instead of writing a branch | I can **swap the implementation at runtime** and the caller does not change |

Both end in "one simple call". That is why they get confused.

### The real case — social login

"My favorite is the strategy pattern" always gets the follow-up *"where did you use it?"*. Social login with Google, Facebook and Apple. **The design had both patterns, and saying that is the senior answer:**

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

- **Open/closed** — adding Apple was **one new module plus one key**. **No existing file was edited.** That is the **O** of SOLID (see [[#SOLID]]).
- **Testability** — the handler depends on the `AuthProvider` shape, so it can be tested with a fake instead of mocking three real SDKs.
- **Blast radius of one** — when a provider changes its SDK, one file changes.

**When it is the wrong choice** — "too much complexity" is a feeling, not a criterion:

- **The variants are not really interchangeable.** The moment one provider needs an extra argument or returns a different shape, the shared interface is a lie and `if (name === "apple")` comes back to the caller. **This is the one that kills the design.**
- **Two options that will never be three** — a normal `if` reads better. YAGNI.
- **The variants share 90% of the logic** — that is **template method**, or just a parameter.
- **The choice is fixed at build time** — that is configuration or DI, not strategy.

> [!tip] The follow-up after that
> *"Where is the new provider registered, and what stops two modules registering the same key?"* → **One registry module**, and the key typed as a **union of literals**, never `string`:
> ```ts
> type ProviderName = "google" | "facebook" | "apple";
> const providers: Record<ProviderName, AuthProvider> = { /* ... */ };
> ```
> `Record<ProviderName, ...>` forces every provider to be implemented, and a typo in a key is a compile error.

## Observer

The pattern **behind RxJS**. A source produces values and the one that subscribes receives the notification. It is useful for any asynchronous communication where we create channels.

```js
class Subject {
  #observers = [];

  subscribe(fn) {
    this.#observers.push(fn);
    return () => { this.#observers = this.#observers.filter((o) => o !== fn); };
  }

  notify(data) { this.#observers.forEach((fn) => fn(data)); }
}

const subject = new Subject();
const unsubscribe = subject.subscribe((v) => console.log("A:", v));
subject.subscribe((v) => console.log("B:", v));

subject.notify(1); // A: 1 — B: 1
unsubscribe();
subject.notify(2); // B: 2
```

Verified in Node ✅ — the result was `["A:1", "B:1", "B:2"]`.

> [!important] The `subscribe` has to return the way to unsubscribe
> This is the memory leak of every interview. If we subscribe in a `useEffect` and we do not return the cleanup, the observer stays alive after the component is unmounted.

## Pub-sub

The same idea but with a **broker** in the middle. The publisher does not know the subscriber, and the subscriber does not know the publisher. The two only know the name of the event.

```js
const bus = {
  events: {},
  on(name, fn) { (this.events[name] ??= []).push(fn); },
  emit(name, data) { (this.events[name] ?? []).forEach((fn) => fn(data)); },
};

bus.on("user:login", (u) => console.log("welcome", u));
bus.emit("user:login", "ana"); // 'welcome ana'
bus.emit("user:logout", "ana"); // nobody listens, nothing happens
```

Observer and pub-sub are **not** synonyms, even though they are often named together. The difference is who knows who:

| | Who knows who | Example |
|---|---|---|
| **Observer** | The subject has the list of its observers | RxJS, the `subscribe` of Redux |
| **Pub-sub** | A broker in the middle, the two sides are decoupled | An event bus, a message queue |

Worth saying in the interview — it is the detail that separates "I know the name" from "I know the pattern".

## Command

We convert an operation into an **object** with a name. That object can be saved, put in a queue, logged, or undone.

```js
const commands = {
  add: (state, payload) => [...state, payload],
  remove: (state, payload) => state.filter((x) => x !== payload),
};

const execute = (state, action) => commands[action.type](state, action.payload);

execute(["a"], { type: "add", payload: "b" }); // ['a', 'b']
```

This is exactly a **Redux action + reducer**. And because every command is an object with a name, we get the **time travel** of the devtools — see [[State Management]].

---

# Concurrency

## Single-flight

Several callers ask for **the same operation at the same time**. Instead of doing the work N times, the first caller starts it and saves the **promise**; everybody else receives that same promise.

It is also called *request deduplication*, *request coalescing*, or *promise memoization*. What we cache is the promise, not the result.

The problem — the token expires and five requests in flight receive a 401 at the same time:

```
GET /user    → 401 ─┐
GET /orders  → 401 ─┤
GET /cart    → 401 ─┼─→ five POST /refresh with the SAME refresh token
GET /prefs   → 401 ─┤
GET /notifs  → 401 ─┘

the first one wins and rotates the token → the other four get a 401 → LOGOUT
```

Most refresh endpoints **rotate** the token: every successful refresh invalidates the one that was used. That is a security measure — it is how the server detects a stolen token — and it means the refresh token is **single use**. Five concurrent calls with the same token: one wins, four fail, and the user is logged out without touching anything.

The pattern:

```js
let refreshing = null;

function getFreshToken() {
  if (!refreshing) {
    refreshing = doRefresh().finally(() => { refreshing = null; });
  }
  return refreshing; // the five await the SAME promise
}

await Promise.all([1, 2, 3, 4, 5].map(getFreshToken));
// → ['token-1','token-1','token-1','token-1','token-1'], 1 network call
```

Verified in Node ✅ — five callers, **one** call to the network. A second round after that returns `token-2` with two calls in total, so the slot is reusable.

> [!important] Why it works — this is the part to say out loud
> Because there is **no `await` between the check and the assignment**:
>
> ```js
> if (!refreshing) {              // ─┐ atomic block: the event loop can not
>   refreshing = doRefresh()...   // ─┘ interrupt between these two lines
> }
> ```
>
> JavaScript is single threaded, so that block runs complete without giving back the control. The first caller sees `null` and creates the promise; the other four already find it assigned.
>
> If we put an `await` inside, the race comes back:
>
> ```js
> if (!refreshing) {
>   await someCheck();          // ← here we give back the control
>   refreshing = doRefresh();   // ← the other four already passed the if
> }
> ```
>
> Verified in Node ✅ — the same five callers with that `await` produce **5** network calls instead of 1.

The cleanup goes in `.finally()`, not in `.then()`. If the refresh fails and we only clear on success, the slot keeps a rejected promise for ever and every future caller receives the old error.

Verified in Node ✅ — with a refresh that throws, the five callers are `rejected` (which is correct, all of them have to log out), there is **one** call to the network, and `refreshing` goes back to `null`.

The **keyed** variant, when it is not one single operation but one per resource:

```js
const inflight = new Map();

function dedupe(key, fn) {
  if (!inflight.has(key)) {
    inflight.set(key, fn().finally(() => inflight.delete(key)));
  }
  return inflight.get(key);
}

// three components mount at the same time and the three ask for /config
await Promise.all([
  dedupe("/config", fetchConfig),
  dedupe("/config", fetchConfig),
  dedupe("/config", fetchConfig),
  dedupe("/user", fetchUser),
]);
// → 2 network calls, and the map is empty at the end
```

Verified in Node ✅ — 2 calls for 4 callers, and no leak in the `Map` because `finally` deletes the key.

This is what **TanStack Query** does internally with its query keys.

> [!warning] What the pattern does NOT solve — the multi-tab case
> `refreshing` is a module variable, so there is **one per tab**. Three open tabs are three concurrent refreshes: exactly the same bug, one level up.
>
> ```js
> async function getFreshToken() {
>   return navigator.locks.request("token-refresh", async () => {
>     const current = readToken();
>     if (!isExpired(current)) return current; // another tab already refreshed
>     return doRefresh();
>   });
> }
> ```
>
> The `if (!isExpired(current))` inside the lock is obligatory: the tab that was waiting has to **re-read** the token when it enters, or it refreshes again over one that was already rotated. Without the Web Locks API the alternatives are `BroadcastChannel` or the `storage` event.

> [!tip] The two other edge cases of the refresh interceptor
> 1. **Mark the retried request.** Retry with the new token, another 401, refresh, retry… infinite loop. The second 401 goes to logout, not to another refresh.
> 2. **The `/refresh` call has to skip the auth layer.** If it goes through its own interceptor, a 401 in the refresh triggers a refresh, and that is infinite recursion.

> [!note] It is not a Gang of Four pattern
> Single-flight is a **concurrency idiom**, not one of the 23. The same honesty as with Redux and Flux — it is better to say it than to be corrected.
>
> Where it comes from: the name is from the Go community (`golang.org/x/sync/singleflight`). Conceptually it is **memoization applied to a promise**, with a lifetime of "while it is in flight" instead of for ever. The nearest GoF relative is the **singleton**, but scoped to one operation instead of to one object.

> [!question] Short answer for the interview
> "Single-flight means that when several callers need the same operation at the same time, only the first one starts it and the rest await the same promise. I use it for the refresh of the token: with five concurrent 401s, without it we send five refreshes, and as the refresh token normally rotates, the first one invalidates it and the other four fail, so the user is logged out alone. I save the promise in a module variable and clear it in `finally`, not in `then`, so a failed refresh does not leave the slot poisoned. It works because there is no `await` between checking the variable and assigning it, so that block is atomic in the event loop. With several tabs the module variable is not enough and I move the lock to Web Locks or `BroadcastChannel`."

The layers around this pattern — transport, auth, domain, feature — are in [[JavaScript#Design the API layer for a multi-team codebase]].

---

# Functional patterns

- **Monads** — containers that represent a specific behavior. The **Maybe** monad represents a value that can exist or not (the equivalent of the `Optional` of Java).
- **Currying and partial application**.
- **Function composition** — `compose`, `pipe`.
- **Immutability** — never mutate, always return a new value.
- **Pure functions** and **higher order functions**.

```js
// Currying and partial application
const add = (a) => (b) => a + b;
const add10 = add(10);
add10(5); // 15

// Composition
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);
const double = (n) => n * 2;
const toText = (n) => `total: ${n}`;
pipe(double, toText)(21); // 'total: 42'

// Maybe — a value that can exist or not
const maybe = (value) => ({
  map: (fn) => (value == null ? maybe(null) : maybe(fn(value))),
  getOr: (fallback) => (value == null ? fallback : value),
});

maybe({ city: "Madrid" }).map((u) => u.city).getOr("no city"); // 'Madrid'
maybe(null).map((u) => u.city).getOr("no city");               // 'no city'
```

> [!warning] A `Promise` is close to a monad, but it is not one
> Say **close**, not *is*:
>
> ```js
> Promise.resolve(Promise.resolve(1)).then((v) => typeof v); // 'number'
> ```
>
> Verified in Node ✅ — the promise **flattens** by itself, so a `Promise<Promise<number>>` can not exist. A real monad keeps the two levels and needs `flatMap` to join them. Also, `then` does the work of `map` and of `flatMap` at the same time. The honest answer is: "it has the shape of a monad, but it does not respect all the laws".

> [!question] Short answer for the interview
> "The patterns of functional programming that I use every day are the pure functions and the immutability — in React they are obligatory, because the render depends on a new reference to detect the change. Then the composition with `pipe`, the currying to fix the first arguments, and the higher order functions like `map` or `filter`. The monads are the most theoretical one: a `Maybe` represents a value that can be there or not, and it avoids the chains of `if (x !== null)`."

---

# Anti-patterns

| Anti-pattern | What it is | How we solve it |
|---|---|---|
| **God object** | One object that does everything, without separation of concerns | Split it by responsibility (the **S** of SOLID) |
| **Blob / Swiss Army Knife** | A class that tries to do multiple things, or an interface that covers every case | The same — it is a sub-version of the God object |
| **Spaghetti code** | No clear structure or flow | Modules with a defined boundary |
| **Callback hell** | Callbacks inside callbacks | Promises and `async/await` |
| **Prop drilling** | Passing a prop through many levels | Context or a state container |
| **Magic numbers / strings** | Values without a name | Named constants, `as const`, enums |
| **Premature optimization** | Optimizing without measuring first | Measure → find → fix → measure |

> [!note] The names that are easy to forget
> "A class which tries to do multiple things" is a **Blob**, or a **Swiss Army Knife** when it is an interface that tries to cover every case. Same idea as breaking the single responsibility principle.

---

# Composition over inheritance

Composition gives us **loose coupling**. We can replace or modify each unit without impacting the rest. Inheritance creates rigid hierarchies: a change in the parent affects all the descendants, and JS/React does not work well with deep hierarchies of classes.

The tools that React gives us for the composition:

- **`children`** and slots as props.
- **Custom hooks** to reuse the logic.
- **Context** for the inversion of control — we declare the context above and we compose it into the component.

> [!tip] Why inheritance breaks, in detail
> The mechanism underneath — Liskov, the fragile base class, mixins and the diamond — is in [[TypeScript#Inheritance: what actually breaks]].

---

# Principles

## SOLID

| Letter | Principle             | In one sentence                                                                                     |
| ------ | --------------------- | --------------------------------------------------------------------------------------------------- |
| **S**  | Single responsibility | Every unit does **one** thing.                                                                      |
| **O**  | Open/closed           | Open for **extension**, closed for **modification**.                                                |
| **L**  | Liskov substitution   | We have to be able to use a subtype in every place where its parent is expected.                    |
| **I**  | Interface segregation | Small and specific interfaces, no God-interfaces.                                                   |
| **D**  | Dependency inversion  | The high-level modules should not depend on the low-level ones; **the two depend on abstractions**. |

> [!tip] Connect every principle with a pattern
> This is what makes the answer look senior:
> - **O** → the **strategy**: adding a key to the object is extending without modifying.
> - **D** → the **DI** of Angular, and the props of a React component.
> - **S** → against the **God object**.
> - **I** → against the **Swiss Army Knife**.

## DRY, YAGNI, KISS

- **DRY** — don't repeat yourself.
- **YAGNI** — you aren't gonna need it: do not write code "for the future".
- **KISS** — keep it simple.
- **Pure functions** where it is possible, without side effects.

And the code quality has to be **measurable**, not an opinion: cyclomatic and cognitive complexity with SonarQube and ESLint, quality gates for the length of the line and of the file, and the **arity** (number of arguments) kept low.

## Dependency inversion vs dependency injection vs inversion of control

They sound the same and they are three different levels:

| | What it is | Example |
|---|---|---|
| **Inversion of Control (IoC)** | The **general principle**: the framework calls our code, not the other way around. "Don't call us, we'll call you." | Event handlers, `map`/`filter`, the declarative render of React |
| **Dependency Inversion (DIP)** | A **design principle** (the D of SOLID): depend on abstractions, not on concrete implementations | Depending on an interface instead of a concrete class |
| **Dependency Injection (DI)** | A **technique** to get DIP: the dependencies are given from outside | The DI container of Angular, with tokens and providers |

> [!question] Short answer for the interview
> "IoC is the general principle — the flow of control is inverted and the framework calls me. Dependency inversion is the SOLID principle of depending on abstractions. And dependency injection is one concrete technique to implement it, passing the dependencies from outside instead of creating them inside."

## What is good code

- It does **one** thing per unit, and the name says which one.
- It is **measurable**: complexity, line and file length, arity — enforced by the linter, not by opinion.
- It is **testable without mocks of half the world** — if a test needs five mocks, the coupling is the bug.
- It is **boring**: the next person reads it once and knows what it does.

---

# Still to study

- [ ] **Event-driven architecture**
- [ ] **Micro-frontends**
- [ ] **Integration patterns, messaging patterns and enterprise application patterns**
- [ ] **Cross-cutting concerns** and how to solve them for a whole solution
- [ ] **Compound components** — the composition pattern still missing from these notes
- [x] **OOP vs FP vs RP (reactive)**, pros and cons → [[TypeScript#OOP vs FP vs RP]]
- [x] **Object patterns and composition** → [[TypeScript#Composition, mixins and delegation]]
- [x] **Decorators in TypeScript**: TS decorators vs esNext decorators, and the pitfalls → [[TypeScript#Decorators, in four lines]]
