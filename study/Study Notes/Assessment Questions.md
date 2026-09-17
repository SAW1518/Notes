---
title: Assessment Questions
tags:
  - study
  - interview
  - promotion
  - javascript
  - react
  - management
parent: "[[The Best Notes of the F Word]]"
source: SMT assessment session transcript
---

# Assessment Questions

These are the questions of a promotion assessment session (SMT). There were 4 experts and 45 questions.
Related: [[Questions for interviews]] · [[The Best Notes of the F Word]] · [[Mock Interviews Knowledge Base]]

> [!danger]- 7 answers that were wrong or incomplete (read this first)
> 1. **The promises do NOT go to the callback queue.** They go to the **microtask queue**. The answer mixed the two queues.
> 2. **The question about microtask vs macrotask was never answered.** The word "macrotask" was said two times, one of them for the microtask, and it never said which one has the priority. **The microtasks win.**
> 3. **A Service Worker is not the same as a Web Worker.** To move a heavy calculation out of the main thread we use a **Web Worker**. A service worker is for the network and the cache.
> 4. **React DOES escape by default.** The answer said that React has a weak built-in security. JSX escapes everything automatically; the only danger is `dangerouslySetInnerHTML`.
> 5. **The hooks came in React 16.8**, not in React 16.
> 6. **Scrum: we do not "restart the sprint from zero".** Only the **Product Owner** can cancel a sprint, and only if the Sprint Goal is not valid any more.
> 7. **"Next.js has SSL built in"** → it is **SSR**, not SSL.

> [!note] How to read this
> Every question has the answer that was given in the session, cleaned up. When something was wrong or missing, there is a correction callout below it.

---

# 1. Technical — JavaScript & React

## How does the event loop work in JavaScript?

JavaScript is single-threaded and it has only **one call stack**. When it reads the code, every call of a function is put in the stack as a **frame**, and when a function calls another one, the new frame goes on top.

But this does not explain how a language with one thread can do many things at the same time. For that we have to look at the **context** where JS runs, not only at the language:

1. In the browser, the **Web APIs** are the ones that do the concurrent work (timers, network, geolocation).
2. When we call something like `setTimeout`, the call goes to the stack and the job is given to the Web API. The stack continues normally.
3. When the Web API finishes, it puts a message in a **queue**.
4. When the stack is **empty**, the event loop takes the message from the queue and puts it in the stack.

> [!info] The full explanation with the diagram
> [[The Best Notes of the F Word#Everything together: how JS runs the code]]

## Microtasks vs macrotasks: what is the difference and which one has priority?

- **Macrotask** (or only "task"): `setTimeout`, `setInterval`, `setImmediate`, I/O, UI events like `click` and `scroll`.
- **Microtask**: `.then()`, `.catch()`, `.finally()`, `await`, `queueMicrotask`, `MutationObserver`.

**The microtask queue has the priority.** When the current task finishes, the event loop empties **all** the microtask queue — including the new microtasks created in that moment — and only then it takes **one** macrotask. The microtasks also run **before** the browser paints.

```js
console.log("1");
setTimeout(() => console.log("2"), 0);   // macrotask
Promise.resolve().then(() => console.log("3"));  // microtask
console.log("4");

// 1, 4, 3, 2
```

> [!danger] This answer was wrong in the session
> The answer said *"macrotasks will be handled right after the current virtual machine task... while **macrotasks** will wait"* — the word **macrotask** was used for the two, so they got mixed. And the direct question ("which one has the priority?") was never answered.
> **The answer they wanted: the microtask queue, and it is emptied completely before the next macrotask.**

> [!question] Short answer for the interview
> "The microtasks have the priority. After every task the event loop empties all the microtask queue — including the ones created while it is emptying it — and only then it takes one macrotask. This is why a promise always runs before a `setTimeout(0)`."

## How do promises work in this context?

A promise represents a value that is not ready yet. When it settles, its callbacks (`.then`, `.catch`, `.finally`) go to the **microtask queue**, so they run before any `setTimeout`.

Inside, the promise can use a Web API (a timer, a network request) — that part does not matter for the queue. The important thing is that **the reaction is always a microtask**.

> [!danger] Correction
> The answer of the session said that the promises are *"placed into the callback queue"* and that they *"use the callback queue as well"*. That is the **task queue**, and it is wrong. The reactions of a promise always go to the **microtask queue**. It is the same confusion as in the previous question.

> [!info] More detail
> [[The Best Notes of the F Word#How do promises work?]]

## How does the event loop work in Node.js?

The idea is the same — one thread, call stack, queues — but the asynchronous work is not done by the Web APIs of the browser. It is done by **libuv** (C/C++) and the thread pool.

The important difference is that the event loop of Node runs in **phases**, in this order:

| Phase | What runs there |
|---|---|
| **timers** | `setTimeout`, `setInterval` |
| **pending callbacks** | some system callbacks |
| **poll** | I/O (reading files, sockets) |
| **check** | `setImmediate` |
| **close callbacks** | `socket.on("close")` |

Between **every** phase Node empties first `process.nextTick()` and then the microtasks (the promises).

> [!warning] What was missing
> The answer of the session only said "similar, but the APIs are C++ libraries". That is true, but it does not answer what they were asking: the **phases**, `setImmediate` vs `setTimeout`, and that `process.nextTick` has more priority than the promises.

## What are hooks in React, and what problem do they solve?

The hooks allow us to use the state and other features of React inside a **function component**, without writing a class.

They solve two problems:

1. **Reuse of the logic.** Before the hooks we had to use HOCs (higher order components) and render props, and this created the "wrapper hell". A custom hook extracts the logic without touching the tree of components.
2. **Separation of concerns.** The logic that is related stays together, instead of being divided between `componentDidMount`, `componentDidUpdate` and `componentWillUnmount`.

Good things to extract in a custom hook: the fetch logic, DOM measurements, subscriptions, forms.

> [!danger] Correction: React 16.8
> The answer said "React 16, I believe". The hooks arrived in **16.8** (February 2019). It is the same mistake as in [[Questions for interviews#What is a Hook in React]].

## What are the most used built-in hooks?

`useState` and `useEffect`.

- **`useState`** creates a local state and updates it in a way that the render algorithm can detect.
- **`useEffect`** runs a callback after the render, when the values of the dependency array change.

> [!warning] "useState is asynchronous" — careful with this phrase
> The answer of the session said that `useState` is asynchronous. It is not asynchronous like a promise. What really happens is:
> - React **groups** the updates (batching) and re-renders only one time.
> - The state variable is a **constant of that render**. If we read it just after calling the setter we get the old value because of the **closure**, not because of a timer.
>
> ```js
> const [n, setN] = useState(0);
> setN(n + 1);
> console.log(n);   // still 0 — this is the closure, not async
> ```
> If the new value depends on the old one, we use the function form: `setN(prev => prev + 1)`.

## useEffect vs useLayoutEffect: what do you mean by "execution time"?

- **`useEffect`** runs **after** the browser paints. It does not block the paint.
- **`useLayoutEffect`** runs after React writes in the DOM but **before** the paint, so the layout is already calculated and we can measure. It **blocks** the paint.

So `useLayoutEffect` is the correct place for DOM measurements, or for DOM changes that would produce a visible jump.

> [!tip] Rule
> If the user can see a flicker, use `useLayoutEffect`. For everything else, `useEffect`.

## Which lifecycle methods does useEffect replace?

| Class component | Function component |
|---|---|
| `componentDidMount()` | `useEffect(() => {...}, [])` |
| `componentDidUpdate()` | `useEffect(() => {...}, [deps])` |
| `componentWillUnmount()` | the **return** function inside `useEffect` |

> [!danger] This was a gap in the session
> The answer was *"I'm unfortunately not so familiar with the class components and the lifecycle names"*, and only "updated" was said. The three names are `componentDidMount`, `componentDidUpdate` and `componentWillUnmount`.
> The answer also mixed one thing at the end: the **cleanup** (the function that we return) is the one that runs on unmount — the empty array `[]` is what makes it run **only** at the unmount, instead of after every render.
> This is already correct in [[The Best Notes of the F Word#Which methods replace useEffect]] — it was only not remembered under pressure.

## Explain the dependency array

The array tells React **which values** re-run the effect.

- `[]` → it runs **once**, after the mount.
- `[a, b]` → it runs when `a` or `b` change.
- no array → it runs after **every** render.

> [!warning] They are values, not only props
> The answer of the session repeated "props" all the time. The dependencies are **any reactive value** used inside the effect: props, state, context, and the values derived from them.

## What happens if we ignore the dependency array?

It produces bugs, normally stale closures, where the effect keeps reading old values of the props or the state.

React has an ESLint rule for this, `react-hooks/exhaustive-deps`, that warns us when a value used inside the effect is not in the array.

## Compare PropTypes, Flow and TypeScript

|  | PropTypes | Flow | TypeScript |
|---|---|---|---|
| When it checks | **Runtime** (dev only) | Compile time | Compile time |
| Scope | Only the React props | All the code | All the code |
| Today | Removed from React 19 | Practically dead | **The standard** |

> [!note] What was missing
> The answer of the session was honest — "no experience with the first two" — and that is fine, but there is one point that connects them and it is good to know:
> **The types of TypeScript disappear at runtime.** So TS does not validate what an API returns. PropTypes did check at runtime, and this is why they used to live together. Today the real answer is TS + a runtime validator like **Zod** for the external data.
> It is the same idea as in [[The Best Notes of the F Word#Pros and cons of JS vs TS]].

## Pros and cons of TypeScript

**Pros**
- Less cognitive complexity: the types are documentation, and the editor shows them everywhere.
- We can model the **impossible states**, so they can not be represented.
- Type safety, and we can build tooling on top of the types.
- Safer refactors in big projects.

**Cons**
- We have to maintain the definitions of the types.
- High cost at the beginning in small projects.
- The migration is hard if the team does not know TS.
- TS is **permissive** (this is what makes the migration possible), so if we use `any` everywhere, none of the benefits are real.

## Simple React app: PropTypes or TypeScript?

For somebody that already knows the tooling, TypeScript — the cost of the setup is small when we have done it before.

For somebody that is starting, or for a quick proof of concept, the setup can be more an obstacle than a help.

## Explain server-side rendering

SSR renders the maximum HTML possible **in the server**, so the browser receives real content instead of an empty root div that has to bootstrap everything. With a state management library, the state is normally serialized and sent already initialized (this is the hydration).

**Benefits**
- SEO: the crawlers get the content and the meta tags.
- Faster first paint, better perceived performance.

**Drawbacks**
- It is harder to configure, and there are **two flows** to test — the one rendered in the client and the one rendered in the server.
- The APIs that only exist in the browser (`window`, `document`, `localStorage`, service workers) do not exist in the server, so they need a guard or a facade of the platform.

> [!tip] Connection with your own notes
> This is exactly the problem of `window` vs `global` — see [[The Best Notes of the F Word#`window` vs `global`]]. `globalThis` and `typeof window !== "undefined"` are the normal guards.

## Which libraries or frameworks do you know for SSR?

- **React** → **Next.js** (the standard), Remix, or `renderToPipeableStream` of `react-dom/server` by hand.
- **Angular** → Angular Universal.
- **Vue** → Nuxt.

> [!danger] Slip in the session
> The answer said *"Next.js, which has **SSL** built in"*. It is **SSR**. SSL is the certificate and the encryption — a completely different thing.

## How did you improve the performance of a React app?

This is the process that was described, and it is a good structure to reuse:

1. **Detect** — the app felt slow, and the developers reported it.
2. **Measure** — React DevTools Profiler, and the package `why-did-you-render` to find the re-renders that are not necessary. The Performance tab of Chrome DevTools for the paint time and the scripting time.
3. **Find the cause** — a **tree component** where any change of a prop re-rendered all the tree, even from a deep node.
4. **Fix** — a new version of the component without that problem.
5. **Prove it** — measure again and compare before and after.
6. **Share** — a demo and documentation, and then work with the team that owns the code to integrate the fix.

In the server side, another improvement used the **Performance API** of Node (`perf_hooks`) and won **4 seconds** in the worst case.

> [!tip] Why this answer is strong
> It follows the order measure → find → fix → measure again → communicate. Never answer a performance question with a list of tricks; answer with the **process**.

## A component with thousands of rows — how do you avoid the performance problem?

**First, measure**, to know if the problem is the paint time or the scripting time. Then:

- **Virtualization** — render only the rows that are visible. React: `react-window`, `react-virtualized`, TanStack Virtual. Angular: `cdk-virtual-scroll-viewport` of the CDK.
- **Move the calculation out of the main thread** if the cost is to compute the data.
- **Pagination or infinite scroll** if the product allows it.
- **Memoization** — `React.memo`, `useMemo`, stable keys.

> [!danger] Correction: Web Worker, not Service Worker
> The answer of the session said that the calculation *"can be moved into a **service worker**"*. That is the wrong worker:
> - **Web Worker** → it runs JS in another thread. **This is the one for heavy calculations.**
> - **Service Worker** → it is a proxy between the app and the network: cache, offline, push notifications. We can not use it to make a calculation faster.
> They are confused very often, and it is an easy question to lose points.

## How do you handle security threats in your app?

- **Automated quality gate**: Black Duck scans the vulnerabilities. What it finds becomes a defect with a normal priority, and a critical one is fixed immediately.
- **Guidelines of the framework**: follow the documentation of React about injection and templating attacks.
- **Code review**: look for code that is weak or susceptible.
- **Training**: obligatory security training about the **OWASP Top 10** and the vulnerabilities of the frameworks.

> [!danger] Correction: React does escape by default
> The answer of the session said *"React does not have as strong built-in security systems as Angular"*. That is not correct.
> **React escapes automatically** every value that we interpolate in JSX, so `{userInput}` can not inject HTML. The real hole is the explicit escape hatch:
> ```jsx
> <div dangerouslySetInnerHTML={{ __html: userInput }} />   // ← the real risk
> ```
> Angular does the same with its contextual sanitization, and its escape hatch is `bypassSecurityTrustHtml`. **The two frameworks are safe by default and the two have an escape hatch.** The other real risk in React is a `href={userInput}` with `javascript:`.

## How do you identify and remove vulnerable packages?

- **`npm audit`** — it runs automatically on `npm install`, and `npm audit fix` applies the safe upgrades.
- **Snyk** — a deeper scan, with reachability analysis.
- **Dependabot / Renovate** — automatic PRs for the updates.
- Integrate it in the pipeline, so a critical vulnerability **breaks the build**.

## How do you handle sensitive data?

The answer that was given was to treat it with the maximum security, to not cache it in a place where the user can reach it, and to not leak it. The idea is correct, but this is the concrete list that was missing:

- **Never in `localStorage`** — any XSS can read it. The tokens go in cookies **HttpOnly + Secure + SameSite**.
- **HTTPS everywhere**, and HSTS.
- **Never log it** — not in `console.log`, not in the error tracking, not in the analytics.
- **Minimize**: if the field is not displayed, do not send it to the front end at all. Mask it in the backend (`**** **** **** 4242`).
- **Short-lived tokens** with refresh, and clean them on logout.
- Careful with the URLs — the query strings finish in the logs, the history and the referrers.

> [!note] Honest is fine
> The answer of the session finished with "I don't remember any other techniques at the moment". Saying that is much better than inventing something. But this list is good to memorize.

---

# 2. Technical — Design patterns & principles

## What is your favorite design pattern?

The **strategy** pattern, a behavioral pattern. JavaScript, and specially TypeScript, are very good for it, because a strategy can be simply an object of functions with a shared interface, without any hierarchy of classes.

## What categories of design patterns exist?

The Gang of Four defined three:

| Category | What it solves | Typical in JS |
|---|---|---|
| **Creational** | How the objects are created | Factory, Singleton, Builder |
| **Structural** | How the objects are composed | **Facade** (wrapping an API), Adapter, Proxy, Decorator |
| **Behavioral** | How the objects communicate | **Strategy**, Observer, Command |

In architectural terms, the pattern of **state management** is the one most used in front-end applications.

## What pattern is behind RxJS?

The **observer** pattern, also known as **pub-sub** (publish-subscribe). It is useful for any asynchronous communication where we create channels: a source produces values and the one that subscribes receives the notification.

> [!note] Small nuance that is good to know
> Normally we say that observer and pub-sub are the same, but strictly they are different: in the **observer** the subject knows its observers directly; in **pub-sub** there is a **broker** in the middle and the two sides do not know each other. RxJS is closer to the observer; an event bus is pub-sub.

## Name some anti-patterns you try to avoid

- **God object** — one object that does everything, without separation of concerns.
- **Spaghetti code** — no clear structure or flow.
- **Callback hell** — solved with the promises and `async/await`.
- **Prop drilling** — passing a prop through many levels; solved with context or a state container.
- **Magic numbers / strings** — values without a name.
- **Premature optimization** — optimizing without measuring first.

> [!note] The one that could not be remembered
> In the session it said "a class which tries to do multiple things... a sub-version of the God object". Normally that is called the **Blob**, or **Swiss Army Knife** when it is an interface that tries to cover every case. It is the same idea as breaking the **single responsibility principle**.

## Name some patterns from the functional programming paradigm

- **Monads** — containers that represent a specific behavior. The **Maybe** monad represents a value that can exist or not (the equivalent of the `Optional` of Java). The `Promise` is also very close to a monad.
- **Currying and partial application**.
- **Function composition** — `compose`, `pipe`.
- **Immutability** — never mutate, always return a new value.
- **Pure functions** and **higher order functions**.

## Why is composition better than inheritance in React?

Because it gives us **loose coupling**. We can replace or modify each unit without impacting the rest.

In React this means that it is better to have many small components that we can compose, instead of big ones. The tools that React gives us for the composition:

- **`children`** and slots as props.
- **Custom hooks** to reuse the logic.
- **Context** for the inversion of control — we declare the context above and we compose it into the component.

The inheritance creates rigid hierarchies: a change in the parent affects all the descendants, and JS/React does not work well with deep hierarchies of classes.

## What is good code, from your point of view?

Principles:

- **DRY** — don't repeat yourself.
- **YAGNI** — you aren't gonna need it: do not write code "for the future".
- **KISS** — keep it simple.
- **SOLID** — the five principles below.
- **Pure functions** where it is possible, without side effects.

And it has to be **measurable**, not an opinion:

- **Cyclomatic complexity** and **cognitive complexity**, measured with **SonarQube** and **ESLint**.
- Custom rules as **quality gates**: maximum length of the line, maximum length of the file, and the **arity** (number of arguments) kept low.
- Short functions and classes, every one doing one thing.

## Explain the SOLID principles

| Letter | Principle | In one sentence |
|---|---|---|
| **S** | Single responsibility | Every unit does **one** thing. |
| **O** | Open/closed | Open for **extension**, closed for **modification**. |
| **L** | Liskov substitution | We have to be able to use a subtype in every place where its parent is expected. |
| **I** | Interface segregation | Small and specific interfaces, no God-interfaces. |
| **D** | Dependency inversion | The high-level modules should not depend on the low-level ones; **the two depend on abstractions**. |

> [!note] Honest note about Liskov
> The answer of the session said that Liskov is the least relevant in JavaScript, because we almost never do object-oriented hierarchies. That is a fair observation — but it still applies to **any** contract: if a function accepts a shape, everything with that shape has to behave as it is expected.

## Dependency inversion vs dependency injection vs inversion of control

They sound the same and they are three different levels:

| | What it is | Example |
|---|---|---|
| **Inversion of Control (IoC)** | The **general principle**: the framework calls our code, not the other way around. "Don't call us, we'll call you." | Event handlers, `map`/`filter`, the declarative render of React |
| **Dependency Inversion (DIP)** | A **design principle** (the D of SOLID): depend on abstractions, not on concrete implementations | Depending on an interface instead of a concrete class |
| **Dependency Injection (DI)** | A **technique** to get DIP: the dependencies are given from outside | The DI container of Angular, with tokens and providers |

> [!question] Short answer for the interview
> "IoC is the general principle — the flow of control is inverted and the framework calls me. Dependency inversion is the SOLID principle of depending on abstractions. And dependency injection is one concrete technique to implement it, passing the dependencies from outside instead of creating them inside."

## What are non-functional requirements? Name some

Everything that is not the behavior of the application — not the flows of the user or the use cases, but **how** the application has to be.

| Non-functional | How it is measured / handled |
|---|---|
| **Security** | Black Duck, `npm audit`, OWASP training |
| **Accessibility** | WAI / ARIA standards, Lighthouse, DevTools warnings |
| **Maintainability** | Quality gates, ESLint, SonarQube |
| **Reusability** | Important in a monorepository with shared components |
| **Performance** | Profiling, budgets |

> [!tip] The honest part was good
> Saying "the accessibility is the one we do worst in our project — it does not have business priority" is a strong answer. It shows that we know the gap and the reason, instead of pretending that everything is perfect.

## How do you handle technical debt?

The key is to keep the **business value** as the priority. Refactoring only to make the code nicer is not a justification by itself.

- **Refactor when we have to touch the code anyway** — when a feature has to change or to grow. There the refactor pays itself.
- **Leave it when it works and nobody touches it.** A legacy app that is stable and frozen does not have a business case for a rewrite.
- **When we start a new application**, evaluate case by case what we can reuse, what we can extract as small functions, and what we have to abandon and rewrite. The big God objects were left behind; the useful concepts were extracted as small functions.

> [!question] Short answer for the interview
> "The technical debt is the code that is hard to modify, to test and to understand — the opposite of clean code. I refactor when the code has to be touched anyway, because there the refactor has business value. If it works and nobody touches it, I leave it. And for a rewrite I evaluate what we can extract and what we have to abandon."

## Why do we need a state container like Redux, if React has state and Context?

- **Single source of truth** — one place describes the state, and so it describes the view. There is a direct relation between the state and the UI.
- **Less cognitive complexity** — the actions have names that describe what the user did.
- **Devtools and time travel** — we can replay the steps and debug in any point. Advanced apps can even ask a log to the user and replay their exact session.
- **Selectors** — we subscribe to a *slice* of the state. The Context re-renders **all** the consumers on any change; with selectors (and `reselect` for the memoization) the updates are fine grained.
- **Pure functions by force** — the reducers have to be pure, and a pure function is much easier to unit test.

> [!note] Good to add today
> Redux Toolkit removed most of the boilerplate, and for medium apps the alternatives are **Zustand**, **Jotai** or **React Query** — the last one because a lot of the "global state" is really **server cache**, and that is a different problem.

---

# 3. Process — Methodologies & quality

## When does waterfall work better than agile?

Waterfall works when the project is **long** and the **requirements are known from the start**. Its structure is a sequence of stages, and a change in a late stage obliges us to go back to the previous ones.

**Real cases**: governmental applications, some banking systems, anything with a fixed regulation or a contract closed at the beginning.

| | Waterfall | Scrum / Agile |
|---|---|---|
| **Pros** | Very clear process and stages; we can hand off a stage; the information is ready because the previous stage produced it; no back and forth | It iterates and improves itself; every increment gives feedback for the next one; early deliverables |
| **Cons** | No early deliverable; no way to adapt; it needs a very clear vision from the start | It needs constant involvement (a real Product Owner); we have to be able to cut the work in increments |

The two real differentiators: **how well we know the requirements**, and **how much we need to adapt to the change**.

## What estimation techniques have you used?

- **Story points** — they are not a direct measure of the time. They measure also the **complexity and the uncertainty**. We use them with **planning poker** and a modified Fibonacci scale (1, 2, 3, 5, 8, 13, 20, 40, 100). Together with the **velocity** of the team in the previous sprints, they tell us how much work enters in a sprint.
- **T-shirt sizing** (XS → XL) — relative estimation for high level planning, when we still do not know the exact requirements.
- **Three-point estimation** — worst case, best case and probable case. Used in a project with a lot of uncertainty and a delivery of one year minimum.

> [!tip] Why the three-point answer was strong
> The reason that was given is that the estimation is an **input for the managers to take decisions**, so giving one number that nobody can verify is worse than giving a range with context. That is exactly the level of thinking they expect for a promotion.

## Story points or T-shirt sizing — which one would you pick?

- **Story points** for **small and specific** deliverables, and for the sprint planning. They come with context: the previous sprints, the velocity, and **reference stories** ("this one is a 5, this one is a 2") when the project is new.
- **T-shirt / three-point** for **high level and long term**. When the requirements are vague there is no way to know the complexity, so a more vague unit is more honest.

**The rule**: the higher the level and the longer the term, the more vague the estimation can be. Always keep the **relative scope** and use the previous data as a guide.

## How would you establish a code review process on a new project?

1. **Definition of Done first.** Before the code review there are automated **quality gates**: coverage of the unit tests (branch, statement, etc. — the number used was 80%), linting and static analysis. So the code arrives to the review already in shape.
2. **A checklist for the code review**, in order of priority:
   - **Functional correctness** — does it do exactly what it has to do, with the edge cases included.
   - **Patterns and principles that the tools can not catch** — specially the **hidden duplication**, that the linters do not see.
   - **Readability** — typos, comments, spacing. The lowest priority, but we still fix it.
3. **Items specific of the project** in the same checklist: which classes need documentation (there is no automated gate for that), and specific unit test cases added after a bug of a previous sprint.
4. **Descriptions of the pull request** — the context in the PR, so the reviewer does not have to reconstruct the story.
5. Try to integrate the checklist in the tool (Bitbucket), so the developer marks it consciously.

> [!tip] The strong idea here
> Having the quality gates **before** the review means that the humans only review what the machines can not check. That is the point that is worth repeating.

## What is the testing pyramid?

A way to structure how many tests of every type an application should have.

```
        /\        E2E / behavioral    ← the fewest, the most expensive
       /  \
      /----\      Integration + service
     /      \
    /--------\    Unit tests          ← the most, the cheapest
```

- **Unit** — one unit isolated: a function, a class, a React component.
- **Integration / service** — the interaction between units. A component with its state management, or a service against an API.
- **End-to-end** — real flows of the user through all the application.

Example with a button that shows information when we click it: the **unit** test covers the button itself, the **integration** test covers that the click produces the behavior, the **service** test checks the data that comes back, and the **E2E** test checks that a user that arrives to the page and clicks gets the result.

## Why should there be more unit tests than the other types?

- They are **cheap** to write and **fast** to execute.
- They **localize the failure**. If the test of the button fails, the button is broken. If an E2E test fails, we do not know if it was the component, the service or the network.
- We catch them **earlier** — before the PR, so a tester never has to raise a defect.

The E2E tests are the opposite: expensive, slow, fragile, and they only tell us that *something* in the flow is broken.

## Compare continuous integration, delivery and deployment

The three of them are about automating what we have to repeat. **Every one needs the previous one.**

| | What it automates | Deploy to production |
|---|---|---|
| **Continuous Integration** | Build + tests + quality gates on every merge | ❌ |
| **Continuous Delivery** | All the above, and production is deployable **in any moment** | **Manual** — one click |
| **Continuous Deployment** | All the above | **Automatic** — we merge and it is live |

The only difference between delivery and deployment is **if a human presses the button**.

> [!note] The state described in the session
> The CI exists (release cycle, static analysis, unit tests, security checks), but the deploys to test, integration and production are manual — so there is no delivery and no deployment yet.
> And the gap that was identified was honest and correct: **the E2E suites are not connected to the pipeline**. Before automating a deploy to production, every quality gate has to be in the pipeline and it has to be able to **stop** it.

---

# 4. Management & situational

## How do you delegate a task properly, and what can be delegated?

Delegating is not binary, it is a **level**. The level depends on the experience of the person with that kind of task, and on how comfortable they are:

- **Lowest level** — we delegate but we monitor closely. Even here the person can do the research and bring the information, and we decide the approach together.
- **Middle** — they do it, and we give advice when they ask.
- **Highest** — full ownership. They only come to us for exceptional cases.

**The key criterion of what to delegate**: choose the tasks where the person is going to **grow**.

**The example that was given**: after a performance fix, the integration of that fix in the project was delegated instead of doing it personally — the proof of concept was ready, so the risk was low but it was new for that developer. The requirements were explained, some initial advice was given, and after that it was full autonomy with "come to me for advice". It went well, and the developer grew with it.

> [!note] About the "five levels"
> There are several models. The most known is the **7 levels of delegation of Management 3.0** (tell, sell, consult, agree, advise, inquire, delegate). If they ask for the exact model by the name, that is the one to say. The important part — that the level depends on the person and on the task, not on our mood — was answered correctly.

## How would you convince a customer to use a framework other than the one they want?

First the preparation. There are two inputs:

1. **What the customer needs** — goals, requirements, and also the **non-functional** ones.
2. **What the team can do** — their experience, because that changes the recommendation.

Then we build the case:

- Present the **benefits** of our proposal against those requirements (for React: low barrier to entry, small learning curve, fast iteration).
- Bring **success stories that are not confidential** from inside the company.
- Present the **cons of the alternative**, honestly, including "the team does not have experience with it" — that is a real risk of the project, not an excuse.
- Ask the opinion of **other experts** that worked in similar projects.
- Present everything as a documented comparison.

> [!tip] What makes this answer good
> It never says "React is better". It connects the decision with the **requirements + the capability of the team**, and it accepts that the customer decides. That is the level they expect from a lead.

## Friday evening, the customer reports a critical production issue. What do you do?

1. **Verify it.** Confirm that it is real and that it is not only in the machine of the customer, and check the real impact and the scope.
2. **Check the agreement.** If the contract is for normal working hours and there is no on-call, we can not promise immediate support — but we have to communicate this with care, not like a refusal.
3. **Mitigate if it is possible.** A **rollback** to the previous version is normally much faster and safer than a fix, and there should be a documented process for it.
4. **Communicate concrete things** — what is going to happen, what is the plan for Monday, and that it is the priority one.
5. **A hotfix also passes the quality gates.** Skipping them to go fast is how we create a second incident.
6. After that, escalate to the people that can decide about the future support windows.

> [!warning] How to phrase this one
> The content is correct, but starting with "we have a contract for working hours" sounds defensive. Start with **verify and mitigate**, and after that explain the support window. The order changes how all the answer is received.

## A hotfix is stuck in code review and it is urgent. What do you do?

- Normally this should not happen, because the **standup** and the normal channels exist to make a priority one visible for everybody.
- If it happens, **find the impediment** — what is blocking the reviewers (normally another meeting or another commitment).
- **Ask publicly**, in a shared channel, so everybody sees the reason why somebody is pulled out of their current work. If they are in a meeting, write in the chat of the meeting.
- **Explain the priority** instead of only pushing.
- After that, ask why the channels did not show it, so it does not happen again.

## Mid-sprint, the Product Owner asks to add an urgent task. How do you manage it?

1. **Make visible that this is not normal**, so it does not become the default behavior.
2. **Negotiate.** The most common option is to **change the scope**: something of a similar size goes out of the sprint and the new item comes in.
3. If the new item and the sprint are both critical, use the **project management triangle** — scope, time, cost/resources. Cut scope, or move the release date, or add capacity.
4. **Flag the risk**: the commitment of the sprint is now in risk, because the change was not planned.
5. **Escalate** to the project manager or the delivery manager when the item is really critical and unforeseen. Never commit the team to overtime alone — there are legal limits (in Hungary there is a weekly limit of overtime hours) and we can not speak for the availability of other people.

> [!danger] Correction: what Scrum really says
> The answer of the session said *"Scrum guidelines would say that if the sprint commitment has changed, we should restart the sprint and start from scratch."* That is not what the Scrum Guide says.
> - **Only the Product Owner** can **cancel** a Sprint, and only when the **Sprint Goal is not valid any more**. There is no rule of "restart from zero".
> - **The scope can be renegotiated** with the Product Owner during the Sprint, when we learn more — that is normal and it is explicitly allowed.
> - What can **not** change is the **Sprint Goal**.
>
> So the correct framing: adding work in the middle of the sprint does not cancel the Sprint. It is a **renegotiation of the scope with the PO**, and we only cancel the Sprint if the Goal itself does not make sense any more.

---

## Summary: where to focus before the next one

| Topic | Why |
|---|---|
| **Microtask vs macrotask** | Asked directly and never answered. Remember that the microtasks are emptied completely first. |
| **Promises → microtask queue** | It said "callback queue" two times. |
| **Web Worker vs Service Worker** | Confused. Easy points to lose. |
| **Node event loop phases** | Asked, and only half answered. |
| **Class lifecycle names** | Admitted gap — three names to memorize. |
| **React security model** | It said React is weak; React escapes by default. |
| **Scrum: cancelling a sprint** | It said a rule that does not exist. |

> [!tip] What was already strong — do not change it
> The performance answer (measure → find → fix → measure → share), the technical debt answer (business value first), the estimation answer (a range with context is better than one number), and the delegation answer (delegate what makes the people grow). Those are promotion-level answers.
