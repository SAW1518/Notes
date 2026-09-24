---
title: TypeScript Type System
tags:
  - study
  - interview
  - promotion
  - typescript
  - types
parent: "[[The Best Notes of the F Word]]"
source: "created 2026-09-24. Closes the TypeScript block of the Level Up plan in [[The Best Notes of the F Word#TypeScript]] (it was only a list of titles) and the four open items in [[TypeScript at the Boundary#Still to study from here]]. Companion note: [[OOP in JavaScript and TypeScript]]"
---

# TypeScript Type System

Types, scopes, the checks, interfaces and unions — the part of TS that is **not** about the boundary.

Related: [[TypeScript at the Boundary]] · [[OOP in JavaScript and TypeScript]] · [[The Best Notes of the F Word#Pros and cons of JS vs TS]] · [[Assessment Questions#Pros and cons of TypeScript]] · [[Design Patterns]]

> [!info]- How this note divides the work with [[TypeScript at the Boundary]]
> | Question | Note |
> |---|---|
> | "The data comes from an API — how do you know the shape is right?" | [[TypeScript at the Boundary]] (erasure, `unknown`, Zod, parse don't validate) |
> | "`type` or `interface`? How do you narrow a union? What does `satisfies` do?" | **this one** |
>
> One sentence overlaps on purpose and must be said in both: **the types do not exist at runtime**.

---

# 0. The one sentence

> [!important] The mental model
> A `.ts` file contains **two languages in one file**: the *values* that will exist at runtime, and the *types* that describe them and are then **deleted**.
>
> Almost every TypeScript confusion is a sentence that mixes the two — asking a type to do something at runtime, or asking a value to do something in the type space.

---

# 1. The two scopes: type space vs value space

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

## `typeof` exists in both spaces and means two different things

```ts
// value space → runtime string
typeof user === 'object'                    // JS operator, survives compilation

// type space → "give me the type of that value"
type Config = typeof defaultConfig;         // TS only, erased
```

> [!warning] The trap
> `typeof` in a type position **never runs**. It is a query to the compiler. Saying "`typeof` checks the type at runtime" in an interview is only true for the value-space one.

## Where a type is visible (the actual scoping rules)

- **Module scope by default.** A file with a top-level `import` or `export` is a module: its types are private unless exported. A file without them is a **global script**, and every type in it leaks into the whole project — the usual cause of "why does this `interface Props` collide?".
- `import type { User } from './user'` imports **only** the type and is guaranteed to be erased. It also breaks import cycles that a value import would create.
- **Block scoped like values**: a `type` declared inside a function is not visible outside it.
- **Generic parameters** are scoped to their declaration: `<T>` in a function signature is only visible inside that signature and body.

## Declaration merging and module augmentation

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
> `declare global { interface Window { user: User } }` does not put anything on `window`. It tells the compiler to stop complaining. If nothing assigns it at runtime, the property is `undefined` and the type lied — same class of bug as [[TypeScript at the Boundary#1. Why the compiler cannot help here]].

---

# 2. `interface` vs `type`

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

# 3. Unions and intersections

## The set-theory reading (this is the part that makes it click)

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

## Unions of primitives replace most enums

```ts
type Role = 'admin' | 'member' | 'viewer';   // exists only at compile time, zero runtime cost
```

## Discriminated (tagged) unions — the single most useful shape in a frontend

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

## `never` and exhaustiveness

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

# 4. Literal types, widening, `as const` and `satisfies`

## The widening problem

```ts
const a = 'admin';        // type: 'admin'   ← literal, because const cannot be reassigned
let   b = 'admin';        // type: string    ← widened, because it could change

const config = { role: 'admin' };   // type: { role: string }  ← widened inside objects!
takesRole(config.role);             // ❌ string is not assignable to Role
```

## `as const`

```ts
const config = { role: 'admin', retries: 3 } as const;
// { readonly role: 'admin'; readonly retries: 3 }

const ROLES = ['admin', 'member', 'viewer'] as const;
type Role = typeof ROLES[number];      // 'admin' | 'member' | 'viewer'
```

That last pattern is worth memorising: **one array, used both as runtime data and as the type**. No enum, no duplication, and the list can be iterated to render a `<select>`.

## `as` vs `satisfies` — the pair that gets asked

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

# 5. The checks: narrowing, guards and predicates

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

## Type predicates and assertion functions

```ts
function isNonNull<T>(x: T | null | undefined): x is T {
  return x != null;
}

const ids = items.map(i => i.id).filter(isNonNull);   // string[] instead of (string|null)[]
```

> [!danger] A predicate is a promise, not a proof
> The body is **not verified**. If it is wrong, or if it drifts behind the interface, TS believes it anyway — the lie just moved from the annotation into the function. Full version of this trap, with the assertion-function annotation requirement: [[TypeScript at the Boundary#10. Doing it by hand, when no dependency is allowed]].

## Where narrowing silently disappears (the follow-up question)

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

# 6. `any`, `unknown`, `never` — the three that get swapped

| | Means | Accepts | Can be used | Use it for |
|---|---|---|---|---|
| `any` | "type system off" | everything | everything, unchecked | migrations, and even then temporarily |
| `unknown` | "something, not yet known" | everything | nothing until narrowed | **every value from outside** |
| `never` | "nothing" | nothing | — | impossible branches, exhaustiveness |

Full treatment with the `res.json()` case: [[TypeScript at the Boundary#3. `unknown` instead of `any`]].

> [!warning] Vocabulary drill — belongs in [[Mock Interviews Knowledge Base#🔁 The vocabulary drill — the highest value table in this note]]
> **`unknown` = everything, unusable. `never` = nothing, unassignable. `any` = the leak.**

---

# 7. Generics — the part that actually comes up

A generic is a **parameter of the type space**: it keeps the relationship between input and output instead of collapsing it.

```ts
function first<T>(arr: T[]): T | undefined { return arr[0]; }
first([1, 2, 3]);         // number | undefined — inferred, no annotation needed
```

## Constraints, `keyof` and indexed access

```ts
// "K must be a key of T, and the return is the type at that key"
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: '1', age: 30 };
get(user, 'age');      // number
get(user, 'nope');     // ❌ caught at compile time
```

## Defaults, and inference from a union

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

# 8. Utility types worth knowing cold

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

# 9. Mapped and conditional types, and type manipulation

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

# 10. Structural vs nominal typing, and branded types

TypeScript is **structural**: compatibility is decided by shape, not by name. Two unrelated classes with the same members are interchangeable — this is also why there is no runtime tag to check ([[TypeScript at the Boundary#d) Structural typing has no runtime tag]]).

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

Zero runtime cost — the brand is a phantom property that never exists. Worth it for IDs, money amounts, and anything already-validated (`type SafeHtml = string & { __brand: 'SafeHtml' }`, which pairs with [[The Best Notes of the F Word#Ataques XSS (Cross-Site Scripting)]]).

> [!tip] Excess property checks — the exception that confuses everyone
> Structural typing accepts extra properties… except on a **fresh object literal** assigned directly:
> ```ts
> const a: A = { x: 1, y: 2 };          // ❌ 'y' does not exist in type A
> const tmp = { x: 1, y: 2 };
> const b: A = tmp;                      // ✅ no excess check through a variable
> ```
> It is a deliberate typo-catcher, not a hole in the theory.

---

# 11. Tuples, `readonly`, and the array gotchas

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

# 12. Enums — and why a union usually wins

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

# 13. tsconfig — the flags that shrink the lie surface

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

# 14. Decorators, in four lines

- **Legacy TS decorators** (`experimentalDecorators`) are what Angular and NestJS use, together with `emitDecoratorMetadata` and `reflect-metadata` for DI.
- **ES decorators** (TC39 stage 3, TS 5.0+) are a different, incompatible design: no metadata reflection by default, different signature, and they **cannot** decorate parameters yet.
- The two cannot be mixed in one file, and the flag decides which one the compiler reads.
- The pitfall to name: a decorator is **not** erased — it is real runtime code that runs at class definition time, in the opposite order to how it is written (bottom-up). See [[Design Patterns#Decorator]] for the pattern itself.

---

# 15. Recall triggers

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

---

# 16. Drill — say these out loud

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

---

# Still to study from here

- [ ] Project references and `composite` builds in a monorepo — and why `skipLibCheck` becomes load-bearing there.
- [ ] `tsc --noEmit` in CI vs the bundler's transpile-only mode: which one is the actual type gate.
- [ ] Higher-kinded-ish patterns: `const` type parameters (TS 5.0), `NoInfer` (5.4), and when inference needs help.
- [ ] Typing React properly: `ComponentProps<typeof X>`, polymorphic `as` props, generic components, `forwardRef` with generics.
- [ ] Type-level tests (`expectTypeOf`, `tsd`) for a shared library's public types.
