# Claude Code setup for this vault

Everything in this `.claude/` folder syncs with the vault via Dropbox, so the
skills themselves need no installation on a new machine. Two of the five skills
shell out to command-line tools that live **outside** the vault — those must be
installed once per Mac.

## What syncs with the vault (nothing to do)

| Path | Purpose |
|------|---------|
| `skills/obsidian-markdown/` | Wikilinks, embeds, callouts, properties |
| `skills/obsidian-bases/` | `.base` files — views, filters, formulas |
| `skills/json-canvas/` | `.canvas` files — nodes, edges, groups |
| `skills/obsidian-cli/` | Vault operations via the Obsidian CLI |
| `skills/defuddle/` | Clean markdown extraction from web pages |
| `settings.json` | Pre-approves the read-only CLI commands the skills use |

Source: <https://github.com/kepano/obsidian-skills> (MIT, see `SKILLS-LICENSE`).

## What does NOT sync — install these on each new Mac

### 1. Obsidian CLI — needed by the `obsidian-cli` skill

The CLI ships inside the Obsidian desktop app; it is not a separate download.

1. Install Obsidian 1.13 or newer from <https://obsidian.md>.
2. Enable the CLI from within Obsidian, which symlinks
   `/usr/local/bin/obsidian` to `/Applications/Obsidian.app/Contents/MacOS/obsidian-cli`.
3. Open this vault in Obsidian at least once so the CLI can resolve it by name.

Verify:

```sh
obsidian version
obsidian vault list   # should list this vault
```

### 2. Defuddle — needed by the `defuddle` skill

Requires Node.js. Install globally:

```sh
npm install -g defuddle
```

Verify:

```sh
defuddle --version
```

Without these, the other three skills (`obsidian-markdown`, `obsidian-bases`,
`json-canvas`) still work — they are pure text-editing skills with no external
dependencies.

## Verifying the whole setup

Run from the vault root:

```sh
ls .claude/skills                              # expect 5 directories
obsidian vault list && defuddle --version      # expect no errors
```

Then restart Claude Code — skills are loaded at session start.

## Updating the skills

These were copied manually, so they do not auto-update. To refresh:

```sh
git clone --depth 1 https://github.com/kepano/obsidian-skills.git /tmp/obsidian-skills
rsync -a --delete /tmp/obsidian-skills/skills/ .claude/skills/
```

Installed from upstream commit `a1dc48e` (2026-06-08), plugin version 1.0.1.
