---
title: Test users
type: environment
area:
  - polyphonic
  - monarch
aliases:
  - test accounts
  - which user do I log in with
  - surgeon
  - monarch admin
  - case manager
tags:
  - environment
created: 2026-02-23T12:53:39-06:00
---

# Test users

> [!warning] No passwords here
> This vault syncs to Dropbox in plain text. Passwords belong in the password manager, never in this note. This is only which user is good for what.
> Codes and magic links arrive at https://mail-test.xena.dev/

| User                                                       | Role                   | When I use it                                       |
| ---------------------------------------------------------- | ---------------------- | --------------------------------------------------- |
| polyphonic-sit-surgeon-and-case-manager@mail-test.xena.dev | Surgeon + Case Manager | **The one that already has cases loaded**           |
| polyphonic-sit-surgeon@mail-test.xena.dev                  | Surgeon                | Surgeon-only view                                   |
| polyphonic-sit-monarch-admin@mail-test.xena.dev            | Monarch Admin (SIT)    | Admin in SIT                                        |
| polyphonic-pm-monarch-admin@mail-test.xena.dev             | Monarch Admin (PM)     | The one that shows up in the sandbox ingestion logs |
| polyphonic-surgeon-monarch@mail-test.xena.dev              | Enterprise surgeon     | Enterprise user inside the Monarch tenant           |
|                                                            |                        |                                                     |
Nimda_00001.
## See also

- [[Polyphonic — URLs by environment]]
- [[2026-06-25 — Monarch preingestion 422]]
