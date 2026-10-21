---
title: "Reto 07 — SOLID by refactoring"
tags:
  - challenge
  - design
  - typescript
  - react
plan: "Assessment Plan — Tier 2"
status: todo
---

# Reto 07 — SOLID by refactoring

**Goal:** learn the five SOLID principles the way they show up in frontend code — one smelly piece of checkout code per letter, refactored by you — so that each letter comes with its own example and its own violation, and you can **name the pattern** behind each fix.

**Why it matters:** the panel asked at 00:49:36 *"explain the SOLID principles briefly"*. The Level Up plan lists "SOLID in depth" as a resource, and the Software Design feedback says: gaps in SOLID understanding, and no design patterns named when describing solution design. This reto fixes both.

> [!warning] Do each level before opening its solution
> Write your refactor in the sandbox first, then compare.

---

## The theory you need first

| Letter | Principle | In one sentence | Frontend smell that breaks it |
|---|---|---|---|
| **S** | Single responsibility | A unit has **one reason to change** | A component that fetches, calculates, formats and renders |
| **O** | Open/closed | Open for **extension**, closed for **modification** | A `switch` you edit every time a new case appears |
| **L** | Liskov substitution | A subtype must work **everywhere** its parent works | A subclass that throws on a method the parent supports |
| **I** | Interface segregation | No client should depend on what it **doesn't use** | A props type with 15 optional fields for 3 different uses |
| **D** | Dependency inversion | High-level code depends on **abstractions**, not on details | A service that calls `fetch` to one vendor's URL directly |

"One reason to change" is the precise form of S — it is about **who** asks for changes (the tax rules, the design, the API), not about doing "one thing".

---

## Setup

The code lives in `Retos/retos-sandbox/reto07/`. Check types with `npx tsc --noEmit -p .` from `retos-sandbox/` and run tests with `npx vitest run reto07` (Vitest is installed in reto 06; otherwise `npm install -D vitest`).

---

## Level 0 — Name the violation

For each snippet, name the principle it breaks and the **concrete cost** — what goes wrong next month.

```ts
// A
function exportReport(data: Row[], format: 'csv' | 'pdf' | 'xlsx') {
  if (format === 'csv') { /* 40 lines */ }
  else if (format === 'pdf') { /* 60 lines */ }
  else { /* 50 lines */ }
}

// B
class Logger { log(msg: string) { console.log(msg); } }
class SilentLogger extends Logger { log() { throw new Error('Logging disabled'); } }

// C
interface UserStore {
  getUser(id: string): User;
  updateUser(u: User): void;
  deleteUser(id: string): void;
  exportAllUsersToCsv(): string;
  rotateEncryptionKeys(): void;
}
// ...used by an <Avatar> component that only calls getUser.

// D
export function useBookings() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch('https://api.hotel.example/v2/bookings').then(r => r.json()).then(setData); }, []);
  return data;
}
```

> [!success]- Solution — Level 0
> - **A — Open/closed.** Every new format means editing this function, and re-testing the other two branches it touches. The cost grows with every format, and the function grows into a God function.
> - **B — Liskov.** Any code that receives a `Logger` and calls `log` now crashes when it receives a `SilentLogger`. A "silent" logger should do *nothing*, not throw.
> - **C — Interface segregation.** `<Avatar>` depends on key rotation and CSV export. A test of `Avatar` must fake five methods, and any change to that interface ripples into a component that doesn't care.
> - **D — Dependency inversion.** The hook is welded to one vendor's URL and to `fetch`. It can't be tested without the network, can't point at a staging API without editing it, and can't be reused with another source.

---

## Level 1 — S: split the God component

`reto07/summary.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';

type Line = { sku: string; price: number; qty: number };

export function CheckoutSummary() {
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    fetch('/api/cart')
      .then((r) => r.json())
      .then(setLines);
  }, []);

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const discount = subtotal > 100 ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.16;
  const total = subtotal - discount + tax;
  const fmt = (n: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

  return (
    <dl>
      <dt>Subtotal</dt><dd>{fmt(subtotal)}</dd>
      <dt>Discount</dt><dd>{fmt(discount)}</dd>
      <dt>Tax</dt><dd>{fmt(tax)}</dd>
      <dt>Total</dt><dd>{fmt(total)}</dd>
    </dl>
  );
}
```

1. List every **reason to change** this component — who would ask for each change?
2. Refactor it into `summary.fixed.tsx`, so that the discount and tax rules can be unit-tested **with no React and no network**.
3. Write one Vitest test for the rules: one line of 200 → subtotal 200, discount 20, tax 28.8, total 208.8.

> [!success]- Solution — Level 1
> 1. Four reasons, from four different people: the **API** changes (backend), the **discount or tax rules** change (business, finance), the **money format** changes (design, localisation), the **layout** changes (design).
> 2. ```tsx
>    'use client';
>
>    import { useEffect, useState } from 'react';
>
>    export type Line = { sku: string; price: number; qty: number };
>    export type Totals = { subtotal: number; discount: number; tax: number; total: number };
>
>    // 1. Pure business rules: no React, no network — a unit test needs nothing.
>    export function computeTotals(lines: Line[]): Totals {
>      const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
>      const discount = subtotal > 100 ? subtotal * 0.1 : 0;
>      const tax = (subtotal - discount) * 0.16;
>      return { subtotal, discount, tax, total: subtotal - discount + tax };
>    }
>
>    // 2. Formatting: one place decides how money looks.
>    export const formatMoney = (n: number) =>
>      new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
>
>    // 3. Data access: where the cart comes from.
>    export function useCartLines(): Line[] {
>      const [lines, setLines] = useState<Line[]>([]);
>      useEffect(() => {
>        const controller = new AbortController();
>        fetch('/api/cart', { signal: controller.signal })
>          .then((r) => r.json())
>          .then(setLines)
>          .catch(() => {});
>        return () => controller.abort();
>      }, []);
>      return lines;
>    }
>
>    // 4. The view: given numbers, draws them.
>    export function SummaryView({ totals }: { totals: Totals }) {
>      return (
>        <dl>
>          <dt>Subtotal</dt><dd>{formatMoney(totals.subtotal)}</dd>
>          <dt>Discount</dt><dd>{formatMoney(totals.discount)}</dd>
>          <dt>Tax</dt><dd>{formatMoney(totals.tax)}</dd>
>          <dt>Total</dt><dd>{formatMoney(totals.total)}</dd>
>        </dl>
>      );
>    }
>
>    // The container wires them together, and does nothing else.
>    export function CheckoutSummary() {
>      return <SummaryView totals={computeTotals(useCartLines())} />;
>    }
>    ```
> 3. ```ts
>    it('applies 10% over 100 and 16% tax after discount', () => {
>      expect(computeTotals([{ sku: 'a', price: 200, qty: 1 }])).toEqual({ subtotal: 200, discount: 20, tax: 28.8, total: 208.8 });
>    });
>    ```
>    ✅ Passes.
>
> The React names for this split: a **custom hook** for data, a **pure function** for rules, a **presentational component** for the view, and a thin **container** — the container/presentational pattern. The committee's React gap mentions custom hooks as an advanced reuse pattern; this is where they come from.

---

## Level 2 — O: the switch that keeps growing

`reto07/payments.ts`:

```ts
type Method = 'card' | 'paypal' | 'oxxo';

export function pay(method: Method, amount: number): string {
  switch (method) {
    case 'card':
      return `Charged ${amount} to the card`;
    case 'paypal':
      return `Redirecting to PayPal for ${amount}`;
    case 'oxxo':
      return `OXXO voucher for ${amount}, valid 3 days`;
  }
}
```

1. Product wants **Apple Pay**. Add `'applepay'` to `Method` only, and run `tsc`. What happens, and is that good or bad?
2. Refactor into `payments.fixed.ts` so that adding a method means **adding an entry**, without editing `pay` — and TypeScript still rejects an entry that is missing its `pay` function.
3. What is the name of this pattern?

> [!success]- Solution — Level 2
> 1. `tsc` complains that the function lacks an ending return statement — `'applepay'` falls through the `switch`. That is **good**: exhaustiveness is protecting you. But it also shows the problem: the only way to add a method is to **modify** `pay`, and in a real codebase the same `switch` is copied into the label, the icon, the validation…
> 2. ```ts
>    export type PaymentStrategy = {
>      label: string;
>      pay(amount: number): string;
>    };
>
>    export const strategies = {
>      card: { label: 'Card', pay: (amount) => `Charged ${amount} to the card` },
>      paypal: { label: 'PayPal', pay: (amount) => `Redirecting to PayPal for ${amount}` },
>      oxxo: { label: 'OXXO', pay: (amount) => `OXXO voucher for ${amount}, valid 3 days` },
>      applepay: { label: 'Apple Pay', pay: (amount) => `Apple Pay sheet for ${amount}` },
>    } satisfies Record<string, PaymentStrategy>;
>
>    export type Method = keyof typeof strategies;
>
>    export function pay(method: Method, amount: number): string {
>      return strategies[method].pay(amount);
>    }
>    ```
>    ✅ `pay('applepay', 50)` returns `Apple Pay sheet for 50`.
>
>    `satisfies` checks every entry against `PaymentStrategy` without widening the object's type, so `Method` is still the exact union of keys. Adding Apple Pay touched **one** place, and `pay` never changed. Everything about a method — label, behaviour — lives together.
> 3. The **Strategy** pattern: a family of interchangeable behaviours behind one interface, selected at runtime. In React, the same idea is a map from key to component.
>
> When **not** to do this: with two stable cases, a `switch` is simpler. Open/closed pays off where change is *expected*.

---

## Level 3 — L: the subtype that lies

`reto07/liskov.ts`:

```ts
type Item = { sku: string; qty: number };

export class Cart {
  protected items: Item[] = [];
  add(item: Item): void {
    this.items.push(item);
  }
  count(): number {
    return this.items.reduce((n, i) => n + i.qty, 0);
  }
}

// A cart after payment: it must not change any more.
export class PaidCart extends Cart {
  constructor(items: Item[]) {
    super();
    this.items = items;
  }
  override add(): void {
    throw new Error('A paid cart cannot change');
  }
}

export function addFreeGift(cart: Cart): void {
  if (cart.count() >= 3) cart.add({ sku: 'gift', qty: 1 });
}
```

1. Does `addFreeGift(new PaidCart([{ sku: 'a', qty: 3 }]))` compile? What happens when it runs?
2. Whose fault is the crash: `addFreeGift`, or `PaidCart`?
3. Fix it in `liskov.fixed.ts` so that passing a paid cart to `addFreeGift` is a **compile error**, not a runtime one.

> [!success]- Solution — Level 3
> 1. It **compiles** — a `PaidCart` *is a* `Cart` to the type system — and it **throws** at runtime: `A paid cart cannot change`. ✅ Checked with a test.
> 2. **`PaidCart`'s.** `addFreeGift` relied on the contract `Cart` promises: you can `add`. The subclass broke that promise. That is exactly what Liskov forbids: a subtype must be usable wherever the parent is, without the caller knowing.
> 3. Turn the hierarchy around — the **mutable** thing extends the **read-only** thing, never the opposite:
>    ```ts
>    type Item = { sku: string; qty: number };
>
>    export interface ReadonlyCart {
>      count(): number;
>      items(): readonly Item[];
>    }
>
>    export interface Cart extends ReadonlyCart {
>      add(item: Item): void;
>    }
>
>    export function createCart(initial: Item[] = []): Cart {
>      const items = [...initial];
>      return {
>        add: (item) => void items.push(item),
>        count: () => items.reduce((n, i) => n + i.qty, 0),
>        items: () => items,
>      };
>    }
>
>    // Paying freezes a copy: the result can be read, and the type has no `add` to call.
>    export function pay(cart: Cart): ReadonlyCart {
>      const frozen = Object.freeze([...cart.items()]);
>      return { count: () => frozen.reduce((n, i) => n + i.qty, 0), items: () => frozen };
>    }
>
>    export function addFreeGift(cart: Cart): void {
>      if (cart.count() >= 3) cart.add({ sku: 'gift', qty: 1 });
>    }
>    ```
>    ✅ Assigning the result of `pay(cart)` to a `Cart` is a compile error.
>
> The classic example of the same mistake is `Square extends Rectangle`: setting the width of a square silently changes its height, so code written for rectangles breaks. The rule of thumb: if a subclass needs to **throw** on, or **ignore**, something the parent does, it is not a subtype. Use composition or a narrower interface.

---

## Level 4 — I: the props that do too much

A `ProductCard` used on the shop page **and** in the admin back office:

```tsx
type ProductCardProps = {
  product: Product;
  onAddToCart: () => void;
  isAdmin: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onChangeStock?: (stock: number) => void;
  trackImpression?: (id: string) => void;
  compact?: boolean;
};
```

1. Name two costs this props type puts on the **shop** page, which never edits anything.
2. What does `isAdmin: true` with no `onDelete` mean? Which states does this type allow that should be impossible?
3. Refactor in `card.fixed.tsx`, so the shop page's card knows nothing about admin work and the admin page can still put its tools inside the card.

> [!success]- Solution — Level 4
> 1. Every change to admin behaviour ripples into a type the shop depends on, and its tests and stories have to deal with props they don't use. And it bundles admin code paths into the shop page's component.
> 2. Nothing sensible — a delete button with no handler, or a hidden button with a handler. Optional props plus boolean flags allow combinations that **should not exist**; the interface is wide because it is serving three clients at once.
> 3. ```tsx
>    import type { ReactNode } from 'react';
>
>    type Product = { id: string; name: string; price: number; stock: number };
>
>    // What every shopper sees. It knows nothing about admin work.
>    export function ProductCard({ product, onAddToCart, children }: {
>      product: Product;
>      onAddToCart: () => void;
>      children?: ReactNode;
>    }) {
>      return (
>        <article>
>          <h3>{product.name}</h3>
>          <p>{product.price}</p>
>          <button onClick={onAddToCart} disabled={product.stock === 0}>Add to cart</button>
>          {children}
>        </article>
>      );
>    }
>
>    // Only the admin page renders this, inside the card's slot.
>    export function AdminProductTools({ product, onEdit, onDelete, onChangeStock }: {
>      product: Product;
>      onEdit: () => void;
>      onDelete: () => void;
>      onChangeStock: (stock: number) => void;
>    }) {
>      return (
>        <footer>
>          <button onClick={onEdit}>Edit</button>
>          <button onClick={onDelete}>Delete</button>
>          <input type="number" defaultValue={product.stock} onChange={(e) => onChangeStock(Number(e.target.value))} />
>        </footer>
>      );
>    }
>
>    export function AdminGrid({ products }: { products: Product[] }) {
>      return products.map((p) => (
>        <ProductCard key={p.id} product={p} onAddToCart={() => {}}>
>          <AdminProductTools product={p} onEdit={() => {}} onDelete={() => {}} onChangeStock={() => {}} />
>        </ProductCard>
>      ));
>    }
>    ```
>    ✅ Type-checks. The admin handlers are now **required** — the impossible states are gone — and the shop card's interface has three props.
>
> The React form of interface segregation is **composition**: small components with small props, combined through `children` or slots, instead of one component with a flag for every use. In non-React code it is the same move on interfaces: `<Avatar>` should depend on a `UserReader` with `getUser`, not on the whole `UserStore`.

---

## Level 5 — D: the service welded to a vendor

`reto07/order.ts`:

```ts
export class OrderService {
  async placeOrder(amount: number): Promise<string> {
    const res = await fetch('https://api.stripe.example/charges', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    if (!res.ok) throw new Error('Payment failed');
    const { id } = (await res.json()) as { id: string };
    console.log(`order paid: ${id}`);
    return id;
  }
}
```

1. How do you unit-test `placeOrder` today?
2. Refactor in `order.fixed.ts`: the order logic depends on a `PaymentGateway` and a `Logger` it declares itself; Stripe becomes one implementation; **one place** wires the real classes.
3. Write a test with fakes: charging 100 returns the gateway's id and logs it.
4. Dependency **inversion**, dependency **injection**, inversion of **control** — one sentence each.

> [!success]- Solution — Level 5
> 1. You can't, really: you would have to mock the global `fetch` and parse the request it was given. The test would be coupled to Stripe's URL and payload, not to the order logic.
> 2. ```ts
>    // The abstractions belong to the high-level module: it says what it needs.
>    export interface PaymentGateway {
>      charge(amount: number): Promise<{ id: string }>;
>    }
>    export interface Logger {
>      info(message: string): void;
>    }
>
>    export class OrderService {
>      constructor(
>        private readonly payments: PaymentGateway,
>        private readonly log: Logger,
>      ) {}
>
>      async placeOrder(amount: number): Promise<string> {
>        if (amount <= 0) throw new Error('Nothing to charge');
>        const { id } = await this.payments.charge(amount);
>        this.log.info(`order paid: ${id}`);
>        return id;
>      }
>    }
>
>    // The low-level detail implements the abstraction.
>    export class StripeGateway implements PaymentGateway {
>      constructor(private readonly baseUrl: string) {}
>      async charge(amount: number) {
>        const res = await fetch(`${this.baseUrl}/charges`, { method: 'POST', body: JSON.stringify({ amount }) });
>        if (!res.ok) throw new Error('Payment failed');
>        return (await res.json()) as { id: string };
>      }
>    }
>
>    // Composition root: the one place that picks the concrete classes.
>    export const orderService = new OrderService(new StripeGateway('https://api.stripe.example'), console);
>    ```
> 3. ```ts
>    it('charges and logs', async () => {
>      const payments: PaymentGateway = { charge: vi.fn(async () => ({ id: 'ch_1' })) };
>      const log = { info: vi.fn() };
>      const id = await new OrderService(payments, log).placeOrder(100);
>      expect(id).toBe('ch_1');
>      expect(payments.charge).toHaveBeenCalledWith(100);
>      expect(log.info).toHaveBeenCalledWith('order paid: ch_1');
>    });
>    ```
>    ✅ Passes, with no network.
> 4. **Dependency inversion** is the *principle*: high-level policy and low-level detail both depend on an abstraction, and the high-level side owns it. **Dependency injection** is a *technique*: the dependency is passed in (constructor, parameter, props, context) instead of created inside. **Inversion of control** is the broader *idea*: something else — a framework, a container — calls your code and supplies what it needs. Angular's DI container is IoC that does the injection; in React, props and context are hand-made injection.

---

## Level 6 — Name the pattern in your own stories

The Software Design feedback: *"has not mentioned design patterns when discussing solution design."* For each story, name the pattern(s), then retell it in two sentences **with the names in it**:

1. Expedia, universal profile rollout: legacy brands kept their code, and a **server-side interceptor** redirected their old profile URLs to the universal profile; newer brands changed their links directly.
2. Expedia, universal profile itself: one profile application serving every brand behind a single entry point, with each brand's differences configured, not coded.
3. Johnson & Johnson: storage code that runs on AWS or Azure depending on the region's data rules.
4. The payment methods from level 2.

> [!success]- Solution — Level 6
> 1. **Proxy / middleware** (a chain of responsibility in front of untouched code) — and a **strangler fig** migration: new behaviour grows around the legacy system, which is retired gradually. "For legacy brands we put an interceptor — effectively a proxy — in front of the old routes, so we migrated them strangler-style without touching their code; newer brands changed the URL directly."
> 2. **Facade** over the brand-specific services, with **configuration over code** for the differences. "The universal profile was a facade: one entry point and one UI for every brand, with brand differences as configuration."
> 3. **Adapter** (or **Strategy**) behind a storage interface — dependency inversion again. "The business logic depends on a storage interface, and an AWS adapter or an Azure adapter is chosen per region, so the compliance rules decide the deployment, not the code."
> 4. **Strategy**, with a **registry** (the map of strategies).

---

## Level 7 — Say it out loud

Without looking, in English, in under ninety seconds: the five principles, each with **one** frontend example. Then answer: which one do you think matters most in a React codebase, and why?

> [!success]- Solution — Level 7
> "**S**, single responsibility — one reason to change. In React: the data in a custom hook, the business rules in a pure function, and a component that only renders. **O**, open/closed — extend without modifying. A strategy map of payment methods: a new method is a new entry, not an edit. **L**, Liskov — a subtype must work wherever its parent works. A read-only cart must not *extend* a cart and throw on `add`; the mutable one extends the read-only one. **I**, interface segregation — don't depend on what you don't use. Small components with small props, composed with `children`, instead of one card with flags for every page. **D**, dependency inversion — depend on abstractions. The order service takes a payment gateway interface; Stripe is just one implementation, and the test passes a fake."
>
> Which matters most: a defensible answer is **S together with D** — they are what make code testable. Logic out of components into pure functions and hooks, and dependencies passed in, means most of the codebase can be unit-tested without rendering or network. Any of the five is fine if you justify it.

> [!question] Short answer for the interview
> "Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion. In frontend terms: hooks for data, pure functions for rules, components that only render; strategy maps instead of growing switches; subtypes that never throw on what the parent supports; small composable components instead of fat props; and services that receive their dependencies, so a test passes a fake instead of hitting the network."

---

## Done when

- [ ] Level 0 four violations named, with their cost
- [ ] Level 1 split done; `computeTotals` tested
- [ ] Level 2 strategy map; Apple Pay added by one entry
- [ ] Level 3 paid cart rejected at compile time
- [ ] Level 4 card split by composition
- [ ] Level 5 order service tested with fakes; inversion vs injection vs IoC answered
- [ ] Level 6 three stories retold with the pattern names
- [ ] Level 7 the five letters in under ninety seconds, out loud
