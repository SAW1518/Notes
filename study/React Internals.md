---
title: React Internals
tags:
  - study
  - interview
  - react
  - fiber
  - internals
---

# React Internals

How React turns a `setState` into a DOM change: elements and fibers, the two fiber trees, the render and commit phases, the diff rules, the reconciler/renderer split, lanes and concurrent rendering — and how the model changed from React 15 to 19.

The day-to-day side (hooks, re-renders, memoisation) is in [[React]]. What the browser does after React's commit — style, layout, paint — is in [[Browser Platform#The five phases]]. The task/microtask scheduling React relies on is in [[JavaScript#The event loop]].

> [!important] The sentence the whole topic stands on
> React never reads the DOM to find out what changed. It compares the **new description against the previous one, both in memory**, in an interruptible **render phase**, and then writes only the differences to the DOM in a synchronous **commit phase**.

---

# 1. The three things people call "the virtual DOM"

"Virtual DOM" is the community name, and it blurs three different objects. The React team talks about **elements**, **fibers** and **host nodes**.

| | React element | Fiber | DOM node |
|---|---|---|---|
| What it is | What JSX compiles to | React's internal unit of work | The real browser node |
| Created | **New on every render** | Once per component instance / host node, then **reused** | Once, by the renderer |
| Lifetime | Thrown away after the render | As long as the component is mounted | As long as the fiber |
| Mutable? | No — frozen in development | Yes | Yes |
| Holds state? | No | **Yes** — props, hooks, effects, pending work | Its own DOM state (focus, scroll, value) |

An element is a cheap, immutable description:

```js
// <button className="buy" onClick={add}>Add</button> compiles to (React 17+ JSX transform):
jsx('button', { className: 'buy', onClick: add, children: 'Add' });

// which returns, roughly:
{ $$typeof: Symbol.for('react.element'), type: 'button', key: null,
  props: { className: 'buy', onClick: add, children: 'Add' } }
```

Before React 17 the same JSX compiled to `React.createElement(...)`, which is why every file had to `import React`.

The **fiber** is the persistent object behind it. Elements are the input of a render; fibers are where React remembers everything between renders.

> [!tip] See it yourself
> In Chrome DevTools, select any element rendered by React in the Elements panel, then in the console:
> `$0[Object.keys($0).find(k => k.startsWith('__reactFiber'))]`
> That is the fiber for that DOM node — look at `memoizedProps`, `return`, `alternate`, `flags`. (React 16 used the prefix `__reactInternalInstance` instead.)

---

# 2. Before Fiber: the stack reconciler (React ≤ 15)

Up to React 15, reconciliation was a **recursive** walk: `updateComponent` called the children's `updateComponent`, which called theirs, all the way down.

The problem is that **the progress of the work lived in the JavaScript call stack**. Once an update started, it could not stop until the whole tree was done — there is no way to pause a recursion halfway, leave the event loop, and come back. A big update held the main thread for tens of milliseconds: dropped frames, an input field that lagged behind the keyboard.

Fiber's core idea is to **move the work out of the call stack into a data structure React controls**: a linked tree of fibers plus a pointer to "the next unit of work". A pointer can be saved, and the loop can stop and resume from it.

---

# 3. A fiber, field by field

Simplified, but the field names are the real ones:

```js
{
  tag,                        // FunctionComponent, ClassComponent, HostComponent ('div'), HostText...
  type,                       // the component function / class, or the string 'div'
  key,

  stateNode,                  // HostComponent → the DOM node. Class → the instance. Function → null

  return, child, sibling,     // the tree, as a linked list: parent, first child, next sibling

  pendingProps,               // the props this render received
  memoizedProps,              // the props of the last committed render
  memoizedState,              // class: this.state. Function component: the FIRST HOOK of a linked list
  updateQueue,                // pending setState updates, effect list for function components

  flags,                      // what the commit must do to THIS fiber: Placement, Update, ChildDeletion, Ref, Passive...
  subtreeFlags,               // the OR of every flag below it — lets the commit skip clean subtrees
  deletions,                  // children to remove

  lanes, childLanes,          // priority of pending work here / somewhere below

  alternate,                  // the twin of this fiber in the other tree
}
```

`return` / `child` / `sibling` is what makes the walk resumable. Instead of recursion, React goes down through `child`, across through `sibling`, and back up through `return`, keeping only a `workInProgress` pointer to where it is.

```
        App
         │ child
         ▼
       Header ──sibling──► List ──sibling──► Footer
                            │ child   ▲
                            ▼         │ return
                           Item ──────┘
```

---

# 4. Double buffering: `current` and `workInProgress`

React keeps **two fiber trees**:

- **`current`** — what is on screen right now. The root (`FiberRootNode`) points to it through `root.current`.
- **`workInProgress`** — the draft of the next UI, built during a render.

Every fiber points to its twin in the other tree through `alternate`.

```
FiberRootNode
     │ .current
     ▼
 HostRoot (current) ◄──── alternate ────► HostRoot (workInProgress)
     │                                          │
    App ◄─────────── alternate ───────────►    App
     │                                          │
   Counter ◄──────── alternate ───────────►  Counter   ← state 1 here, 0 on screen
```

When a render finishes and is committed, React flips one pointer: `root.current = finishedWork`. The draft **becomes** the screen, and the old `current` tree becomes the `alternate` that the next render will **reuse** as its draft (`createWorkInProgress` recycles `current.alternate` instead of allocating new objects).

The name comes from graphics: games draw the next frame into an off-screen buffer and swap it in at once, so the screen never shows a half-drawn frame. Here, the two benefits are:

1. **A render can be thrown away for free.** Nothing on screen depends on the draft until the swap. This is what makes interruption (§9) safe.
2. **Fewer allocations.** At most two fibers ever exist per node, and they alternate roles.

> [!warning] Two trees, not "two virtual DOMs" diffed against each other
> React does not build a full second tree and then diff two finished trees. It builds the draft **while** diffing: for each fiber it compares the new elements against the `current` children and decides, child by child, what to reuse, create or delete. Untouched subtrees are not even copied — they are shared (§5, bailout).

---

# 5. The render phase

**What triggers it.** `setState` (or a hook setter) does not render. It creates an **update object**, appends it to that hook's queue on the fiber, marks the fiber's `lanes` and every ancestor's `childLanes` up to the root, and asks the scheduler to process the root. Several setters in the same event are batched into one render (automatic batching, everywhere since React 18).

**The work loop**, almost literally from the source:

```js
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

The only difference between "sync" and "concurrent" rendering is `shouldYield()`: the concurrent loop checks, after each fiber, whether its time slice (about 5 ms) is used up, and if so returns control to the browser. The `workInProgress` pointer remembers where to resume.

**`performUnitOfWork`** does two things, in a depth-first walk:

- **`beginWork`** — on the way **down**. For a function component: call it (with its hooks) and get the new elements. Then **reconcile** those elements against the current children (§6), producing the child fibers of the draft.
- **`completeWork`** — on the way **up**, when a fiber has no more children to process. For a host component (`div`, `p`): on mount, **create the DOM node** (detached, not yet in the document) and append its already-created children; on update, compute which DOM props changed. Then bubble `flags` into the parent's `subtreeFlags`.

So the render phase does not touch the **visible** DOM. It may create detached nodes for new elements, but nothing is inserted into the document until the commit.

**Bailout.** When React reaches a fiber whose props are the **same reference** (`oldProps === newProps`), with no pending update in its lanes and no context change, it does not call the component. If nothing below has work either (`childLanes` empty), the whole subtree is skipped and shared with the current tree. This is the mechanism under [[React#First: why does a component re-render at all?]] and under `React.memo`, which only loosens the props check from `===` to a shallow compare.

> [!important] The render phase must be pure
> React may call your component, then **discard** the result (an urgent update interrupted it), and call it again. Anything with a side effect in the body — a request, a mutation of a global, a subscription — runs a number of times you do not control. That is why StrictMode calls components twice in development: to make impurity visible.

---

# 6. Reconciliation: the diff rules

Comparing two arbitrary trees optimally is O(n³). React gets O(n) with two assumptions: **different types produce different trees**, and **keys identify children across renders**.

## The rules, per position

| Old | New | What React does | State |
|---|---|---|---|
| `<div>` | `<div>` | Keep the DOM node, update only changed attributes | Kept |
| `<Counter>` | `<Counter>` | Keep the fiber, re-render with new props | **Kept** |
| `<div>` | `<span>` | Destroy the subtree, build a new one | **Lost** |
| `<CounterA>` | `<CounterB>` | Unmount A (cleanups run), mount B | **Lost** |
| `<Counter key="1">` | `<Counter key="2">` | Different identity → remount | **Lost** — this is the "reset with a key" trick |

> [!danger] A component defined inside another component
> ```jsx
> function List() {
>   const Row = ({ item }) => <li>{item.name}</li>; // a NEW function every render
>   return items.map((i) => <Row key={i.id} item={i} />);
> }
> ```
> `Row` is a different `type` on every render of `List`, so rule 4 applies: every row unmounts and remounts on every render — state lost, inputs lose focus, effects re-run. Define components at module level.

## Lists and keys

For an array of children, React matches old and new children by **key**; without keys, by **index**.

1. Walk both lists in order while keys match — the common "nothing moved" case is cheap.
2. Put the remaining old children in a `Map` by key.
3. For each remaining new child, look it up in the map: found → reuse the fiber (and mark it for a move if needed); not found → create it.
4. Whatever is left in the map is deleted.

With **index keys**, identity is the position. Insert an item at the top of a list of inputs and every fiber keeps its position, so the state of row 0 (typed text, focus, a checkbox) now shows next to the new item. A stable key from the data (`sku`, `id`) fixes it. `Math.random()` as a key is worse than the index — a new identity on every render means a remount on every render.

---

# 7. The commit phase

The commit takes the finished draft and applies it. It is **synchronous and never interrupted** — a half-applied UI must never reach the screen.

In order:

1. **Before mutation** — reads the DOM before it changes: `getSnapshotBeforeUpdate` (e.g. to keep a scroll position).
2. **Mutation** — walks the fibers with flags (skipping subtrees whose `subtreeFlags` is empty) and calls the renderer: insert nodes (`Placement`), update props and text (`Update`), remove nodes (`ChildDeletion`, which also runs the unmount cleanups of that subtree). Old refs are detached; `useLayoutEffect` cleanups of updated components run.
3. **The swap** — `root.current = finishedWork`. The draft is now the current tree.
4. **Layout** — `useLayoutEffect` callbacks, `componentDidMount` / `componentDidUpdate`, refs attached. The DOM is updated but **not painted yet**, so measuring here is safe and any change made here lands in the same frame.
5. The JavaScript task ends → **the browser does style, layout and paint**.
6. **Passive effects** — `useEffect` cleanups, then callbacks, scheduled to run after the paint.

The swap sits between mutation and layout on purpose: `componentWillUnmount` and the mutation steps still see the old tree as current, while `componentDidMount` and layout effects see the new one.

> [!warning] "`useEffect` runs after the paint" has an exception
> Since React 18, when the update came from a **discrete input** (a click, a keydown), React flushes the passive effects **synchronously at the end of the commit**, before the browser paints — so the result of a click is consistent before the next event. For other updates they run after the paint. Code should never depend on either; if it must run before paint, it belongs in `useLayoutEffect`.

---

# 8. Reconciler vs renderer: why React "does not write the DOM"

React is split in two layers:

- **The reconciler** (`react-reconciler`, i.e. Fiber) — scheduling, the fiber trees, hooks, reconciliation, the render and commit phases. It has **no idea what a DOM is**.
- **The renderer** — supplies a "host config": a set of functions the reconciler calls during `completeWork` and the commit, such as `createInstance`, `createTextInstance`, `appendChild`, `insertBefore`, `commitUpdate`, `removeChild`.

| Renderer | Host nodes |
|---|---|
| `react-dom` | DOM elements |
| `react-native` | Native views (iOS / Android) |
| `react-three-fiber` | Three.js objects |
| `ink` | Terminal output |
| `react-test-renderer` | Plain JS objects (deprecated in React 19) |

The same `useState`, the same diff, the same effects — only the host config changes. The `react` package itself is tiny: `createElement`/`jsx`, and hooks that **forward to a dispatcher** the reconciler installs while a component is rendering. That is why calling a hook outside a component throws: there is no dispatcher installed.

The `react` / `react-dom` package split dates from **React 0.14 (2015)**; Fiber made the host config the formal boundary.

---

# 9. Lanes, the scheduler and concurrent rendering

## Lanes

Every update gets a **lane**: a bit in a 31-bit mask that encodes its priority. Bitmasks let React merge, compare and select batches of priorities with single operations.

| Lane (simplified) | Typical source |
|---|---|
| `SyncLane` | Discrete input: click, keydown, submit |
| `InputContinuousLane` | Continuous input: mousemove, scroll, drag |
| `DefaultLane` | Updates outside events: a `fetch().then(setState)`, a timer |
| `TransitionLanes` | `startTransition`, `useTransition`, `useDeferredValue` |
| `RetryLanes` | Suspense retrying after data arrives |
| `IdleLane` / `OffscreenLane` | Work nobody is waiting for; hidden `<Activity>` content |

Lanes replaced the older "expiration time" model internally in React 17.

## The scheduler

The `scheduler` package runs React's work in **macrotasks** (posted through a `MessageChannel`, not `setTimeout`, to avoid its 4 ms clamping). Inside a task, the concurrent work loop renders fibers until `shouldYield()` reports that the ~5 ms slice is over, then returns control so the browser can handle input and paint. Sync-lane work is flushed in a **microtask** at the end of the event instead.

## What "concurrent" means in practice

1. The user types; the keystroke is a `SyncLane` update. Rendering the filtered list is wrapped in `startTransition`, so it is a `TransitionLane` update.
2. React renders the transition draft in slices, yielding every ~5 ms.
3. Another keystroke arrives mid-render. React **abandons the half-built draft** — nothing was on screen, so nothing is lost — renders and commits the urgent update first, then restarts the transition from the new current tree.

That is why the render phase must be pure (§5), and why external stores need `useSyncExternalStore`: if a render is sliced and the store changes between slices, different components could read different versions of it — **tearing**. `useSyncExternalStore` detects the change and forces a synchronous re-render.

> [!warning] Concurrent is not parallel
> There is one thread. Concurrent rendering **interleaves** work and can **abandon** it; it never runs two renders at the same time.

> [!important] Concurrency is opt-in, per update
> With `createRoot`, React 18+ **can** interrupt rendering, but only does so for transition-level work (`startTransition`, `useDeferredValue`, Suspense retries). Urgent and default updates still render in one go, without yielding. Fiber made interruption possible in 2017; most apps only started using it with React 18.

---

# 10. Rules of hooks, from the fiber

For a function component, `fiber.memoizedState` is the **first hook** of a linked list. Each `useState`, `useEffect`, `useMemo`, `useRef` call adds or reads one node, **in call order**:

```js
// function Search() {
//   const [query, setQuery] = useState('');      // hook 1
//   const [results, setResults] = useState([]);  // hook 2
//   useEffect(() => { ... }, [query]);           // hook 3
// }

fiber.memoizedState → { memoizedState: '',  queue, next } // hook 1
                    → { memoizedState: [],  queue, next } // hook 2
                    → { memoizedState: effect,     next: null } // hook 3
```

On mount React installs a dispatcher that **creates** nodes; on updates, one that **walks** the existing list one step per hook call. There are no names and no keys — **the only identity a hook has is its position in the list**.

So a hook inside a condition shifts everything after it:

```js
if (query) useEffect(...);   // render 1: query '' → skipped
const [n, setN] = useState(0);
// render 1: the list has one node, useState's
// render 2: query 'so' → useEffect takes slot 1 (useState's node),
//           useState asks for slot 2, which never existed → React throws
```

Depending on the shape, the values land in the wrong hooks or React throws "Rendered more hooks than during the previous render". The rules of hooks — top level only, same order every render — are what a positional linked list requires. `react-hooks/rules-of-hooks` enforces them. `use()` (React 19) is the documented exception: it can be called conditionally because it does not depend on a position in that list.

---

# 11. One update, end to end

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => { document.title = `Count: ${count}`; }, [count]);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

The user clicks:

1. **Event.** React listens at the root container (since React 17; before that, at `document`). The native click becomes a synthetic event and your `onClick` runs.
2. **Update.** `setCount(1)` enqueues an update on hook 1's queue, marks `SyncLane` on the `Counter` fiber and `childLanes` up to the root. Nothing renders yet.
3. **Schedule.** When the handler returns, React flushes the sync work in a microtask. Any other setter called in the same handler is in the same batch.
4. **Render.** `createWorkInProgress` starts the draft from the root. `App` has no pending work → bailout. `Counter` has → React calls it; `useState` processes the queue and returns `1`. The new `<button>` element has the same type as before → reuse the fiber; its text changed → `Update` flag. The effect's deps changed `[0] → [1]` → `Passive` flag.
5. **Commit — mutation.** `react-dom` sets the button's text to `1`.
6. **Swap.** `root.current` now points to the new tree.
7. **Layout.** No layout effects here.
8. **Passive effects.** A click is discrete input, so `document.title` is set synchronously at the end of the commit (§7).
9. **Paint.** The browser recalculates style, layout and paints the frame.

---

# 12. Timeline

| Version | Date | What changed in the model |
|---|---|---|
| 0.3 | May 2013 | Open-sourced. The "virtual DOM" diff is the pitch |
| 0.14 | Oct 2015 | `react` / `react-dom` split — the reconciler no longer assumes a DOM |
| 15 | Apr 2016 | Last version with the **stack reconciler**: recursive, uninterruptible |
| **16** | **Sep 2017** | **Fiber.** Two trees, render/commit phases, resumable work. Also fragments, portals, error boundaries |
| 16.3 | Mar 2018 | `StrictMode`, new context API, lifecycles renamed `UNSAFE_` because the render phase may run more than once |
| 16.6 | Oct 2018 | `React.lazy` and `Suspense` for code splitting, `React.memo` |
| 16.8 | Feb 2019 | **Hooks** — stored as a linked list on the fiber |
| 17 | Oct 2020 | No new features. Events delegated to the root container, new JSX transform, lanes internally |
| **18** | **Mar 2022** | **Concurrent rendering** via `createRoot`: transitions, `useDeferredValue`, automatic batching everywhere, `useSyncExternalStore`, `useId` |
| 19 | Dec 2024 | Actions, `use`, `ref` as a prop, `ReactDOM.render` / `hydrate` removed — `createRoot` is the only client root |
| 19.2 | Oct 2025 | `<Activity>`: hidden subtrees keep their state, unmount their effects and render at low priority; `useEffectEvent` |
| Compiler 1.0 | Oct 2025 | Build-time automatic memoisation. Changes **what** re-renders, not **how** rendering works |

---

# 13. Myths worth correcting out loud

| Myth | What is true |
|---|---|
| "The virtual DOM is faster than the DOM" | A direct, targeted DOM write is faster. The VDOM buys a **declarative** API at a cost. Svelte and Solid compile to direct updates and skip it |
| "React diffs against the real DOM" | It diffs the new elements against the **current fiber tree**. It never reads the DOM to diff |
| "Render means the DOM was updated" | Render = calling components. A render can end with zero DOM mutations |
| "`setState` re-renders immediately" | It enqueues an update; renders are batched and scheduled |
| "Concurrent means multi-threaded" | One thread; work is sliced, interleaved and sometimes thrown away |
| "React has two virtual DOMs it diffs against each other" | Two fiber trees that **swap roles**; the diff happens while building the draft, element by element |
| "Fiber made React faster" | Fiber made React **interruptible** and prioritised. Total work is similar; responsiveness is better |

---

# 14. The interview block

> [!question] Short answer for the interview
> "JSX produces elements — cheap, immutable descriptions created on every render. React keeps persistent **fibers**, one per component or host node, holding props, the hooks list and pending work. Since Fiber in React 16 there are two fiber trees: `current`, which matches the screen, and a `workInProgress` draft, linked through `alternate`. A state update runs a pure **render phase** that calls the components, reconciles their output against the current tree and flags what changed. Since React 18 that phase can be time-sliced and abandoned for transitions. Then a synchronous **commit phase** applies only the flagged mutations through the renderer, `react-dom`, swaps the trees, and runs layout and passive effects. React never reads the DOM to diff, and the reconciler doesn't know what a DOM is — that is why the same core runs React Native."

## The follow-ups the panel will chain

| Follow-up | The answer in one line |
|---|---|
| "Why did React need Fiber?" | The stack reconciler kept progress in the call stack, so it could not pause; Fiber moves it into a linked tree and a pointer |
| "What are the two trees for?" | Double buffering: build the draft off-screen, swap one pointer on commit, throw the draft away if interrupted |
| "Can the commit be interrupted?" | No. Only the render phase; the commit is synchronous so the UI is never half-applied |
| "Why must components be pure?" | The render phase can run several times or be discarded; StrictMode double-calls to expose impurity |
| "Why do keys matter?" | They are the identity of a child across renders; index keys tie state to position |
| "Why the rules of hooks?" | Hooks live in a positional linked list on the fiber; a conditional call shifts every hook after it |
| "What is tearing?" | Different components reading different versions of an external store during a sliced render — fixed by `useSyncExternalStore` |
| "Does the React Compiler change this?" | No. It inserts memoisation at build time so fewer components re-render; rendering itself is unchanged |
| "Where do `useEffect` and `useLayoutEffect` run?" | Layout: in the commit, before paint. Passive: after paint — or synchronously at the end of the commit for discrete input |

## Drill — say these out loud until they are automatic

1. **Elements** are thrown away every render; **fibers** persist and hold the state.
2. React diffs against the **current fiber tree**, never against the DOM.
3. Two trees, **`current` and `workInProgress`**, twins through **`alternate`**, swapped on commit.
4. **Render** is pure and interruptible; **commit** is synchronous and never interrupted.
5. Interruptible since **16 (Fiber, 2017)**, actually interrupted since **18 (concurrent, 2022)** — and only for transitions.
6. `beginWork` going down, `completeWork` going up.
7. Same type → keep and update; different type → destroy and rebuild; **key** = identity.
8. The **reconciler** computes, the **renderer** (`react-dom`) writes.
9. Hooks are a **linked list by position** on `fiber.memoizedState`.
10. Commit order: before mutation → **mutation** → **swap** → **layout** → paint → **passive**.

---

# Still to study

- [ ] Suspense internals: thrown promises / thenables, fallbacks, retry lanes
- [ ] Hydration on fibers: matching server HTML, selective hydration, hydration mismatches in React 19
- [ ] React Server Components: the RSC payload and how the client reconciler consumes it
- [ ] `<Activity>` in depth: what "effects unmounted, state kept" means on the fiber
- [ ] Reading React Compiler output: what the generated cache (`useMemoCache`) looks like
- [ ] Profiling the phases: render vs commit duration in the DevTools Profiler and the Performance panel's React tracks
