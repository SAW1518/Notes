---
title: "Reto 03 — TypeScript unions and a typed API client"
tags:
  - challenge
  - typescript
plan: "Assessment Plan — Tier 1 (required)"
status: todo
---

# Reto 03 — TypeScript unions and a typed API client

**Goal:** model an API whose response shape depends on its status so that **the compiler** forces every case to be handled — then use the advanced type tools (conditional types, `infer`, mapped types, key remapping, declaration merging) on the same client.

**Why it matters:** this is the only *required* item of the Level Up plan (TypeScript, Intermediate → Advanced). The panel asked it at 00:12:09: *"an API returns several response shapes depending on status — how do you model it so developers handle every case?"* and pushed twice for a **compile-time** answer. When you finish, this reto is the artifact you attach to the Level Up item.

> [!warning] Do each level before opening its solution
> Write your answer first — on paper for level 0, in the sandbox for the rest — then open the fold and compare.

---

## Setup

The code lives in `Retos/retos-sandbox/reto03/`. Create the folder and this `reto03/tsconfig.json`, so the compiler checks only this reto with the sandbox's `strict` settings:

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": { "incremental": false, "plugins": [] },
  "include": ["*.mts"]
}
```

Two commands, both from `retos-sandbox/`:

- `npx tsc -p reto03` → **type-checks**. This is where every level is judged.
- `node reto03/levelN.mts` → **runs** the file. Node 22.18+ strips the types and runs the JavaScript; it never type-checks.

Files are `.mts` so Node treats them as ES modules without a warning.

---

## Level 0 — Predict before you compile

Create `reto03/level0.mts`:

```ts
type User = { id: string; name: string };

type UserResponse =
  | { status: 'ok'; data: User }
  | { status: 'error'; message: string };

type LooseResponse = { ok: boolean; data?: User; message?: string };

declare const res: UserResponse;
declare const loose: LooseResponse;

// 1
console.log(res.data);

// 2
if (res.status === 'ok') {
  console.log(res.data.name);
}

// 3
if ('message' in res) {
  console.log(res.message.toUpperCase());
}

// 4
if (loose.ok) {
  console.log(loose.data.name);
}

// 5
type Both = { id: string } & { name: string };
const b: Both = { id: '1' };
```

**Answer on paper**, then run `npx tsc -p reto03`:

1. Which of the five numbered blocks fail to compile?
2. For each one that fails, say in one line *why*.
3. `UserResponse` and `LooseResponse` describe the same API. Why does block 2 compile and block 4 does not?
4. In one sentence each: what is a **union** type, and what is an **intersection** type?

> [!success]- Solution — Level 0
> 1. **1, 4 and 5** fail. 2 and 3 compile.
> 2. **1** — `data` exists only on the `'ok'` member; on a union you can only touch what *every* member has. **4** — `loose.data` is `User | undefined` even after checking `ok`, because nothing ties `ok` to `data`. **5** — an intersection needs *all* the properties of both sides; `name` is missing.
> 3. In `UserResponse` the `status` field is a **discriminant**: a literal type (`'ok'`, `'error'`) present on every member. Checking it **narrows** the union to exactly one member, so the compiler knows `data` is there. `LooseResponse` is a bag of optionals: `ok: boolean` says nothing about which other fields exist, so no check can narrow it.
> 4. A **union** `A | B` is a value that is *one of* the members — you can use only what they share until you narrow it. An **intersection** `A & B` is a value that is *all of* them at once — it has every property of both.
>
> The name for 2 and 3: **narrowing** by a discriminant (`===` on the tag) and by the `in` operator. Other narrowing tools: `typeof`, `instanceof`, `Array.isArray`, and your own type predicates (`v is T`).

---

## Level 1 — Break it on purpose

The backend adds a 404 case. Create `reto03/level1.mts`:

```ts
type User = { id: string; name: string };

type UserResponse =
  | { status: 'ok'; data: User }
  | { status: 'error'; message: string }
  | { status: 'not_found' };

function render(res: UserResponse): string {
  if (res.status === 'ok') return `Hello ${res.data.name}`;
  if (res.status === 'error') return `Error: ${res.message}`;
  return '';
}

console.log(render({ status: 'not_found' }));
```

1. Does `npx tsc -p reto03` complain about the new `not_found` case?
2. Run it with `node reto03/level1.mts`. What does the user see?
3. Why is this the bug the panel was describing — "developers forget a case"?

> [!success]- Solution — Level 1
> 1. **No.** The function compiles: the last `return ''` covers "everything else", including a case nobody wrote code for.
> 2. An empty line — a blank screen for the user, and no error anywhere.
> 3. The type grew, but nothing in the code is *forced* to grow with it. In a codebase with twenty `render`-like functions, the new status silently falls into twenty fallbacks. The fix must turn "I forgot a case" into a **compile error**.

---

## Level 2 — Fix it: exhaustiveness, then the runtime boundary

Create `reto03/level2.mts`. Requirements:

1. A `render(res: UserResponse): string` that handles the three statuses with a `switch`.
2. If someone adds a fourth status to `UserResponse` and does not handle it, **`tsc` fails** — inside `render`, pointing at the missing case.
3. A `parseUserResponse(json: unknown): UserResponse` that checks an untrusted value at runtime (no libraries) and throws on anything that does not match.
4. Then prove requirement 2: add `| { status: 'rate_limited'; retryAfter: number }` to the type and run `tsc`. Read the error, then remove the line.

> [!info]- Hint for requirement 2 (open only if stuck)
> After every case is handled, what type does TypeScript give the variable in the `default` branch? Write a function whose parameter only accepts that type.

> [!success]- Solution — Level 2
> ```ts
> type User = { id: string; name: string };
>
> type UserResponse =
>   | { status: 'ok'; data: User }
>   | { status: 'error'; message: string }
>   | { status: 'not_found' };
>
> function assertNever(value: never): never {
>   throw new Error(`Unhandled variant: ${JSON.stringify(value)}`);
> }
>
> export function render(res: UserResponse): string {
>   switch (res.status) {
>     case 'ok':
>       return `Hello ${res.data.name}`;
>     case 'error':
>       return `Error: ${res.message}`;
>     case 'not_found':
>       return 'No such user';
>     default:
>       return assertNever(res);
>   }
> }
>
> function isRecord(v: unknown): v is Record<string, unknown> {
>   return typeof v === 'object' && v !== null;
> }
>
> export function parseUserResponse(json: unknown): UserResponse {
>   if (!isRecord(json)) throw new Error('Not an object');
>   switch (json.status) {
>     case 'ok': {
>       const d = json.data;
>       if (isRecord(d) && typeof d.id === 'string' && typeof d.name === 'string') {
>         return { status: 'ok', data: { id: d.id, name: d.name } };
>       }
>       throw new Error('Bad data');
>     }
>     case 'error':
>       if (typeof json.message === 'string') return { status: 'error', message: json.message };
>       throw new Error('Bad message');
>     case 'not_found':
>       return { status: 'not_found' };
>     default:
>       throw new Error(`Unknown status: ${String(json.status)}`);
>   }
> }
>
> console.log(render(parseUserResponse(JSON.parse('{"status":"ok","data":{"id":"1","name":"Ana"}}'))));
> console.log(render(parseUserResponse({ status: 'not_found' })));
> try { parseUserResponse({ status: 'ok', data: { id: 1 } }); } catch (e) { console.log((e as Error).message); }
> ```
>
> Output: `Hello Ana`, `No such user`, `Bad data`.
>
> With `rate_limited` added, `tsc` reports: *Argument of type `{ status: "rate_limited"; retryAfter: number; }` is not assignable to parameter of type `never`* — on the `assertNever(res)` line. ✅ checked with TypeScript 5.9.
>
> Why it works: each `case` removes one member from the union. After the last one, the union is empty — its type is **`never`**, the type with no values. Passing `res` to a parameter of type `never` compiles only while that is true. A new member makes `res` non-empty in `default`, and the call stops compiling.
>
> Why the parser too: **types are erased** — at runtime `fetch(...).json()` returns whatever the server sent. The union is the compile-time contract; the parser is what makes the network honour it. In a real project the parser is a Zod schema, `z.discriminatedUnion('status', [...])`, and the type is inferred from it with `z.infer`, so the two cannot drift. The order of the interview answer matters: **union first, runtime validation second** — validation complements the model, it does not replace it.

---

## Level 3 — The return type depends on a parameter

The panel's follow-up (00:13:29): *the same endpoint returns user data, or user data with bookings, depending on a parameter.* Create `reto03/level3.mts` with:

```ts
type User = { id: string; name: string };
type Booking = { id: string; hotel: string };
type UserWithBookings = User & { bookings: Booking[] };

const db: UserWithBookings = { id: '1', name: 'Ana', bookings: [{ id: 'b1', hotel: 'Cancun' }] };
```

Write `getUser(id, opts?)` **twice**, so that `getUser('1', { withBookings: true })` is typed `Promise<UserWithBookings>` and `getUser('1')` is `Promise<User>`:

- **A** — with function **overloads**.
- **B** — as `getUser2`, with **one generic signature** and a **conditional return type**.

Then predict: with `const flag: boolean = Math.random() > 0.5`, what is the type of `await getUser2('1', { withBookings: flag })`?

Prove your types with `// @ts-expect-error` on a line that must *not* compile, such as reading `.bookings` from the plain user. If the line compiles, `tsc` complains that the directive is unused.

> [!success]- Solution — Level 3
> ```ts
> // A — overloads
> function getUser(id: string, opts: { withBookings: true }): Promise<UserWithBookings>;
> function getUser(id: string, opts?: { withBookings?: false }): Promise<User>;
> async function getUser(id: string, opts?: { withBookings?: boolean }): Promise<User | UserWithBookings> {
>   const { bookings, ...user } = db;
>   return opts?.withBookings ? { ...user, bookings } : user;
> }
>
> const a = await getUser('1', { withBookings: true });
> const b = await getUser('1');
> console.log(a.bookings.length, b.name);
> // @ts-expect-error — b is User, it has no bookings
> b.bookings;
>
> // B — generic + conditional return type
> type UserFor<B extends boolean> = B extends true ? UserWithBookings : User;
>
> async function getUser2<B extends boolean = false>(id: string, opts?: { withBookings: B }): Promise<UserFor<B>> {
>   const { bookings, ...user } = db;
>   return (opts?.withBookings ? { ...user, bookings } : user) as UserFor<B>;
> }
>
> const c = await getUser2('1', { withBookings: true });
> const d = await getUser2('1');
> console.log(c.bookings.length, d.name);
> const flag: boolean = Math.random() > 0.5;
> const e = await getUser2('1', { withBookings: flag });
> // @ts-expect-error — e is User | UserWithBookings, so bookings is not guaranteed
> e.bookings;
> ```
>
> ✅ `tsc` clean, and `node` prints `1 Ana` twice.
>
> The prediction: `e` is **`User | UserWithBookings`**. `B` is inferred as `boolean`, which is `true | false`, and a conditional type **distributes** over a union: `UserFor<true> | UserFor<false>`.
>
> Overloads vs conditional types:
> - **Overloads** read like documentation and need no cast. The implementation signature is hidden from callers, so it must be compatible with every overload.
> - **The conditional type** scales to many cases and composes with other types, but the implementation **needs a cast** (`as UserFor<B>`) — TypeScript cannot check that a runtime branch matches a type-level branch. That cast is a small lie you own.
> - For two or three fixed variants, overloads are usually clearer.

---

## Level 4 — The Advanced toolbox, on the same client

The committee's gaps, word for word: *conditional types, mapped types, `infer`*, *generics*, *declaration merging*. Create `reto03/level4.mts` and build these five pieces, starting from:

```ts
type User = { id: string; name: string };
type Booking = { id: string; hotel: string };

type ApiResponse<T> =
  | { status: 'ok'; data: T }
  | { status: 'error'; message: string }
  | { status: 'not_found' };
```

1. **`infer`** — `PayloadOf<R>` extracts `T` from an `ApiResponse<T>`. `PayloadOf<ApiResponse<Booking[]>>` must be `Booking[]`.
2. **Mapped type** — `Handlers<U, R>`: an object with **one key per status**, where each function receives *its own* variant. Use it in a `match(value, handlers)` function, and check that omitting a status is a compile error. It is the exhaustive `switch` turned into an object.
3. **Generic over an endpoint map** — an `Endpoints` type mapping `'/users/:id'` and `'/bookings'` to their params and response, and a `request(path, params)` whose return type comes from the map.
4. **Key remapping** — `Getters<T>` turns `{ id: string; name: string }` into `{ getId: () => string; getName: () => string }`.
5. **Declaration merging** — declare a `window.__APP_VERSION__: string` that a build tool injects, so `window.__APP_VERSION__` type-checks.

> [!success]- Solution — Level 4
> ```ts
> // 1 — infer: pull the payload out of a response type
> type PayloadOf<R> = R extends { status: 'ok'; data: infer D } ? D : never;
> type P = PayloadOf<ApiResponse<Booking[]>>; // Booking[]
>
> // 2 — mapped type: one handler per status, each receiving its own variant
> type Handlers<U extends { status: string }, R> = {
>   [K in U['status']]: (variant: Extract<U, { status: K }>) => R;
> };
>
> function match<U extends { status: string }, R>(value: U, handlers: Handlers<U, R>): R {
>   const handler = handlers[value.status as U['status']] as (v: U) => R;
>   return handler(value);
> }
>
> declare const res: ApiResponse<User>;
> const text = match(res, {
>   ok: (r) => `Hello ${r.data.name}`,
>   error: (r) => `Error: ${r.message}`,
>   not_found: () => 'No such user',
> });
>
> // 3 — an endpoint map, and a request function typed from it
> type Endpoints = {
>   '/users/:id': { params: { id: string }; response: User };
>   '/bookings': { params: Record<string, never>; response: Booking[] };
> };
>
> async function request<P extends keyof Endpoints>(
>   path: P,
>   params: Endpoints[P]['params'],
> ): Promise<ApiResponse<Endpoints[P]['response']>> {
>   const url = path.replace(/:(\w+)/g, (_, k: string) => (params as Record<string, string>)[k] ?? '');
>   const r = await fetch(`https://api.example.test${url}`);
>   return (await r.json()) as ApiResponse<Endpoints[P]['response']>;
> }
>
> // 4 — key remapping
> type Getters<T> = {
>   [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
> };
> type UserGetters = Getters<User>; // { getId: () => string; getName: () => string }
>
> // 5 — declaration merging: add a global the build injects
> declare global {
>   interface Window {
>     __APP_VERSION__: string;
>   }
> }
> ```
>
> ✅ `tsc` clean. With `not_found` removed from the `match` call: *Property `not_found` is missing in type ... but required in type `Handlers<ApiResponse<User>, unknown>`*.
>
> What each tool is:
> - **Conditional type** — `A extends B ? X : Y`, an `if` at the type level. Distributes over unions.
> - **`infer`** — only valid inside the `extends` of a conditional type; it captures a piece of the matched type in a new variable. `ReturnType`, `Parameters` and `Awaited` are built this way.
> - **Mapped type** — `{ [K in Keys]: ... }`, a loop over keys. `Partial`, `Readonly`, `Record` and `Pick` are mapped types.
> - **Key remapping** — the `as` clause inside a mapped type renames keys, with template literal types. Mapping a key to `never` drops it.
> - **`Extract<U, X>`** — keeps the union members assignable to `X`. Here it picks the variant for each status.
> - **Declaration merging** — two declarations of the same `interface` merge into one. It is how you augment a global (`Window`) or a library's types (`declare module 'express'`). It works for `interface`, not `type` — one of the real differences between the two.
> - **The cast inside `match`** — at runtime `handlers[value.status]` is a plain lookup; TypeScript cannot prove that the key and the variant line up, so the implementation owns a cast while every caller stays fully checked. Same trade as level 3.

### Level 4 — tsconfig questions, answer before opening

1. The sandbox has `"strict": true`. Name three checks it turns on.
2. What do `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` add on top of `strict`?
3. `"moduleResolution": "bundler"` vs `"node16"` / `"nodenext"` — when is each one right?

> [!success]- Solution — tsconfig
> 1. `strictNullChecks` (no `null`/`undefined` hiding in every type), `noImplicitAny`, `strictFunctionTypes`, `strictPropertyInitialization`, `useUnknownInCatchVariables`, among others.
> 2. `noUncheckedIndexedAccess` makes `arr[i]` and `record[key]` include `| undefined`, because an index can be out of range. `exactOptionalPropertyTypes` stops `{ a?: string }` from accepting an explicit `a: undefined` — "missing" and "present but undefined" become different.
> 3. **`bundler`** — the code goes through Vite, webpack or Next: extensionless imports and `exports` maps are resolved the way bundlers do. **`node16`/`nodenext`** — the output runs directly in Node, which follows Node's own ESM rules (explicit `.js` extensions, `type: module`). Using `bundler` for a Node library produces code that compiles but fails in Node.

---

## Level 5 — Client case, then the Level Up justification

**The interview version.** Answer the 00:12:09 question out loud, as the panel asked it: *"Your API returns several shapes depending on status. How do you model it so developers are forced to handle every possible case — at compile time?"* Two minutes, in this order: union → discriminant and narrowing → `never` exhaustiveness → the boundary (runtime parsing) → when you would not bother.

**The Level Up justification.** The Development Justification field is mandatory, and the committee reads it. Write it in your own words, with the reto attached as the artifact, along these lines:

> [!example]- A model justification
> "To close the TypeScript gap I built a typed API client in a sandbox (attached). It models responses as a discriminated union on `status`, with exhaustive handling through `never`, so a new status is a compile error at every handler. A runtime parser at the boundary checks untrusted JSON against the same union. On the same client I applied the advanced type tools: overloads and a distributive conditional type for a return type that depends on a parameter, `infer` to extract payloads, a mapped type that forces one handler per variant, key remapping with template literal types, and declaration merging for an injected global. I also reviewed the strict compiler flags (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) and when to use `bundler` vs `nodenext` module resolution."

> [!success]- Solution — the spoken answer
> "I'd model it as a discriminated union: every response has a `status` with a literal type — `'ok'` with `data`, `'error'` with a `message`, `'not_found'` with nothing. Checking `status` narrows the union, so inside the `'ok'` branch the compiler knows `data` exists, and outside it, it won't let me touch it. To force every case, I handle them in a `switch` and pass the value to a function that only accepts `never` in the `default` branch. When the backend adds a status, every handler that forgot it stops compiling — that's the guarantee. Then the boundary: types are erased, so I also parse the JSON at runtime, usually with a Zod discriminated union, and infer the TypeScript type from the schema so they can't drift. For a return type that depends on a parameter I'd use overloads, or a conditional type if there are many variants."

---

## Level 6 — Say it out loud

Without looking, in English:

1. Union vs intersection, in one sentence each.
2. What is a discriminated union, and what makes a field a valid discriminant?
3. Why does `assertNever` catch a missing case at compile time?
4. `interface` vs `type` — one thing only `interface` can do, one thing only `type` can do.
5. What does `infer` do, and where is it allowed?
6. Why do you still validate at runtime if the types are correct?

> [!success]- Solution — Level 6
> 1. A union is one of several types — you can use what they share until you narrow. An intersection is all of them at once — it has every property of each.
> 2. A union whose members share a field with a different **literal type** in each member (`status: 'ok' | 'error'`). Comparing that field narrows the union to one member.
> 3. Each handled case removes a member from the union; when all are handled the remaining type is `never`. A function that takes `never` only compiles while nothing is left, so a new member breaks the build exactly where it is missing.
> 4. Only `interface` supports **declaration merging** (augmenting `Window` or a library). Only `type` can name a **union**, a tuple, a primitive alias, or a mapped or conditional type.
> 5. It captures part of a type into a variable while matching, as in `R extends { data: infer D } ? D : never`. Only inside the `extends` clause of a conditional type.
> 6. Types are erased at compile time. What comes from the network, `localStorage` or `postMessage` is unchecked at runtime, so a parser at the boundary turns "trust me" into a checked value — and the type is inferred from the schema so there is one source of truth.

> [!question] Short answer for the interview
> "A discriminated union with a literal `status` on every member, handled in a `switch` with a `never` check in `default` — so a new status is a compile error everywhere it's not handled. And because types are erased, a Zod discriminated union at the boundary parses the real JSON, with the type inferred from the schema."

---

## Done when

- [ ] Level 0 predicted on paper, then checked against `tsc`
- [ ] Level 1 bug reproduced
- [ ] Level 2 exhaustive `switch` and parser passing; the `rate_limited` error seen and explained
- [ ] Level 3 both versions written; the `boolean` case predicted
- [ ] Level 4 five tools written; tsconfig questions answered
- [ ] Level 5 answer recorded under two minutes; justification written in Level Up with this reto attached
- [ ] Level 6 answered out loud without notes
