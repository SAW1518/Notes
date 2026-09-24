---
title: OOP in JavaScript and TypeScript
tags:
  - study
  - interview
  - promotion
  - oop
  - javascript
  - typescript
  - principles
parent: "[[The Best Notes of the F Word]]"
source: "created 2026-09-24 to fill the OOP holes: `this` binding (open since [[Mock Interviews Knowledge Base#Still unanswered across all four sessions — expect them again]] item 5), object patterns and composition (Level Up JavaScript Advanced), and OOP vs FP vs RP ([[Design Patterns#Still to study]]). Companion note: [[TypeScript Type System]]"
---

# OOP in JavaScript and TypeScript

The pillars, the prototype underneath the `class` keyword, `this`, and why the frontend answer is almost always composition.

Related: [[Design Patterns]] · [[Design Patterns#SOLID]] · [[Design Patterns#Composition over inheritance]] · [[TypeScript Type System]] · [[Mock Interviews Knowledge Base#Walk the prototype chain for `dog.speak()`]]

> [!danger]- The three OOP holes this note closes (read this first)
> 1. **`this` was never answered** — it is item 5 of the questions still open after four mock sessions. Five rules, and why an arrow function has no `this` of its own.
> 2. **"Composition over inheritance" was known as a slogan, not as a mechanism.** The vault has the React answer ([[Design Patterns#Composition over inheritance]]); what was missing is *what inheritance actually breaks* — Liskov, the fragile base class, and the diamond.
> 3. **`private` in TypeScript is not private.** It is erased like every other type. `#field` is the real one. Same family of mistake as [[TypeScript at the Boundary#a) The types are erased]].

---

# 0. The one sentence

> [!important] The mental model
> **JavaScript has no classes. It has objects that delegate to other objects.** `class` is syntax over prototypal delegation, and TypeScript's `private`, `protected`, `implements` and `abstract` are compile-time paperwork on top of that.
>
> So every OOP question in a JS interview has two layers: the OOP concept, and the prototype or erasure reality underneath it. Answering only the first layer is the ⚠️ Mid answer from [[Study prompt#7. RUBRIC (how you grade me)]].

---

# 1. The four pillars, with the JS reality under each

| Pillar | The definition | What it actually is in JS/TS |
|---|---|---|
| **Encapsulation** | State and the operations on it live together; the inside is hidden | `#private` fields (real), closures (real), `private` (erased), module scope |
| **Abstraction** | Expose *what* it does, hide *how* | `interface`, `abstract class`, a facade ([[Design Patterns#Facade]]) |
| **Inheritance** | A type reuses and specialises another | `extends` → sets the **prototype chain**; `super` → walks up it |
| **Polymorphism** | One call site, many behaviours | Method overriding, and **structural typing** — no `extends` required |

> [!tip] The sentence that upgrades this answer
> "Three of the four pillars have a cheaper implementation in JS than a class hierarchy: encapsulation with a module or a closure, abstraction with an interface or a function signature, and polymorphism with structural typing or a strategy object. Only inheritance really needs `extends` — and that is the one I use least."

---

# 2. Encapsulation: four levels, only two of them real

```ts
class Account {
  public  id: string = '';        // visible everywhere
  protected rate = 0.1;           // this class + subclasses — COMPILE TIME ONLY
  private  secret = 'x';          // this class only        — COMPILE TIME ONLY
  #balance = 0;                   // real privacy, enforced by the engine
  static #count = 0;              // static private

  get balance() { return this.#balance; }              // read-only from outside
  set balance(v: number) { throw new Error('use deposit()'); }

  deposit(n: number) { this.#balance += n; return this; }   // return this → chainable
}
```

| Mechanism | Enforced by | Survives compilation | Visible in devtools / `Object.keys` |
|---|---|---|---|
| `private` / `protected` (TS) | the compiler | ❌ erased | ✅ yes — fully readable and writable at runtime |
| `#field` | the **engine** | ✅ real | ❌ no (and a wrong access is a **syntax** error) |
| Closure variable | the engine | ✅ real | ❌ no |
| Naming convention `_field` | nothing | ✅ | ✅ |

```ts
const a = new Account();
(a as any).secret = 'changed';    // ✅ works at runtime — `private` stopped nobody
a.#balance;                       // ❌ SyntaxError, not even a type error
```

> [!question] Short answer for the interview
> "TypeScript's `private` is a compile-time contract — it is erased with every other type, so at runtime the field is a normal property and a cast or plain JS can read and write it. If I need real encapsulation I use a `#` private field, which the engine enforces, or a closure. `private` is for communicating intent inside a typed codebase; `#` is for invariants I cannot allow anyone to break, and for anything that holds a secret."

## The closure alternative (the "object patterns" item)

```ts
function createCounter(start = 0) {
  let count = start;                                   // truly private
  return {
    increment: () => ++count,
    get value() { return count; },
  };
}
```

No `this`, no `new`, no binding problems, real privacy, and trivially testable. The cost: **one closure per instance**, so every method is a new function object — for thousands of instances the prototype version wins on memory. That trade-off is the senior half of "closures vs classes". Leak patterns of the closure version: [[Mock Interviews Knowledge Base#Name the closure-related memory leak patterns and their fixes]].

---

# 3. `class` is prototypes — what the keyword really does

```js
class Animal { speak() { return 'generic'; } }
class Dog extends Animal { speak() { return 'woof'; } }

const d = new Dog();
Object.getPrototypeOf(d) === Dog.prototype;             // true
Object.getPrototypeOf(Dog.prototype) === Animal.prototype;  // true
```

`extends` does two links, and this is the part people miss:

1. `Dog.prototype.__proto__ = Animal.prototype` → **instance** methods are inherited.
2. `Dog.__proto__ = Animal` → **static** members are inherited too.

The lookup for `d.speak()`: own property → `Dog.prototype` → `Animal.prototype` → `Object.prototype` → `null`. Full walk with the `this` binding step: [[Mock Interviews Knowledge Base#Walk the prototype chain for `dog.speak()`]].

| | `class` | `function` constructor + prototype | `Object.create` |
|---|---|---|---|
| Hoisted | ❌ (TDZ, like `let`) | ✅ | n/a |
| Strict mode inside | always | only if the file is | n/a |
| Callable without `new` | ❌ TypeError | ✅ (silent bug) | n/a |
| `#private`, `static` blocks | ✅ | ❌ | ❌ |
| What it expresses | a type | a type, verbosely | **delegation**, directly |

## Class fields vs prototype methods (the one that changes behaviour)

```js
class A {
  method() {}                 // on A.prototype — ONE function shared by all instances
  arrow = () => {};           // OWN property of each instance — one function PER instance
}
```

The arrow field is the standard "auto-bound handler" trick, and it costs memory per instance and cannot be called via `super`. It is also why `Object.keys(instance)` shows `arrow` but not `method`.

> [!warning] Field initialisation order — a real bug source
> Fields are initialised **after** `super()` returns, in declaration order. So a base-class constructor that calls an overridden method sees the subclass's fields as `undefined`:
> ```js
> class Base { constructor() { this.init(); } init() {} }
> class Child extends Base { name = 'x'; init() { console.log(this.name); } }
> new Child();   // undefined — not 'x'
> ```
> This is the **fragile base class** problem in its smallest form.

---

# 4. `this` — the five rules (the open question)

`this` is not lexical and it is not the object where the function was **defined**. It is decided at the **call site**, by these rules, in this order of precedence:

| # | Rule | Call shape | `this` is |
|---|---|---|---|
| 1 | **`new` binding** | `new Foo()` | the brand-new object |
| 2 | **Explicit binding** | `f.call(o)`, `f.apply(o)`, `f.bind(o)` | `o` (`bind` returns a permanently bound function) |
| 3 | **Implicit binding** | `obj.f()` | `obj` — whatever is **left of the dot** |
| 4 | **Default binding** | `f()` | `undefined` in strict mode / modules, `globalThis` in sloppy mode |
| 5 | **Lexical (arrow)** | `() => {}` | inherited from the enclosing scope — **not a rule, an absence of one** |

```js
const user = {
  name: 'Ana',
  greet() { return `hi ${this.name}`; },
};

user.greet();                     // 'hi Ana'      → rule 3
const g = user.greet;
g();                              // ❌ TypeError  → rule 4: the dot was lost
g.call(user);                     // 'hi Ana'      → rule 2
setTimeout(user.greet, 0);        // ❌ same loss — the callback is invoked bare
setTimeout(() => user.greet(), 0);// ✅ the call site keeps the dot
```

## Why an arrow function has no `this` of its own

An arrow function **does not create a `this` binding at all**. `this` inside it resolves up the scope chain exactly like any other variable — it is closed over, at definition time, and `call`/`apply`/`bind` cannot change it.

```js
class Timer {
  count = 0;
  startBad()  { setInterval(function () { this.count++; }, 1000); }  // `this` is undefined
  startGood() { setInterval(() => { this.count++; }, 1000); }        // `this` is the instance
}
```

Consequences worth naming: an arrow cannot be a constructor, has no `arguments`, no `prototype`, and **must not** be used for an object-literal method that needs the receiver (`{ name, greet: () => this.name }` is broken by design).

> [!question] Short answer for the interview
> "`this` is determined by the call site, not by where the function was written. In order of precedence: `new` binds the new object; `call`, `apply` and `bind` bind explicitly; a method call binds whatever is left of the dot; and a bare call gets `undefined` in strict mode or in a module. An arrow function is the exception because it does not create a `this` binding at all — it closes over the `this` of the enclosing scope, which is why it survives being passed as a callback and why `bind` has no effect on it. The classic bug is extracting a method and losing the dot, and the fixes are an arrow wrapper, a class field arrow, or `bind` in the constructor."

> [!tip] The three-word tell
> **"Left of the dot."** If there is no dot at the call site, there is no implicit binding.

---

# 5. Abstraction: `interface` vs `abstract class`

```ts
interface Repository<T> {                  // pure contract, zero runtime output
  find(id: string): Promise<T | null>;
}

abstract class BaseRepository<T> implements Repository<T> {
  constructor(protected http: HttpClient) {}       // parameter property: declares + assigns
  abstract find(id: string): Promise<T | null>;    // subclass must implement
  protected url(id: string) { return `${this.base}/${id}`; }   // shared implementation
  protected abstract get base(): string;
}
```

| | `interface` | `abstract class` |
|---|---|---|
| Runtime output | none (erased) | a real class, in the prototype chain |
| Can hold implementation / state | ❌ | ✅ |
| How many can a class take | many (`implements A, B`) | **one** (`extends`) |
| Enforces a constructor signature | ❌ | ✅ |
| Couples the subclass to it | no | yes — it is inheritance |

> [!important] The decision rule
> **`interface` for the contract, `abstract class` only when there is real shared behaviour and state that every subclass needs.** Defaulting to `abstract class` is how a fragile base class is born; defaulting to `interface` + composition is how it is avoided. In TS, `implements` is checked but **not** inherited — it adds no runtime coupling, which is exactly the D of [[Design Patterns#SOLID]] done cheaply.

---

# 6. Polymorphism — three kinds, only two of them OOP

```ts
// 1. Subtype polymorphism: override and dispatch through the prototype chain
class Shape { area() { return 0; } }
class Circle extends Shape { area() { return Math.PI * this.r ** 2; } }
shapes.map(s => s.area());               // each one resolves its own method

// 2. Structural / "duck" polymorphism — no inheritance anywhere
type Speaker = { speak(): string };
function announce(x: Speaker) { return x.speak(); }
announce({ speak: () => 'hi' });         // ✅ TS is structural: shape is enough

// 3. Parametric polymorphism = generics — same code, many types
function first<T>(xs: T[]): T | undefined { return xs[0]; }
```

TypeScript **overloads** are compile-time only — one implementation, several signatures. There is no runtime dispatch on argument types:

```ts
function parse(x: string): object;
function parse(x: object): string;
function parse(x: unknown): unknown { /* the single real body, must handle both */ }
```

> [!tip] `override` and `noImplicitOverride`
> Mark every intentional override with `override`. With `noImplicitOverride` on, renaming a base method turns the orphaned subclass method into a **compile error** instead of a method that silently never runs again.

---

# 7. Inheritance: what actually breaks

## a) Liskov substitution, concretely

A subtype must be usable **everywhere** the parent is expected, with no caller changing behaviour. The classic violation:

```ts
class Rectangle { constructor(public w: number, public h: number) {}
  setWidth(w: number) { this.w = w; } }

class Square extends Rectangle {
  setWidth(w: number) { this.w = w; this.h = w; }    // "keeps it square"
}

function grow(r: Rectangle) {
  r.setWidth(5);
  return r.w * r.h;          // a caller holding a Rectangle expects w*h to follow setWidth alone
}
```

`Square` **is a** square, and it is still not a substitutable `Rectangle`, because it breaks an invariant the caller relies on. The rule: an override may **weaken preconditions and strengthen postconditions**, never the reverse. Throwing `NotSupported` in an override is the other everyday violation.

## b) The fragile base class

Every `protected` member is public API to the subclasses. A refactor inside the base class that is invisible from outside can break every descendant — and the base class author cannot see the call sites. This is the concrete cost behind "inheritance creates rigid hierarchies" in [[Design Patterns#Composition over inheritance]].

## c) No multiple inheritance, and the diamond

JS allows exactly one prototype chain. Two behaviours from two parents require **mixins**, and then the diamond question ("which `init()` wins?") is answered by the order of application — which is why deep mixin stacks are also discouraged.

## d) Subclassing built-ins

```ts
class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, HttpError.prototype);   // needed when targeting ES5
  }
}
```

`instanceof HttpError` fails in ES5-transpiled output without that line, because `Error` returns a fresh object from its own constructor. **A custom `Error` subclass is the one inheritance every frontend codebase should have** — it is what makes the error layers in [[Mock Interviews Knowledge Base#Which layer catches which error?]] distinguishable, and it pairs with the typed boundary in [[TypeScript at the Boundary#5. Zod in practice]].

---

# 8. Composition, mixins and delegation

```ts
// composition: the object HAS the capability, injected from outside
class OrderService {
  constructor(private repo: Repository<Order>, private logger: Logger) {}
  // swap either one in a test with a plain object — no hierarchy, no framework
}
```

```ts
// mixin: a function that takes a class and returns a subclass
type Ctor<T = {}> = new (...args: any[]) => T;

const Timestamped = <B extends Ctor>(Base: B) => class extends Base {
  createdAt = new Date();
};
const Serializable = <B extends Ctor>(Base: B) => class extends Base {
  toJSON() { return { ...this }; }
};

class Doc extends Timestamped(Serializable(class {})) {}
```

```ts
// delegation: forward to a collaborator instead of inheriting from it
class Cache { constructor(private store = new Map<string, unknown>()) {}
  get(k: string) { return this.store.get(k); } }     // wraps, does not extend Map
```

| Technique | Coupling | Use when |
|---|---|---|
| **Composition / injection** | loosest | the default, always start here |
| **Mixin** | medium | the same orthogonal capability is needed by unrelated classes |
| **Delegation / wrapper** | loose | the collaborator's API is bigger than what should be exposed ([[Design Patterns#Adapter]], [[Design Patterns#Proxy]]) |
| **Inheritance** | tightest | a genuine, stable `is-a` with substitutability — framework base classes, `Error` |

> [!question] Short answer for the interview
> "I prefer composition because inheritance couples me to a hierarchy at design time, and the base class becomes API for every descendant: a change in it reaches code the author cannot see, and Liskov breaks as soon as one subclass has to strengthen a precondition. Composition injects the capability, so it can be replaced per instance, stubbed in a test, and chosen at runtime — which is also the strategy pattern. In React the same idea appears as `children` and slots, custom hooks for logic, and context for inversion of control, which is why HOC-and-class hierarchies disappeared from the ecosystem. I still use inheritance for a real `is-a` with stable invariants — a custom `Error` subclass, or a framework's base class."

---

# 9. Statics, and the class-as-namespace smell

```ts
class MathUtils { static clamp(n: number, a: number, b: number) { … } }   // ❌ a module in disguise
export function clamp(n: number, a: number, b: number) { … }              // ✅ tree-shakable
```

Statics are inherited (`Child.staticMethod()` works) and `this` inside a static refers to the **class**, which is what makes the factory pattern work:

```ts
class Model {
  static create<T extends typeof Model>(this: T): InstanceType<T> {
    return new (this as any)();      // `this` is the subclass when called as Child.create()
  }
}
```

Static blocks (`static { … }`) run once at class definition time, and are the right place for private static setup.

> [!warning] `static` + mutable state = singleton by accident
> A `static cache` is global mutable state with a nicer name: it breaks test isolation and, in SSR, **leaks data between requests of different users**. The singleton trade-offs are in [[Design Patterns#Singleton]] — this is the same problem entering through the back door.

---

# 10. `instanceof`, `constructor`, and checking types at runtime

```js
x instanceof Dog            // walks the prototype chain looking for Dog.prototype
Dog.prototype.isPrototypeOf(x)
x.constructor === Dog       // breaks on a subclass, and is trivially spoofable
Object.getPrototypeOf(x)
```

> [!danger] When `instanceof` lies
> - **Two copies of the same library** (two `node_modules` versions, or a bundle + a CDN copy) → two different `Dog.prototype` objects → `false` on a valid instance.
> - **Across a realm** — an iframe, a worker, a Node `vm`. `Array.isArray` exists precisely because `instanceof Array` fails across realms.
> - `Object.setPrototypeOf` / `Symbol.hasInstance` can make it say anything.
> - **A plain object from JSON is never an instance of anything.** There is no tag on it — which is the whole argument of [[TypeScript at the Boundary#d) Structural typing has no runtime tag]]. Discriminate with a field, or parse into a class.

---

# 11. OOP vs FP vs RP

The comparison that was open in [[Design Patterns#Still to study]].

| | **OOP** | **Functional** | **Reactive** |
|---|---|---|---|
| Unit | object = state + behaviour | pure function + immutable data | stream of values over time |
| State | encapsulated, mutable | passed through, immutable | derived from the stream |
| Composition | objects, inheritance, injection | function composition, currying | operators (`map`, `filter`, `switchMap`) |
| Polymorphism | dispatch on the receiver | higher-order functions | operators over any stream |
| Strength | models identity, lifecycle and invariants | testability, predictability, no shared state | async coordination, cancellation, backpressure |
| Weakness | hidden state, hierarchies, `this` | awkward for long-lived identity, allocation cost | steep learning curve, debugging a marble diagram |
| Where it shows in my stack | Angular services, `Error` subclasses, DI, domain models | React components, reducers, selectors, `map`/`filter`, immutability | RxJS, event streams, `Observable` ([[Design Patterns#Observer]], [[Design Patterns#Pub-sub]]) |

> [!question] Short answer for the interview
> "They answer different questions, and a real frontend uses all three. I reach for functional style by default — pure render functions, immutable state, reducers — because it makes behaviour testable without setup and it is what React's model assumes. I use OOP where there is identity and invariants to protect: domain entities, a typed error hierarchy, services with injected dependencies. And reactive where the problem is coordinating asynchronous events over time — debounced search, cancellation, retry — because promises model one value and streams model a sequence. The mistake is picking one as an identity instead of per problem."

---

# 12. Where OOP actually appears in a modern frontend

| Place | What it is |
|---|---|
| `class AppError extends Error` and its subtypes | the only inheritance most apps need |
| Angular / NestJS services and DI | constructor injection, decorators, the D of SOLID ([[Design Patterns#Dependency inversion vs dependency injection vs inversion of control]]) |
| Domain models with invariants | a `Money` or `DateRange` that cannot be built invalid — pairs with branded types in [[TypeScript Type System#10. Structural vs nominal typing, and branded types]] |
| Web platform APIs | `IntersectionObserver`, `AbortController`, `Map`, `URL` — all classes, all `new` |
| React **class** components | legacy only: `this` binding, lifecycle methods, and error boundaries, which are **still** class-only ([[The Best Notes of the F Word#Which methods replace useEffect]]) |
| State machines | `idle → loading → success` as explicit transitions, typed with a discriminated union |

---

# 13. Recall triggers

| When I hear / say… | The words that must come out |
|---|---|
| "`this` is undefined" | **left of the dot** — implicit binding was lost |
| "why does the arrow work?" | it has **no `this` of its own**; lexical, and `bind` cannot change it |
| "is it private?" | `private` is **erased**; `#field` is engine-enforced |
| "should this extend that?" | is it substitutable? **Liskov** — otherwise compose |
| "the base class changed and everything broke" | **fragile base class**, `protected` is public API to subclasses |
| "interface or abstract class?" | interface = contract, many; abstract = shared behaviour, one |
| "`instanceof` returns false" | two copies of the library, **another realm**, or plain JSON |
| "class or closure?" | prototype = one method shared; closure = real privacy, one per instance |
| "we need both behaviours" | **mixin** or composition — JS has one prototype chain |
| "static helper" | that is a **module**; static mutable state is a singleton, and leaks in SSR |
| "OOP vs functional" | identity and invariants vs transformation and purity — **per problem** |

---

# 14. Drill — say these out loud

1. **JS has no classes** — objects delegate to objects. `class` is syntax over the prototype chain.
2. `extends` links **both** `prototype` (instances) and the constructor (statics).
3. `this` = the **call site**: `new` → explicit → implicit (the dot) → default. Arrow = **none of them**.
4. **`private` is erased. `#` is real.** A cast defeats the first; the engine enforces the second.
5. A class **field** is per instance; a **method** lives on the prototype and is shared.
6. Fields initialise **after `super()`** — a base constructor calling an override sees `undefined`.
7. **Liskov:** weaken preconditions, strengthen postconditions. Never throw "not supported".
8. `interface` for the contract, `abstract class` only for real shared state.
9. **Composition first**, mixin when orthogonal, inheritance only for a stable `is-a`.
10. `instanceof` is **not** a type check across realms, duplicated packages, or JSON.
11. **Structural typing means polymorphism needs no inheritance at all.**
12. Static mutable state = a singleton that **leaks between requests in SSR**.

---

# Still to study from here

- [ ] `Symbol.iterator`, `Symbol.asyncIterator` and `Symbol.hasInstance` — making own objects work with `for…of` and `instanceof`.
- [ ] `Object.freeze` vs `as const` vs a deep-readonly type: which of the three actually stops a mutation, and when.
- [ ] `WeakMap` for private state and for caches that must not retain — the link back to [[Mock Interviews Knowledge Base#Name the closure-related memory leak patterns and their fixes]].
- [ ] `Proxy` and `Reflect`: how Vue 3 reactivity and MobX observables are built, and the cost.
- [ ] Modelling a domain aggregate with invariants in the constructor, and where that lives in a frontend architecture.
