---
title: Design Patterns
tags:
  - study
  - interview
  - promotion
  - design-patterns
  - principles
parent: "[[The Best Notes of the F Word]]"
source: extracted from [[Assessment Questions]] and [[The Best Notes of the F Word]]
---

# Design Patterns

Everything about design patterns that was spread in the vault, in one place.
Related: [[Assessment Questions]] · [[The Best Notes of the F Word]] · [[Questions for interviews]]

> [!info]- Where every part of this note comes from
> Nothing here is invented. This is the map of the extraction:
>
> | Section | Extracted from |
> |---|---|
> | Categories, favorite pattern, RxJS | [[Assessment Questions#2. Technical — Design patterns & principles]] |
> | Anti-patterns, functional patterns | [[Assessment Questions#Name some anti-patterns you try to avoid]] |
> | Composition vs inheritance | [[Assessment Questions#Why is composition better than inheritance in React?]] |
> | SOLID, IoC / DIP / DI, good code | [[Assessment Questions#Explain the SOLID principles]] |
> | State management | [[Assessment Questions#Why do we need a state container like Redux, if React has state and Context?]] |
> | The checklist of pending topics | [[The Best Notes of the F Word#Design patterns]] and the Level Up plan |
> | Single-flight | [[Mock Interview Session 01#Q3 — The token-refresh race]] |
>
> The **code examples are new** — the vault only had the names of the patterns, without code. All of them are verified in Node v22 ✅

> [!warning]- 5 traps inside this material (read this first)
> 1. **Observer and pub-sub are not the same thing.** The vault says "observer, also known as pub-sub". In the observer the subject knows its observers; in pub-sub there is a **broker** in the middle and the two sides do not know each other. RxJS is observer, an event bus is pub-sub.
> 2. **A `Promise` is not really a monad.** The vault says "very close" and that is the honest answer. `then` flattens automatically, so a `Promise<Promise<T>>` can not exist — verified in Node ✅. A real monad keeps the two levels and needs `flatMap` to join them.
> 3. **Redux is not a Gang of Four pattern.** It is the **Flux** architecture. Inside it there are GoF ideas: the store notifies its subscribers (observer), the actions are commands, and the middleware is a chain.
> 4. **In JavaScript a singleton is normally just a module.** An ES module is evaluated **one time** and cached, so exporting an object already gives us a singleton — verified in Node ✅. We do not need the `getInstance()` class of Java.
> 5. **"My favorite is the strategy pattern" needs a real example ready.** The next question is always "where did you use it?". Without a case from our own project the answer sounds memorized.

---

# Quick reference — the three categories

The Gang of Four defined three categories:

| Category | What it solves | Typical in JS |
|---|---|---|
| **Creational** | How the objects are created | Factory, Singleton, Builder |
| **Structural** | How the objects are composed | **Facade** (wrapping an API), Adapter, Proxy, Decorator |
| **Behavioral** | How the objects communicate | **Strategy**, Observer, Command |

In architectural terms, the pattern of **state management** is the one most used in front-end applications.

> [!tip] Where we already use them in front-end (addition)
> This table is not in the vault, but it is the follow-up question after the categories:
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

Verified in Node ✅

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

But in JavaScript we almost never write this, because **the modules are already singletons**:

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

Verified in Node ✅

---

# Structural

## Facade

**Wrapping an API.** We give one simple interface over several low level calls. This is the example the vault uses for the category.

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

The same idea appears in [[Assessment Questions#Explain server-side rendering]]: the browser APIs do not exist in the server, so we need **a guard or a facade of the platform**.

## Adapter

We convert one shape into another shape. In front-end it is the mapper between the API and the component.

```js
const apiUser = { first_name: "ana", last_name: "lopez" };
const toViewModel = (u) => ({ fullName: `${u.first_name} ${u.last_name}` });

toViewModel(apiUser); // { fullName: 'ana lopez' }
```

Verified in Node ✅

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

Verified in Node ✅

The **Service Worker** is also a proxy, but of the network — see [[Assessment Questions#How do you handle security threats in your app?]].

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

Verified in Node ✅

In React this is the **HOC** (higher order component), and `React.memo` is a decorator too: it receives a component and returns the same component with the memoization added.

---

# Behavioral

## Strategy

The favorite pattern of the answer in the session. We have several algorithms with the **same interface** and we choose one in runtime.

> JavaScript, and specially TypeScript, are very good for it, because a strategy can be simply an object of functions with a shared interface, without any hierarchy of classes.

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

Verified in Node ✅

In TypeScript the shared interface becomes explicit, and this is the part worth saying out loud:

```ts
type ShippingStrategy = (weight: number) => number;
const shipping: Record<string, ShippingStrategy> = { /* ... */ };
```

> [!question] Short answer for the interview
> "My favorite is the strategy pattern, a behavioral one. It replaces a big `switch` with an object of functions that share the same interface, so adding a new case is adding a key, not modifying the existing code — it respects the open/closed principle. In JavaScript I do not need a hierarchy of classes for it, and in TypeScript I can type the interface of the strategy with a `type`, so the compiler checks that every strategy has the same signature."

> [!tip] Prepare the real example
> Think about one case from our own project — the shipping costs, the validations by country, the different renders by type of user, the export in PDF / CSV / Excel. Without a concrete example the answer is incomplete.

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

Verified in Node ✅

> [!danger] Correction of the vault
> [[Assessment Questions#What pattern is behind RxJS?]] says "the observer pattern, also known as pub-sub". They are **not** synonyms:
>
> | | Who knows who | Example |
> |---|---|---|
> | **Observer** | The subject has the list of its observers | RxJS, the `subscribe` of Redux |
> | **Pub-sub** | A broker in the middle, the two sides are decoupled | An event bus, a message queue |
>
> The note already had this nuance in a small callout. It is worth saying it in the interview, because it is the detail that separates "I know the name" from "I know the pattern".

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

Verified in Node ✅

This is exactly a **Redux action + reducer**. And because every command is an object with a name, we get the **time travel** of the devtools — see [[Assessment Questions#Why do we need a state container like Redux, if React has state and Context?]].

---

# Concurrency

## Single-flight

Several callers ask for **the same operation at the same time**. Instead of doing the work N times, the first caller starts it and saves the **promise**; everybody else receives that same promise.

It is also called *request deduplication*, *request coalescing*, or *promise memoization*. What we cache is the promise, not the result.

The problem, with the case of the session — the token expires and five requests in flight receive a 401 at the same time:

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

> [!danger] It is not a Gang of Four pattern
> Single-flight is a **concurrency idiom**, not one of the 23. The same honesty as with Redux and Flux — it is better to say it than to be corrected.
>
> Where it comes from: the name is from the Go community (`golang.org/x/sync/singleflight`). Conceptually it is **memoization applied to a promise**, with a lifetime of "while it is in flight" instead of for ever. The nearest GoF relative is the **singleton**, but scoped to one operation instead of to one object.

> [!question] Short answer for the interview
> "Single-flight means that when several callers need the same operation at the same time, only the first one starts it and the rest await the same promise. I use it for the refresh of the token: with five concurrent 401s, without it we send five refreshes, and as the refresh token normally rotates, the first one invalidates it and the other four fail, so the user is logged out alone. I save the promise in a module variable and clear it in `finally`, not in `then`, so a failed refresh does not leave the slot poisoned. It works because there is no `await` between checking the variable and assigning it, so that block is atomic in the event loop. With several tabs the module variable is not enough and I move the lock to Web Locks or `BroadcastChannel`."

The layers around this pattern — transport, auth, domain, feature — and what deliberately **stays out** of them are in [[Mock Interview Session 01#Q3 — The token-refresh race]].

---

# Functional patterns

From [[Assessment Questions#Name some patterns from the functional programming paradigm]]:

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

Verified in Node ✅ — the three of them.

> [!danger] Correction — the `Promise` and the monads
> The vault says "the `Promise` is also very close to a monad". The word **close** is correct and it is better not to say that it **is** one:
>
> ```js
> Promise.resolve(Promise.resolve(1)).then((v) => typeof v); // 'number'
> ```
>
> Verified in Node ✅ — the promise **flattens** by itself, so a `Promise<Promise<number>>` can not exist. A real monad keeps the two levels. Also, `then` does the work of `map` and of `flatMap` at the same time. The honest answer is: "it has the shape of a monad, but it does not respect all the laws".

> [!question] Short answer for the interview
> "The patterns of functional programming that I use every day are the pure functions and the immutability — in React they are obligatory, because the render depends on a new reference to detect the change. Then the composition with `pipe`, the currying to fix the first arguments, and the higher order functions like `map` or `filter`. The monads are the most theoretical one: a `Maybe` represents a value that can be there or not, and it avoids the chains of `if (x !== null)`."

---

# Anti-patterns

From [[Assessment Questions#Name some anti-patterns you try to avoid]]:

| Anti-pattern | What it is | How we solve it |
|---|---|---|
| **God object** | One object that does everything, without separation of concerns | Split it by responsibility (the **S** of SOLID) |
| **Blob / Swiss Army Knife** | A class that tries to do multiple things, or an interface that covers every case | The same — it is a sub-version of the God object |
| **Spaghetti code** | No clear structure or flow | Modules with a defined boundary |
| **Callback hell** | Callbacks inside callbacks | Promises and `async/await` |
| **Prop drilling** | Passing a prop through many levels | Context or a state container |
| **Magic numbers / strings** | Values without a name | Named constants, `as const`, enums |
| **Premature optimization** | Optimizing without measuring first | Measure → find → fix → measure |

> [!note] The one that could not be remembered in the session
> The answer said "a class which tries to do multiple things... a sub-version of the God object". The name is **Blob**, or **Swiss Army Knife** when it is an interface that tries to cover every case. It is the same idea as breaking the single responsibility principle.

---

# Composition over inheritance

> [!tip] Why inheritance breaks, in detail
> This section is the React answer. The mechanism underneath — Liskov, the fragile base class, mixins and the diamond — is in [[OOP in JavaScript and TypeScript#7. Inheritance: what actually breaks]].

From [[Assessment Questions#Why is composition better than inheritance in React?]]:

Because it gives us **loose coupling**. We can replace or modify each unit without impacting the rest. The inheritance creates rigid hierarchies: a change in the parent affects all the descendants, and JS/React does not work well with deep hierarchies of classes.

The tools that React gives us for the composition:

- **`children`** and slots as props.
- **Custom hooks** to reuse the logic.
- **Context** for the inversion of control — we declare the context above and we compose it into the component.

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

---

# State management

> In architectural terms, the pattern of state management is the one most used in front-end applications.

Why we need a container like Redux, if React already has state and Context — from [[Assessment Questions#Why do we need a state container like Redux, if React has state and Context?]]:

- **Single source of truth** — one place describes the state, and so it describes the view.
- **Less cognitive complexity** — the actions have names that describe what the user did.
- **Devtools and time travel** — we can replay the steps and debug in any point.
- **Selectors** — we subscribe to a *slice* of the state. The Context re-renders **all** the consumers on any change.
- **Pure functions by force** — the reducers have to be pure, and a pure function is easy to unit test.

> [!danger] Correction — Redux is not a GoF pattern
> Redux is the **Flux** architecture, not one of the 23 patterns of the Gang of Four. But it is built with them, and this is a good thing to say:
>
> | Piece of Redux | Pattern |
> |---|---|
> | The action `{ type, payload }` | **Command** |
> | `store.subscribe()` | **Observer** |
> | The middleware (`thunk`, `saga`) | A chain of decorators |
> | The reducer | A pure function — `reduce` / fold |
>
> The details of every piece are in [[Questions for interviews#Redux]].

---

# Still to study

> [!todo]- These topics are only a title in the vault
> They appear in the Level Up career plan (see [[The Best Notes of the F Word]]) without any definition. I did not invent them — tell me and I fill them in, one by one.
>
> - [ ] **Event-driven architecture** — *Software Design, Advanced*
> - [ ] **Micro-frontends** — *Software Design + JavaScript Top Frameworks*
> - [ ] **Integration patterns, messaging patterns and enterprise application patterns** — *Software Design*
> - [x] **OOP vs FP vs RP (reactive)**, pros and cons — *Software Design* → [[OOP in JavaScript and TypeScript#11. OOP vs FP vs RP]]
> - [ ] **Cross-cutting concerns** and how to solve them for a whole solution — *Software Design*
> - [ ] **Compound components** — the vault itself says it is the "composition pattern that is missing in the notes"
> - [x] **Object patterns and composition** — *JavaScript, Advanced* → [[OOP in JavaScript and TypeScript#8. Composition, mixins and delegation]]
> - [x] **Decorators in TypeScript**: TS decorators vs esNext decorators, and the pitfalls — *TypeScript, Advanced* → [[TypeScript Type System#14. Decorators, in four lines]]
