---
title: TypeScript
tags:
  - study
  - interview
  - typescript
  - types
  - oop
---

# TypeScript

Types, scopes, the checks, interfaces and unions — plus OOP and the prototype reality underneath the `class` keyword.

The other half, "the data comes from an API, how do you know the shape is right?", is in [[TypeScript Boundary]]. One sentence overlaps on purpose and must be said in both: **the types do not exist at runtime**.

---

# 0. The one sentence

> [!important] The mental model
> A `.ts` file contains **two languages in one file**: the *values* that will exist at runtime, and the *types* that describe them and are then **deleted**.
>
> Almost every TypeScript confusion is a sentence that mixes the two — asking a type to do something at runtime, or asking a value to do something in the type space.

---

# 1. The type system

## The two scopes: type space vs value space

Every name in TS lives in one of two declaration spaces, and some names live in **both**.

| Declaration | Creates a **value** | Creates a **type** |
|---|---|---|
| `const` / `let` / `var` | ✅ | ❌ |
| `function` | ✅ | ❌ |
| `type X = …` | ❌ | ✅ |
| `interface X {}` | ❌ | ✅ |
| `class X {}` | ✅ (the constructor) | ✅ (the instance type) |
| `enum X {}` | ✅ | ✅ |
| `namespace X {}` | ✅ | ✅ |

```ts
type User = { id: string };
const User = { id: '1' };        // ✅ legal — different spaces, no collision

const a: User = User;            // the annotation reads the TYPE, the value reads the VALUE
new User();                      // ❌ 'User' only refers to a type... when it is a type
```

### `typeof` exists in both spaces and means two different things

```ts
// value space → runtime string
typeof user === 'object'                    // JS operator, survives compilation

// type space → "give me the type of that value"
type Config = typeof defaultConfig;         // TS only, erased
```

> [!warning] The trap
> `typeof` in a type position **never runs**. It is a query to the compiler. Saying "`typeof` checks the type at runtime" in an interview is only true for the value-space one.

### Where a type is visible (the actual scoping rules)

- **Module scope by default.** A file with a top-level `import` or `export` is a module: its types are private unless exported. A file without them is a **global script**, and every type in it leaks into the whole project — the usual cause of "why does this `interface Props` collide?".
- `import type { User } from './user'` imports **only** the type and is guaranteed to be erased. It also breaks import cycles that a value import would create.
- **Block scoped like values**: a `type` declared inside a function is not visible outside it.
- **Generic parameters** are scoped to their declaration: `<T>` in a function signature is only visible inside that signature and body.

### Declaration merging and module augmentation

`interface` declarations with the same name in the same scope **merge**. `type` aliases never do — a duplicate is an error. That is the one capability an interface has that a type alias does not, and it is how third-party typings get extended:

```ts
// extend a global
declare global {
  interface Window { __APP_VERSION__: string }
}

// extend someone else's module
declare module 'express-serve-static-core' {
  interface Request { user?: { id: string } }
}
```

```ts
// process.env, typed properly instead of `as string` everywhere
declare global {
  namespace NodeJS {
    interface ProcessEnv { API_URL: string; NODE_ENV: 'development' | 'production' }
  }
}
```

> [!danger] Augmentation is still a promise, not a check
> `declare global { interface Window { user: User } }` does not put anything on `window`. It tells the compiler to stop complaining. If nothing assigns it at runtime, the property is `undefined` and the type lied — same class of bug as [[TypeScript Boundary#Why the compiler cannot help here]].

---

## `interface` vs `type`

Both describe object shapes and are interchangeable in ~95% of code. The differences that are real:

| | `interface` | `type` |
|---|---|---|
| Object shapes | ✅ | ✅ |
| Unions | ❌ | ✅ `type R = A \| B` |
| Primitives, tuples, functions as aliases | ❌ | ✅ `type ID = string` |
| Mapped / conditional types, `infer` | ❌ | ✅ |
| Declaration merging | ✅ (merges silently) | ❌ (duplicate = error) |
| Extending | `extends` — checked eagerly, clearer errors | `&` — intersection, conflicts collapse to `never` lazily |
| `implements` on a class | ✅ | ✅ (if it is an object type) |
| Recursive self-reference | ✅ | ✅ (since TS 3.7) |
| Error messages / editor speed on big shapes | Keeps the name, caches better | Can inline into a wall of text |

```ts
// the conflict difference, which is the one that bites
interface A { x: string }
interface B extends A { x: number }        // ❌ error immediately, at the declaration

type C = { x: string } & { x: number };    // ✅ declares fine
const c: C = { x: 1 };                     // ❌ error later: x is `string & number` = never
```

> [!question] Short answer for the interview
> "In practice they overlap almost completely for object shapes. I use `interface` for object and class contracts that other code implements — it gives better errors on conflicts and it can be merged, which is how you augment third-party or global typings. I use `type` for everything that is not an object shape: unions, tuples, function types, and anything computed with mapped or conditional types. The one behavioural difference worth naming is that interfaces merge and type aliases do not, so a public API surface is usually an interface and an internal union is a type."

> [!tip] The team rule that avoids the bikeshed
> `interface` for what is *implemented* or *augmented*, `type` for what is *computed* or *unioned*. Enforce it with `@typescript-eslint/consistent-type-definitions` so it stops being a review discussion.

---

## Unions and intersections

### The set-theory reading (this is the part that makes it click)

A type is a **set of values**. Then:

| Type | Set reading | Values allowed |
|---|---|---|
| `'a' \| 'b'` | union | `'a'`, `'b'` |
| `A & B` | intersection | values that satisfy **both** |
| `never` | empty set | nothing — it is the identity of the union and the absorber of the intersection |
| `unknown` | the universe | everything, but usable only after narrowing |

Counter-intuitive but correct: for **object** types, the intersection has **more properties** and therefore **fewer valid values**, while the union has fewer usable properties and more valid values.

```ts
type A = { a: string };
type B = { b: number };

const both: A & B = { a: 'x', b: 1 };   // must have BOTH keys
const one:  A | B = { a: 'x' };         // either shape is fine

declare const u: A | B;
u.a;                                    // ❌ not guaranteed to exist — narrow first
```

### Unions of primitives replace most enums

```ts
type Role = 'admin' | 'member' | 'viewer';   // exists only at compile time, zero runtime cost
```

### Discriminated (tagged) unions — the single most useful shape in a frontend

```tsx
type Request =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error';   error: Error };

function render(r: Request) {
  switch (r.status) {
    case 'idle':    return null;
    case 'loading': return <Spinner />;
    case 'success': return <List items={r.data} />;   // ✅ only here does `data` exist
    case 'error':   return <Alert error={r.error} />; // ✅ only here does `error` exist
  }
}
```

> [!important] Why this beats four booleans
> `{ isLoading, isError, data, error }` allows `isLoading && isError` — a state the UI has no design for, and the bug lands in production. A discriminated union makes the impossible states **unrepresentable**, which is the whole point of having a type system. This is the answer to "how do you model a fetch state?".

### `never` and exhaustiveness

```ts
function assertNever(x: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(x)}`);
}

switch (r.status) {
  case 'idle':    …
  case 'loading': …
  case 'success': …
  case 'error':   …
  default: return assertNever(r);   // ✅ add a 5th variant → this line stops compiling
}
```

That is the mechanism that turns "someone added a state and forgot a branch" from a runtime bug into a **build failure**. Say this out loud in an interview; it is the senior half of the union question.

> [!tip] `never` in one line each
> - The **empty set**: no value has this type.
> - Assignable **to** everything, nothing is assignable **to it** (except `never`).
> - The return type of a function that never returns normally (`throw`, infinite loop).
> - What a `union` collapses to when every member was filtered out — so it is also the exhaustiveness detector.
> - In a union it disappears: `string | never` is `string`.

---

## Literal types, widening, `as const` and `satisfies`

### The widening problem

```ts
const a = 'admin';        // type: 'admin'   ← literal, because const cannot be reassigned
let   b = 'admin';        // type: string    ← widened, because it could change

const config = { role: 'admin' };   // type: { role: string }  ← widened inside objects!
takesRole(config.role);             // ❌ string is not assignable to Role
```

### `as const`

```ts
const config = { role: 'admin', retries: 3 } as const;
// { readonly role: 'admin'; readonly retries: 3 }

const ROLES = ['admin', 'member', 'viewer'] as const;
type Role = typeof ROLES[number];      // 'admin' | 'member' | 'viewer'
```

That last pattern is worth memorising: **one array, used both as runtime data and as the type**. No enum, no duplication, and the list can be iterated to render a `<select>`.

### `as` vs `satisfies` — the pair that gets asked

```ts
type Config = Record<string, string | number>;

// ❌ `as` — a claim. It silences the compiler and can be a lie
const a = { role: 'admin', retries: '3' } as Config;   // typo passes, and role is widened to string|number

// ✅ `satisfies` — a check. Verifies against Config but KEEPS the narrow inferred type
const b = { role: 'admin', retries: 3 } satisfies Config;
b.role;        // 'admin'  ← literal preserved, autocomplete works
// a typo in a key or a wrong value type still fails here
```

| | What it does | Type you get | Safe? |
|---|---|---|---|
| `as T` | Assertion — "trust me" | `T` (widened) | ❌ unchecked, can lie |
| `satisfies T` | Constraint — "check this against T" | the **inferred** narrow type | ✅ checked |
| `: T` (annotation) | Constraint + declaration | `T` (widened) | ✅ checked, loses literals |

> [!question] Short answer for the interview
> "`as` is an assertion: it tells the compiler to accept my claim and it is never verified, so it is the same family as `any` — a place where I take responsibility. `satisfies` is a check: it validates the value against a type but keeps the specific inferred type, so I get both the validation and the literal types for autocomplete and for `keyof`. Annotating with `: T` also checks, but it widens the value to `T` and I lose the literals. For config objects and route maps I use `satisfies`."

> [!warning] What `as` can and cannot do
> `as` only moves **within** related types. `'a' as number` is an error. Forcing it needs the double assertion `x as unknown as number` — and if that appears in a PR, it is a design smell, not a solution.

---

## The checks: narrowing, guards and predicates

Narrowing is how a broad type becomes a precise one inside a block. The compiler does **control-flow analysis**: every branch has its own view of the variable.

| Check | Narrows | Example |
|---|---|---|
| `typeof` | primitives | `if (typeof x === 'string')` |
| `instanceof` | classes, `Error`, `Date` | `if (e instanceof HttpError)` |
| `in` | optional / union members | `if ('data' in r)` |
| Truthiness | `null`, `undefined`, `''`, `0` out | `if (user)` |
| Equality | literal members | `if (status === 'ok')` |
| Discriminant | tagged unions | `switch (r.status)` |
| `Array.isArray` | arrays | `if (Array.isArray(x))` |
| `x === null` / `!= null` | nullish | `if (v != null)` (catches both `null` and `undefined`) |
| Assignment | re-narrows on write | `x = 'a'` |
| Type predicate | anything, **user defined** | `function isUser(x: unknown): x is User` |
| Assertion function | anything, and everything after it | `function assertUser(x: unknown): asserts x is User` |
| `never` in `default` | exhaustiveness | `assertNever(x)` |

```ts
function format(value: string | number | Date | null) {
  if (value == null)              return '—';          // null AND undefined
  if (typeof value === 'string')  return value.trim(); // string here
  if (typeof value === 'number')  return value.toFixed(2);
  return value.toISOString();                          // Date — the only thing left
}
```

### Type predicates and assertion functions

```ts
function isNonNull<T>(x: T | null | undefined): x is T {
  return x != null;
}

const ids = items.map(i => i.id).filter(isNonNull);   // string[] instead of (string|null)[]
```

> [!danger] A predicate is a promise, not a proof
> The body is **not verified**. If it is wrong, or if it drifts behind the interface, TS believes it anyway — the lie just moved from the annotation into the function. Full version of this trap, with the assertion-function annotation requirement: [[TypeScript Boundary#Doing it by hand, when no dependency is allowed]].

### Where narrowing silently disappears (the follow-up question)

```ts
// 1. A callback resets it — the compiler cannot know when it runs
if (user) {
  setTimeout(() => user.name, 0);     // ❌ 'user' is possibly undefined
}
const u = user;                        // ✅ capture it in a const first

// 2. A property re-read after an await or a function call
if (obj.data) {
  await save();
  obj.data.length;                     // narrowing on a mutable property may be dropped
}

// 3. `let` reassigned in between → narrowing recomputed from the assignment
// 4. An `any` anywhere upstream → nothing to narrow, every access is allowed
```

> [!tip] The habit
> Narrow **once**, into a `const`, at the top of the scope. Then the rest of the function is unconditionally typed and no callback can un-narrow it.

---

## `any`, `unknown`, `never` — the three that get swapped

| | Means | Accepts | Can be used | Use it for |
|---|---|---|---|---|
| `any` | "type system off" | everything | everything, unchecked | migrations, and even then temporarily |
| `unknown` | "something, not yet known" | everything | nothing until narrowed | **every value from outside** |
| `never` | "nothing" | nothing | — | impossible branches, exhaustiveness |

Full treatment with the `res.json()` case: [[TypeScript Boundary#`unknown` instead of `any`]].

> [!tip] Vocabulary drill
> **`unknown` = everything, unusable. `never` = nothing, unassignable. `any` = the leak.**

---

## Generics — the part that actually comes up

A generic is a **parameter of the type space**: it keeps the relationship between input and output instead of collapsing it.

```ts
function first<T>(arr: T[]): T | undefined { return arr[0]; }
first([1, 2, 3]);         // number | undefined — inferred, no annotation needed
```

### Constraints, `keyof` and indexed access

```ts
// "K must be a key of T, and the return is the type at that key"
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: '1', age: 30 };
get(user, 'age');      // number
get(user, 'nope');     // ❌ caught at compile time
```

### Defaults, and inference from a union

```ts
type ApiResult<T = unknown> = { data: T; meta: { page: number } };

// infer the element type of a promise-returning function
type Unwrap<T> = T extends Promise<infer U> ? U : T;
```

> [!warning] When NOT to use a generic
> If a type parameter appears **only once** in the signature, it is not doing anything a plain type would not do:
> ```ts
> function log<T>(x: T): void {}        // pointless — just take `unknown`
> ```
> A generic earns its place when it **links** two positions (argument ↔ return, or two arguments). Answering that shows the difference between using generics and understanding them.

---

## Utility types worth knowing cold

| Utility | Does |
|---|---|
| `Partial<T>` / `Required<T>` | all keys optional / all required |
| `Readonly<T>` | all keys `readonly` (shallow!) |
| `Pick<T, K>` / `Omit<T, K>` | keep / drop keys |
| `Record<K, V>` | build an object type from keys to values |
| `Exclude<U, X>` / `Extract<U, X>` | filter a **union** |
| `NonNullable<T>` | drop `null` and `undefined` |
| `ReturnType<F>` / `Parameters<F>` | read a function's pieces |
| `Awaited<T>` | unwrap a promise, recursively |
| `InstanceType<C>` | the instance type of a class value |
| `ThisParameterType<F>` / `OmitThisParameter<F>` | read or drop the `this` parameter |
| `ThisType<T>` | type `this` inside an object literal's methods (needs `noImplicitThis`) |

```ts
type UserPatch  = Partial<Pick<User, 'name' | 'bio'>>;
type RoleLabels = Record<Role, string>;              // must cover every role — exhaustive by construction
type PublicUser = Omit<User, 'passwordHash'>;
```

> [!tip] `Omit` vs `Pick` — the real difference in review
> `Pick` is an **allowlist**: a new field added to `User` is *not* exposed by accident. `Omit` is a **denylist**: a new `passwordResetToken` field ships to the client on the next PR. For anything that crosses a boundary, prefer `Pick`.

---

## Mapped and conditional types, and type manipulation

```ts
// mapped: transform every key
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Getters<T>  = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };
//                                 ↑ key remapping        ↑ template literal type

// conditional + infer: branch on a type, and pull a piece out of it
type ElementOf<T>  = T extends (infer U)[] ? U : never;
type Unwrap<T>     = T extends Promise<infer U> ? Unwrap<U> : T;

// modifiers can be added or removed with + / -
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type Concrete<T> = { [K in keyof T]-?: T[K] };
```

> [!warning] The cost nobody mentions
> Deeply recursive conditional types are the usual reason a repo's editor gets slow and `tsc` takes minutes. `interface` with named shapes is cheap; a five-level conditional over a large union is not. If the type is only read by one call site, write it out by hand.

---

## Structural vs nominal typing, and branded types

TypeScript is **structural**: compatibility is decided by shape, not by name. Two unrelated classes with the same members are interchangeable — this is also why there is no runtime tag to check ([[TypeScript Boundary#Structural typing has no runtime tag]]).

```ts
type UserId  = string;
type OrderId = string;

function load(id: UserId) {}
load(orderId);          // ✅ compiles — both are just `string`. This is the bug.
```

```ts
// brand it: nominal typing, emulated
type UserId  = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

const asUserId = (s: string) => s as UserId;   // one controlled door

load(orderId);          // ❌ now it fails, which is the point
```

Zero runtime cost — the brand is a phantom property that never exists. Worth it for IDs, money amounts, and anything already-validated (`type SafeHtml = string & { __brand: 'SafeHtml' }`, which pairs with [[Security#XSS — Cross-Site Scripting]]).

> [!tip] Excess property checks — the exception that confuses everyone
> Structural typing accepts extra properties… except on a **fresh object literal** assigned directly:
> ```ts
> const a: A = { x: 1, y: 2 };          // ❌ 'y' does not exist in type A
> const tmp = { x: 1, y: 2 };
> const b: A = tmp;                      // ✅ no excess check through a variable
> ```
> It is a deliberate typo-catcher, not a hole in the theory.

---

## Tuples, `readonly`, and the array gotchas

```ts
type Point  = [number, number];
type Named  = [x: number, y: number];              // named tuple — labels show in the editor
type Entry  = readonly [key: string, value: number];
type Args   = [string, ...number[]];               // variadic tail

const t = [1, 'a'] as const;                       // readonly [1, 'a']
```

> [!danger] Two runtime lies that live in array types
> 1. **`arr[i]` is typed as `T`, never `T | undefined`** — unless `noUncheckedIndexedAccess` is on. Out-of-range access is a compile-time success and a runtime `undefined`.
> 2. **`Readonly<T>` is shallow.** `readonly user: { name: string }` still allows `user.name = 'x'`. There is no deep readonly in the language; a mapped recursive type or a library provides it.

---

## Enums — and why a union usually wins

```ts
enum Role { Admin = 'admin', Member = 'member' }   // emits a real JS object: runtime cost
type Role = 'admin' | 'member';                    // erased: zero cost
```

| | `enum` | union of literals |
|---|---|---|
| Runtime output | an object (reverse-mapped for numeric enums) | nothing |
| Works with data already in JSON | needs a cast | directly |
| Iterable at runtime | ✅ `Object.values(Role)` | only via `as const` array |
| Nominal-ish (a numeric enum rejects a raw number) | ✅ | ❌ |
| `isolatedModules` / `erasableSyntaxOnly` friendly | ❌ (`const enum` especially) | ✅ |

> [!question] Short answer for the interview
> "I default to a union of string literals plus an `as const` array when I need to iterate, because it is erased completely and it matches the strings that actually arrive in JSON. I use an `enum` when I want a single named runtime object shared across packages — and I avoid `const enum` because it inlines across module boundaries and breaks under `isolatedModules` and most modern bundlers."

---

## tsconfig — the flags that shrink the lie surface

| Flag | What it stops |
|---|---|
| `strict` | the umbrella: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `useUnknownInCatchVariables` |
| `strictNullChecks` | the single biggest one: `null`/`undefined` stop being members of every type |
| `noUncheckedIndexedAccess` | `arr[i]` and `record[key]` become `T \| undefined` |
| `exactOptionalPropertyTypes` | `{ a?: string }` stops accepting an explicit `undefined` |
| `useUnknownInCatchVariables` | `catch (e)` is `unknown`, not `any` (on by default under `strict`) |
| `noImplicitOverride` | an override that no longer overrides anything fails |
| `verbatimModuleSyntax` | keeps `import type` honest, no accidental runtime imports |
| `isolatedModules` | forbids what a single-file transpiler (esbuild/swc/Babel) cannot handle |
| `moduleResolution: 'bundler' \| 'node16'` | resolves `exports` maps the way the runtime actually does |
| `skipLibCheck` | pragmatic speed-up; it also hides real conflicts between `@types` versions |

> [!tip] Migration answer
> A legacy repo does not turn `strict` on in one PR. `allowJs` + `checkJs` file by file, `strict` per-directory with project references or separate tsconfigs, and `@ts-expect-error` (which **fails when the error disappears**) instead of `@ts-ignore` (which rots silently). Ratchet the count down in CI.

---

## Decorators, in four lines

- **Legacy TS decorators** (`experimentalDecorators`) are what Angular and NestJS use, together with `emitDecoratorMetadata` and `reflect-metadata` for DI.
- **ES decorators** (TC39 stage 3, TS 5.0+) are a different, incompatible design: no metadata reflection by default, different signature, and they **cannot** decorate parameters yet.
- The two cannot be mixed in one file, and the flag decides which one the compiler reads.
- The pitfall to name: a decorator is **not** erased — it is real runtime code that runs at class definition time, in the opposite order to how it is written (bottom-up). See [[Design Patterns#Decorator]] for the pattern itself.

---

# 2. OOP in JavaScript and TypeScript

> [!important] The mental model
> **JavaScript has no classes. It has objects that delegate to other objects.** `class` is syntax over prototypal delegation, and TypeScript's `private`, `protected`, `implements` and `abstract` are compile-time paperwork on top of that.
>
> So every OOP question in a JS interview has two layers: the OOP concept, and the prototype or erasure reality underneath it. Answering only the first layer is the mid-level answer.

## The four pillars, with the JS reality under each

| Pillar | The definition | What it actually is in JS/TS |
|---|---|---|
| **Encapsulation** | State and the operations on it live together; the inside is hidden | `#private` fields (real), closures (real), `private` (erased), module scope |
| **Abstraction** | Expose *what* it does, hide *how* | `interface`, `abstract class`, a facade ([[Design Patterns#Facade]]) |
| **Inheritance** | A type reuses and specialises another | `extends` → sets the **prototype chain**; `super` → walks up it |
| **Polymorphism** | One call site, many behaviours | Method overriding, and **structural typing** — no `extends` required |

> [!tip] The sentence that upgrades this answer
> "Three of the four pillars have a cheaper implementation in JS than a class hierarchy: encapsulation with a module or a closure, abstraction with an interface or a function signature, and polymorphism with structural typing or a strategy object. Only inheritance really needs `extends` — and that is the one I use least."

---

## Encapsulation: four levels, only two of them real

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

### The closure alternative

```ts
function createCounter(start = 0) {
  let count = start;                                   // truly private
  return {
    increment: () => ++count,
    get value() { return count; },
  };
}
```

No `this`, no `new`, no binding problems, real privacy, and trivially testable. The cost: **one closure per instance**, so every method is a new function object — for thousands of instances the prototype version wins on memory. That trade-off is the senior half of "closures vs classes". Leak patterns of the closure version: [[JavaScript#Memory leak patterns with closures, and their fixes]].

---

## `class` is prototypes — what the keyword really does

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

The lookup for `d.speak()`: own property → `Dog.prototype` → `Animal.prototype` → `Object.prototype` → `null`. Full walk with the `this` binding step: [[JavaScript#The prototype chain, step by step]].

| | `class` | `function` constructor + prototype | `Object.create` |
|---|---|---|---|
| Hoisted | ❌ (TDZ, like `let`) | ✅ | n/a |
| Strict mode inside | always | only if the file is | n/a |
| Callable without `new` | ❌ TypeError | ✅ (silent bug) | n/a |
| `#private`, `static` blocks | ✅ | ❌ | ❌ |
| What it expresses | a type | a type, verbosely | **delegation**, directly |

### Class fields vs prototype methods (the one that changes behaviour)

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

## `this` — the five rules

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

### Why an arrow function has no `this` of its own

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

## Abstraction: `interface` vs `abstract class`

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

## Polymorphism — three kinds, only two of them OOP

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

## Inheritance: what actually breaks

### a) Liskov substitution, concretely

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

### b) The fragile base class

Every `protected` member is public API to the subclasses. A refactor inside the base class that is invisible from outside can break every descendant — and the base class author cannot see the call sites. This is the concrete cost behind "inheritance creates rigid hierarchies" in [[Design Patterns#Composition over inheritance]].

### c) No multiple inheritance, and the diamond

JS allows exactly one prototype chain. Two behaviours from two parents require **mixins**, and then the diamond question ("which `init()` wins?") is answered by the order of application — which is why deep mixin stacks are also discouraged.

### d) Subclassing built-ins

```ts
class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, HttpError.prototype);   // needed when targeting ES5
  }
}
```

`instanceof HttpError` fails in ES5-transpiled output without that line, because `Error` returns a fresh object from its own constructor. **A custom `Error` subclass is the one inheritance every frontend codebase should have** — it is what makes the error layers in [[JavaScript#Which layer catches which error]] distinguishable, and it pairs with the typed boundary in [[TypeScript Boundary#Zod in practice]].

---

## Composition, mixins and delegation

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

## Statics, and the class-as-namespace smell

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

## `instanceof`, `constructor`, and checking types at runtime

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
> - **A plain object from JSON is never an instance of anything.** There is no tag on it — which is the whole argument of [[TypeScript Boundary#Structural typing has no runtime tag]]. Discriminate with a field, or parse into a class.

---

## OOP vs FP vs RP

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

## Where OOP actually appears in a modern frontend

| Place | What it is |
|---|---|
| `class AppError extends Error` and its subtypes | the only inheritance most apps need |
| Angular / NestJS services and DI | constructor injection, decorators, the D of SOLID ([[Design Patterns#Dependency inversion vs dependency injection vs inversion of control]]) |
| Domain models with invariants | a `Money` or `DateRange` that cannot be built invalid — pairs with [[#Structural vs nominal typing, and branded types]] |
| Web platform APIs | `IntersectionObserver`, `AbortController`, `Map`, `URL` — all classes, all `new` |
| React **class** components | legacy only: `this` binding, lifecycle methods, and error boundaries, which are **still** class-only ([[React#Which lifecycle methods useEffect replaces]]) |
| State machines | `idle → loading → success` as explicit transitions, typed with a discriminated union |

---

# 3. Recall triggers

## Types

| When I hear / say… | The words that must come out |
|---|---|
| "`type` or `interface`?" | interfaces **merge** and implement; types **compute** and union |
| "how do you model loading / error state?" | **discriminated union**, impossible states unrepresentable |
| "what if someone adds a new state?" | `assertNever` — **exhaustiveness becomes a build error** |
| "I cast it with `as`" | that is a **claim, not a check** — `satisfies` checks and keeps the literal |
| "the config object loses its literal types" | **`as const`**, and `typeof ROLES[number]` for the union |
| "how do you check a type at runtime?" | you **cannot** — type predicate + a real check, or parse with a schema |
| "two IDs got swapped" | structural typing — **branded types** |
| "`arr[0]` was undefined" | **`noUncheckedIndexedAccess`** |
| "enum" | union of literals is **erased**; `const enum` breaks bundlers |
| "generic" | it must **link two positions**, otherwise it is decoration |
| "`never` showed up" | a union filtered to **empty**, or a conflicting intersection |

## OOP

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

# 4. Drill — say these out loud

## Types

1. A `.ts` file has **two spaces**: value and type. `class` and `enum` live in both.
2. **Interfaces merge, type aliases do not.** That is how global and third-party typings get augmented.
3. A type is a **set of values**. Union = or. Intersection = and. `never` = empty. `unknown` = everything.
4. For object types, **intersection adds properties and removes valid values**.
5. **Discriminated union + `assertNever`** — the missing branch fails the build.
6. `as` is a **claim**, `satisfies` is a **check**, `: T` **widens**.
7. `as const` freezes literals; `typeof ROLES[number]` turns the array into the union.
8. Narrowing is **control-flow analysis**, and a callback **resets** it — narrow into a `const`.
9. A **type predicate is a promise to the compiler**; its body is never verified.
10. TS is **structural** — brand the types that must not be interchangeable.
11. `Pick` is an allowlist, `Omit` is a denylist. Boundaries get `Pick`.
12. `@ts-expect-error`, never `@ts-ignore`.

## OOP

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

# Still to study

## Types

- [ ] Project references and `composite` builds in a monorepo — and why `skipLibCheck` becomes load-bearing there.
- [ ] `tsc --noEmit` in CI vs the bundler's transpile-only mode: which one is the actual type gate.
- [ ] Higher-kinded-ish patterns: `const` type parameters (TS 5.0), `NoInfer` (5.4), and when inference needs help.
- [ ] Typing React properly: `ComponentProps<typeof X>`, polymorphic `as` props, generic components, `forwardRef` with generics.
- [ ] Type-level tests (`expectTypeOf`, `tsd`) for a shared library's public types.

## OOP

- [ ] `Symbol.iterator`, `Symbol.asyncIterator` and `Symbol.hasInstance` — making own objects work with `for…of` and `instanceof`.
- [ ] `Object.freeze` vs `as const` vs a deep-readonly type: which of the three actually stops a mutation, and when.
- [ ] `WeakMap` for private state and for caches that must not retain.
- [ ] `Proxy` and `Reflect`: how Vue 3 reactivity and MobX observables are built, and the cost.
- [ ] Modelling a domain aggregate with invariants in the constructor, and where that lives in a frontend architecture.
