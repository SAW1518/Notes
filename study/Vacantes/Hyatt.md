---
title: Hyatt — Full-stack Engineer, React / Next.js + Java / Spring Boot
tags:
  - position
client: Hyatt Hotels Corporation
project: HYAT-LIFE
onehub_id: 1050978431
role: Engineer
level: A3–A4
english: B2
location: Remote, Argentina
status: Proposed
next_step: Project reviews the profile and may schedule an interview
extracted: 2026-10-09
---

# Hyatt — Full-stack Engineer

Source: [OneHub position 1050978431](https://onehub.epam.com/opportunities/positions/1050978431), extracted 2026-10-09.

| | |
|---|---|
| **Client** | Hyatt Hotels — 1000+ properties, 60+ countries, 19 brands |
| **Product** | Guest-facing digital experience |
| **Stack** | React, Next.js (SSR), Java, Spring Boot. Nice: Node.js, Redux, Dust.js (legacy templating), accessibility |
| **Level** | A3–A4 — senior-to-lead: client communication, code review and architecture docs are in the responsibilities · English B2 |
| **Must-have skills** | JavaScript (Fullstack), Front-End Development, Java, Next.js, ReactJS, Spring Boot |
| **Nice to have** | Accessibility in HTML / CSS, Node.js, Redux, dust |

## The role

A full-stack engineer who is an **expert in React and Next.js** and can modify and add API endpoints in Java / Spring Boot. Frontend-heavy, but the backend half is a must-have, not a nice-to-have.

**Responsibilities**
- Talk to the client to clarify requirements and align expectations.
- Regular code reviews; uphold quality standards.
- Write and maintain architecture docs and team guidelines.
- Build frontend components with React and Next.js.
- Build and modify API endpoints in Java and Spring Boot.

**Skills**
- Strong modern frontend, React as a must.
- Designing scalable solutions; informed technical decisions across frontend topics.
- Problem solving and communication.
- Next.js and server-side rendering.
- Web accessibility — "can be learned on project".
- API development with Java and Spring Boot.

## What the interview will probe

1. **Next.js in depth** — App Router vs Pages Router, Server Components vs Client Components, the `"use client"` boundary, data fetching and caching, static vs dynamic rendering, ISR, streaming with Suspense, middleware.
2. **SSR and hydration** — what is sent, what hydrates, hydration mismatches and their causes, the cost of hydrating everything.
3. **Architecture decisions** — how you document one (ADRs), how you pick between options, how you write team guidelines that people follow.
4. **Java / Spring Boot** — a REST controller, DTOs and validation, the service/repository layering, status codes and error handling, how the frontend contract is kept in sync.
5. **Client communication** — clarifying a vague requirement, saying no, aligning expectations at lead level.
6. **State** — Redux vs server-state libraries, and what the App Router changes about client state.

## Coverage in the vault

| Requirement | Where | State |
|---|---|---|
| React | [[React]] | Covered |
| SSR, hydration | [[React#Server-side rendering]] · [[React#Hydration, explained to a non-technical PM]] | Partial — no Next.js App Router, no RSC |
| Rendering strategies | [[React#The rendering strategies in one line each]] | Partial |
| Redux | [[State Management#Redux]] | Covered |
| API contracts | [[TypeScript Boundary#Contracts: codegen and contract tests]] | Covered |
| Code review, client conflict | [[Testing and Process#3. Code review]] · [[Testing and Process#How would you convince a customer to use a different framework?]] | Covered |
| Accessibility | [[Browser Platform#3. Accessibility and focus management]] | Covered |
| Next.js App Router, RSC | README roadmap → Web Application Rendering Strategies | Missing |
| Java / Spring Boot | — | Missing |
| Node.js | README roadmap → Node.js | Missing |
| Architecture docs (ADRs) | — | Missing |

# Still to study

- [ ] Next.js App Router: Server vs Client Components, `"use client"`, layouts, `fetch` caching and revalidation, Server Actions, streaming
- [ ] Hydration mismatches: causes (dates, `window`, random IDs) and fixes; `useId`
- [ ] Spring Boot essentials: `@RestController`, `@RequestMapping`, DTO + Bean Validation, `@ControllerAdvice`, service/repository layers, JPA basics
- [ ] Keeping a Java API and a TS frontend in sync: OpenAPI and codegen
- [ ] Architecture Decision Records: format, when to write one
- [ ] Dust.js — just enough to recognise it and talk about migrating off a legacy template engine
