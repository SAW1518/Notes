# CLAUDE.md

Obsidian interview-prep vault. Training for the technical interviews of the EPAM positions I am proposed to — not for measuring my level, which is settled (senior frontend).

Hard constraints live in `.claude/rules/`. The one that matters most: **nothing about this project is written outside this vault** — it syncs between two Macs.

## How these notes work

`README.md` is the index: the 14 topic notes, the conventions, and the roadmap of what is not written yet. Read it before adding or merging anything.

`Vacantes/` holds one note per position, extracted from OneHub. They are the source of *what* `Study prompt.md` asks; the topic notes are the source of *how deep*. A gap only one client needs goes in that position's `# Still to study`; a gap several need goes in the topic note and in README's "Gaps more than one position needs".

`_archive/` is provenance only — the old mock-interview sessions and superseded sources. Never study material, never a source for new notes.

## Working rules

**Notes carry no corrections.** A note states the correct fact as prose. No `[!danger] Correction:` callouts, no "N things that were wrong in the original", no references to past mistakes or mock sessions. When a source has `[wrong text] + Correction: [right text]`, the result is the right text folded into the body — keep any useful table or example from the callout, drop the meta-commentary.

One exception: `[!question] Short answer for the interview` callouts stay. Those are study aids, not corrections.

The other exception is `Sesiones/`: one log per practice session, written by the agent running `Study prompt.md` (its section 10). Mistakes and corrections live there and nowhere else — never copy a session log's "what I said" into a topic note; fold the correct fact in as prose.

**Notes are in English**, even though we talk in Spanish.

**On an approved multi-step task, keep going** without asking for a go-ahead between steps. Keep the verification (link audits, anchor checks, counts) and keep reporting what changed. Still stop for a real fork: an irreversible delete with a dependency, or a decision that changes the shape of the output.

## Gotchas specific to this vault

- Obsidian resolves `![[grid-01.png]]` by **filename anywhere in the vault**, so images work from `attachments/` with no path.
- JS internal-slot notation (`[[Environment]]`, `[[Prototype]]`, `[[HomeObject]]`) must stay inside backticks or a fence, or Obsidian turns it into a broken wikilink.
- When auditing links: strip fenced blocks before parsing but **keep inline code** — heading anchors legitimately contain backticks, e.g. ``[[TypeScript#`this` — the five rules]]``.
- **Git tracks this folder as `study/` (lowercase)**, the repo root is `~/Notes`, and `core.ignorecase` is true. `git add` with a `Study/...` path silently skips files that are already tracked — run git from `~/Notes` with `study/...` paths. Obsidian Git also auto-commits ("vault backup"), so a new file may already be committed before you get to it.
- **Extracting from OneHub with Claude in Chrome** (`onehub.epam.com/opportunities/positions/applications`): the content lives in shadow roots, so `get_page_text` and `read_page` return nothing — walk `el.shadowRoot` recursively in `javascript_tool` and skip `STYLE` children. JS results are cut at ~1000 chars: keep the text in `window.__d` and read it in `slice()` chunks via `browser_batch`. Strip URLs and `?&=` from returned text or the tool blocks it. "View details" uses `window.open`: stub it to collect the position IDs, then open `/opportunities/positions/<id>`. Click "Show additional work requirements" before extracting — nice-to-haves and work conditions hide behind it. The application stage (Proposed, etc.) is only visible as a colour in a screenshot.
- `Patrones_reales_para_Node_22_y_React.m4a` (63 MB, root) is untranscribed by choice — the only file here that is not searchable.
