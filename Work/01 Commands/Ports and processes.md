---
title: Ports and processes
type: command
area:
  - node
  - docker
aliases:
  - port in use
  - address already in use
  - EADDRINUSE
  - kill process
  - lsof
tags:
  - command
created: 2026-03-25T16:19:03-06:00
---

# Ports and processes

## Port 8080 is already in use

```bash
lsof -i :8080
kill -9 <PID>
```

Shows up when Node throws `EADDRINUSE` or `address already in use`. Swap `8080` for whichever port you need.

## Check for a stuck Nest process

```bash
ps aux | grep nest
```

Useful when Kafka says the consumer group still has active members even though you already stopped the app. See [[Kafka — kcat and consumer groups#Error — Group is not empty]].

## See also

- [[Kafka — kcat and consumer groups]]
- [[Run services locally]]
