---
title: Testing and Process
tags:
  - study
  - interview
  - testing
  - agile
  - process
  - leadership
---

# Testing and Process

Testing strategy, CI/CD, methodologies, estimation, and the management and situational questions.

The pattern across all of these: the question looks like it wants a technique, and it actually wants a **policy**. Answering "state contamination and short timeouts" to a flaky-suite question is an individual-bug answer; the senior scope is the process that stops the suite rotting again.

---

# 1. Testing

## The testing pyramid

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
- **End-to-end** — real flows of the user through the whole application.

Example with a button that shows information when clicked: the **unit** test covers the button itself, the **integration** test covers that the click produces the behaviour, the **service** test checks the data that comes back, and the **E2E** test checks that a user who arrives at the page and clicks gets the result.

## Why more unit tests than the other types

- They are **cheap** to write and **fast** to execute.
- They **localise the failure**. If the test of the button fails, the button is broken. If an E2E test fails, we do not know whether it was the component, the service or the network.
- We catch them **earlier** — before the PR, so a tester never has to raise a defect.

E2E tests are the opposite: expensive, slow, fragile, and they only tell us that *something* in the flow is broken.

## The e2e suite takes 40 minutes and is flaky. What do you do?

> [!important] This is a process question, not a bug question
> Naming two plausible root causes is the mid-level answer. The senior scope is **policy**: what stops the suite from rotting again after this week's fix.

**Sources of flake**: shared or leaked state between tests, `sleep` instead of waiting for a condition, hitting the real network, non-deterministic seed data, parallel workers fighting over fixtures, animations and clocks.

**The policy**:

1. **Quarantine** — a flaky test is muted **within one day**, ticketed with an owner, and deleted if it is not fixed in two weeks.
2. **Flake tracking** — record pass/fail per test over time. The dashboard is what stops accumulation, not willpower.
3. **Ban "re-run until green"** — or at minimum make every re-run visible and counted.
4. **Rebalance the pyramid** — most e2e flakes are integration tests wearing a browser. Push them down.
5. **Cut the 40 minutes** — parallelism, sharding, and run the full suite only on `main`.

> [!question] Short answer for the interview
> "Flakiness is a process problem, so I would answer at two levels. The mechanics: shared state between tests, `sleep` instead of waiting for a condition, real network calls, non-deterministic seed data, parallel workers fighting over fixtures. But the reason a suite gets to 40 minutes and stays flaky is that nothing stops it: so quarantine within a day with a ticket and an owner, delete at two weeks, track flake rate per test on a dashboard, and make re-runs visible instead of free. Then I would look at what those e2e tests actually assert — most of them are integration tests wearing a browser, and pushing them down the pyramid fixes both the time and the flakiness."

## What makes a test worth having

- It fails for **one** reason, and the name says which.
- It tests **behaviour**, not implementation. A test that breaks on a refactor with no behaviour change is a liability.
- No `sleep`. Wait for a **condition**.
- Deterministic: fixed clock, fixed seed, no real network, no shared fixtures.
- Coverage is a **signal, not a target**. 80% branch coverage of code nobody reads is not quality; a Goodhart'ed number is worse than none.

---

# 2. CI, delivery and deployment

The three are about automating what we have to repeat. **Every one needs the previous one.**

| | What it automates | Deploy to production |
|---|---|---|
| **Continuous Integration** | Build + tests + quality gates on every merge | ❌ |
| **Continuous Delivery** | All the above, and production is deployable **at any moment** | **Manual** — one click |
| **Continuous Deployment** | All the above | **Automatic** — we merge and it is live |

The only difference between delivery and deployment is **whether a human presses the button**.

> [!tip] The honest gap to name
> Having CI (release cycle, static analysis, unit tests, security checks) while the deploys to test, integration and production are manual means there is **no** delivery and **no** deployment yet. And before automating a deploy to production, every quality gate has to be **in the pipeline** and it has to be able to **stop** it. A gate that only writes a report is not a gate.

---

# 3. Code review

## How would you establish a code review process on a new project?

1. **Definition of Done first.** Before the code review there are automated **quality gates**: unit test coverage (branch, statement), linting and static analysis. So the code arrives at the review already in shape.
2. **A checklist for the review**, in order of priority:
   - **Functional correctness** — does it do exactly what it has to do, edge cases included.
   - **Patterns and principles the tools cannot catch** — especially **hidden duplication**, which linters do not see.
   - **Readability** — typos, comments, spacing. Lowest priority, but still fixed.
3. **Project-specific items** in the same checklist: which classes need documentation (there is no automated gate for that), and specific test cases added after a bug in a previous sprint.
4. **Pull request descriptions** — the context in the PR, so the reviewer does not have to reconstruct the story.
5. Integrate the checklist in the tool, so the developer marks it consciously.

> [!important] The idea worth repeating
> Having the quality gates **before** the review means humans only review what machines cannot check. Everything a linter can catch should never reach a human reviewer.

## How do you handle technical debt?

The key is to keep the **business value** as the priority. Refactoring only to make the code nicer is not a justification by itself.

- **Refactor when we have to touch the code anyway** — when a feature has to change or grow. There the refactor pays for itself.
- **Leave it when it works and nobody touches it.** A legacy app that is stable and frozen has no business case for a rewrite.
- **When starting a new application**, evaluate case by case: what to reuse, what to extract as small functions, and what to abandon and rewrite. The God objects get left behind; the useful concepts get extracted.

> [!question] Short answer for the interview
> "Technical debt is the code that is hard to modify, to test and to understand — the opposite of clean code. I refactor when the code has to be touched anyway, because there the refactor has business value. If it works and nobody touches it, I leave it. And for a rewrite I evaluate what we can extract and what we have to abandon."

---

# 4. Methodologies

## When does waterfall work better than agile?

Waterfall works when the project is **long** and the **requirements are known from the start**. Its structure is a sequence of stages, and a change in a late stage forces going back through the previous ones.

**Real cases**: governmental applications, some banking systems, anything with a fixed regulation or a contract closed at the beginning.

| | Waterfall | Scrum / Agile |
|---|---|---|
| **Pros** | Very clear process and stages; a stage can be handed off; the information is ready because the previous stage produced it; no back and forth | It iterates and improves itself; every increment gives feedback for the next; early deliverables |
| **Cons** | No early deliverable; no way to adapt; it needs a very clear vision from the start | Needs constant involvement (a real Product Owner); the work has to be cuttable into increments |

The two real differentiators: **how well we know the requirements**, and **how much we need to adapt to change**.

## What Scrum actually says about changing a Sprint

This is the one that costs points, because the intuitive answer — "restart the sprint from scratch" — **is not a rule that exists**.

- **Only the Product Owner can cancel a Sprint**, and only when the **Sprint Goal is no longer valid**. Not the Scrum Master, not the team, not a manager.
- The only question is: **is the Sprint Goal still valid?**
  - Goal dead → the PO **may** cancel. It is rare, and usually means the Sprint was too long.
  - Goal alive → the Sprint continues, and the **scope is renegotiated with the PO**, which Scrum explicitly allows.
- What can **never** change during the Sprint is the **Goal**.
- If it is cancelled: finished work is reviewed and can be accepted, the rest returns to the Product Backlog, and the team goes back to Sprint Planning.
- **There is no "restart from zero" and no penalty.**

> [!important] The framing that is correct
> Adding work mid-sprint does **not** cancel the Sprint. It is a **renegotiation of scope with the PO**. We only cancel the Sprint if the **Goal** itself stops making sense.

## Estimation techniques

- **Story points** — not a direct measure of time. They also measure **complexity and uncertainty**. Used with **planning poker** and a modified Fibonacci scale (1, 2, 3, 5, 8, 13, 20, 40, 100). Together with the team's **velocity** from previous sprints, they say how much work fits in a sprint.
- **T-shirt sizing** (XS → XL) — relative estimation for high-level planning, when the exact requirements are still unknown.
- **Three-point estimation** — worst case, best case, probable case. For a project with a lot of uncertainty and a delivery of a year or more.

> [!tip] Why the three-point reasoning lands
> An estimate is an **input for managers to make decisions**. Giving one number nobody can verify is worse than giving a range with context. That is the level of thinking a promotion panel is listening for.

### Story points or T-shirt sizing — which one?

- **Story points** for **small and specific** deliverables, and for sprint planning. They come with context: previous sprints, velocity, and **reference stories** ("this one is a 5, this one is a 2") when the project is new.
- **T-shirt / three-point** for **high level and long term**. When the requirements are vague there is no way to know the complexity, so a vaguer unit is more honest.

**The rule**: the higher the level and the longer the term, the vaguer the estimate can be. Always keep the **relative scope** and use previous data as the guide.

## Non-functional requirements

The ones that get forgotten in a requirements conversation, and that every architecture decision is actually about: **performance**, **scalability**, **availability**, **security**, **accessibility**, **maintainability**, **observability**, **localisation**, **browser and device support**, **compliance** (GDPR, data residency), **cost**.

Naming "non-functional requirements" when asked what inputs drive a technical decision is a cheap way to sound senior, and it is also just correct.

---

# 5. Management and situational

## How do you delegate properly, and what can be delegated?

Delegating is not binary, it is a **level**. The level depends on the person's experience with that kind of task and how comfortable they are:

- **Lowest level** — delegate but monitor closely. Even here the person can do the research and bring the information, and the approach is decided together.
- **Middle** — they do it, and we give advice when they ask.
- **Highest** — full ownership. They only come back for exceptional cases.

**The key criterion of what to delegate**: choose the tasks where the person is going to **grow**.

A concrete example: after a performance fix, the *integration* of that fix in the project was delegated instead of done personally — the proof of concept was ready, so the risk was low but the work was new for that developer. Requirements explained, some initial advice, then full autonomy with "come to me for advice".

> [!note] If they ask for the model by name
> The best known one is the **7 levels of delegation of Management 3.0**: tell, sell, consult, agree, advise, inquire, delegate. The important part is that the level depends on the **person and the task**, not on our mood.

## How would you convince a customer to use a different framework?

First the preparation. Two inputs:

1. **What the customer needs** — goals, requirements, and the **non-functional** ones.
2. **What the team can do** — their experience, because that changes the recommendation.

Then build the case:

- Present the **benefits** of the proposal against those requirements (for React: low barrier to entry, small learning curve, fast iteration).
- Bring **non-confidential success stories** from inside the company.
- Present the **cons of the alternative**, honestly, including "the team does not have experience with it" — that is a real project risk, not an excuse.
- Ask the opinion of **other experts** who worked on similar projects.
- Present everything as a documented comparison.

> [!tip] What makes this answer good
> It never says "React is better". It connects the decision to the **requirements plus the capability of the team**, and it accepts that the customer decides. That is lead-level framing.

## Friday evening, the customer reports a critical production issue

> [!warning] The order changes how the whole answer is received
> Start with **verify and mitigate**. Starting with "we have a contract for working hours" sounds defensive, even when it is true — the support window comes after, not first.

1. **Verify it.** Confirm it is real and not only on the customer's machine, and check the real impact and scope.
2. **Mitigate if possible.** A **rollback** to the previous version is normally much faster and safer than a fix, and there should be a documented process for it.
3. **Check the agreement.** If the contract is for normal working hours with no on-call, we cannot promise immediate support — communicate it with care, not as a refusal.
4. **Communicate concrete things** — what is going to happen, what the plan for Monday is, and that it is priority one.
5. **A hotfix also passes the quality gates.** Skipping them to go fast is how we create a second incident.
6. Afterwards, escalate to the people who can decide about future support windows.

## A hotfix is stuck in code review and it is urgent

- Normally this should not happen, because the **standup** and the normal channels exist to make a priority-one visible to everybody.
- If it happens, **find the impediment** — what is blocking the reviewers (usually another meeting or commitment).
- **Ask publicly**, in a shared channel, so everybody sees why somebody is being pulled off their current work. If they are in a meeting, write in the meeting chat.
- **Explain the priority** instead of only pushing.
- Afterwards, ask why the channels did not surface it, so it does not happen again.

## Mid-sprint, the PO asks to add an urgent task

1. **Make visible that this is not normal**, so it does not become the default behaviour.
2. **Negotiate.** The most common option is to **change the scope**: something of a similar size leaves the sprint and the new item comes in.
3. If the new item and the sprint are both critical, use the **project management triangle** — scope, time, cost/resources. Cut scope, move the date, or add capacity.
4. **Flag the risk**: the sprint commitment is now at risk, because the change was not planned.
5. **Escalate** to the project or delivery manager when the item is genuinely critical and unforeseen. Never commit the team to overtime alone — there are legal limits, and we cannot speak for other people's availability.

And the Scrum framing from above: this is a **scope renegotiation**, not a cancelled or restarted Sprint.

## Tell me about a disagreement you pushed, and how it was resolved

> [!tip] The structure to reuse for any behavioural question
> **The concrete case → the real constraint → the negotiated outcome → what was left behind in writing.**

The case: product wanted notification state in **`localStorage`**; the repo rules forbade client storage (security plus a server-driven-UI methodology). Researched it, presented the reasons, the proposal was dropped, and it moved to a small dedicated DB — and **a spike doc was written for future reference**.

**Research → align → decide → document** is the senior loop. The written artefact left behind for the next person is what makes it senior rather than merely correct.

---

# 6. Recall triggers

| When I hear / say… | The words that must come out |
|---|---|
| "the suite is flaky" | **policy**, not root causes: quarantine, track, ban re-runs, rebalance |
| "how much coverage?" | coverage is a **signal, not a target** |
| "the test broke on a refactor" | it tested **implementation**, not behaviour |
| "why more unit tests?" | cheap, fast, and they **localise the failure** |
| "CI vs CD vs CD" | the difference is **whether a human presses the button** |
| "we have quality gates" | can they **stop the pipeline**? Otherwise they are reports |
| "code review" | gates **before** the review; humans only check what machines cannot |
| "technical debt" | refactor when the code has to be **touched anyway** |
| "the sprint changed" | **renegotiate scope with the PO** — there is no "restart from zero" |
| "cancel the sprint" | only the **PO**, and only if the **Goal** is dead |
| "estimate it" | a **range with context** beats one unverifiable number |
| "what inputs drive the decision?" | requirements **+ non-functional requirements +** team capability |
| "critical issue on Friday" | **verify → mitigate (rollback) →** then the support window |
| "a behavioural question" | case → constraint → outcome → **what I left in writing** |

---

# 7. Drill — say these out loud

1. Pyramid: **most unit, fewer integration, fewest e2e**. Unit tests **localise the failure**.
2. Flakiness is a **process** problem. Quarantine in a day, delete at two weeks, track the rate.
3. Most e2e flakes are **integration tests wearing a browser**.
4. CI → Delivery → Deployment. The last step is **who presses the button**.
5. A gate that cannot **stop** the pipeline is not a gate.
6. Quality gates come **before** the human review.
7. Refactor when the code must be **touched anyway**.
8. **Only the PO cancels a Sprint**, and only if the **Goal** is invalid. Scope is renegotiable; the Goal is not.
9. Story points measure **complexity and uncertainty**, not time.
10. An estimate is an **input for a decision** — give a range with context.
11. Friday incident: **verify → mitigate → communicate**. The contract comes last.
12. Behavioural answers end with **the artefact left behind**.

---

# Still to study

- [ ] Testing React properly: Testing Library queries by role, `userEvent` vs `fireEvent`, what not to mock
- [ ] MSW for network mocking, and why it beats stubbing `fetch`
- [ ] Contract tests in CI (Pact) — see [[TypeScript Boundary#Contracts: codegen and contract tests]]
- [ ] Visual regression testing: where it pays and where it becomes its own flake source
- [ ] Mutation testing — the answer to "80% coverage of what, exactly?"
- [ ] Trunk-based development vs GitFlow, and feature flags as the enabler
- [ ] Observability for a frontend: error tracking, RUM, session replay, and what to sample
- [ ] Incident process: severity levels, on-call, blameless postmortems, action items that actually close
- [ ] DORA metrics: deployment frequency, lead time, change failure rate, MTTR
