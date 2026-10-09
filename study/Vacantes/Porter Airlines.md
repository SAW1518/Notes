---
title: Porter Airlines — Key Engineer, customer-facing web
tags:
  - position
client: Porter Airlines
project: PRTR-DMOD
onehub_id: 1103088330
role: Key Engineer
level: A2–A3
english: B2+
location: Remote, Argentina
status: Proposed
next_step: Project reviews the profile and may schedule an interview
extracted: 2026-10-09
---

# Porter Airlines — Key Engineer

Source: [OneHub position 1103088330](https://onehub.epam.com/opportunities/positions/1103088330), extracted 2026-10-09.

| | |
|---|---|
| **Client** | Porter Airlines — Canadian airline |
| **Product** | Customer-facing self-service web: booking, managing trips, the whole traveller journey |
| **Stack** | HTML5, CSS3, ES6+, React (Angular / Vue also named), Flexbox and Grid, Figma and design systems, Git and CI/CD, WCAG 2.1 AA, analytics and A/B testing, Copilot / Cursor / Claude / ChatGPT. .NET backend |
| **Level** | A2–A3 · English B2+ |
| **Must-have skills** | JavaScript (Fullstack), ReactJS |
| **Nice to have** | Content Management Systems, Gen AI Assisted Development, .NET |

## The role

A cross-functional Agile team (PM, UX, engineers, QA, business) building the airline's public web experience. The ad is written as a profile of what the person will have done, so read it as the list of things to talk about.

**What the work involves**
- Turning UX designs, wireframes and prototypes into production UI with component-based architecture.
- Building and maintaining reusable **design-system components**: consistent, scalable, accessible, on brand, across several channels.
- Responsive work across browsers, devices, screen sizes and accessibility needs.
- AI coding assistants to speed up delivery, automate repetitive work, debug and write docs — with full technical ownership of the result.
- Prototyping with design and product; experimentation: **A/B tests, personalisation, analytics-driven changes**.
- Front-end practice: **WCAG 2.1 AA**, performance, **SEO**, responsive standards, CI/CD, component docs, code review.
- Fixing complex cross-browser, cross-platform issues.

## What the interview will probe

1. **Design systems** — building a component library: API design of a component, variants, tokens, documenting with Storybook, versioning, avoiding the "one prop per edge case" trap. Compound components fit here.
2. **Accessibility at WCAG 2.1 AA** — the four principles (POUR), contrast ratios, keyboard and focus, accessible forms and errors, testing with a screen reader and axe.
3. **HTML and CSS** beyond layout — semantics, the cascade, responsive images, container queries.
4. **Performance and SEO** for a public site — Core Web Vitals on a booking funnel, SSR/SSG for indexability, meta tags, structured data.
5. **Experimentation** — how an A/B test is wired into the frontend without flicker, feature flags, measuring a conversion change.
6. **CMS** — headless CMS, content modelling, preview.
7. **AI-assisted development** — what you use, how you keep ownership of the output.

## Coverage in the vault

| Requirement | Where | State |
|---|---|---|
| React components | [[React]] | Covered |
| Flexbox and Grid, responsive layout | [[CSS]] | Covered |
| Accessibility, focus | [[Browser Platform#3. Accessibility and focus management]] | Partial — no WCAG structure, no forms |
| Performance, Core Web Vitals | [[Browser Platform#The metrics that matter]] | Covered |
| Rendering strategies for SEO | [[React#The rendering strategies in one line each]] | Partial |
| CI/CD, code review | [[Testing and Process]] | Covered |
| Design systems, compound components | README roadmap | Missing |
| HTML semantics, CSS cascade | README roadmap · [[CSS#Still to fill]] | Missing |
| A/B testing, analytics | — | Missing |
| CMS | README roadmap → Content Management Systems | Missing |
| AI-assisted development | README roadmap → Gen AI Assisted Development | Missing |

# Still to study

- [ ] Design systems: tokens, component API design, Storybook, versioning, compound components
- [ ] WCAG 2.1 AA: POUR, the success criteria that come up (1.4.3 contrast, 2.1.1 keyboard, 2.4.7 focus visible, 3.3.1 error identification, 4.1.2 name/role/value)
- [ ] Accessible forms: labels, errors, `aria-describedby`, live regions
- [ ] SEO for a React site: SSR/SSG, meta and Open Graph, canonical URLs, structured data
- [ ] A/B testing on the frontend: flicker, client-side vs server-side assignment, feature flags
- [ ] Headless CMS: content modelling, preview, cache invalidation on publish
- [ ] Cross-browser: feature detection, progressive enhancement, Browserslist
