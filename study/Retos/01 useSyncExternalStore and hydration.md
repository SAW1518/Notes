---
title: "Reto 01 — useSyncExternalStore and hydration"
tags:
  - challenge
  - react
  - nextjs
  - hydration
positions:
  - Hyatt
  - Nordstrom
status: todo
---

# Reto 01 — `useSyncExternalStore` and hydration

**Goal:** be able to explain, without notes, **which code runs on the server, which runs in the browser, and when** — and use that to read browser-only data (`localStorage`, `navigator.onLine`) in a `'use client'` component without breaking hydration.

**Why it matters:** Hyatt probes hydration mismatches on server-rendered pages; Nordstrom's POS needs an offline banner. Both are this pattern.

Background: [[React Internals]] (what hydration does with fibers) · [[React#Hydration, explained to a non-technical PM]].

> [!warning] Do each level before opening its solution
> The solutions are folded. Write your answer first — on paper for level 0, in the sandbox for the rest — then open the fold and compare.

---

## Setup — the sandbox

The code lives in `Retos/retos-sandbox/`, a Next.js project. Its source is committed and syncs to the other Mac; `node_modules/` and `.next/` are git-ignored, so run `npm install` there before the first `npm run dev`.

To create it from scratch:

```bash
cd Retos
npx create-next-app@latest retos-sandbox
cd retos-sandbox
npm run dev
```

If it asks: TypeScript **yes**, App Router **yes**, `src/` directory **no**. The rest doesn't matter here.

Two places to watch while you work:

- **The terminal** where `npm run dev` runs → what happened **on the server**.
- **The browser DevTools console** → what happened **in the browser**.

Each level is a component in `app/`, rendered from `app/page.tsx`.

---

## Level 0 — Predict before you run

Create `app/CurrencyBadge.tsx`:

```tsx
'use client';

import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  console.log('A · subscribe');
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

function getSnapshot() {
  console.log('B · getSnapshot');
  return localStorage.getItem('currency') ?? 'USD';
}

function getServerSnapshot() {
  console.log('C · getServerSnapshot');
  return 'USD';
}

export function CurrencyBadge() {
  console.log('D · render');
  const currency = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <span>{currency}</span>;
}
```

Before running anything, open the browser console and run `localStorage.setItem('currency', 'EUR')`. Then **answer on paper**:

1. Which letters (A, B, C, D) appear in the **terminal**? Which in the **browser console**? :
ABD console C in terminal
2. `subscribe` and `getSnapshot` both touch `window` / `localStorage`. Why doesn't the server crash with `window is not defined`?

3. What does the badge show in the HTML the server sends? And a moment later?
4. How many times does `D · render` run in the browser, and **why** the extra one?

Now render `<CurrencyBadge />` in `app/page.tsx`, reload the page, and check your answers.

> [!tip] Ignore the duplicates
> In development, StrictMode and React's own checks call some of these functions twice. Count **which** letters appear in each place, not how many times.

> [!success]- Solution — Level 0
> 1. **Terminal:** `D` and `C` — the render body and `getServerSnapshot`. **Browser:** `D` and `C` again (the hydration render), then `A` and `B` after hydration, then `D` and `B` once more.
> 2. On the server, `useSyncExternalStore` **only calls `getServerSnapshot`**. `subscribe` and `getSnapshot` are defined there, but defining a function never runs its body — and nobody calls them on the server. `window` is only evaluated when a function that mentions it is **called**.
> 3. The server HTML says `USD`. The hydration render also uses `getServerSnapshot`, so it says `USD` too — **same HTML, no mismatch**. After hydration React calls `getSnapshot`, gets `EUR`, and re-renders. You may see USD flash to EUR.
> 4. Twice (ignoring dev duplicates). The first is hydration, which must match the server, so it uses the server snapshot. The second is a **normal update** caused by `getSnapshot` returning a different value — normal updates are not compared against the server HTML, so they are free to differ.

---

## Level 1 — Break it on purpose

Create `app/NaivePrice.tsx`, the way the bug was written in the Hyatt question:

```tsx
'use client';

export function NaivePrice() {
  const currency =
    typeof window !== 'undefined' ? localStorage.getItem('currency') ?? 'USD' : 'USD';
  return <p>Price in {currency}</p>;
}
```

With `EUR` still in `localStorage`, render it and reload.

1. What error do you see, and where?
2. Write down, in two lines, what the server rendered, what the browser's first render produced, and why React refuses that.
3. Change `localStorage` to `USD` and reload. Does the error go away? What does that tell you about how this bug shows up in production?

> [!success]- Solution — Level 1
> 1. A **hydration error** in the Next.js dev overlay and the console: the server-rendered text did not match the client.
> 2. Server: `typeof window` is `'undefined'` → `"Price in USD"`. Browser hydration: `window` exists → `"Price in EUR"`. Hydration **adopts** the existing DOM instead of rebuilding it, so it requires the first client render to produce exactly the same output; when it doesn't, React discards that part and re-renders it on the client.
> 3. Yes, it disappears — both sides now say `USD`. In production the bug only appears **for users whose stored value differs from the server default**, so it passes QA on a fresh browser and fails for returning users. The `typeof window` check is not a guard here; it is what *creates* the two branches.

---

## Level 2 — Fix it with `useSyncExternalStore`

Create `app/currency.ts` with two exports:

- `useStoredCurrency(): string`
- `setStoredCurrency(currency: string): void`

Requirements:

1. **No hydration error**, with any value in `localStorage`.
2. Updates when **another tab** changes the currency (open two tabs and test it).
3. Updates when **this same tab** calls `setStoredCurrency('GBP')` — add a button that does it.
4. `subscribe`, `getSnapshot` and `getServerSnapshot` are defined **outside** the component.

Then replace `NaivePrice`'s body with your hook and confirm the error is gone.

> [!info]- Hint for requirement 3 (open only if stuck)
> The `storage` event only fires in **other** tabs. Same-tab writes need their own notification.

> [!success]- Solution — Level 2
> ```ts
> 'use client';
>
> import { useSyncExternalStore } from 'react';
>
> const KEY = 'currency';
> const SAME_TAB_EVENT = 'currency-change';
>
> function subscribe(onChange: () => void) {
>   window.addEventListener('storage', onChange);        // other tabs
>   window.addEventListener(SAME_TAB_EVENT, onChange);   // this tab
>   return () => {
>     window.removeEventListener('storage', onChange);
>     window.removeEventListener(SAME_TAB_EVENT, onChange);
>   };
> }
>
> const getSnapshot = () => localStorage.getItem(KEY) ?? 'USD';
> const getServerSnapshot = () => 'USD';
>
> export function useStoredCurrency() {
>   return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
> }
>
> export function setStoredCurrency(currency: string) {
>   localStorage.setItem(KEY, currency);
>   window.dispatchEvent(new Event(SAME_TAB_EVENT));
> }
> ```
>
> Why each requirement holds:
> - **No mismatch:** the server and the hydration render both use `getServerSnapshot`.
> - **Other tabs:** the browser fires `storage` in every *other* tab that shares the origin.
> - **Same tab:** `storage` never fires in the tab that wrote, so the setter dispatches its own event, and `subscribe` listens to it.
> - **Outside the component:** if `subscribe` were an inline arrow, it would be a new function on every render, and React would unsubscribe and resubscribe each time.

### Level 2 traps — answer before opening

1. What happens if `getSnapshot` returns `{ currency: localStorage.getItem(KEY) }` instead of the string?
2. What happens if you omit `getServerSnapshot`?
3. The USD → EUR flash is still there. How would Hyatt remove it completely?

> [!success]- Solution — traps
> 1. **Infinite loop.** React compares snapshots with `Object.is`; a new object on every call always looks "changed", so React keeps re-rendering, and in development it warns that the result of `getSnapshot` should be cached. Return a primitive, or cache the object and return the same reference while the data has not changed.
> 2. React throws during server rendering: the server has no way to get a value, so it needs `getServerSnapshot` for server-rendered content.
> 3. Store the preference in a **cookie**. The server reads it (`cookies()` in a Server Component) and renders `EUR` from the start, so server and client agree and nothing flashes. The cost: the page now depends on a request cookie, so it renders dynamically instead of being fully static or cached.

---

## Level 3 — Nordstrom: the offline banner

POS+ must show *"Offline — payments will be queued"* the moment the store Wi-Fi drops, and hide it when the connection comes back.

Write `useOnline(): boolean` with `useSyncExternalStore` and a `<OfflineBanner />` that uses it.

Test it: DevTools → **Network** tab → throttling dropdown → **Offline**, then back to **No throttling**.

Then answer: what should `getServerSnapshot` return, and why?

> [!success]- Solution — Level 3
> ```tsx
> 'use client';
>
> import { useSyncExternalStore } from 'react';
>
> function subscribe(onChange: () => void) {
>   window.addEventListener('online', onChange);
>   window.addEventListener('offline', onChange);
>   return () => {
>     window.removeEventListener('online', onChange);
>     window.removeEventListener('offline', onChange);
>   };
> }
>
> export function useOnline() {
>   return useSyncExternalStore(
>     subscribe,
>     () => navigator.onLine,
>     () => true, // the server just served the page, so assume online; avoids a banner flashing on every load
>   );
> }
>
> export function OfflineBanner() {
>   const online = useOnline();
>   if (online) return null;
>   return <div role="status">Offline — payments will be queued</div>;
> }
> ```
>
> `getServerSnapshot` returns `true`: if the browser received the server's HTML, it was online a moment ago, and rendering "online" on both sides keeps hydration clean. `role="status"` makes a screen reader announce the banner when it appears.
>
> Caveat worth saying in the interview: `navigator.onLine === true` only means "connected to a network", not "the API is reachable". A POS would combine it with failed-request detection or a health check.

---

## Level 4 — Say it out loud

Answer these out loud, in English, without looking. Then open the fold.

1. Does `'use client'` mean the component only runs in the browser?
2. Why must the first client render match the server HTML exactly?
3. What do the three arguments of `useSyncExternalStore` do, and which one runs on the server?
4. Why is `useSyncExternalStore` better than `useState` + `useEffect` for an external store?

> [!success]- Solution — Level 4
> 1. No. A Client Component is rendered **on the server** to produce the initial HTML, then its code is sent to the browser and **hydrated**. `'use client'` marks where the code starts shipping to the browser, not where it stops running on the server.
> 2. Hydration doesn't rebuild the DOM; it **adopts** the server's nodes and attaches React to them. That only works if React's first render in the browser produces the same output. If it differs, React can't trust that DOM and re-renders it on the client, with an error.
> 3. `subscribe(callback)` registers a listener and returns an unsubscribe function. `getSnapshot()` reads the current value in the browser. `getServerSnapshot()` gives the value for the server render **and for hydration** — it is the only one that runs on the server.
> 4. It hydrates with the server value automatically, subscribes and unsubscribes for you, and prevents **tearing**: during a concurrent render, every component reads the same version of the store.

> [!question] Short answer for the interview
> "`'use client'` doesn't mean client-only — the component is server-rendered first, then hydrated, and hydration needs the browser's first render to match the server's HTML. So I never read `window` or `localStorage` during render. For browser-only data I use `useSyncExternalStore`: the server and the hydration render use `getServerSnapshot`, and only after hydration does React call `getSnapshot` and subscribe, so the value updates without a mismatch. If the flash matters, as with a currency on a hotel page, I move the preference to a cookie so the server can render the right value from the start."

---

## Done when

- [ ] Level 0 predicted on paper, then checked against the terminal and the console
- [ ] Level 1 error reproduced and explained in two lines
- [ ] Level 2 passing all four requirements, traps answered
- [ ] Level 3 banner appears and disappears with DevTools offline mode
- [ ] Level 4 answered out loud without notes
