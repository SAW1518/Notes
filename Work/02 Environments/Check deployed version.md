---
title: Check deployed version
type: environment
area:
  - polyphonic
  - ci
aliases:
  - which version is deployed
  - deployed tag
  - meta version
tags:
  - environment
created: 2026-05-20T12:12:34-06:00
---

# Check deployed version

The portal exposes the version in a `<meta>` tag. Open the site, view source (`Cmd+Opt+U`) and search for `name="version"`:

```html
<meta name="version" content="6.0.0-26051980-f4195f55">
```

Format: `<version>-<build>-<commit>`. The last segment is the short SHA — use it to cross-reference against the pipeline.

From the browser console:

```js
document.querySelector('meta[name="version"]').content
```

## See also

- [[Polyphonic — URLs by environment]]
- [[Links — Jira, Confluence, pipelines]]
