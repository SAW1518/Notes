---
title: Polyphonic — URLs by environment
type: environment
area:
  - polyphonic
aliases:
  - dev-euw1
  - sbox-euw1
  - dev url
  - where do I log in to test
  - test mailbox
tags:
  - environment
created: 2026-02-23T12:53:39-06:00
---

# Polyphonic — URLs by environment

| Environment | URL | What for |
|---|---|---|
| **DEV** | https://dev-euw1.nprd.polyphonic.jnjmedtech.com/login | Day-to-day test login |
| **SBOX** | https://sbox-euw1.nprd.polyphonic.jnjmedtech.com | Where the sandbox services run |
| **Mailbox** | https://mail-test.xena.dev/ | Inbox for `@mail-test.xena.dev` users (magic links, codes) |

## Sandbox endpoints I use

Identity resolution by login:

```
https://sbox-euw1.nprd.polyphonic.jnjmedtech.com/jnj-tenant-mgmt-v2-svc/api/v2/principals?login=<url-encoded-email>
```

Managed remote media upload:

```
https://sbox-euw1.nprd.polyphonic.jnjmedtech.com/jnj-media-mgmt-svc/api/v1/files/managed-remote-upload
```

## Tenant IDs that come up often

| Tenant ID | Where I see it |
|---|---|
| `b32af673-24d4-49f2-ad86-886cc858dc7b` | Real tenant in the sandbox logs |
| `da562638-a86d-11ef-b26c-0b52ea46c7fb` | The one that goes in the kcat payloads |
| `a4a93f5f-d158-4ef0-a5ea-3882ba8011bd` | The `userLogin` tenant in the PDP mock |

## Config

Okta client ID for the UI:

```
jnj-security-okta-client-id-ui-polyphonic
```

## See also

- [[Test users]]
- [[Check deployed version]]
- [[Links — Jira, Confluence, pipelines]]
