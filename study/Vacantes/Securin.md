---
title: Securin — Senior / Lead Frontend Engineer, AI-native security platform
tags:
  - position
client: Securin
project: SCRN-ENG
onehub_id: 1103802431
role: Engineer
level: A3–A4
english: B2+
location: Remote, Argentina
status: Proposed
next_step: Project reviews the profile and may schedule an interview
extracted: 2026-10-09
---

# Securin — Senior / Lead Frontend Engineer

Source: [OneHub position 1103802431](https://onehub.epam.com/opportunities/positions/1103802431), extracted 2026-10-09.

| | |
|---|---|
| **Client** | Securin — cybersecurity, Proactive Exposure Management |
| **Stack** | JavaScript, React. GenAI tools (Claude, ChatGPT) as part of daily delivery |
| **Level** | A3–A4 — this is the senior-to-lead one: mentoring and code-review leadership are in the responsibilities · English B2+ |
| **Must-have skills** | JavaScript (Frontend), Front-End Development, Generative AI Fundamentals, JavaScript, ReactJS |
| **Nice to have** | AI Security, Cybersecurity & Trust, Gen AI Application Development, Gen AI in SDLC |

## The role

Frontend lead-level engineer at a company that wants to be "AI-native": GenAI embedded in delivery, not used occasionally. The ad expects you to move from using GenAI to building with it — agent workflows and reusable skills.

**Responsibilities**
- Design, build and optimise responsive, user-friendly web apps.
- Architect reusable code libraries and frameworks: scalable, maintainable, performant.
- Work with PMs, designers and backend engineers on accessible UIs; turn wireframes into code and give design feedback.
- Mentor junior developers; lead code reviews.
- Analyse and optimise performance: load times, smooth interaction.
- Debug complex cross-device, cross-browser issues.
- Drive adoption of new technologies and best practices.
- Unit and end-to-end testing; work with QA before releases.

**Leadership requirements**
- Inspire and guide teams; care for team growth and morale.
- Align engineering goals with business strategy; anticipate technical trends.
- Handle changing priorities and ambiguity under pressure.
- Assess risks, make decisions, mitigate.
- Encourage continuous learning in the team.

**Core AI requirements**
- Use GenAI daily: drafting, research, summarising, analysis, code generation, workflow automation.
- Know the limits: hallucination, context-window constraints, data sensitivity; validate output before acting on it.
- Prompt engineering: multi-step instructions, giving context, iterating to production quality.
- Agentic workflows: using, designing or building multi-step agents with human-in-the-loop validation.
- AI security: prompt injection, data classification, sandboxed execution, handling sensitive data.
- Connecting GenAI tools to internal data sources, APIs and enterprise systems.
- Contributing reusable skills, templates, agent configurations to a shared repository.

## What the interview will probe

1. **Frontend architecture at lead level** — designing a shared component library or internal framework, versioning it, getting other teams to adopt it.
2. **Performance as a process** — measure, find the cause, fix, measure again. Core Web Vitals, bundle size, long tasks.
3. **Leadership** — mentoring a junior, running code reviews, handling a disagreement, a missed deadline, ambiguous requirements.
4. **GenAI in practice** — how you use it daily, how you verify its output, an example of an agent workflow you built or would build.
5. **AI security** — prompt injection (direct and indirect), why an LLM with tool access is a confused deputy, sandboxing, least privilege, not pasting classified data.
6. **Web security** — they sell security; expect XSS, CSP, token storage and dependency vulnerabilities.

## Coverage in the vault

| Requirement | Where | State |
|---|---|---|
| React, JavaScript | [[React]] · [[JavaScript]] | Covered |
| Performance | [[Browser Platform]] · [[React#How I improved the performance of a React app]] | Covered |
| Reusable architecture, patterns | [[Design Patterns]] | Covered |
| Code review, mentoring, delegation | [[Testing and Process#How would you establish a code review process on a new project?]] · [[Testing and Process#How do you delegate properly, and what can be delegated?]] | Covered |
| Testing | [[Testing and Process#1. Testing]] | Covered |
| Web security | [[Security]] | Covered |
| GenAI fundamentals, agents, prompting | README roadmap → Gen AI Assisted Development | Missing |
| AI security, prompt injection | — | Missing |

# Still to study

- [ ] GenAI fundamentals: tokens, context window, temperature, hallucination, why output must be verified
- [ ] Prompt engineering: structure, examples, decomposition into steps, iterating against a check
- [ ] Agentic workflows: tool use, the agent loop, human-in-the-loop checkpoints, MCP
- [ ] AI security: direct vs indirect prompt injection, data exfiltration through tools, sandboxing, least privilege — OWASP Top 10 for LLM Applications
- [ ] Building a shared component library: versioning, changelogs, adoption, design tokens
- [ ] Leadership stories prepared in STAR form: mentoring, a hard code review, a risk you flagged early
