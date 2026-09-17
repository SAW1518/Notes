---
title: Run services locally
type: command
area:
  - polyphonic
  - java
aliases:
  - gradlew bootRun
  - run feature flags locally
  - FF repo local
  - skip auth locally
tags:
  - command
created: 2026-02-23T12:53:39-06:00
---

# Run services locally

## Run the Feature Flags repo locally

With OAuth2, RBAC and ABAC disabled so you don't fight the auth layer:

```bash
POSTGRES_USERNAME=postgres \
POSTGRES_PASSWORD=postgres \
EXT_JNJ_JWT_KID=local-dev-kid \
EXT_JNJ_JWT_SECRET_ALGORITHM=HmacSHA256 \
EXT_JNJ_JWT_SECRET=dGhpcy1pcy1hLXNlY3JldC1rZXktZm9yLWxvY2FsLWRldmVsb3BtZW50LW9ubHk= \
./gradlew :app:bootRun --args='--spring.profiles.active=local --jnj.security.oauth2.enabled=false --jnj.security.rbac.enabled=false --jnj.security.abac.authorization-token.required-for-administrators=false'
```

> [!note] About the JWT secret
> That base64 decodes to `this-is-a-secret-key-for-local-development-only`. It's a dev value — useless in any real environment.

## Sandbox environment variables

Full file attached: [[adjuntos/Robotics in sbox - env.sbox]]

## See also

- [[Kafka — kcat and consumer groups]]
- [[Ports and processes]]
- [[Polyphonic — URLs by environment]]
