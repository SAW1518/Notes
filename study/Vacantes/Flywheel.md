---
title: Flywheel — Senior Frontend Engineer, medical imaging viewer
tags:
  - position
client: Flywheel.io
project: FLYW-SRE
onehub_id: 1079289685
role: Engineer
level: A2–A3
english: B2+
location: Remote, Argentina
status: Proposed
next_step: Position interest check, due 2026-10-05
extracted: 2026-10-09
---

# Flywheel — Senior Frontend Engineer

Source: [OneHub position 1079289685](https://onehub.epam.com/opportunities/positions/1079289685), extracted 2026-10-09.

| | |
|---|---|
| **Client** | Flywheel.io — research platform for medical imaging data |
| **Team** | Flywheel Viewer — next-generation web-based medical imaging viewer |
| **Stack** | TypeScript + React (the viewer), Angular (the wider frontend app), Vitest, Playwright, GitLab CI. Backend in Python and Go |
| **Level** | A2–A3 · 8+ years · English B2+ |
| **Must-have skills** | JavaScript (Frontend), Angular, Playwright, ReactJS, TypeScript, API & Integration Platforms, DICOM Medical Viewers |

## The role

Build new capabilities in a medical image viewer used by researchers to run imaging studies. The ad stresses that the job goes beyond writing code: analysing problems, designing solutions and managing complexity together with engineers, designers and product owners.

**Responsibilities**
- Design, build and maintain key features of the viewer (TypeScript + React).
- Analyse problems with the engineering team, propose solutions, implement them.
- Work with Product and Design on intuitive, responsive UIs that follow the design system.
- Full Scrum participation: refinement, planning, stand-ups, retros.
- Contribute to the Angular frontend when needed.

**Must have**
- OHIF / DICOM experience — stated as a hard requirement.
- 8+ years; strong TypeScript and React.
- Strong verbal and written communication.
- Comfortable with the API layer: reading backend code, tracing a bug across the client/server boundary, giving feedback on endpoint design.
- Testing tooling: Vitest and Playwright.
- Modern frontend architecture, state management, component-based design.
- Clean, maintainable, performant solutions to complex problems.
- Working directly with UX designers, product owners and engineering leads on architecture decisions.

**Nice to have**
- DICOM, OHIF or other medical imaging standards and libraries.
- Regulated environments, healthcare or clinical-trial software.
- Python or Go.
- CI/CD, GitLab CI in particular.
- Modern Angular.
- Contributions to large open-source projects (OHIF is one).

## What the interview will probe

1. **Rendering heavy data in the browser** — large images, canvas/WebGL, keeping the main thread free (workers, `OffscreenCanvas`), memory pressure from big `ArrayBuffer`s.
2. **The API boundary** — tracing a bug from the UI to the endpoint, validating responses at runtime, critiquing an endpoint design (pagination, partial responses, streaming large payloads).
3. **React architecture** for a complex, stateful tool — where viewer state lives, avoiding re-renders of the canvas, extension/plugin architecture (OHIF is built on extensions and modes).
4. **Testing** — what goes in Vitest vs Playwright, testing a canvas-based UI.
5. **DICOM / OHIF** — at least the vocabulary: study → series → instance, DICOMweb (WADO-RS, QIDO-RS, STOW-RS), Cornerstone3D under OHIF.
6. **Angular** — enough to work in it: components, DI, RxJS, signals, change detection.
7. **Communication** — disagreeing with a design, pushing back on an endpoint, explaining a trade-off to a PO.

## Coverage in the vault

| Requirement | Where | State |
|---|---|---|
| React re-renders, memoisation | [[React#2. Re-renders and memoisation]] | Covered |
| Large lists / heavy UI performance | [[React#A component with thousands of rows — how do you avoid the performance problem?]] · [[Browser Platform#1. The rendering pipeline and jank]] | Partial — nothing on canvas, WebGL or workers |
| TypeScript | [[TypeScript]] | Covered |
| API boundary, runtime validation | [[TypeScript Boundary]] | Covered |
| State management | [[State Management]] | Covered |
| Testing strategy | [[Testing and Process#1. Testing]] | Partial — no Vitest/Playwright specifics |
| Scrum | [[Testing and Process#What Scrum actually says about changing a Sprint]] | Covered |
| Angular | README roadmap | Missing |
| DICOM / OHIF | — | Missing |
| GitLab CI | [[Testing and Process#2. CI, delivery and deployment]] | Partial — generic |

# Still to study

- [ ] DICOM basics: study / series / instance, DICOMweb (WADO-RS, QIDO-RS, STOW-RS), pixel data and transfer syntaxes
- [ ] OHIF Viewer architecture: extensions, modes, Cornerstone3D, the hanging protocol
- [ ] Canvas vs WebGL for image rendering; Web Workers and `OffscreenCanvas`; transferring `ArrayBuffer`s
- [ ] Playwright: locators, auto-waiting, fixtures, tracing; Vitest vs Jest
- [ ] Angular essentials: standalone components, DI, RxJS, signals, change detection
- [ ] Software for regulated environments: audit trails, traceability, validation
