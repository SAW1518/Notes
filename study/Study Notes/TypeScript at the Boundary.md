---
title: TypeScript at the Boundary
tags:
  - study
  - interview
  - promotion
  - typescript
  - validation
  - architecture
parent: "[[The Best Notes of the F Word]]"
source: "created after Study Session 05 Q3 (2026-09-17). Closes item 4 of [[Mock Interviews Knowledge Base#Still unanswered across all four sessions — expect them again]] and the TypeScript hole in the rubric (10%, asked zero times in four mock sessions)"
---

# TypeScript at the Boundary

Why the compiler cannot protect the app from the network, and what runtime validation actually does about it.

Related: [[The Best Notes of the F Word#Pros and cons of JS vs TS]] · [[Assessment Questions#Pros and cons of TypeScript]] · [[Assessment Questions#Compare PropTypes, Flow and TypeScript]] · [[Mock Interviews Knowledge Base]]

> [!danger]- What went wrong on 2026-09-17 (read this first)
> The knowledge was there. The **retrieval** was not. That is a different problem and it needs a different fix — see [[#11. Recall triggers — the actual fix for this one]].
>
> 1. **Said:** *"in the compilation stage the bundler adds js type validation"* → **false**. `tsc`, esbuild, swc and Babel **strip** the types and emit **nothing** in their place. No check, no guard, no assertion, zero bytes. Self-corrected one message later ("nothing runs, the types are deleted") — that retraction saved the question, but the sentence should never have been said.
> 2. **Never named a validator.** Zod was already written down in my own vault, in [[The Best Notes of the F Word#Pros and cons of JS vs TS]], in the short answer I had memorised. It did not come out under pressure.
> 3. **Never answered what `res.json()` returns.** It is `Promise<any>` — and that `any` *is* the hole.
> 4. **Assumed the backend had changed.** The sharper answer: `createdAt: Date` was **never** true, not even on day one.

---

# 0. The one sentence

> [!important] The mental model
> **TypeScript describes what I *believe*. Only code that runs can establish what is *true*.**
>
> Every value that enters the app from outside is a **belief** until something at runtime checks it. Inside the app the compiler is excellent. At the boundary it is decoration.

---

# 1. Why the compiler cannot help here

## a) The types are erased

```ts
// what I write
const user: User = await res.json();
```

```js
// what the browser actually receives, after tsc / esbuild / swc
const user = await res.json();
```

Type annotations are not compiled into checks — they are **deleted**. TypeScript is a *development-time* tool: its entire output is editor feedback and a build that fails. At runtime the app is plain JavaScript, exactly as if it had never been typed.

## b) `res.json()` returns `any`

```ts
const res  = await fetch('/api/profile');
const user: User = await res.json();   // ✅ compiles — and checks NOTHING
```

`Response.json()` is typed `Promise<any>` in the DOM lib. **`any` is assignable to everything**, so that line type-checks not because TypeScript verified the shape, but because I explicitly told it to stop looking. The compiler is not failing; it is obeying.

## c) JSON has no `Date`

```ts
interface User {
  id: string;
  createdAt: Date;   // ❌ a lie from the first commit
}
```

`JSON.parse` can only ever produce: **string, number, boolean, null, object, array**. There is no date type in JSON, so `createdAt` was a **string at runtime** while every `.toISOString()` call in the codebase believed it was a `Date`. The crash was not caused by a backend change — it was always there, waiting for the right data.

> [!tip] The tell
> If a type annotation sits on data I did not construct **myself, in this process**, it is a lie until something proves otherwise.

## d) Structural typing has no runtime tag

TypeScript types are structural and exist only in the type space. There is no marker on the object at runtime, so nothing can ask "are you really a `User`?" later. The only moment to establish it is **when the data arrives**.

---

# 2. Where the boundaries are

Every one of these hands the app `any` or a comfortable lie:

| Boundary                                                 | What it really gives back                              |
| -------------------------------------------------------- | ------------------------------------------------------ |
| `fetch(...).json()`                                      | `any`                                                  |
| `JSON.parse(...)`                                        | `any`                                                  |
| `localStorage` / `sessionStorage`                        | `string \| null`, then `JSON.parse` → `any`            |
| URL and query params                                     | `string \| null`, whatever the user typed              |
| `postMessage`, `BroadcastChannel`, WebSocket             | `any`, and from another origin in some cases           |
| A third-party SDK without types, or with optimistic ones | whatever it feels like                                 |
| `process.env` / `import.meta.env`                        | `string \| undefined`, often typed as `string` by hand |
| A CMS, a feature flag payload, an analytics config       | JSON, unversioned, edited by non-engineers             |
| An `<input>` value, a file, a pasted payload             | a string that claims to be a number                    |

> [!question] The senior framing
> These are **trust boundaries**, the same idea as in security ([[The Best Notes of the F Word#Ataques XSS (Cross-Site Scripting)]]). Validation goes exactly where trust changes hands — not sprinkled everywhere, and never omitted there.

---

# 3. `unknown` instead of `any`

`any` switches the type system **off** and spreads: everything derived from it is `any` too, silently, across files. `unknown` keeps the type system **on** and forces a narrowing step before use.

```ts
// ❌ the leak
async function getJSON(url: string): Promise<any> { … }
const user = await getJSON('/api/profile');
user.profile.name.toUpperCase();   // compiles. explodes.

// ✅ the wall
async function getJSON(url: string): Promise<unknown> { … }
const raw = await getJSON('/api/profile');
raw.profile;                       // ❌ Object is of type 'unknown' — compiler stops me
const user = UserSchema.parse(raw); // ✅ now it is a User, and it was CHECKED
```

| | `any` | `unknown` |
|---|---|---|
| Assignable **to** it | everything | everything |
| Assignable **from** it | everything (danger) | nothing without narrowing |
| Property access | allowed, unchecked | compile error |
| Spreads through the codebase | ✅ silently | ❌ stops at the boundary |
| Use it for | almost never | **every value arriving from outside** |

> [!tip] One-line policy that removes this whole bug class
> Type the fetch wrapper's return as `unknown`. The bad version then **does not compile**, instead of merely being discouraged in review.

---

# 4. Parse, don't validate

Two shapes look similar and are not:

```ts
// ❌ "validate": answers a boolean question and throws the knowledge away
function isUser(x: any): boolean { return typeof x?.id === 'string'; }

if (isUser(data)) {
  // data is still `any` here — nothing was gained, and the check can drift
  // away from the interface without anybody noticing
}
```

```ts
// ✅ "parse": turns unknown input into a TRUSTED value, once, at one place
const user = UserSchema.parse(raw);   // User, or it threw
// everything from here inward is genuinely safe, and the type system carries it
```

The difference in one line: **a validator returns a boolean, a parser returns a better type.** Parsing pushes the uncertainty to a single edge and lets the rest of the app be honest.

---

# 5. Zod in practice

## a) The schema is the source of truth — the type is inferred from it

```ts
import { z } from 'zod';

export const UserSchema = z.object({
  id:        z.string().uuid(),
  email:     z.string().email(),
  name:      z.string().min(1),
  createdAt: z.coerce.date(),           // ISO string in → real Date out
  role:      z.enum(['admin', 'member']),
  avatarUrl: z.string().url().nullable(),
  bio:       z.string().optional(),
  seats:     z.number().int().default(1),
});

export type User = z.infer<typeof UserSchema>;   // ← the type comes FROM the schema
```

> [!important] Why this is the whole point
> Writing an `interface` **and** a validator separately means two sources of truth that drift apart on the first hurried PR. With `z.infer` there is **one** declaration: the runtime check and the compile-time type cannot disagree, because they are the same object.

## b) `parse` vs `safeParse`

```ts
// parse → returns the value or THROWS a ZodError
const user = UserSchema.parse(raw);

// safeParse → never throws; returns a discriminated union
const result = UserSchema.safeParse(raw);
if (!result.success) {
  logger.error('profile parse failed', { issues: result.error.issues });
  return { kind: 'invalid-response' } as const;
}
const user = result.data;        // fully typed, fully checked
```

Rule of thumb: **`safeParse` at an application boundary** where a failure must become a UI state, **`parse`** where a failure is genuinely a bug and should reach the error tracker as an exception.

## c) The features that actually come up

```ts
// coercion at the edge, so the inside of the app can hold real types
z.coerce.date();  z.coerce.number();  z.coerce.boolean();

// optional / nullable / default — three different things, and the panel will ask
z.string().optional()   // key may be absent          → string | undefined
z.string().nullable()   // key present, value null    → string | null
z.string().default('')  // absent → the default, never undefined

// a response that is either shape, discriminated by a field
const Response = z.discriminatedUnion('status', [
  z.object({ status: z.literal('ok'),    data: UserSchema }),
  z.object({ status: z.literal('error'), message: z.string() }),
]);

// rename / reshape the API's DTO into the app's view model, in one step
const UserVM = UserSchema.transform(u => ({ ...u, initials: u.name[0] }));

// a list where one bad row must not kill the other 499
const rows = raw
  .map(r => RowSchema.safeParse(r))
  .filter(r => r.success)
  .map(r => r.data);
// …and count + log the dropped ones, otherwise data disappears silently
```

## d) Where it goes in the app

One layer, not scattered:

```ts
// api/client.ts — the single door
export async function apiGet<T>(url: string, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new ApiError(res.status, url);
  const raw: unknown = await res.json();          // ← unknown, never any
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    reportToSentry('contract-violation', { url, issues: parsed.error.issues });
    throw new ContractError(url, parsed.error);
  }
  return parsed.data;
}

// callers cannot bypass it, and they get a real type back
const user = await apiGet('/api/profile', UserSchema);
```

This is the **facade** over the network from [[Design Patterns#Facade]] — one place that owns headers, errors and now the contract.

---

# 6. What happens when parsing fails (the part people forget)

Adding a validator does not make bad data disappear — it makes it **loud**. That is an improvement only if the failure is designed:

| Decision | Options |
|---|---|
| **Log it** | Endpoint + the issue path (`issues[0].path`) to Sentry/Datadog. Never the whole payload — it may carry PII |
| **Blast radius** | Degrade **that section** (a card, a widget), not the page. A validator that turns a missing `bio` into a white screen is worse than the bug it replaced |
| **Per-field severity** | A broken `id` is fatal; a broken `avatarUrl` should fall back to a default. Encode that in the schema (`.catch()`, `.nullable()`), not in the component |
| **Lists** | Drop the bad rows and **count them**, or fail the whole list — decide per endpoint, and never let rows vanish silently |
| **Rollout** | Ship it in **report-only mode first**: parse, log every mismatch, but keep rendering the old way. After a week the logs show exactly how wrong the contract already is — then switch to enforcing |

> [!warning] The trade-off to say out loud
> Strict validation converts a **silent partial bug** into a **visible failure**. That is usually right, but it is a product decision, not a purely technical one. Report-only mode is how it ships without an incident on day one.

---

# 7. Where NOT to validate

- **Between internal functions.** The compiler already covers that; a schema there is noise.
- **In hot loops or on very large lists.** Parsing 50.000 rows on the main thread is a jank source ([[Mock Interviews Knowledge Base#Scrolling is janky. Layout and paint dominate the frame. What is happening and how do you fix it?]]). Validate the envelope, sample the rows, or parse in a Web Worker.
- **Everywhere, by reflex.** Cost: Zod 3 is roughly **13KB gzipped** and not very tree-shakable; Zod 4 and Valibot are markedly smaller. On a bundle-sensitive app that is a real line item — a reason to pick Valibot, not a reason to skip validation.

---

# 8. Contracts: codegen and contract tests

| Layer | What it buys | What it does **not** buy |
|---|---|---|
| **OpenAPI / GraphQL codegen** (`openapi-typescript`, `graphql-codegen`) | The frontend types come from the backend's schema instead of being hand-copied. This is "agree a contract with the backend team", made mechanical | **Nothing at runtime.** Generated types are still erased — they say what the server *promised*, not what it *sent* |
| **Contract tests** (Pact, schema assertions in CI) | A backend change that breaks the contract fails the pipeline, not the user | Nothing about data that is valid-but-unexpected in production |
| **Runtime parsing** (Zod) | What actually arrived, in the user's browser, today | Bundle size, and a designed failure path |

> [!important] The trap question
> *"You generate types from OpenAPI — do you still need runtime validation?"* → **Yes.** Generated types are compile-time only. Codegen removes the copying mistakes; it does not observe a single real response. Answering "no" fails the question.

---

# 9. The alternatives (one line each)

| Tool | Shape | When |
|---|---|---|
| **Zod** | Chainable, one big import, `z.infer` | The default. Biggest ecosystem, best docs |
| **Valibot** | Modular functions, tree-shakable, ~1–2KB used | Bundle-sensitive apps. Same idea, smaller |
| **ArkType** | Types written as TypeScript-like syntax, very fast | When schema-as-syntax appeals |
| **io-ts** | fp-ts style, `Either` for errors | Codebases already functional |
| **Yup** | Older, form-oriented | Legacy; type inference is weaker |
| **Hand-written type guards** | Zero dependency | Small surface, or no-dependency policy |

> [!tip] Standard Schema
> Zod, Valibot and ArkType now implement a shared **Standard Schema** interface, so libraries (form libraries, routers, tRPC) can accept any of them. Worth one sentence in an interview — it shows the ecosystem is being followed, not just one library.

---

# 10. Doing it by hand, when no dependency is allowed

```ts
// type predicate: narrows in an if
function isUser(x: unknown): x is User {
  if (typeof x !== 'object' || x === null) return false;
  const u = x as Record<string, unknown>;
  return typeof u.id === 'string'
      && typeof u.email === 'string'
      && typeof u.createdAt === 'string';
}

if (isUser(raw)) {
  raw.email;            // ✅ narrowed to User
}
```

```ts
// assertion function: throws, and narrows everything after it
function assertUser(x: unknown): asserts x is User {
  if (!isUser(x)) throw new TypeError('not a User');
}

assertUser(raw);
raw.email;              // ✅ User from here on
```

> [!warning] Two traps in the hand-written version
> 1. A predicate is only a **promise to the compiler**. If the body is wrong or falls behind the interface, TypeScript believes it anyway — the lie just moved. A schema library cannot drift because the type is inferred from the check.
> 2. An assertion function needs an **explicit type annotation** on whatever holds it (`const assertUser: (x: unknown) => asserts x is User = …` when written as a const), or TypeScript refuses the narrowing.

---

# 11. Recall triggers — the actual fix for this one

The knowledge was present and did not surface. Retrieval is trained with **triggers**, not with more reading.

| When I hear / say… | The word that must come out |
|---|---|
| "compiles fine but crashes in production" | **types are erased** |
| "the API returns…" | **`res.json()` is `any`** |
| "how do you know the shape is right?" | **parse at the boundary, Zod** |
| "a date field" | **JSON has no Date — it is a string** |
| "we agreed a contract with backend" | **codegen + contract tests, and still runtime parsing** |
| "`any`" | **use `unknown`, force the narrowing** |
| "is the data valid?" | **parse, don't validate — return a type, not a boolean** |
| "we added validation" | **and what does a failure DO? log, degrade, report-only rollout** |

> [!question] Short answer for the interview (memorise this one)
> "TypeScript types are erased at compile time, and `res.json()` returns `any`, so that assignment was never checked by anything — and a `Date` cannot survive JSON, so that type was wrong from day one rather than broken later. The fix is to parse at the boundary with a schema validator and infer the TypeScript type from the schema, so the check and the type cannot drift; type raw input as `unknown` instead of `any` so narrowing is mandatory; and generate types from the OpenAPI contract with contract tests in CI. Then I'd decide explicitly what a parse failure does — log the endpoint and the field, degrade that section instead of the page, and roll it out in report-only mode first so we see how wrong the contract already is before we start enforcing it."

## The follow-ups that always come next

| Follow-up | The answer in one line |
|---|---|
| "So Zod fixes it — what happens when parsing fails in prod?" | Log endpoint + issue path, degrade that section, report-only mode on rollout |
| "You generate types from OpenAPI. Still need runtime validation?" | Yes — generated types are erased too; they encode a promise, not a response |
| "Does this slow the app down?" | Bundle cost is real (~13KB for Zod 3, less for Valibot); parsing big lists belongs off the main thread. Validate trust boundaries only |
| "`unknown` vs `any`?" | Both accept anything; only `any` lets me *use* it unchecked, and it spreads |
| "Where else besides `fetch`?" | localStorage, URL params, `postMessage`, env vars, third-party SDKs, CMS payloads |
| "Isn't a type guard enough?" | It is a promise to the compiler that can drift from the interface. Inferring the type from the schema cannot drift |

---

# 12. Drill — say these out loud

1. **Types are erased.** The bundler adds **no** validation. Zero bytes.
2. `res.json()` → **`any`** → assignable to everything → nothing is checked.
3. **JSON has no Date.** String, number, boolean, null, object, array. That is the whole list.
4. `unknown` at the door, narrow before use. **`any` is the leak.**
5. **Parse, don't validate:** return a type, not a boolean.
6. The **schema is the source of truth**; `z.infer` gives the type.
7. `safeParse` at the boundary, `parse` where failure is a bug.
8. Generated types are **still compile-time only**.
9. A validator makes bad data **loud** — design the failure: log, degrade, report-only first.
10. Validate **trust boundaries**, not internal functions.

---

# Still to study from here

- [ ] `satisfies` and `as const` — narrowing config objects without widening.
- [ ] tsconfig flags that shrink the lie surface: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `useUnknownInCatchVariables`.
- [ ] Branded / nominal types (`type UserId = string & { __brand: 'UserId' }`) and where they beat a plain alias.
- [ ] tRPC and end-to-end type safety without codegen — and its boundary: it only works when both ends are mine.
