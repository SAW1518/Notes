---
title: Nordstrom — Frontend Engineer, POS+
tags:
  - position
client: Nordstrom Inc.
project: NDM-SXP
onehub_id: 1086436703
role: Engineer
level: A2–A3
english: B2+
location: Remote, Argentina — client in UTC-07:00 (America/Los_Angeles), flexible schedule
status: Proposed
next_step: Profile review by the project, due 2026-10-14
extracted: 2026-10-09
---

# Nordstrom — Frontend Engineer, POS+

Source: [OneHub position 1086436703](https://onehub.epam.com/opportunities/positions/1086436703), extracted 2026-10-09.

| | |
|---|---|
| **Client** | Nordstrom — US retailer, Nordstrom and Nordstrom Rack stores |
| **Product** | POS+ — the new point-of-sale system for both store brands |
| **Stack** | React, JavaScript, TypeScript, Material UI, React Testing Library, Claude Code. Backend in Java / Spring Boot, observability in New Relic |
| **Level** | A2–A3 · English B2+ |
| **Must-have skills** | JavaScript (Frontend), Anthropic Claude Code, JavaScript, Material UI, React Testing Library, ReactJS, TypeScript |
| **Nice to have** | Java, Spring Boot, New Relic |

## The role

Nordstrom is replacing its point-of-sale infrastructure with POS+. The team owns the user-facing side: the screens store associates use to ring up transactions on the shop floor.

**Responsibilities**
- Build and maintain frontend components in React, JavaScript and TypeScript.
- Unit-test them with React Testing Library.
- Deliver features with backend and product teams.
- Keep a high-availability, store-floor application reliable across the whole store footprint.

**Requirements**
- Proven JavaScript, React and TypeScript.
- AI-assisted development tools, Claude Code named explicitly.
- Strong communication in a cross-functional team.
- Proactive, willing to learn and adapt.

## What the interview will probe

1. **React fundamentals in depth** — hooks, effects, re-renders, forms. A POS is form-heavy and keyboard-heavy.
2. **React Testing Library** — querying by role, `userEvent` vs `fireEvent`, async queries, what not to mock, testing behaviour instead of implementation.
3. **Material UI** — theming, `sx` vs `styled`, overriding component styles, bundle cost, accessibility you get for free and what you still own.
4. **Reliability on the shop floor** — a payment flow that must not double-charge (idempotency, disabled submit, optimistic UI limits), flaky network, error boundaries, offline tolerance.
5. **Claude Code / AI-assisted development** — how you actually use it, what you delegate, how you review its output, where it fails.
6. **Observability** — New Relic browser monitoring, error tracking, what you would alert on in a POS.

## Coverage in the vault

| Requirement | Where | State |
|---|---|---|
| React | [[React]] | Covered |
| TypeScript | [[TypeScript]] | Covered |
| Optimistic UI and failed mutations | [[React#Optimistic UI: three mutations in flight and one fails]] | Covered |
| Forms and validation | [[State Management#4. React Hook Form + Zod — forms and validation]] | Partial — one paragraph |
| Testing strategy | [[Testing and Process#1. Testing]] | Partial — no RTL specifics |
| Accessibility | [[Browser Platform#3. Accessibility and focus management]] | Covered |
| Material UI | — | Missing |
| AI-assisted development | README roadmap → Gen AI Assisted Development | Missing |
| Observability | [[Testing and Process#Still to study]] | Missing |

# Still to study

- [ ] React Testing Library: query priority (`getByRole` first), `userEvent` vs `fireEvent`, `findBy*` and `waitFor`, mocking the network with MSW
- [ ] Material UI: theme, `sx` vs `styled()`, slot overrides, tree-shaking imports
- [ ] Payment-flow reliability: idempotency keys, double-submit protection, retries without duplicates
- [ ] Error boundaries and graceful degradation in a kiosk-like app; offline tolerance
- [ ] Claude Code in practice: plan → implement → review loop, `CLAUDE.md`, what to delegate, how to review generated code
- [ ] New Relic browser monitoring: errors, Core Web Vitals, custom events
- [ ] Java / Spring Boot at reading level: a controller, a DTO, an HTTP status
