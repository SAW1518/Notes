---
title: State Management
tags:
  - study
  - interview
  - react
  - redux
  - state
---

# State Management

In architectural terms, state management is the pattern most used in front-end applications. The GoF pieces it is built from are in [[Design Patterns]].

---

# Why a container, if React already has state and Context

- **Single source of truth** — one place describes the state, and so it describes the view.
- **Less cognitive complexity** — the actions have names that describe what the user did.
- **Devtools and time travel** — we can replay the steps and debug in any point.
- **Selectors** — we subscribe to a *slice* of the state. The Context re-renders **all** the consumers on any change.
- **Pure functions by force** — the reducers have to be pure, and a pure function is easy to unit test.

> [!important] Redux is not a Gang of Four pattern
> It is the **Flux** architecture. But it is built with GoF ideas, and this is a good thing to say out loud:
>
> | Piece of Redux | Pattern |
> |---|---|
> | The action `{ type, payload }` | **Command** |
> | `store.subscribe()` | **Observer** |
> | The middleware (`thunk`, `saga`) | A chain of decorators |
> | The reducer | A pure function — `reduce` / fold |

> [!warning] Context is not a state manager
> Context is a **dependency injection** mechanism, not a store. It has no selectors: any change to the value re-renders **every** consumer, no matter which part of the value they read. That is fine for things that rarely change (theme, locale, the current user) and wrong for anything that updates often.

---

# Redux

## What is Redux

A library commonly used with React to manage **global state**. Recommended only for big applications, because it adds a lot of concepts and rules.

Modern Redux is used with **Redux Toolkit** (RTK), which removes a big part of the boilerplate. For small or medium apps, Context, Zustand or TanStack Query are usually enough.

## The Store

A JavaScript object with the responsibility of keeping the state of the application. This object is **read-only**: it can only be modified by dispatching actions.

## Actions

Plain JavaScript objects that describe a change in the state of the application.

They must have a **`type`** property that indicates the type of the action — for example success, failed or loading — and normally they carry the data in a `payload`.

```js
{ type: "user/loginSuccess", payload: { id: 1, name: "Ana" } }
```

## Reducers

A reducer is a **pure function** that receives the **current state** and an **action**, and returns the **new state**.

```js
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };   // NEW object
    default:
      return state;
  }
}
```

Being a pure function, it can **never** mutate the state directly, call an API, or use things like `Math.random()` or `Date.now()`.

> [!important] Action vs Reducer — do not swap these
> - **Action** = the *object* that says **what happened**.
> - **Reducer** = the *pure function* that decides **how the state changes**.

## Dispatch

The `dispatch` function is used to **send actions** to the store. When an action is dispatched, the store calls the correct reducer(s) to update the state.

```js
dispatch({ type: "increment" });
```

## Middleware

It sits **between** the dispatching of an action and the moment it arrives to the reducer.

We can use it to trigger another action, to retry an API call, or to inject data into the action. The most known ones are `redux-thunk` and `redux-saga`, which are the way to handle asynchronous things in Redux.

## Selectors

Functions used to extract specific pieces of data from the store.

```js
const selectUserName = (state) => state.user.name;
```

The advantage is that the components do not need to know the shape of the state. If tomorrow we change the structure, we only touch the selector.

> [!tip] Memoized selectors
> With `createSelector` (of Reselect, included in Redux Toolkit) the selector only recalculates when its inputs change. This avoids re-renders that are not necessary.

> [!question] Short answer for the interview
> "Redux is a single store that is read-only: the only way to change it is dispatching an action, which is an object with a `type` and a `payload`, and a reducer — a pure function — returns the new state. Middleware sits between the dispatch and the reducer for the async part, and selectors let a component subscribe to a slice instead of to the whole store, which is exactly what Context can not do. It is the Flux architecture, not a GoF pattern, but it is assembled from Command, Observer and a chain of decorators."

---

# The real question: server state vs client state

The senior framing, and the one that reframes most "should we use Redux" questions. Most of what teams put in Redux is not client state at all:

| | What it is | Who owns the truth | The tool |
|---|---|---|---|
| **Server state** | A cached copy of something that lives in a database | The **server** | TanStack Query, RTK Query, SWR, Apollo |
| **Client state** | State that only exists in the browser | The **client** | `useState`, Zustand, Redux, Jotai |
| **URL state** | Filters, pagination, the open tab, the selected id | The **URL** | The router — `useSearchParams` |
| **Form state** | The in-progress value of a form | The **form** | React Hook Form, or `useState` |

Putting server state in Redux means hand-writing caching, invalidation, deduplication, retries, and loading and error flags — which is what the server-state libraries already do.

> [!tip] The sentence that lands
> "Before choosing a state library I ask who owns the truth. If the server owns it, it is a cache and I want a server-state library, not a store. If the URL can own it, the URL should, because then it is shareable and the back button works. What is left is real client state, and that is usually small enough that `useState` plus one lightweight store is enough."

---

# Libraries worth learning

In the order that gives the most return. Each one teaches a concept, not just an API.

## 1. TanStack Query — start here

The highest-value library in the list, because it deletes the most code. Server state with caching, invalidation, deduplication (single-flight — see [[Design Patterns#Single-flight]]), retries, background refetch and optimistic updates.

- What to learn: query keys, `staleTime` vs `gcTime`, invalidation, `useMutation` with `onMutate` for optimistic UI.
- What it teaches: that most "global state" was a cache all along.
- Docs: `tanstack.com/query`

## 2. Zustand — the small store

A store in a few lines, no provider, no boilerplate, with selectors. The honest default for real client state.

```js
import { create } from "zustand";

const useCart = create((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
}));

// in the component — subscribes only to this slice
const items = useCart((s) => s.items);
```

- What to learn: the selector signature, `subscribeWithSelector`, the `persist` middleware.
- What it teaches: that selectors are what Context is missing, and that they are not hard.

## 3. Redux Toolkit — because interviews ask for it

Even with TanStack Query and Zustand covering the real work, Redux is what gets asked. RTK is the modern form: `createSlice`, Immer so you can write "mutating" code that produces immutable updates, and RTK Query built in.

- What to learn: `createSlice`, `createAsyncThunk`, `createSelector`, the devtools and time travel.
- What it teaches: the Flux loop, and why reducers must be pure.

## 4. React Hook Form + Zod — forms and validation

Forms are where uncontrolled inputs, validation and typing all meet. Pair it with Zod so the same schema gives the validation and the TypeScript type — see [[TypeScript Boundary]].

- What to learn: `register` vs `Controller`, `zodResolver`, how re-renders are avoided.
- What it teaches: that validation belongs at the boundary, once.

## 5. Jotai or Valtio — a different model, for contrast

Worth a weekend, not a project. Jotai is bottom-up atoms (like Recoil); Valtio is a mutable proxy. Knowing them lets you answer "why Zustand and not X" with an actual reason.

- What it teaches: the three models — one store with selectors (Zustand/Redux), many atoms (Jotai), a proxy that tracks reads (Valtio/Vue/MobX).

## 6. XState — when the state is a machine

Reach for it when the bug reports are "it got stuck in loading" or "it submitted twice". It makes the impossible states impossible, which no amount of booleans does.

- What to learn: states, events, guards, the visualizer.
- What it teaches: that `isLoading && isError && isSuccess` is a state machine with the states left implicit.

> [!tip] The practical stack
> TanStack Query for the server + the URL for what belongs in the URL + Zustand for the rest. Redux Toolkit when the team already has it or the interview asks. XState only for the two or three flows that genuinely are machines.

---

# Still to study

- [ ] RTK Query in depth, and how it compares with TanStack Query
- [ ] Normalising state — when `entities` + `ids` beats nested objects
- [ ] Optimistic updates with rollback across several mutations in flight — see [[React]]
- [ ] Persisting and rehydrating state, and the version-migration problem
- [ ] `useSyncExternalStore` — how an external store subscribes safely under concurrent rendering
