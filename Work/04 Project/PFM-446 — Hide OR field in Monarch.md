---
title: PFM-446 — Hide OR field in Monarch
type: reference
area:
  - polyphonic
  - monarch
aliases:
  - PFM-446
  - Operating Room field
  - PR example
tags:
  - reference
  - ticket
created: 2026-05-20T15:43:24-06:00
ticket: PFM-446
---

# PFM-446 — Hide OR field in Monarch

> [!info] Why I keep this
> It's a complete PR description that actually shipped. Use it as a formatting reference alongside [[PR description]].
> Jira: https://aurisrobotics.atlassian.net/browse/PFM-446

## Story

> As a Monarch user, I do not want to see the Operating Room (OR) field as it is not included in Case Edit and it will always be displayed empty.

**Acceptance criteria:** Given a Monarch user, when the user accesses Cases and selects a case, then the Case Info should not show the OR field.

![[adjuntos/PR templete - Attachment.png]]

## Commit message

```
feat(PFM-446): Hide Operating Room field from Monarch case info panel
```

Alternative:

```
fix(PFM-446): Remove OR field from Monarch Case Info per Case Edit consistency
```

## PR description

### Problem statement

Monarch users were seeing an Operating Room (OR) field in the Case Info panel when viewing case details. However, the OR field is not included in the Case Edit UI for Monarch cases and is always displayed as empty, creating confusion and a poor user experience.

### Solution

Modified the Case Details Info Section component to conditionally hide the Operating Room field specifically for Monarch case data sources, ensuring consistency with the Case Edit UI behavior.

### Changes made

**Component** — `apps/polyphonic/app/cases/[id]/_components/CaseDetailsInfoSection/CaseDetailsInfoSection.tsx`

The facility grid now checks `isMonarchCase` on top of the existing conditions. The OR field only renders when it is **not** read-only **and** the source is **not** Monarch:

```tsx
{!isReadOnly && !isMonarchCase && (
  <Grid item xs={6}>
    <CaseInfoBlock
      data-test-id="jnj-case-info-operating-room"
      label={t('operatingRoom')}
      content={surgery.facility?.operatingRoom}
    />
  </Grid>
)}
```

**Tests** — `.../CaseDetailsInfoSection/__tests__/CaseDetailsInfoSection.test.tsx`

- Enhanced the `CaseInfoBlock` mock so it forwards the `data-test-id` prop.
- New suite: *"Operating Room visibility with isMonarchCase"* — verifies the field is hidden for Monarch cases and still shown for non-Monarch (Ottava).

### Verification

Manual: log in as a Monarch user → Cases → select a case → the Case Info panel must not show "Operating Room". With an Ottava case, the field must still appear.

Automated:

```bash
npm run test:ci:polyphonic -- CaseDetailsInfoSection.test.tsx
```

### Affected apps

POLYPHONIC.

### Template checks

- [x] Code owner teams added as required approvers
- [x] Unit tests for the new behavior
- [x] PR linked in the Jira ticket
- [x] No TODOs left in the description
- [x] Screenshots: N/A (field removal — no visual change to show)

### Notes

No breaking changes, no new dependencies, no performance impact (conditional rendering only). Uses the existing translation key `t('operatingRoom')`.

## See also

- [[PR description]]
- [[Links — Jira, Confluence, pipelines]]
