---
name: vault-memory
description: Save anything that must be remembered about this vault INSIDE the vault, never in ~/.claude or any external path. Use when asked to remember, note down, save a preference, update context files, or persist a decision for future sessions — and before writing to any memory directory.
---

# Vault Memory

This vault is synced between two Macs. **Anything written outside it exists on one machine only** and silently desyncs — the other Mac will never see it, and neither will a future session there.

So: everything that must be remembered about this project lives in the vault, in git.

## Never write to

- `~/.claude/projects/<anything>/memory/` — the harness default for auto-memory. Disabled here via `autoMemoryEnabled: false` in `.claude/settings.json`, but the instinct to reach for it survives, so check.
- `~/.claude/CLAUDE.md` or user-level settings, for anything project-specific.
- `/tmp`, the scratchpad directory, or any absolute path outside this repo, for anything that must outlive the session.

If a tool or default points outside the vault, that is the bug — do not follow it.

## Where it goes instead

| What | Where |
|---|---|
| A working rule, a preference, how to do things here | `CLAUDE.md` at the vault root — auto-loaded every session |
| Subject matter worth studying | A topic note, listed in `README.md` |
| A structural decision or convention | `README.md` |
| A gap or an open item | The `# Still to study` section of the relevant note |
| Config that must apply on both Macs | `.claude/settings.json` (checked in). **Not** `settings.local.json` for anything shared |

`CLAUDE.md` is loaded into context on every session in this directory, so keep it tight: rules and gotchas, not content. Content belongs in a note.

## Procedure

1. Decide which of the five destinations above fits. When in doubt between `CLAUDE.md` and a note: if it changes *how I work*, it is `CLAUDE.md`; if it is something to *learn*, it is a note.
2. Read the target file first and merge — never replace.
3. If it is a new note, add its row to `README.md`. An unlisted note is a lost note.
4. Commit it. Uncommitted means unsynced, which is the same problem as writing it outside.

## Checks

- `git status` clean afterwards, or the change is committed — not left in the working tree.
- Nothing new under `~/.claude/projects/`. Verify with `ls ~/.claude/projects/*/memory/ 2>/dev/null` if auto-memory was ever in play.
- Project-wide settings in `.claude/settings.json`, not `settings.local.json`.

## Note on `autoMemoryDirectory`

Pointing auto-memory into the vault looks like the clean fix, but `autoMemoryDirectory` is **ignored when set in a checked-in `.claude/settings.json`** (a deliberate security restriction), and `settings.local.json` is per-machine. So the setting cannot be made to sync. `autoMemoryEnabled: false` plus this skill is the arrangement that actually holds on both machines.
