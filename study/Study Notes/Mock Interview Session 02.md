---
title: Mock Interview Session 02
date: 2026-08-18
tags:
  - study
  - interview
  - promotion
  - javascript
  - react
  - design-patterns
  - mock-interview
parent: "[[The Best Notes of the F Word]]"
source: Mock senior assessment panel — 5 questions asked, 2 answered
---

# Mock Interview Session 02 — Senior Frontend

Related: [[Mock Interview Session 01]] · [[Mock Interview Session 03]] · [[Assessment Questions]] · [[The Best Notes of the F Word]] · [[Design Patterns]]

Session ended early. 5 questions asked: 2 answered, 2 skipped with `/next`, 1 not answered.

> [!danger]- Read this first — the pattern behind every miss
> The pattern of this session is **not** the same as Session 01.
> In Session 01 the mechanism was missing. Now the mechanism is arriving — but **you break the right idea with the wrong word**.
> - Q1: you said *microtask starvation* first, correct. Then you said the promises go to the *"macro tasck queue"*. Wrong word — and it is exactly the mistake that [[Assessment Questions]] flags twice as the classic one. Until now it was somebody else's mistake in the transcript. Now it is in your own record.
> - Q3: you described a **strategy** and called it a **facade**. It took two follow-ups to name what you had already built.
>
> The panel does not hear "he knows it and mixed the name". The panel hears "he does not know the difference".
> **This is a vocabulary problem now, not a knowledge problem.** Drill the names, not the concepts.

## 1. Results

| # | Area | Origin | Topic | Verdict |
|---|---|---|---|---|
| 1 | JS core & runtime | `[EXTRA]` | Frozen page — starvation, and where rendering sits | ⚠️ Mid |
| 2 | React | `[BASE]` | Three setter calls, batching, React 17 vs 18 | ❌ Gap — "I don't remember" + skipped |
| 3 | Patterns | `[BASE]` | Strategy pattern in a real project | ⚠️ Mid |
| 4 | React | `[BASE]` | React XSS model and its escape hatches | ❌ Not answered — skipped |
| 5 | Process | `[BASE]` | Cancelling a sprint — who decides what | ❌ Not answered — session ended |

**Score: 0 ✅ / 2 ⚠️ / 3 ❌. Estimated level: Mid.**

Three of the five were `[BASE]` questions — topics that are already **written and correct in this vault**. That is the important number.

---

## 2. The two you answered

### Q1 — Where the rendering sits in the event loop

The question: a page is frozen, no clicks, no scroll, and a **pure-CSS** spinner is stopped. The call stack is empty most of the time.

**What you got right:** the first thing you said was microtask starvation — *"we have a pice of code that is queing a micro task an the micro task is queing another micro task"*. That is the correct cause and most people never reach it.

**What broke it:** you said the promises go to the *"macro tasck queue"*, and then you said the loop *"is filling all the memory heap"*. Both are wrong, and the second one is a guess.

The event loop has **four** steps, not three. Your notes only have three.

1. Take **one** task (macrotask) and run it to the end.
2. Drain the **whole** microtask queue — including the microtasks created while draining.
3. **Update the rendering**: `requestAnimationFrame` → recalculate style → layout → paint. Around every 16.7 ms at 60 Hz, and it is skipped if nothing changed.
4. Repeat.

**Rendering is a step of the loop.** It is not something the browser does at the same time in another place. So:

- A microtask that queues another microtask makes step 2 never finish.
- The loop never arrives to step 3 → no paint → **the CSS animation freezes**, because its frames are calculated in the main thread.
- The loop never goes back to step 1 → the click and the scroll stay in the task queue → **no input**.
- The stack looks empty because every single microtask is very short. **The memory is flat.** That is the fingerprint: 100% CPU, normal memory.

Verified in Node v22 ✅ — the timer does not run until the 100.000 microtasks finish:

```js
let n = 0;
setTimeout(() => console.log("timer fired, after n =", n), 0);
function loop() {
  n++;
  if (n < 100000) Promise.resolve().then(loop);   // a microtask queues a microtask
}
loop();
console.log("sync end, n =", n);

// sync end, n = 1
// timer fired, after n = 100000   ← the timer waited for ALL the microtasks
```

And the same recursion with `setTimeout` does **not** starve, because every timer is a **task** and the loop breathes between them:

```js
let m = 0;
setTimeout(() => console.log("other timer fired, after m =", m), 0);
function taskLoop() {
  m++;
  if (m < 5) setTimeout(taskLoop, 0);
}
taskLoop();

// other timer fired, after m = 1   ← it did NOT wait for the 5
```

Verified in Node v22 ✅

> [!important] This table is the whole answer
> | Recursion | Queue | Result |
> |---|---|---|
> | `setTimeout(loop, 0)` | task | The loop still arrives to step 3 → the page paints, the spinner moves, the CPU burns |
> | `Promise.resolve().then(loop)` | **microtask** | Step 3 never arrives → the page is completely dead |

**How to detect it:** Performance tab. Look for a long block with **no Frame markers and no Paint entries**. That is starvation. A normal long task shows one big yellow block; starvation shows many small ones with nothing in between.

> [!question] Short answer for the interview
> "Rendering is a step of the event loop, not something that happens in parallel. After each task the loop empties all the microtask queue, and only then it recalculates style, layout and paint. So if a microtask keeps queueing another microtask, the loop never arrives to the rendering step and never takes the next task: no paint, no input, and even a CSS animation freezes, because its frames are calculated in the main thread. The tell is that the memory stays flat and the stack looks empty — it is starvation, not a leak. The same recursion with `setTimeout` would not do this, because every timer is a separate task and the loop renders between them."

> [!tip] The follow-up they were going to ask
> *"You said the CSS spinner froze. Would a spinner with `transform: rotate()` also freeze?"*
> Often **no**. `transform`, `opacity` and `filter` can be animated in the **compositor thread**, so they keep moving while the main thread is dead. Everything else (`width`, `left`, `margin`) needs layout in the main thread, so it freezes.
> This one fact is worth more than the rest of the answer. It proves you know which thread does what.

---

### Q3 — Strategy, and why you called it a facade

The question: give a real case where you used the strategy pattern.

**What you got right:** you brought a case from your own project, not from a book. And the design was correct: a social login with Google, Facebook and Apple, and three wrappers behind one entry point.

**What broke it:** you opened with *"my favorite is the facade"* and then you described *"1 simple function that receives the auth provider name and the function has the mechanism to execute the correct algorithm"* — that is a **selector**, not a facade. You only named strategy after two follow-ups.

> [!danger] Facade vs Strategy — the correction of the vault
> [[Design Patterns]] has a **Facade vs Adapter** callout, but it does **not** have this one. This is the pair that failed.
>
> | | What is behind the door | It hides | The test |
> |---|---|---|---|
> | **Facade** | **One** thing | The **depth** — many low level calls become one call | There is nothing to swap |
> | **Strategy** | **N** interchangeable things | The **variation** — the caller passes a key instead of writing a branch | I can swap the implementation in runtime and the caller does not change |
>
> Both end in "one simple call". That is why they are confused.

**Your design had the two patterns, and saying that is the senior answer:**

1. **A facade per provider** — `googleAuth`, `facebookAuth`, `appleAuth`, all with the same shape `signIn(): Promise<Session>`. Every one hides the depth of one SDK: its redirect, its token format, its error codes.
2. **A strategy to select** — a map with the name of the provider as key. The click handler becomes `providers[name].signIn()`, with zero branching.

```js
const providers = {
  google:   { signIn: () => "session:google" },
  facebook: { signIn: () => "session:facebook" },
  apple:    { signIn: () => "session:apple" },
};

const signIn = (name) => providers[name].signIn();

signIn("apple");   // 'session:apple'
signIn("google");  // 'session:google'
```

Verified in Node v22 ✅

**What it bought the team** — you said *"we can add or remove the providers in an easy way"*. That is the textbook line. This is how to say it:

- **Open/closed** — adding Apple was one new module plus one key. **No existing file was edited.** That is the **O** of SOLID, and [[Design Patterns#SOLID]] already has this exact line written down.
- **Testability** — the handler now depends on the `AuthProvider` shape, so it can be tested with a fake. Before, testing it meant mocking three real SDKs.
- **Blast radius of one** — when a provider changes its SDK, only one file changes.

**When it is the wrong choice** — you said *"when we have few options and the complexity is too much"*. "Too much complexity" is a feeling, not a criterion. The real ones:

- **The variants are not really interchangeable.** The moment one provider needs an extra argument or returns a different shape, the shared interface is a lie and the `if (name === "apple")` comes back to the caller. This is the one that kills the design.
- **Two options that will never be three.** A normal `if` is easier to read — YAGNI.
- **The variants share 90% of the logic.** Then it is not N strategies, it is one algorithm with a hole: that is **template method**, or simply a parameter.
- **The choice is fixed at build time.** Then it is configuration or DI, not strategy.

> [!question] Short answer for the interview
> "In a social login I had three providers with their SDK calls inside the click handler. I wrapped every provider in a facade with the same `signIn(): Promise<Session>`, and then I selected between them with a strategy map keyed by the provider name. So there are two patterns composed: the facades hide the depth of each SDK, the strategy hides the variation. It gave us open/closed — adding Apple was a new module plus a key, without touching the existing code — and it made the handler testable with a fake provider. I would not use it if the providers were not really interchangeable: the moment one needs a different signature, the shared interface is a lie and the branching comes back to the caller."

> [!tip] The follow-up they were going to ask
> *"You said adding a provider is easy — where is the new provider registered, and what stops two modules registering the same key?"*
> The answer: **one registry module**, and the key typed as a **union of literals**, never `string`.
> ```ts
> type ProviderName = "google" | "facebook" | "apple";
> const providers: Record<ProviderName, AuthProvider> = { /* ... */ };
> ```
> With `Record<ProviderName, ...>` TypeScript forces you to implement **all** of them, and a typo in the key is a compile error.

---

## 3. The three you did not answer

> [!warning] These were never answered in the session
> Q2 was answered with "I don't remember" and skipped. Q4 and Q5 were skipped. The three are `[BASE]` topics.

### Q2 — Three setter calls in one click handler

The question: inside a click handler you call the setter three times, every time with the current value plus one. The state starts at 0 and the user clicks once. What is on screen, and what changes inside a `setTimeout` in React 17 vs React 18?

**The answer on screen is 1.** You said 1 and you said it is because *"the re-render is happening just one time"*. That explains why there is **one render**. It does **not** explain why the value is **1**.

The real reason is the **closure**, and [[Assessment Questions#What are the most used built-in hooks?]] already says it: *"the state variable is a constant of that render"*.

The three calls do not see each other. All three read the same captured value:

```js
const count = 0;                              // the value React gave to THIS render
const calls = [count + 1, count + 1, count + 1];
// [ 1, 1, 1 ]   ← the three compute the same thing

// the functional form reads the pending value, not the captured one
let c = 0;
[1, 2, 3].forEach(() => { c = c + 1; });      // 1, 2, 3
```

Verified in Node v22 ✅ — `[1, 1, 1]` against `[1, 2, 3]`.

So there are **two different things** and the panel asks for the two:

| | What it explains |
|---|---|
| **The closure** | Why the value is **1** and not 3 |
| **The batching** | Why there is **one** re-render and not three |

If you use the functional form, the result is **3**, and there is **still only one re-render**. That is the proof that the two things are separate — and it is the best way to show you understand it.

**React 17 vs React 18** — this is the part that is **not** in the vault:

| | Inside a React event handler | Inside `setTimeout`, a promise, or a native listener |
|---|---|---|
| **React 17** | Batched → 1 render | **Not batched** → 3 renders |
| **React 18** (with `createRoot`) | Batched → 1 render | **Batched too** → 1 render |

React 18 calls this **automatic batching**. In React 17 the batching only worked inside the synthetic events of React; everything outside re-rendered on every setter call. The escape hatch, if you really need the render in the middle, is `flushSync`.

> [!question] Short answer for the interview
> "The value on screen is 1, and there are two separate reasons. The value is 1 because of the closure: the state is a constant of that render, so the three calls read the same 0 and all compute 1. And there is only one re-render because React batches the updates. If I use the functional form `setCount(c => c + 1)` the result is 3, but there is still one render — that shows the two things are different. In React 17 the batching only happened inside React event handlers, so the same three calls inside a `setTimeout` produced three renders. React 18 added automatic batching, so now it is batched everywhere, and `flushSync` is the escape hatch."

### Q4 — Is React safe against XSS?

The question: a teammate says not to worry about XSS because "React is safe by default". Where is he right and where is he wrong?

**Where he is right:** React **escapes automatically** every value interpolated in JSX. `{userInput}` can never inject HTML. [[Assessment Questions#How do you handle security threats in your app?]] already has this correction — in the real session the answer was that React has weak security, and that is false.

**Where he is wrong** — the places where user input can still execute:

| Hole | The example | The fix |
|---|---|---|
| **`dangerouslySetInnerHTML`** | `<div dangerouslySetInnerHTML={{ __html: comment }} />` | Sanitize with **DOMPurify** before |
| **A URL in `href` or `src`** | `<a href={userInput}>` with `javascript:alert(1)` | Validate the protocol: only `http:`, `https:`, `mailto:` |
| **Spreading props on a DOM node** | `<div {...userObject} />` — the user sends `dangerouslySetInnerHTML` | Never spread an object that comes from outside |
| **A ref writing HTML** | `ref.current.innerHTML = userInput` | Same rule as `dangerouslySetInnerHTML` |
| **State serialized in the SSR HTML** | `window.__STATE__ = ${JSON.stringify(state)}` and the state contains `</script>` | Escape `<`, `>` and `&` in the serialization |
| **Injection in `style`** | `style={{ background: userInput }}` with `url(javascript:...)` | Old browsers only, but it is still on the list |
| **A third party component** | The library does `innerHTML` inside | Read the code, or trust nothing |

> [!question] Short answer for the interview
> "He is right that React escapes by default: everything I interpolate in JSX is escaped, so `{userInput}` can not inject HTML. But that only covers the text. The holes are the escape hatches: `dangerouslySetInnerHTML`, a `href` or `src` with a `javascript:` URL, spreading props that come from the user on a DOM element, writing `innerHTML` through a ref, and the state serialized in the HTML in SSR. For rich text the correct answer is to sanitize with DOMPurify, and for URLs to validate the protocol. Angular is the same: it is safe by default and its escape hatch is `bypassSecurityTrustHtml`."

### Q5 — The Product Owner says the feature has no customer, on day 7

The question: what does Scrum actually say happens now, and who decides.

This is correction **number 6** of [[Assessment Questions]] — in the real session the answer was *"we should restart the sprint and start from scratch"*, and that rule does not exist.

**What the Scrum Guide really says:**

- **Only the Product Owner can cancel a Sprint**, and only when the **Sprint Goal is not valid any more**. Nobody else: not the Scrum Master, not the team, not the manager.
- The question is always the same one: **is the Sprint Goal still valid?**
  - If the Goal is dead → the PO **can** cancel the Sprint. It is rare, and normally it means the Sprint was too long.
  - If the Goal is still alive → the Sprint continues. What we do is **renegotiate the scope with the PO**, and that is explicitly allowed and normal.
- What can **never** change during the Sprint is the **Sprint Goal**. The scope around it can.
- If the Sprint is cancelled: the finished work is reviewed and can be accepted, the rest goes back to the Product Backlog, and the team goes to Sprint Planning again.
- There is no "restart from zero" and there is no penalty.

> [!question] Short answer for the interview
> "The only question is if the Sprint Goal is still valid. If the feature has no customer any more, the Goal is probably dead, and then only the Product Owner can cancel the Sprint — it is the only person who can, and only for that reason. If the Goal is still valid, the Sprint continues and what we do is renegotiate the scope with the PO, which Scrum allows explicitly. What can never change during the Sprint is the Goal itself. And if the Sprint is cancelled, the work that is done is reviewed, the rest goes back to the Product Backlog and we plan again — there is no restart from zero."

---

## 4. What was missing for senior

1. **The name kills the idea.** Twice you had the correct concept and gave it the wrong name. The panel can not read your mind — a wrong name is a wrong answer. This is now the number one problem, above any missing topic.
2. **When you do not know, do not guess.** *"It is filling all the memory heap"* was invented. In Q2 you said "I don't remember" and that was the **right** move — do the same everywhere.
3. **Half answers.** Q1 had two parts and you only answered one, through three follow-ups. When a question has two parts, say "two things" out loud and count them.
4. **The payoff is never quantified.** "We can add providers easily" is mid level. "Adding Apple was one module and one key, and no existing file was touched — that is open/closed" is senior level. Same fact, different level.
5. **Three of five were `[BASE]`.** The material was already written and correct in this vault. This is a **recall** problem, not a study problem, and recall is fixed by drilling out loud, not by reading.

---

## 5. Study backlog

### Review from this vault

| Topic | Where it is | Why it failed |
|---|---|---|
| Promises → **microtask** queue 🔁 | [[The Best Notes of the F Word#Microtask queue]] · [[Assessment Questions#How do promises work?]] · [[Questions for interviews#What is an event]] | Written correctly in **three** places of this vault. Said "macro task queue" anyway. It is the classic mistake of the transcript, and now it is mine too |
| The state is a **constant of the render** | [[Assessment Questions#What are the most used built-in hooks?]] | Explained the batching, not the closure |
| React escapes by default | [[Assessment Questions#How do you handle security threats in your app?]] | Never answered |
| Cancelling a Sprint | [[Assessment Questions#Mid-sprint, the Product Owner asks to add an urgent task. How do you manage it?]] | Never answered |
| Open/closed ↔ strategy | [[Design Patterns#SOLID]] | The exact line is written there and it was not used |
| Facade | [[Design Patterns#Facade]] | Used the name for a strategy |

### Study outside this vault

| Topic | What exactly to look up | Why I need it |
|---|---|---|
| The **render step** of the event loop | HTML spec §8.1.7.2 *Processing model*. Easier: Jake Archibald, *In The Loop* — the second half of the talk | It is the step missing from my model, and it was half of Q1 |
| **Compositor vs main thread** animations | web.dev *Animations guide* → "Stick to compositor-only properties" | `transform`/`opacity`/`filter` do not freeze. It is the follow-up they always ask |
| **Automatic batching** in React 18 | React 18 release notes, "Automatic Batching" + the `flushSync` docs | Not in the vault at all, and it is a direct React 18 question |
| **Microtask starvation** | MDN `queueMicrotask()`, section "when to use it" | It names the risk explicitly |
| **Template Method vs Strategy** | Refactoring Guru, *Template Method* → "Relations with Other Patterns" | The next confusion after facade/strategy |
| **DOMPurify + URL protocol validation** | DOMPurify README, and the React docs on `dangerouslySetInnerHTML` | The concrete fix for the XSS question |
| **Scrum Guide 2020**, the Sprint section | The official guide, ~14 pages, the "Sprint" section | The rules about cancelling. Already wrong once in a real assessment |

---

## 6. Top 3 priorities before the next session

| # | What | Time | Why it hurts most |
|---|---|---|---|
| 1 | **Drill the vocabulary out loud** — microtask/macrotask, facade/strategy/adapter, Web Worker/Service Worker, SSR/SSL. Say them, do not read them | 30 min, every day | This is the failure mode. Everything else is secondary. It cost points **twice in this session alone**, on two questions I actually knew |
| 2 | **Closure + batching + React 18** — the setter question, until I can say the two reasons separately | 1–2 h | A guaranteed React question, and I did not answer it at all |
| 3 | **The render step of the event loop** — Jake Archibald's talk, then add step 3 to my own diagram | 1 h | It is the first question of any senior panel, and my model is incomplete |

---

## 7. What to add to the vault

- [ ] **[[The Best Notes of the F Word#Everything together: how JS runs the code]]** — the 6-step cycle has **no render step**. Add it between the current 5 and 6.
- [ ] **[[Design Patterns]]** — there is a "Facade vs Adapter" callout but no **"Facade vs Strategy"**. Add it. That is the pair that failed.
- [ ] **React 18 automatic batching** — it is nowhere in the vault. It belongs next to the `useState` callout in [[Assessment Questions#What are the most used built-in hooks?]].
- [ ] **The React XSS table** of section 3 of this note — move it to [[Assessment Questions#How do you handle security threats in your app?]], which only has `dangerouslySetInnerHTML`.
- [ ] **Cancelling a Sprint** — [[Assessment Questions]] has it inside the "urgent task mid-sprint" answer. It deserves its own question, because they can ask it directly.

---

## 8. Next session

1. The Sprint cancellation question again — it was never answered.
2. The React XSS question again — it was never answered.
3. The setter / batching question again, with the React 17 vs 18 part.
4. `useMemo` and `React.memo`: when they do **nothing**, and how I measure that they helped.
5. TypeScript: why the types do not validate an API response, and what I do about it. (Zero TypeScript questions in this session.)
6. `useEffect` cleanup and the subscription leak — [[Design Patterns#Observer]] already warns about it.

> [!tip] What is already working — do not touch it
> - The **first instinct is correct**. Microtask starvation in Q1, and the real architecture of Q3. The intuition is at the right level.
> - **Real examples from real projects.** The social login case is exactly what a panel wants to hear. Keep bringing cases from your own work.
> - **"I don't remember" instead of inventing.** Do it more, not less.
