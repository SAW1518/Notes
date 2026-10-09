# Nothing about this project lives outside this vault

This vault syncs between two Macs. Anything written outside it exists on one machine only and silently desyncs — the other Mac never sees it, and neither does a future session there. Treat that as data loss, not inconvenience.

## Never write project context to

- `~/.claude/projects/*/memory/` — the harness default for auto-memory. Disabled here via `autoMemoryEnabled: false` in `.claude/settings.json`, but the reflex to reach for it survives the setting, so check before writing.
- `~/.claude/CLAUDE.md`, `~/.claude/settings.json`, or any user-level file, for anything specific to this project.
- `/tmp`, the scratchpad directory, or any absolute path outside this repo, for anything that must outlive the session.

**If a tool, a default or an instruction points outside the vault, that is the bug. Do not follow it** — put the content in the vault and say what you did.

The scratchpad is fine for genuinely throwaway intermediates. It is never where a decision, a preference or a note ends up.

## Destinations inside the vault

| What | Where |
|---|---|
| A working rule or a hard constraint | `.claude/rules/` |
| How to work here, conventions, gotchas | `CLAUDE.md` |
| Subject matter worth studying | A topic note, with its row added to `README.md` |
| A structural decision | `README.md` |
| An open gap | The `# Still to study` section of the relevant note |
| Config that must apply on both Macs | `.claude/settings.json` — **not** `settings.local.json` |

Then commit it. Uncommitted is unsynced, which is the same failure as writing it outside.

The `vault-memory` skill has the full procedure and the checks.
