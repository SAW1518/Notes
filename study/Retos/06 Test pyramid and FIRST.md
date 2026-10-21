---
title: "Reto 06 — Test pyramid and FIRST"
tags:
  - challenge
  - testing
plan: "Assessment Plan — Tier 2"
status: todo
---

# Reto 06 — Test pyramid and FIRST

**Goal:** break a small test suite in every way the **FIRST** principles warn about, fix each one, then use the **test pyramid** to decide where each test of a real feature belongs — and tell the Cypress migration story with the pyramid as its spine.

**Why it matters:** the panel asked at 00:51:17 *"do you know the FIRST principles in testing?"* and at 00:51:39 *"the testing pyramid?"* — and earlier, at 00:30:25, *"after the Cypress migration, how did you decide what is a unit, component, integration or end-to-end test?"*, which is the pyramid asked in practical form. Both are Level Up resources, and both are named gaps under Software Engineering Practices.

> [!warning] Do each level before opening its solution
> Predict first, write it down, then run and compare.

---

## The theory you need first

**FIRST** — five properties of a good unit test (from Tim Ottinger and Jeff Langr):

| Letter | Means | Broken when |
|---|---|---|
| **F**ast | runs in milliseconds, so you run the suite all the time | it waits on a network, a database, a timer |
| **I**ndependent | no test depends on another one or on the order | tests share state; one passes only after another ran |
| **R**epeatable | same result on any machine, any day, any time | it reads the real clock, `Math.random`, a live server |
| **S**elf-validating | it passes or fails by itself | it prints something for a human to check |
| **T**imely | written with the code (or before it, in TDD) | written months later, against code that was never designed to be tested |

Some versions read the T as **Thorough** — covering edge cases and failure paths, not just the happy path. Both are worth saying.

**The test pyramid** — Mike Cohn's idea, popularised by Martin Fowler: **many** unit tests at the base, **fewer** integration tests in the middle, **few** end-to-end tests at the top. Going up, each test is slower, more expensive to maintain, more likely to be flaky, and worse at telling you *where* the bug is. Going down, each test is faster and more precise, but proves less about the whole system.

---

## Setup

In `Retos/retos-sandbox/`:

1. `npm install -D vitest`
2. A slow exchange-rate service, `app/api/rates/route.ts`:

```ts
// A slow exchange-rate service for reto 06. The rate moves a little on every call, like a real one.
export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return Response.json({ EUR: 0.9 + Math.random() * 0.05 });
}
```

3. The code under test, `reto06/cart.ts`:

```ts
export type Item = { sku: string; price: number; qty: number };

// The cart lives in the module: every importer shares it.
export const cart: Item[] = [];

export function addItem(item: Item): void {
  const existing = cart.find((i) => i.sku === item.sku);
  if (existing) existing.qty += item.qty;
  else cart.push({ ...item });
}

export function total(items: Item[]): number {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

// 10% off between 17:00 and 19:00.
export function happyHourDiscount(items: Item[]): number {
  const hour = new Date().getHours();
  return hour >= 17 && hour < 19 ? total(items) * 0.1 : 0;
}

export async function totalInEur(items: Item[]): Promise<number> {
  const res = await fetch('http://localhost:3000/api/rates');
  const { EUR } = (await res.json()) as { EUR: number };
  return Math.round(total(items) * EUR * 100) / 100;
}

export function orderId(): string {
  return `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
```

Run tests with `npx vitest run reto06`. Keep `npm run dev` running in another terminal — one test calls it.

---

## Level 0 — Predict before you run

Create `reto06/cart.bad.test.ts`:

```ts
import { expect, it } from 'vitest';
import { addItem, cart, happyHourDiscount, orderId, totalInEur } from './cart';

it('adds an item', () => {
  addItem({ sku: 'tee', price: 20, qty: 1 });
  expect(cart).toHaveLength(1);
});

it('merges the same sku', () => {
  addItem({ sku: 'tee', price: 20, qty: 2 });
  expect(cart[0].qty).toBe(3);
});

it('gives 10% off at happy hour', () => {
  expect(happyHourDiscount([{ sku: 'tee', price: 100, qty: 1 }])).toBe(10);
});

it('converts the total to EUR', async () => {
  const eur = await totalInEur([{ sku: 'tee', price: 100, qty: 1 }]);
  expect(eur).toBe(92.5);
});

it('creates an order id', () => {
  console.log('order id:', orderId());
});
```

**On paper**, before running:

1. Which tests pass and which fail right now? Does the answer depend on *when* you run it?
2. How long does the whole file take, roughly, and which test is responsible?
3. Run **only** the second test: `npx vitest run reto06/cart.bad.test.ts -t "merges the same sku"`. What happens?
4. Which test can never fail?

> [!success]- Solution — Level 0
> ✅ Measured outside happy hour: *2 failed, 3 passed*, about 1.6 s.
>
> 1. "adds an item" and "merges the same sku" pass. **"Happy hour" fails** — except between 17:00 and 19:00, when it passes. **"EUR" fails most of the time** (`expected 92.48 to be 92.5`), because the rate changes on every call. "Order id" passes.
> 2. About 1.5 s, all of it in the EUR test, waiting for the server. Every other test takes about a millisecond.
> 3. It **fails**: `expected 2 to be 3`. Alone, the cart starts empty, so the quantity is 2, not 3. It only passed because the first test had already put a tee in the shared cart.
> 4. **"Creates an order id"** — it has no `expect`. It prints a value and passes whatever happens, even if `orderId()` returns garbage.

---

## Level 1 — Diagnose: one letter per failure

For each of the five tests, name the FIRST letter it breaks (some break more than one), and the **cause** in the code — not in the test.

> [!success]- Solution — Level 1
> | Test | Breaks | Cause in the code |
> |---|---|---|
> | adds an item / merges the same sku | **I**ndependent | `cart` is module-level state shared by every test; the second test depends on the first having run |
> | gives 10% off at happy hour | **R**epeatable | `happyHourDiscount` reads `new Date()` itself — the result depends on the time of day |
> | converts the total to EUR | **F**ast, **R**epeatable, **I**ndependent | it calls a real service: slow, a different rate every time, and it fails if the server is down |
> | creates an order id | **S**elf-validating | no assertion: a human has to read the log |
>
> And **T**imely, for all of them: this code was written without tests, so it hides its dependencies — the clock, the network, the randomness, the shared cart. Code written test-first rarely ends up like this, because the first test forces those dependencies to become parameters.

---

## Level 2 — Fix it: change the code, then the tests

Create `reto06/cart.fixed.ts` and `reto06/cart.fixed.test.ts`. Requirements:

1. No module-level cart: each test builds its own.
2. The clock, the exchange rate and the randomness can be **controlled** by a test, while production code calls the functions exactly as before.
3. Every test has at least one meaningful assertion.
4. The whole file runs in **under 50 ms** and passes in any order: run it three times with `--sequence.shuffle`.
5. Show the clock **two ways**: once by passing a date in, once with Vitest's fake timers.

> [!info]- Hint (open only if stuck)
> A dependency that a function reaches for can become a parameter **with a default value**: production passes nothing, the test passes a fake.

> [!success]- Solution — Level 2
> `reto06/cart.fixed.ts`:
>
> ```ts
> export type Item = { sku: string; price: number; qty: number };
>
> export function createCart() {
>   const items: Item[] = [];
>   return {
>     items: () => items.map((i) => ({ ...i })),
>     add(item: Item) {
>       const existing = items.find((i) => i.sku === item.sku);
>       if (existing) existing.qty += item.qty;
>       else items.push({ ...item });
>     },
>   };
> }
>
> export function total(items: Item[]): number {
>   return items.reduce((sum, i) => sum + i.price * i.qty, 0);
> }
>
> export function happyHourDiscount(items: Item[], now: Date = new Date()): number {
>   const hour = now.getHours();
>   return hour >= 17 && hour < 19 ? total(items) * 0.1 : 0;
> }
>
> export type RateSource = () => Promise<number>;
>
> export const liveEurRate: RateSource = async () => {
>   const res = await fetch('http://localhost:3000/api/rates');
>   return ((await res.json()) as { EUR: number }).EUR;
> };
>
> export async function totalInEur(items: Item[], getRate: RateSource = liveEurRate): Promise<number> {
>   const rate = await getRate();
>   return Math.round(total(items) * rate * 100) / 100;
> }
>
> export function orderId(random: () => number = Math.random): string {
>   return `ORD-${random().toString(36).slice(2, 8).toUpperCase()}`;
> }
> ```
>
> `reto06/cart.fixed.test.ts`:
>
> ```ts
> import { afterEach, describe, expect, it, vi } from 'vitest';
> import { createCart, happyHourDiscount, orderId, totalInEur } from './cart.fixed';
>
> describe('cart', () => {
>   it('adds an item', () => {
>     const cart = createCart();
>     cart.add({ sku: 'tee', price: 20, qty: 1 });
>     expect(cart.items()).toHaveLength(1);
>   });
>
>   it('merges the same sku', () => {
>     const cart = createCart();
>     cart.add({ sku: 'tee', price: 20, qty: 1 });
>     cart.add({ sku: 'tee', price: 20, qty: 2 });
>     expect(cart.items()).toEqual([{ sku: 'tee', price: 20, qty: 3 }]);
>   });
> });
>
> describe('happy hour', () => {
>   const items = [{ sku: 'tee', price: 100, qty: 1 }];
>
>   it('gives 10% off at 17:30', () => {
>     expect(happyHourDiscount(items, new Date(2026, 0, 1, 17, 30))).toBe(10);
>   });
>
>   it('gives nothing at 19:00', () => {
>     expect(happyHourDiscount(items, new Date(2026, 0, 1, 19, 0))).toBe(0);
>   });
>
>   describe('with the clock faked instead of injected', () => {
>     afterEach(() => vi.useRealTimers());
>
>     it('gives 10% off at 18:59', () => {
>       vi.useFakeTimers();
>       vi.setSystemTime(new Date(2026, 0, 1, 18, 59));
>       expect(happyHourDiscount(items)).toBe(10);
>     });
>   });
> });
>
> describe('currency', () => {
>   it('converts the total with the given rate', async () => {
>     const eur = await totalInEur([{ sku: 'tee', price: 100, qty: 1 }], async () => 0.925);
>     expect(eur).toBe(92.5);
>   });
> });
>
> describe('order id', () => {
>   it('has the ORD- prefix and six characters', () => {
>     expect(orderId(() => 0.123456789)).toMatch(/^ORD-[0-9A-Z]{6}$/);
>   });
> });
> ```
>
> ✅ Measured: *7 passed*, tests 2 ms, and 7 passed in each of three shuffled runs.
>
> - **Independent**: `createCart()` is a factory, so each test owns its cart. The general rule: no shared mutable state between tests, and whatever must be shared is reset in `beforeEach`.
> - **Repeatable**: the clock, the rate and the randomness are **parameters with defaults**. Production calls `happyHourDiscount(items)` as before; the test passes a fixed date. That is dependency injection at function level — the same idea as the D in SOLID.
> - **Fake timers** are the other way, when you can't change the signature: `vi.setSystemTime` makes `new Date()` return what you choose. Always restore real timers afterwards, or *that* becomes shared state.
> - **Self-validating**: the order-id test now asserts the format. Note the boundary test too: 19:00 is **outside** happy hour — off-by-one bugs live at boundaries, which is what "Thorough" means.
> - **Fast**: no network. The real `liveEurRate` still needs a test, but **one**, at the integration level, against a stub server or a contract — not inside every unit test.

---

## Level 3 — The pyramid: where does each test go?

A checkout feature: cart, discount codes, address form, payment through a provider, order confirmation. Here are twelve tests someone wants to write. Put each one at **unit**, **integration/component**, or **end-to-end**, then answer the three questions.

1. `total()` sums price × quantity.
2. A discount code of 100% never makes the total negative.
3. The address form shows *"Postcode is required"* when submitted empty.
4. The address form's submit button is reachable and labelled for a screen reader.
5. The cart badge in the header updates when an item is added on the product page.
6. The checkout page renders the error banner when the payment API returns 402.
7. The API client retries a 503 once, then gives up.
8. A real user can browse, add to cart, pay with a test card and see the confirmation.
9. The order-id format.
10. The order-confirmation email template contains the order id.
11. Logging out in one tab sends the other tab to the login page.
12. The happy-hour discount at 17:00, 18:59 and 19:00.

Then:

- a. Roughly what proportions do you end up with, and why that shape?
- b. What is the **ice-cream cone**, and how does a team end up there?
- c. Where do **Cypress component tests** sit, and how does the **testing trophy** differ from the pyramid?

> [!success]- Solution — Level 3
> - **Unit**: 1, 2, 7 (with a fake `fetch`), 9, 10, 12 — pure logic, edge cases, milliseconds each.
> - **Integration / component**: 3, 4, 5, 6 — a component or a few together, rendered with a mocked network (React Testing Library + MSW, or Cypress component mode). 4 also runs an automated accessibility check (axe).
> - **End-to-end**: 8, and 11 — a real browser, the whole app. Keep that layer to the **critical journeys** only.
>
> a. Something like **60–70% unit, 20–30% integration, under 10% e2e**. It is a shape, not a quota. The reasons: the lower a test is, the faster it runs and the more precisely it points at the broken line; the higher it is, the more it proves but the slower, more fragile and more expensive it gets. You want most of your confidence from cheap tests, and a few expensive tests to prove the pieces work together.
>
> b. The **ice-cream cone** is the pyramid upside down: mostly e2e and manual tests, few unit tests. Teams get there when code is hard to unit-test (no injection, logic inside components), so the only way to test anything is to drive the whole app. The symptoms: a 40-minute suite, flaky reruns, and failures that say "checkout broke" without saying where.
>
> c. **Cypress component tests** sit in the middle: one real component, rendered in a real browser, with its dependencies mocked. They replace some Jest + jsdom unit tests where the browser behaviour matters (layout, focus, real events). The **testing trophy** (Kent C. Dodds) is a frontend variant: static analysis (types, lint) at the base, then a thin unit layer, a **thick integration layer**, and a thin e2e top — because in UI code most bugs live in how components work together. Both agree on the essential point: few e2e tests, and test behaviour, not implementation.

---

## Level 4 — Client case: tell the Cypress story with the pyramid

Re-answer the 00:30:25 question out loud: *"you migrated a large React component package to Cypress — what problem were you solving, and how did you decide which tests should be unit, component, integration or end-to-end?"*

It is your own story, from Expedia, so tell it in the first person with a decision in it. Include: the problem (the old Jest version was hard to upgrade, and jsdom does not behave like a browser), the criteria you used to place each test, what stayed where, and the result.

> [!success]- Solution — a model answer
> "The component library was on an old Jest version that had become very hard to upgrade, and jsdom kept giving us false confidence on browser behaviour — focus, layout, real events. We moved component tests to Cypress component mode, so each component renders in a real browser, isolated, with its dependencies mocked.
>
> To decide where each test went I used the pyramid. Pure logic — formatters, validation, the reducers — stayed as fast unit tests, because a browser adds nothing there. Anything about how a component behaves for the user — keyboard, focus, what a screen reader sees, visual states — became a component test. Flows across several components and the API went to integration tests with a mocked network. And end-to-end we kept to the few critical journeys, like login and the profile update, because they're the slowest and the flakiest.
>
> The result was a suite that upgrades cleanly, catches real browser bugs, and still runs fast enough to gate every pull request."

---

## Level 5 — Say it out loud

Without looking, in English:

1. What does FIRST stand for? One sentence per letter.
2. Give an example of a test that breaks each letter.
3. Explain the test pyramid and *why* it has that shape.
4. What is the ice-cream cone?
5. How do you make code that uses the clock, the network or randomness testable?

> [!success]- Solution — Level 5
> 1. **Fast** — milliseconds, so you run it constantly. **Independent** — no dependence on other tests or their order. **Repeatable** — same result anywhere, any time. **Self-validating** — it passes or fails by itself, with no human reading output. **Timely** — written with the code, or before it.
> 2. A test that calls a real API (Fast). Two tests sharing a module-level array (Independent). A test that reads `new Date()` (Repeatable). A test that only `console.log`s (Self-validating). Tests added months later to code with hidden dependencies (Timely).
> 3. Many unit tests, fewer integration tests, few end-to-end tests. Going up, tests get slower, flakier, more expensive and worse at locating the bug; going down, they get faster and more precise but prove less about the whole. So most confidence comes from the cheap layers, and a few expensive tests prove it all fits together.
> 4. The inverted pyramid: mostly e2e and manual tests, few unit tests — slow, flaky suites whose failures don't tell you where the bug is.
> 5. Make the dependency a parameter with a default — inject the clock, the rate source, the random function — or, when you can't change the signature, control it from the test with fake timers and a mocked `fetch`.

> [!question] Short answer for the interview
> "FIRST is what makes a unit test worth having: fast, independent, repeatable, self-validating, and written in time with the code. The pyramid is about where tests go: many fast unit tests at the base, fewer integration tests, and a few end-to-end tests for the critical journeys, because the higher you go the slower, flakier and less precise a test gets. When a suite drifts into an ice-cream cone, the usual root cause is code with hidden dependencies — the clock, the network — so the fix starts by injecting them."

---

## Done when

- [ ] Level 0 predicted on paper, then checked
- [ ] Level 1 a FIRST letter and a cause for every test
- [ ] Level 2 fixed suite under 50 ms, passing three shuffled runs
- [ ] Level 3 twelve tests placed; the three questions answered
- [ ] Level 4 the Cypress story recorded, under two minutes
- [ ] Level 5 answered out loud without notes
