---
title: Git
type: command
area:
  - git
aliases:
  - git stash
  - save changes without committing
  - undo last commit
  - stash pop
tags:
  - command
created: 2026-04-08T11:22:13-06:00
---

# Git

## Save changes without committing (including new files)

```bash
git stash -u
```

`-u` includes untracked files. Without it, new files stay in the working tree.

## Restore the last thing I stashed

```bash
git stash pop
```

## Stash with a name so I can identify it

```bash
git stash push -m "descriptive name"
```

List them with `git stash list`. Pop a specific one with `git stash pop stash@{2}`.

## Undo the last commit but keep the changes

```bash
git reset --soft HEAD~1
```

Changes go back to the staging area. With `--hard` they are lost.

## See also

- [[Ports and processes]]
- [[PR description]] — for generating the PR description
