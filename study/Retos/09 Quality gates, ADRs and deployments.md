---
title: "Reto 09 — Quality gates, ADRs and deployments"
tags:
  - challenge
  - process
  - ci
plan: "Assessment Plan — Tier 2"
status: todo
---

# Reto 09 — Quality gates, ADRs and deployments

**Goal:** build a real chain of quality gates in the sandbox and break each gate on purpose, so you know **what each one catches that the others miss**; write an **ADR** for the Kafka decision the panel described; and choose a **deployment strategy** for concrete situations.

**Why it matters:** Software Engineering Practices is a recommended skill (Intermediate → Advanced) whose gaps are Git workflows (hooks, tags), design reviews, AI evaluation in the pipeline and deployment strategies. The panel asked at 00:35:00 *"what quality gates before a pull request can be merged?"*, at 00:28:44 *"how do you document the decision to move two services to Kafka, so a new engineer understands why?"*, and at 00:58:33 *"how do you handle and distribute technical debt?"*

> [!warning] Do each level before opening its solution
> Predict first, write it down, then run and compare.

---

## The theory you need first

A **quality gate** is an automated check that **blocks** a change from moving forward — a merge, a deploy — when it fails. A check that only writes a report is not a gate.

Gates are ordered **cheapest and fastest first**, so a developer gets the fastest possible "no":

```
on the laptop        pre-commit hook: format + lint the changed files (seconds)
on the pull request  lint → type-check → unit and component tests → build → e2e smoke on a preview
                     + coverage on changed lines, static analysis (Sonar), dependency and secret scan,
                     + bundle and performance budget, + required human review
after merge          deploy to staging → smoke tests → progressive production rollout → monitoring
```

An **ADR** (Architecture Decision Record) is a short file in the repository that records **one** decision: the context, the decision, the alternatives considered, and the consequences. ADRs are never edited after acceptance; a new ADR **supersedes** an old one, so the history of *why* stays readable.

---

## Setup

Everything runs in `Retos/retos-sandbox/`. Reto 06 must be done first (it installs Vitest and contains the tests the gates run).

> [!danger] No Git hooks in the sandbox
> The sandbox lives **inside this vault's Git repository**, and Obsidian Git auto-commits the vault. A pre-commit hook installed here (Husky sets `core.hooksPath` on the repository) would run on every vault backup. Level 3 is configuration on paper — do not run `husky init` here.

---

## Level 0 — Predict: which gate catches it?

Eight defects. For each, name the **first** gate that catches it: lint, type-check, unit test, build, e2e smoke, dependency scan, performance budget, human review — or "none".

1. A hook called inside an `if`.
2. A function returns a `string` where the caller expects a `number`.
3. The discount is computed as 1% instead of 10%.
4. A Next.js page uses `useState` but has no `'use client'`.
5. The login button stopped submitting after a CSS change hid it behind an overlay.
6. A new dependency has a known critical vulnerability.
7. A new date library adds 70 KB to the first page.
8. The code works, but the new endpoint returns every user's email to any logged-in user.

> [!success]- Solution — Level 0
> 1. **Lint** — `react-hooks/rules-of-hooks`.
> 2. **Type-check.**
> 3. **Unit test** — and only if someone wrote one for the rule; no tool knows that 10% is right.
> 4. **Build** — lint and type-check both pass it (level 1 proves it).
> 5. **E2E smoke** on a preview — only a real browser sees that the button can't be clicked.
> 6. **Dependency scan** (`npm audit`, Dependabot, Snyk).
> 7. **Performance / bundle budget.**
> 8. **Human review** — and a security review. It is a design flaw, not a syntax error; no automated gate catches "this data should not be exposed". That is why review stays a required gate.

---

## Level 1 — Build the chain, then break each gate

Add a script to `package.json`:

```json
"gates": "eslint . && tsc --noEmit && vitest run --exclude '**/*.bad.test.ts' && next build"
```

Run `npm run gates`. Then break each gate, one at a time, run it again, read the error, and undo:

- **a.** `reto09/broken-hook.tsx` — a component that calls `useState` inside an `if`.
- **b.** `reto09/broken-type.ts` — `export const total: number = '10';`
- **c.** Remove `--exclude '**/*.bad.test.ts'` from the script.
- **d.** `app/broken/page.tsx` — a page that uses `useState` **without** `'use client'`. Before running: does lint catch it? Does `tsc`?

Then answer:

1. Why `&&`, and why in this order?
2. What does the `--exclude` stand for in a real team, and what makes it acceptable?
3. `eslint .` passes with 2 warnings. Should warnings block?

> [!success]- Solution — Level 1
> ✅ Measured: the full chain passes — lint with 0 errors, *13 passed* tests, `✓ Compiled successfully`, and the routes of every reto listed.
>
> - **a** — lint: `React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.` (`react-hooks/rules-of-hooks`)
> - **b** — type-check: `error TS2322: Type 'string' is not assignable to type 'number'.`
> - **c** — tests: reto 06's deliberately bad suite fails (`expected +0 to be 10`) and the chain stops.
> - **d** — **lint passes, `tsc` passes**, and only the build fails: `You're importing a module that depends on useState into a React Server Component module. This API is only available in Client Components.`
>
> 1. `&&` stops at the first failure, so the cheap gates (lint takes seconds) fail before the expensive one (a build takes much longer). On CI the same idea becomes separate jobs, with the slow ones depending on the fast ones.
> 2. It is a **quarantine**: known-failing or flaky tests taken out of the gate on purpose, so one bad test doesn't block every merge. It is acceptable only if it is **visible and temporary**: an explicit list, a ticket and an owner for each test, and a deadline to fix or delete it. A silent `.skip` is how a suite rots.
> 3. Warnings that never block accumulate until nobody reads them. The usual rule: `eslint --max-warnings 0` on **changed files** in CI, so new code is clean, while old warnings are paid down as debt. Here the two warnings are deliberate (reto 03 evaluates an expression to prove a type), which is what an inline `eslint-disable-next-line` with a reason is for.

---

## Level 2 — The CI pipeline, on paper

Write `reto09/ci.yml`, a GitHub Actions workflow that runs on every pull request. Requirements:

1. Install with `npm ci`, cached.
2. Lint and type-check in one job; tests in another; the build only if both pass.
3. A dependency audit that fails on **high** severity.
4. The workflow should be the **same commands** as `npm run gates` — why does that matter?

Then: which gates from the theory section are still missing from your file, and where would each one live?

> [!success]- Solution — Level 2
> ```yaml
> name: pull-request
> on:
>   pull_request:
>
> jobs:
>   static:
>     runs-on: ubuntu-latest
>     steps:
>       - uses: actions/checkout@v4
>       - uses: actions/setup-node@v4
>         with: { node-version: 22, cache: npm }
>       - run: npm ci
>       - run: npx eslint .
>       - run: npx tsc --noEmit
>       - run: npm audit --audit-level=high
>
>   test:
>     runs-on: ubuntu-latest
>     steps:
>       - uses: actions/checkout@v4
>       - uses: actions/setup-node@v4
>         with: { node-version: 22, cache: npm }
>       - run: npm ci
>       - run: npx vitest run --exclude '**/*.bad.test.ts'
>
>   build:
>     needs: [static, test]
>     runs-on: ubuntu-latest
>     steps:
>       - uses: actions/checkout@v4
>       - uses: actions/setup-node@v4
>         with: { node-version: 22, cache: npm }
>       - run: npm ci
>       - run: npx next build
> ```
>
> 4. If CI runs different commands from the ones a developer runs locally, "it passed on my machine" means nothing. One script, run in both places, makes a red CI reproducible in one command.
>
> Still missing, and where each one lives:
> - **E2E smoke tests** against a **preview deployment** of the PR (Vercel or Netlify previews, or a staging environment), with Playwright or Cypress.
> - **Coverage on changed lines** (`vitest run --coverage`, after `npm install -D @vitest/coverage-v8`) and **static analysis** (SonarQube's quality gate) as required status checks.
> - **Bundle and performance budgets**: Lighthouse CI, or a bundle-size check that fails over a threshold.
> - **Secret scanning** (GitHub's own, or gitleaks).
> - **Branch protection**: these checks marked **required**, plus at least one approving review, and no direct pushes to `main`. Without branch protection, a failing workflow is only a suggestion.
> - **AI in the pipeline**: an AI review bot as a **first pass** that comments, never as a gate on its own. And for AI **features**, an eval suite with a threshold (reto 08, level 5).

---

## Level 3 — Git hooks, tags and the branch model

On paper — see the danger note in Setup.

1. What would **Husky** and **lint-staged** do on a developer's laptop? Write the `lint-staged` config that lints and formats only the staged files.
2. Why are hooks **not** a gate on their own?
3. What are **tags** for in releases, and what is semantic versioning?
4. Trunk-based development vs GitFlow — which one fits continuous delivery, and what makes it safe?

> [!success]- Solution — Level 3
> 1. Husky installs Git hooks from the repository, so every developer gets the same ones. On `pre-commit`, lint-staged runs commands on **only the staged files**, so it stays fast:
>    ```json
>    "lint-staged": {
>      "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
>      "*.{css,md,json}": ["prettier --write"]
>    }
>    ```
>    A `commit-msg` hook can also enforce Conventional Commits (`feat:`, `fix:`), which release tooling reads.
> 2. Hooks run on the developer's machine and can be skipped with `git commit --no-verify`. They give **fast feedback**; the **gate** is CI plus branch protection, which nobody can skip.
> 3. A **tag** marks the exact commit that was released (`v2.4.0`), so you can rebuild it, diff two releases, or roll back to it. **Semantic versioning**: MAJOR for breaking changes, MINOR for new backwards-compatible features, PATCH for fixes. Tools like Changesets or semantic-release generate the version and changelog from the commits.
> 4. **Trunk-based**: everyone merges small changes to `main` at least daily, behind **feature flags** when unfinished; `main` is always releasable. That is what continuous delivery needs. **GitFlow**: long-lived `develop` and `release` branches — suited to versioned products shipped on a schedule, but long branches mean painful merges. What makes trunk-based safe is the gate chain above plus feature flags.

---

## Level 4 — Write the ADR

The panel's scenario: *your team moves the communication between two services from synchronous REST to Kafka.* Invent the details you need — say, the order service called the notification service over REST, and every outage of notifications made checkout fail.

Write `reto09/adr-0007-orders-to-notifications-via-kafka.md` with these sections: **Title · Status · Date · Context · Decision · Alternatives considered · Consequences**. Keep it under one page.

Then: where does the file live, who reviews it, and what happens to it in two years when the team moves to a different broker?

> [!success]- Solution — a model ADR
> ```markdown
> # ADR-0007: Order service publishes events to Kafka instead of calling notifications over REST
>
> Status: Accepted · Date: 2026-10-21 · Deciders: checkout team, platform team
>
> ## Context
> Checkout calls the notification service synchronously over REST after every order.
> When notifications are slow or down, checkout times out and the order fails —
> three incidents last quarter, the longest 40 minutes. Notifications are not needed
> to complete an order; they only need to happen eventually.
>
> ## Decision
> The order service publishes an `OrderPlaced` event to the `orders` Kafka topic and
> returns. The notification service consumes the topic. Delivery is at-least-once,
> so the consumer is idempotent on the order id.
>
> ## Alternatives considered
> - Keep REST, add retries and a circuit breaker — protects checkout, but notifications are lost while the breaker is open.
> - A job queue (SQS) — simpler, but only one consumer; analytics and loyalty also want this event.
> - An outbox table polled by notifications — no new infrastructure, but tight coupling to the orders database.
>
> ## Consequences
> + A notification outage no longer affects checkout.
> + New consumers (loyalty, analytics) subscribe without touching the order service.
> − Eventual consistency: an email can arrive seconds later.
> − New operational cost: a Kafka cluster, consumer lag monitoring, a dead-letter topic.
> − Event schema changes now need versioning (a schema registry).
> ```
>
> - **Where**: in the repository, `docs/adr/`, numbered, next to the code it explains — so it is versioned, reviewed and found with the code, not lost in a wiki or a Jira comment.
> - **Who reviews it**: it goes through a **pull request** like code, ideally after a **design review** (an RFC discussed with the affected teams) for decisions this size.
> - **In two years**: nobody edits it. A new ADR, *"ADR-0031: move events from Kafka to …"*, states that it **supersedes** ADR-0007, and 0007's status changes to *Superseded by ADR-0031*. A new engineer can read the whole chain of *why*.

---

## Level 5 — Choose the deployment strategy

For each situation, choose among **rolling**, **blue-green**, **canary**, **feature flag**, or a combination, and say how you would **roll back**:

1. A new checkout flow for a hotel site with high traffic, where a bug costs money every minute.
2. A database migration that renames a column used by the running app.
3. A redesigned search page that product wants to show to 10% of users and compare conversion.
4. A security patch to a stateless API running on 20 instances behind a load balancer.
5. A feature that is half-built, but the team practises trunk-based development.

> [!success]- Solution — Level 5
> 1. **Canary**: release to 1–5% of traffic, watch error rate, latency and conversion against the old version, widen in steps, and roll back automatically when a metric crosses a threshold. Often behind a **feature flag** too, so turning it off needs no deploy.
> 2. **Expand and contract**, never a single-step rename: add the new column, deploy code that writes both and reads the new one, backfill, deploy code that uses only the new one, then drop the old column in a later release. Each step is backwards-compatible, so any step can be rolled back — which a rename cannot be once the old code is gone.
> 3. A **feature flag** with percentage targeting — an **A/B test**. That is an experiment, not a deployment problem: deploy once and change the audience without deploying.
> 4. **Rolling**: replace instances a few at a time while the rest keep serving. Or **blue-green** if you want an instant switch back: two full environments, the load balancer flips to green, and blue stays warm for rollback.
> 5. **Feature flag**, off in production: the code merges and deploys continuously but is dark until it is ready. Remove the flag when the feature is done — old flags are technical debt.
>
> The principle under all of them: **separate deploy from release**, and keep every step reversible.

---

## Level 6 — Technical debt and design reviews

1. The panel asked how you **organise and distribute** technical debt across the team. Answer with a mechanism, not intentions.
2. When does a change need a **design review** before code, and what does one look like?

> [!success]- Solution — Level 6
> 1. "Debt goes into the backlog as tickets in a **tech-debt epic**, each with the **cost of not fixing it** — incidents, slowed delivery, risk — so it can be prioritised against features by the same product owner. We reserve a **fixed share of every sprint**, usually 15 to 20%, and assign those tickets in planning like any other work, rotating so it isn't always the same people. Small debt is paid with the **boy-scout rule**: when we touch code for a feature, we leave it a little better in the same PR. And big debt — a migration — becomes its own project with milestones, not 'when someone has time'."
> 2. When it is **hard to reverse** or **crosses team boundaries**: a new service or data store, a public API contract, a cross-cutting library, anything security- or cost-sensitive. It looks like a short written **RFC** — problem, proposal, alternatives, risks, rollout — shared a few days before a 30–45 minute review with the affected teams; the outcome is recorded as an **ADR**.

---

## Level 7 — Say it out loud

Answer the panel's three questions, each in under two minutes, in English:

1. *"If you designed the quality gates, what would you require before a pull request can be merged into a large production application?"*
2. *"Your team moves two services from REST to Kafka. How do you document the decision so a later engineer understands why?"*
3. *"How do you handle technical debt, and how do you organise and distribute it in the team?"*

> [!success]- Solution — Level 7
> 1. "I'd order the gates from cheapest to most expensive, and make every one of them blocking. Locally, a pre-commit hook lints and formats the staged files — fast feedback, but skippable, so not the gate. On the pull request: lint and type-check, unit and component tests with coverage on the changed lines, a SonarQube quality gate, a dependency and secret scan, then the build, then e2e smoke tests against a preview deployment, plus a bundle-size and performance budget. All of these are required checks with branch protection, and at least one human review, which is the only gate that catches design and security problems. After merge, staging smoke tests and a canary rollout with automatic rollback on error metrics."
> 2. "With an Architecture Decision Record in the repository, next to the code: the context — why REST was hurting us — the decision, the alternatives we rejected and why, and the consequences, including the costs we accepted, like eventual consistency and running Kafka. It goes through a pull request, after a design review for a change that size. It's never edited later: if we change our mind, a new ADR supersedes it, so the history of why stays readable."
> 3. *(Level 6, question 1.)*

> [!question] Short answer for the interview — quality gates
> "Cheapest first and all blocking: lint, types, unit and component tests with coverage on changed lines, Sonar, dependency and secret scans, the build, e2e smoke on a preview, a performance budget — as required checks under branch protection, plus a human review for what tools can't judge. Then a canary rollout with automatic rollback."

---

## Done when

- [ ] Level 0 eight defects assigned to a gate
- [ ] Level 1 the chain passing; each gate broken and its error read; the build-only failure seen
- [ ] Level 2 `ci.yml` written; the missing gates listed
- [ ] Level 3 hooks, tags and branch model answered on paper
- [ ] Level 4 ADR written in under a page
- [ ] Level 5 five deployment situations decided, with rollback
- [ ] Level 6 debt mechanism and design review answered
- [ ] Level 7 the three answers recorded
