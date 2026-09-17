---
title: How I find things
aliases:
  - readme
  - how this works
  - convention
tags:
  - meta
---

# How I find things

## Searching fast

1. **`Cmd+O`** and type the **symptom**, not the tool: *"port in use"*, *"kcat"*, *"error 422"*, *"which user do I log in with"*. Every note carries `aliases` with the phrases I actually search for, so it surfaces even when the title says something else.
2. **`Dashboard.base`** — filterable table of everything, with tabs by type (Commands / Environments / Debug / All).
3. **`Cmd+Shift+F`** for full-text search when the above doesn't cut it.

## The convention

Every note carries these properties:

```yaml
type: command | environment | prompt | reference | debug
area: [kafka, git, node, polyphonic, monarch, ottava, ci, java, docker]
aliases: [the phrases I'll actually search for]
tags: [same value as type]
```

And inside:

- **One `##` heading per problem**, named after the symptom (*"Port 8080 is already in use"*), not after the tool.
- **Every command in a ` ```bash ` block** so it's one click to copy.
- Warnings go in callouts: `> [!warning]`, `> [!bug]`, `> [!tip]`.

## The folders

| Folder | What goes here |
|---|---|
| `00 Inbox` | Quick capture. Empty it when it piles up. |
| `01 Commands` | Things I run and keep forgetting. |
| `02 Environments` | URLs, test users, tenants, versions. |
| `03 Prompts` | Templates for AI agents. |
| `04 Project` | Tickets, links, Polyphonic context. |
| `05 Debug` | Dated troubleshooting sessions. Logs inside collapsed callouts. |

## Rules

> [!warning] No real passwords
> This vault syncs to Dropbox in plain text. Real credentials belong in the password manager. Only test users, endpoints and local dev secrets live here.

> [!tip] Long logs
> They go inside `> [!example]- Title` (the trailing dash collapses it), with the conclusion **above**. The log is evidence, not the note.

## Notes

- Backup of the previous layout: `.backup-2026-07-27/` (hidden from Obsidian).
