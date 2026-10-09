# CLAUDE.md

Obsidian interview-prep vault. Reference notes for frontend interviews.

Hard constraints live in `.claude/rules/`. The one that matters most: **nothing about this project is written outside this vault** — it syncs between two Macs.

## How these notes work

`README.md` is the index: the 14 topic notes, the conventions, and the roadmap of what is not written yet. Read it before adding or merging anything.

`_archive/` is provenance only — the old mock-interview sessions and superseded sources. Never study material, never a source for new notes.

## Working rules

**Notes carry no corrections.** A note states the correct fact as prose. No `[!danger] Correction:` callouts, no "N things that were wrong in the original", no references to past mistakes or mock sessions. When a source has `[wrong text] + Correction: [right text]`, the result is the right text folded into the body — keep any useful table or example from the callout, drop the meta-commentary.

One exception: `[!question] Short answer for the interview` callouts stay. Those are study aids, not corrections.

**Notes are in English**, even though we talk in Spanish.

**On an approved multi-step task, keep going** without asking for a go-ahead between steps. Keep the verification (link audits, anchor checks, counts) and keep reporting what changed. Still stop for a real fork: an irreversible delete with a dependency, or a decision that changes the shape of the output.

## Gotchas specific to this vault

- Obsidian resolves `![[grid-01.png]]` by **filename anywhere in the vault**, so images work from `attachments/` with no path.
- JS internal-slot notation (`[[Environment]]`, `[[Prototype]]`, `[[HomeObject]]`) must stay inside backticks or a fence, or Obsidian turns it into a broken wikilink.
- When auditing links: strip fenced blocks before parsing but **keep inline code** — heading anchors legitimately contain backticks, e.g. ``[[TypeScript#`this` — the five rules]]``.
- `Patrones_reales_para_Node_22_y_React.m4a` (63 MB, root) is untranscribed by choice — the only file here that is not searchable.
