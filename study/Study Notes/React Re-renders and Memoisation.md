---
title: React Re-renders and Memoisation
tags:
  - study
  - interview
  - promotion
  - react
  - performance
parent: "[[The Best Notes of the F Word]]"
source: "created after Study Session 05 Q1 (2026-09-14). Closes item 3 of [[Mock Interviews Knowledge Base#Still unanswered across all four sessions — expect them again]]"
---

# React Re-renders and Memoisation

`React.memo`, `useMemo`, `useCallback` — what each one is for, what React actually builds underneath, which design pattern is behind it, when it pays and when it does literally nothing.

Related: [[Mock Interviews Knowledge Base]] · [[Assessment Questions]] · [[Questions for interviews#What is useMemo in React]] · [[Design Patterns#Decorator]]

> [!danger]- 3 things I said wrong on 2026-09-14 (read this first)
> 1. **"memoising everywhere piles up unnecessary microtasks"** → memoisation creates **zero** microtasks. A microtask is a promise reaction, `queueMicrotask` or a `MutationObserver` callback. `React.memo` and `useMemo` are **synchronous work inside the render phase** — same call stack. The real cost is a shallow comparison per prop, a retained closure, and a deps array allocated on every render.
> 2. **"the compile time gets slower"** → runtime cost, not build cost. Nothing about memoisation touches the bundler.
> 3. **"you have to add those props to the dependency array"** about `React.memo` → **`React.memo` has no dependency array.** There is nowhere to put them. It compares *all* props, shallowly, with `Object.is`. The deps array is a **hook** API (`useMemo`, `useCallback`, `useEffect`).
>
> The tell that separates them: **a deps array is something you pass to a hook, from inside the component. `React.memo` wraps the component from the outside — its "deps" are the props, and I do not get to choose them.**

> [!warning] The order to answer this in an interview
> Re-render causes → what `memo` intercepts (and what it does **not**) → reference identity → **measure** → the structural fix that beats memoising. Skipping straight to "I use `React.memo`" is the Mid answer.

---

# 0. First: why does a component re-render at all?

Only three reasons. Everything else reduces to these.

| # | Cause | Does `React.memo` stop it? |
|---|---|---|
| 1 | Its **own** state changed (`useState`, `useReducer`) | ❌ No |
| 2 | Its **parent** re-rendered | ✅ Yes, if props are shallow-equal |
| 3 | A **context** it consumes with `useContext` got a new value | ❌ No |

> [!important] The single most useful sentence about `React.memo`
> **`React.memo` only intercepts renders coming from the parent.** Own state and consumed context go straight through it. If the re-render comes from cause 1 or 3, memoising the component is pure cost.

Three more facts that belong here:

- **Re-render ≠ DOM update.** A render is React calling the function and diffing the result (reconciliation). If the output is the same, the **commit** touches nothing in the DOM. A "wasted render" costs JS time, not layout and paint — that is a different layer ([[Mock Interviews Knowledge Base#Scrolling is janky. Layout and paint dominate the frame. What is happening and how do you fix it?]]).
- **Setting state to the same value bails out**, compared with `Object.is` — but React may still render the component **once** before it notices. It does not go deeper into the tree.
- **A parent re-render renders the whole subtree by default.** That is normal and usually cheap. It is not a bug to fix pre-emptively.

---

# 1. `React.memo`

## What it is for

Skip the re-render of a subtree when the parent re-rendered but **nothing that subtree depends on changed**.

## What it generates underneath

`React.memo(Component)` does **not** return a wrapper component that renders your component. It returns a plain object that the reconciler recognises as a special element type:

```js
// conceptually what React.memo returns
{
  $$typeof: Symbol.for('react.memo'),
  type: MyComponent,   // the real component
  compare: null        // or the areEqual function, if I passed one
}
```

At render time the reconciler sees that type and, before rendering `type`, compares previous props with next props:

- default comparison = **shallow equality**: same set of keys, and `Object.is(prev[k], next[k])` for every key.
- all equal → React **bails out**: it reuses the last rendered output and does not call the function at all.
- one key different → normal render.

> [!info]- Internals (implementation detail, not API — do not quote as if it were documented)
> The reconciler handles this in `updateMemoComponent` / `updateSimpleMemoComponent`, and the skip goes through `bailoutOnAlreadyFinishedWork`. The "simple" path is used when the inner component is a plain function with no `defaultProps`. **Never rely on this in an answer** — say "it bails out of the subtree", that is the documented behaviour.

## Which design pattern it is

**Decorator** — it takes a component and returns the same component with one behaviour added, without modifying it. Already written in [[Design Patterns#Decorator]] ("the HOCs of React, `React.memo`"). Functionally it also acts as a **gatekeeper / guard**: it decides whether the call happens at all. The cache itself is **memoisation**, which is not a GoF pattern — it is the cache-aside idea applied to a function call.

## The second argument

```jsx
const Row = React.memo(RowBase, (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id
      && prevProps.item.updatedAt === nextProps.item.updatedAt;
});
```

> [!warning] The trap in the second argument
> `areEqual` returns **`true` = "they are equal, skip the render"**. It is the **inverse** of the old `shouldComponentUpdate`, which returned `true` = "yes, render". Getting this backwards silently freezes the UI.
>
> And a custom comparator is usually a smell: if I need a deep comparison to make the memo hold, the real problem is the **shape of the props**, not the comparison.

> [!info]- The class-component relatives: `shouldComponentUpdate` and `PureComponent`
> `shouldComponentUpdate(nextProps, nextState, nextContext)` is a **lifecycle method of class components** — the only bailout that existed before hooks. Returning `false` skips `render()` and the whole subtree. It is **not** called on mount, and **not** called after `forceUpdate()`. It is **not deprecated** (the deprecated ones are `componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate`).
>
> | API | `true` means |
> |---|---|
> | `shouldComponentUpdate` | **render** |
> | `React.memo`'s `areEqual` | **equal → skip** |
>
> `React.PureComponent` implements `shouldComponentUpdate` as a shallow compare of **props *and* state**. `React.memo` is the function equivalent but **props only** — it cannot compare hook state, which is the mechanical reason why it never blocks a re-render caused by the component's own `useState` (§0, cause 1).
>
> **There is no hook version.** No `useShouldComponentUpdate` exists; in function components the only lever is `React.memo`, from the outside.
>
> Two footguns: a deep comparison inside `shouldComponentUpdate` costs more than the render it avoids; and mutating state in place (`this.state.list.push(x)`) with `PureComponent` makes the shallow compare see the same reference and the update never happens.

## When it does genuinely nothing

| Situation | Why the memo is dead | Code |
|---|---|---|
| A prop is an **inline arrow** `onSelect={() => …}` | New function reference on every parent render | [[#1 — Inline arrow\|→ example 1]] |
| A prop is an **object or array literal** `config={{ a: 1 }}`, `items={[…]}` | New reference every render | [[#2 — Object, array and style literals\|→ example 2]] |
| `style={{ margin: 8 }}` | Same — object literal | [[#2 — Object, array and style literals\|→ example 2]] |
| A prop **value** is `new Date()`, `data.filter(…)`, `{ ...rest }` | New reference every render | [[#2 — Object, array and style literals\|→ example 2]] · [[#8 — JSX spread — NOT a dead memo\|→ 8]] |
| It receives **`children`** | JSX creates a **new element object** each render, so `children` never compares equal | [[#3 — The children prop\|→ example 3]] |
| The re-render comes from its **own state** | `memo` only intercepts the parent (cause 1 of §0) | [[#4 — Own state\|→ example 4]] |
| The re-render comes from a **context** it consumes | `memo` does not intercept context (cause 3 of §0) | [[#5 — Context\|→ example 5]] |
| The component is **trivial** (a `<span>`, a badge) | The comparison costs more than the render | [[#6 — Trivial component\|→ example 6]] |
| The parent **remounts it** (`key` changed) | Nothing survives an unmount | [[#7 — Remount by key\|→ example 7]] |

## The same table, as code

### 1 — Inline arrow

```jsx
const Row = React.memo(RowBase);

function List({ items }) {
  const [query, setQuery] = useState('');

  return items.map(item => (
    <Row
      key={item.id}
      item={item}
      // ❌ DEAD MEMO — inline arrow.
      //    A new function object is created on every render of List.
      //    React.memo compares with Object.is, and (() => {}) is never
      //    Object.is-equal to another (() => {}). The memo can NEVER hold.
      onSelect={() => select(item.id)}
    />
  ));
}
```

```jsx
// ✅ FIX — one stable handler for every row; the row sends its own id back.
const onSelect = useCallback(id => select(id), []);   // [] → same reference for ever
// …
<Row key={item.id} item={item} onSelect={onSelect} />

// Inside RowBase, <button onClick={() => onSelect(item.id)}> is perfectly fine:
// that arrow goes to a DOM node, not to a memoised component.
```

> [!important] A dead memo is not a bug — it is dead code that looks like an optimisation
> With the inline arrow, `onSelect` **works perfectly**: React compares the props, sees a different function, and renders the row exactly as it would without the memo. Correct output, every time. The only thing lost is the benefit that was assumed.
>
> And the direction that really matters: **the inline arrow is the version that is always correct**, because it closes over the current render's `item`, props and state. The memoised version is the one that can be wrong:
>
> ```jsx
> const [count, setCount] = useState(0);
>
> // ❌ REAL bug — the deps lie. The closure captured count = 0 on the first
> //    render and useCallback keeps returning that stale function for ever.
> const onSelect = useCallback(id => select(id, count), []);
>
> // ✅ declare what it reads…
> const onSelect = useCallback(id => select(id, count), [count]);
> // …but now the reference changes whenever count does, so the memo downstream
> //    only holds while count is stable. That is the real trade-off.
> ```
>
> | Version | Correct? | Fast? |
> |---|---|---|
> | Inline arrow, no memo | ✅ always | usually fine |
> | Inline arrow + `React.memo` | ✅ always | the memo is dead weight |
> | `useCallback` + `React.memo`, deps right | ✅ | ✅ when the props are genuinely stable |
> | `useCallback` with missing deps | ❌ **stale closure** | — |
>
> Same shape for a custom `areEqual`: too narrow a comparison and the UI stops updating — a real bug, invisible in review. This is why `exhaustive-deps` is non-negotiable: hand-memoising is the only option here that can put a wrong screen in front of a user.
>
> **Interview line:** *"memoisation is never a correctness tool — removing every `useMemo` and `useCallback` from a codebase has to leave the behaviour identical. If it does not, the code was already broken."* Which is also why the React Compiler can do it automatically: it is a pure optimisation layer.


### 2 — Object, array and style literals

```jsx
function Dashboard({ data }) {
  return (
    <Chart
      // ❌ DEAD MEMO — object literal: new reference every render.
      options={{ legend: true, height: 240 }}
      // ❌ .filter() always returns a NEW array, even when the result is identical.
      series={data.filter(d => d.visible)}
      // ❌ the most invisible one of all: the inline style object.
      style={{ marginTop: 8 }}
    />
  );
}
```

```jsx
// ✅ FIX — constants leave the component, derived data gets useMemo.
const OPTIONS = { legend: true, height: 240 };   // hoisted → one reference for ever
const STYLE   = { marginTop: 8 };

function Dashboard({ data }) {
  const series = useMemo(() => data.filter(d => d.visible), [data]);
  return <Chart options={OPTIONS} series={series} style={STYLE} />;
}
```

### 3 — The children prop

```jsx
const Panel = React.memo(PanelBase);

function Page() {
  const [tick, setTick] = useState(0);

  return (
    // ❌ DEAD MEMO — children.
    //    <Heavy /> is React.createElement(Heavy, null): a NEW object on every
    //    render of Page. It arrives as props.children, so the shallow compare
    //    fails on that key alone, even though nothing about Heavy changed.
    <Panel title="Stats">
      <Heavy />
    </Panel>
  );
}
```

> [!tip] The nuance of this one
> The problem is not `children` itself — it is that **`Page` re-renders**. If the element is created by a component that does **not** re-render, that reference survives and the memo holds. That is exactly the trick in [[#5. What beats memoising (the senior half of the answer)]]: pass the heavy part as `children` from **above** the component that owns the changing state, and the win arrives **with no memo at all**.

### 4 — Own state

```jsx
// ❌ DEAD MEMO — the re-render comes from INSIDE (cause 1 of §0).
const Clock = React.memo(function Clock() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // memo compares props… and there are no props. This re-renders every second
  // regardless. The wrapper is pure cost.
  return <span>{new Date(now).toLocaleTimeString()}</span>;
});
```

### 5 — Context

```jsx
// ❌ DEAD MEMO — context (cause 3 of §0).
const Avatar = React.memo(function Avatar() {
  // React.memo does NOT intercept context. Any new value in AuthContext
  // re-renders this component, memoised or not.
  const { user } = useContext(AuthContext);
  return <img src={user.avatarUrl} alt="" />;
});
// The real fix is not memo: split the context, or use a store with selectors.
```

### 6 — Trivial component

```jsx
// ❌ DEAD MEMO — trivial component.
//    Rendering a <span> takes microseconds. The shallow compare, the extra
//    fiber and the retained reference cost more than the render being skipped.
const Badge = React.memo(({ label }) => <span className="badge">{label}</span>);
```

### 7 — Remount by key

```jsx
// ❌ DEAD MEMO — the parent remounts it.
//    A changing key destroys the fiber: memo cache, state and effects die
//    with it. There is nothing left to compare against.
<Row key={`${item.id}-${renderCount}`} item={item} />

// Other half of the same trap: an index key on a list that reorders.
// React reuses the wrong fiber, so state and memo land on the wrong row.
<Row key={index} item={item} />
```

### 8 — JSX spread — NOT a dead memo

```jsx
// ⚠️ The case everybody gets wrong.
//    JSX spread is not an object-literal prop: React spreads the KEYS onto
//    props, and the shallow compare looks at each key, never at the identity
//    of the object being spread. So this holds fine when the values are stable:
<Row {...rest} />

// ❌ This one IS dead: here the object is the prop VALUE, so its identity is
//    what gets compared — and it is brand new on every render.
<Row config={{ ...rest }} />
```


## When it pays

- **Stable props** plus an **expensive subtree**: large table rows, charts, editors, canvases, virtualised list items.
- A list of N items where one changes and the other N−1 receive identical props.
- The component sits under a parent that re-renders very often (a timer, a cursor position, a controlled text input).

## Example — the case that fails, and the fix

```jsx
// ❌ the memo never holds: three new references per render
function Parent() {
  const [query, setQuery] = useState('');
  return (
    <ExpensiveTable
      rows={rows.filter(r => r.active)}   // new array
      onSort={() => sort()}               // new function
      style={{ marginTop: 8 }}            // new object
    />
  );
}
const ExpensiveTable = React.memo(TableBase);
```

```jsx
// ✅ the fix lives in the PARENT, not in the memoised child
const STYLE = { marginTop: 8 };                       // hoisted: same reference for ever

function Parent() {
  const [query, setQuery] = useState('');
  const activeRows = useMemo(() => rows.filter(r => r.active), [rows]);
  const onSort     = useCallback(() => sort(), []);
  return <ExpensiveTable rows={activeRows} onSort={onSort} style={STYLE} />;
}
```

> [!tip] Say this out loud
> **The fix for a broken memo is never inside the memoised component. It is in whoever hands it the props.**

---

# 2. `useMemo`

## What it is for

Two different jobs, and mixing them up is why the hook gets misused:

1. **Skip an expensive calculation** between renders.
2. **Keep a stable reference** so that something downstream can compare it — a memoised child, a deps array, a context value. **This is the more common legitimate use.**

## What it generates underneath

No wrapper, no component, no queue. Hooks live as a **linked list of hook objects on the fiber** (`fiber.memoizedState`), one node per hook call, **in call order** — that is the whole reason for the rules of hooks.

The `useMemo` node stores a tuple:

```js
hook.memoizedState = [value, deps];
```

On the next render React walks to the same position in the list and compares deps **element by element with `Object.is`** (`areHookInputsEqual`). All equal → return the stored `value`. Any different → run the factory again, store the new pair.

So the cost of a `useMemo` that never recomputes is still: one array allocated, N `Object.is` calls, one closure kept alive. Small, but not zero — and **not** a microtask, **not** async, **not** build time.

> [!warning] `useMemo` is not a semantic guarantee
> React documents that it **may throw the cached value away** (for example for off-screen content). Code must stay correct if the factory runs again. Never put a side effect, a subscription, a fetch or an ID generator inside `useMemo`.

## Which design pattern it is

**Memoisation** (function-result caching), the same family as the `single-flight` note in [[Design Patterns#Single-flight]] — there the cache holds a promise in flight, here it holds a value while the deps do not change. Not GoF. The GoF neighbour is **Proxy** in its caching variant: same interface, an interception in front.

## When it does nothing

| Situation                                                                              | Why                                                        | Code                                                 |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| The calculation is cheap (`a + b`, a 20-item `.map`)                                   | The hook costs more than the work                          | [[#1 — Cheap calculation\|→ example 1]]              |
| The result is a **primitive** used only for display                                    | There is no reference to stabilise, and the maths was free | [[#2 — Primitive with no identity\|→ example 2]]     |
| The deps change on **every** render                                                    | It recomputes always, plus the comparison cost             | [[#3 — Deps that change every render\|→ example 3]]  |
| The value exists **only** for referential stability and nothing downstream compares it | No memoised child, no deps array, no context value         | [[#4 — Nothing downstream compares it\|→ example 4]] |
| The component re-mounts constantly                                                     | The cache dies with the fiber                              | [[#5 — The component remounts\|→ example 5]]         |
| —                                                                                      | Two shapes that **look** useless and are not               | [[#6 — Looks useless but is not\|→ example 6]]       |
| —                                                                                      | The one that is an actual bug, not dead weight             | [[#7 — The one that is a real bug\|→ example 7]]     |

## The same table, as code — useMemo

### 1 — Cheap calculation

```jsx
// ❌ THEATRE — the hook costs more than the work it saves.
const total = useMemo(() => price * qty, [price, qty]);
const label = useMemo(() => `${first} ${last}`, [first, last]);
const upper = useMemo(() => tags.map(t => t.toUpperCase()), [tags]); // 20 items

// What each one really costs on EVERY render:
//   · one array allocated for the deps        [price, qty]
//   · one Object.is call per dep
//   · one closure kept alive on the fiber
// …to avoid a multiplication, which is free.

// ✅
const total = price * qty;
```

> [!tip] The rule of thumb
> If I cannot name roughly how many milliseconds the calculation takes, it is not expensive enough to memoise. Sorting 10.000 rows, parsing, building an index, a regex over a big string: yes. Arithmetic, a template string, a small `.map`: no.

### 2 — Primitive with no identity

```jsx
// ❌ a number has no identity to protect.
const count = useMemo(() => items.length, [items]);

// Primitives compare by VALUE: 3 is Object.is-equal to 3, always, for ever.
// No child, no deps array and no Object.is can ever be "broken" by a new number.
// The only reason to memoise a primitive is that the CALCULATION is expensive.

// ✅
const count = items.length;
```

### 3 — Deps that change every render

```jsx
// The parent writes the prop inline:  <Report filters={{ from, to }} />
function Report({ filters }) {
  // ❌ `filters` is a NEW object on every render of the parent, so the dep
  //    never matches: expensiveQuery runs on every single render anyway.
  //    Net result = the full cost of the calculation + the cost of the hook.
  const rows = useMemo(() => expensiveQuery(filters), [filters]);
  // …
}
```

```jsx
// ✅ FIX A — depend on primitives, not on the object.
const rows = useMemo(() => expensiveQuery({ from, to }), [from, to]);

// ✅ FIX B — stabilise at the source, in the parent.
const filters = useMemo(() => ({ from, to }), [from, to]);
<Report filters={filters} />
```

> [!warning] How to spot it without a profiler
> A `useMemo` whose deps contain an **object, array or function built inside a render** is almost always recomputing every time. Read the deps array first, not the factory.

### 4 — Nothing downstream compares it

```jsx
function Page({ data }) {
  // The filter is cheap, and `rows` goes to a component that is NOT memoised,
  // sits in no deps array and is not a context value.
  // ❌ nothing in the app ever compares this reference → the hook buys nothing.
  const rows = useMemo(() => data.filter(d => d.visible), [data]);

  return <Table rows={rows} />;   // Table re-renders with Page regardless
}
```

> [!important] The precision that matters here
> `useMemo` has **two** jobs: saving an expensive calculation, and keeping a stable reference. This row is only about the second one. If the calculation is genuinely expensive, `useMemo` pays **even when the child is not memoised** — the work is skipped either way. It is dead only when the hook exists *purely* for an identity that nobody reads.

### 5 — The component remounts

```jsx
// ❌ the key changes on every render → React unmounts and mounts a new fiber.
//    Hook state lives on the fiber, so the useMemo cache inside Card is
//    created and thrown away every time. Same for its state and its effects.
{items.map(item => <Card key={`${item.id}-${Date.now()}`} item={item} />)}

// Same effect, different cause: a route or a modal that remounts the subtree,
// or a conditional parent that swaps the component type.
```

### 6 — Looks useless but is not

```jsx
// ✅ NOT dead — the value goes into a deps array.
//    Without useMemo, `range` is new every render and the effect re-runs for ever.
const range = useMemo(() => ({ from, to }), [from, to]);
useEffect(() => { fetchStats(range); }, [range]);

// ✅ NOT dead — a context value.
//    Without useMemo, EVERY consumer of AuthContext re-renders on every
//    render of the provider, memoised or not.
const value = useMemo(() => ({ user, logout }), [user, logout]);
<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
```

### 7 — The one that is a real bug

```jsx
// ❌ NOT dead weight — genuinely broken. React documents that it MAY throw the
//    cached value away, so the factory can run again at any moment.
const id = useMemo(() => crypto.randomUUID(), []);       // may change under my feet
const socket = useMemo(() => new WebSocket(url), [url]); // a side effect during render

// ✅ an identity that must survive → useRef / lazy useState
const idRef = useRef(null);
if (idRef.current === null) idRef.current = crypto.randomUUID();
const [id2] = useState(() => crypto.randomUUID());

// ✅ a connection, a subscription, anything with cleanup → useEffect
useEffect(() => {
  const socket = new WebSocket(url);
  return () => socket.close();
}, [url]);
```

> [!important] Same principle as in §1
> Removing every `useMemo` from a codebase must leave the behaviour **identical**. If something breaks, that `useMemo` was doing a job it should never have had — holding an identity, or running a side effect. That is the line between "dead weight" (rows 1–5) and "a bug" (this one).


## When it pays

- Real computation: sorting or grouping thousands of rows, parsing, building an index, a heavy `reduce`, a regex over a big string.
- **Referential stability** for: a memoised child's prop, another hook's deps array, a **context value**.

```jsx
// ✅ the classic that actually matters: a context value
const value = useMemo(() => ({ user, logout }), [user, logout]);
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// without useMemo, EVERY consumer re-renders on every provider render
```

```jsx
// ✅ real computation, measured first
const sorted = useMemo(
  () => [...rows].sort((a, b) => collator.compare(a.name, b.name)),
  [rows]
);
```

```jsx
// ❌ theatre
const total = useMemo(() => price * qty, [price, qty]);
const label = useMemo(() => `${first} ${last}`, [first, last]);
```

---

# 3. `useCallback`

## What it is for

Keep the **same function reference** across renders. Nothing else.

```js
useCallback(fn, deps)  ===  useMemo(() => fn, deps)
```

Already written in [[Questions for interviews#What is useMemo in React]]. Underneath it is the **same hook slot mechanism** as `useMemo`; the only difference is that the stored value is the function itself instead of the result of calling it.

> [!important] The mechanical detail that people miss
> The arrow function **is still created on every render** — it is allocated and then thrown away when the deps match. `useCallback` does not prevent the allocation; it prevents the **new reference from being handed to anyone**. Which is exactly why wrapping everything in `useCallback` is not free and not "more efficient by default".

## When it pays

- The function is a prop of a **memoised** child.
- The function is in the **deps array** of a `useEffect`, `useMemo` or a custom hook (otherwise the effect re-runs every render).
- The function is registered manually (`addEventListener`, an observer, a subscription) and must be the same reference to be removed.
- It goes inside a **context value**.

## When it does nothing

- Passed to a **DOM element**: `<button onClick={handler}>` — the DOM node is reused, React only swaps the stored handler. No benefit.
- The child is not memoised.
- The deps change every render anyway.
- The function is only called locally inside the component.

---

# 4. The reference-identity table (the root of all of this)

`Object.is` compares **references** for objects, functions and arrays. In JS, every literal written inside the render body is a **new reference every render**.

| Written inside the component | New reference each render? |
|---|---|
| `() => …`, `function () {}` | ✅ yes |
| `{ a: 1 }`, `[1, 2]` | ✅ yes |
| `<Child />` (that is, `children`) | ✅ yes — an element is an object |
| `arr.map(…)`, `arr.filter(…)`, `{...props}` | ✅ yes |
| `new Date()`, `new Set()` | ✅ yes |
| `'text'`, `42`, `true`, `null` | ❌ no — primitives compare by value |
| A constant hoisted **outside** the component | ❌ no |

> [!tip] Cheapest fix first
> Before reaching for `useMemo`, check whether the value can simply **live outside the component**. A hoisted constant has the same reference for ever, costs nothing, and needs no hook.

---

# 5. What beats memoising (the senior half of the answer)

Blanket memoisation usually **hides** the real cause: state is too high in the tree, or one context is too fat. Structural fixes first.

**a) Move the state down.** Isolate the state in the smallest component that needs it, so the expensive siblings never render.

**b) Lift content up / pass it as `children`.** A component that re-renders does **not** re-render the elements it received as props — they were created by the parent, so their reference did not change.

```jsx
// ❌ Expensive re-renders on every tick
function Timer() {
  const [n, setN] = useState(0);
  return <div>{n}<Expensive /></div>;
}

// ✅ Expensive is created by the parent, passed as children, never re-renders
function Timer({ children }) {
  const [n, setN] = useState(0);
  return <div>{n}{children}</div>;
}
<Timer><Expensive /></Timer>
```

> [!info] The pattern behind this one
> This is **composition / inversion of control** — the same principle as [[Design Patterns#Dependency inversion vs dependency injection vs inversion of control]] and [[Assessment Questions#Why is composition better than inheritance in React?]]. It removes the re-render **without any memoisation at all**. Bringing this up is what separates the Senior answer from the Mid answer.

**c) Split the context.** One context for the rarely-changing value, another for the frequently-changing one. Context has no selectors: any change re-renders **every** consumer ([[Assessment Questions#Why do we need a state container like Redux, if React has state and Context?]]).

**d) Use a store with selectors** (Redux `useSelector`, Zustand) when the state is genuinely global: the subscription is fine-grained, so only the components reading that slice re-render.

**e) Virtualise the list.** For thousands of rows the answer is not memoising 5.000 rows, it is rendering 20 ([[Assessment Questions#A component with thousands of rows — how do you avoid the performance problem?]]).

**f) Stable `key`s.** An index key or a random key forces remounts and destroys every memo underneath.

---

# 6. How I prove the memo is paying for itself

> [!important] The process, not the trick
> **Measure → find the phase → change one thing → measure the same interaction again → write the number in the PR.**

1. **React DevTools → Profiler.** Record the interaction. Read **commit duration** and the flame chart: grey = did not render, coloured = rendered.
2. **Profiler settings → "Record why each component rendered".** It labels each one: *props changed / hook changed / parent rendered / context changed*. This is what turns an opinion into evidence, and it tells me **which of the three causes** I am fighting.
3. **Production build.** Dev numbers are inflated and `StrictMode` renders twice on purpose. A "win" measured in dev is not a win.
4. **The user-facing metric is INP**, not render count. Chrome DevTools → Performance, long tasks. A render that nobody waits for is not a problem.
5. The programmatic route when I need numbers in CI: the `<Profiler>` component and its `onRender(id, phase, actualDuration, baseDuration)` callback.

> [!question] What "it paid for itself" means
> Not "fewer components re-render". It means **commit duration for that interaction dropped, in a production build, measurably** — and that a user could feel it. If I cannot show a before and an after, the memo is speculation.

---

# 7. React 19 and the Compiler

- **React 19 makes `ref` a normal prop** (no `forwardRef` needed), so `ref` now travels inside the props object.
- **React Compiler** memoises automatically at build time: it analyses the component and inserts the caching where it is actually needed. In a codebase with the compiler on, **hand-written `useMemo`/`useCallback`/`React.memo` are mostly noise** — and a codebase memoised by hand everywhere becomes debt to remove.
- Automatic **batching** (since React 18): several `setState` in the same tick produce **one** render, including inside promises and timeouts. Half of the "unnecessary renders" people memoise against no longer exist.

---

# 8. The interview block

> [!question] Short answer for the interview (2–4 sentences, memorise)
> "`React.memo` shallow-compares props with `Object.is`; `useMemo` caches a value while its deps are equal; `useCallback` is `useMemo(() => fn, deps)`. They do nothing when a prop is a new reference on every render — an inline callback, an object literal, `children` — or when the re-render comes from the component's own state or from context, because `memo` only blocks parent-driven renders. So before memoising I profile the interaction in the DevTools Profiler on a production build and check whether commit time is really the problem; usually the better fix is moving the state down, passing the heavy part as `children`, or splitting the context. If the memo stays, I show the before and after commit duration for the same interaction."

## The follow-ups the panel will chain

| Follow-up | The answer in one line |
|---|---|
| "You wrap the callback in `useCallback`. Does the memo hold now?" | Not if it also gets `children`, an object literal, or if the `useCallback` deps change anyway |
| "A context value changes. Does `React.memo` help the consumers?" | No. `memo` does not intercept context — split the context or use selectors |
| "What does `React.memo` compare?" | All props, shallowly, `Object.is` per key. **No deps array exists** |
| "What does the second argument return to skip the render?" | `true` = equal = skip. The inverse of `shouldComponentUpdate` |
| "Is `useMemo` a guarantee?" | No. React may discard the cache; the code must stay correct if it recomputes |
| "Cost of memoising everything?" | Comparisons and allocations on every render, retained memory, stale-deps bugs, and it hides the real structural cause |
| "Wasted renders — is that jank?" | Different layer. Render/commit is React; layout and paint are the browser below it |

## Drill — say these out loud until they are automatic

1. Three causes of a re-render: **own state · parent · context**.
2. `React.memo` blocks **only the parent** one.
3. `memo` compares **props, shallow, `Object.is`, no deps array**.
4. `children` is **always** a new reference.
5. `useCallback(fn, deps)` **=** `useMemo(() => fn, deps)`.
6. The fix for a dead memo lives **in the parent**.
7. Memoisation is **synchronous render work** — no microtasks, no build cost.
8. First fix is **structural** (state down, `children`, split context), memoisation second.
9. Proof = **Profiler, production build, same interaction, before and after**.

---

# 9. Still to study from here

- [ ] `useDeferredValue` and `startTransition` — the React 18 priority model, and how they differ from memoising ([[Mock Interviews Knowledge Base#Still unanswered across all four sessions — expect them again]]).
- [ ] The rules of hooks explained **from the linked list on the fiber**, not as a rule to obey.
- [ ] Reconciliation and `key`: why an index key breaks state and every memo under it.
- [ ] React Compiler: what it memoises and what it refuses to memoise.
- [ ] `<Profiler>` API and rendering metrics in CI.
