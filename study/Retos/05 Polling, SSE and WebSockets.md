---
title: "Reto 05 — Polling, SSE and WebSockets"
tags:
  - challenge
  - browser
  - protocols
plan: "Assessment Plan — Tier 2"
status: todo
---

# Reto 05 — Polling, SSE and WebSockets

**Goal:** build the same live feed four ways — short polling, long polling, Server-Sent Events, WebSocket — feel what each one costs, and come out able to say **when long polling beats a WebSocket**. On the way, upload progress done the right way, and the HTTP/1.1 connection limit that HTTP/2 removed.

**Why it matters:** the panel asked at 00:52:27 *"when would you use a long polling strategy over a WebSocket, and what would you take into consideration?"* and at 00:55:44 *"HTTP/1.1 vs HTTP/2 — what improved?"* Both are in the Level Up plan: the resource "WebSockets vs Long Polling" and the Web Communication Protocols gaps (long polling vs WebSocket trade-offs, HTTP/2 beyond more connections).

> [!warning] Do each level before opening its solution
> Predict first, write it down, then build and compare.

---

## The theory you need first

| | Who talks | Transport | Each message costs | Reconnects by itself |
|---|---|---|---|---|
| **Short polling** | client asks every N seconds | normal HTTP requests | a full request, even when there is nothing | — |
| **Long polling** | client asks; server **holds** the request until there is data or a timeout | normal HTTP requests | a full request per batch | your loop does it |
| **SSE** | server → client only | one long HTTP response, `text/event-stream` | a few bytes on an open response | **yes**, and resumes with `Last-Event-ID` |
| **WebSocket** | both ways | one TCP connection upgraded from HTTP, then its own framing | a few bytes on an open socket | **no** — you write it |

---

## Setup

In `Retos/retos-sandbox/`:

1. Install the WebSocket server library: `npm install ws`.
2. Create the files below. They are the **server side** — given, because the reto is about the client and the trade-offs.
3. Run `npm run dev` in one terminal and `node reto05/ws-server.mjs` in another.

> [!tip] A hydration warning that mentions `data-darkreader`
> It is the Dark Reader extension editing the page before React hydrates — not your code. Use an incognito window if it gets in the way.

**`lib/rt-bus.ts`** — an in-memory event bus shared by the routes:

```ts
// An in-memory event bus for reto 05. It lives on globalThis so hot reload does not reset it.
export type RtEvent = { id: number; text: string; at: number };

type Bus = { events: RtEvent[]; listeners: Set<(e: RtEvent) => void>; nextId: number };
const g = globalThis as unknown as { __rtBus?: Bus };
const bus: Bus = (g.__rtBus ??= { events: [], listeners: new Set(), nextId: 1 });

export function publish(text: string): RtEvent {
  const event = { id: bus.nextId++, text, at: Date.now() };
  bus.events.push(event);
  for (const listener of bus.listeners) listener(event);
  return event;
}

export function eventsAfter(id: number): RtEvent[] {
  return bus.events.filter((e) => e.id > id);
}

export function onEvent(listener: (e: RtEvent) => void): () => void {
  bus.listeners.add(listener);
  return () => bus.listeners.delete(listener);
}
```

**`app/api/rt/send/route.ts`** — publishes a notification:

```ts
import { publish } from '@/lib/rt-bus';

export async function POST(request: Request) {
  const { text } = (await request.json()) as { text: string };
  return Response.json(publish(text));
}
```

**`app/api/rt/poll/route.ts`** — short polling:

```ts
import { eventsAfter } from '@/lib/rt-bus';

// Short polling: answer immediately, even when there is nothing new.
export async function GET(request: Request) {
  const after = Number(new URL(request.url).searchParams.get('after') ?? 0);
  return Response.json(eventsAfter(after));
}
```

**`app/api/rt/long/route.ts`** — long polling:

```ts
import { eventsAfter, onEvent, type RtEvent } from '@/lib/rt-bus';

const TIMEOUT_MS = 25_000;

// Long polling: hold the request open until there is something new, or until the timeout.
export async function GET(request: Request) {
  const after = Number(new URL(request.url).searchParams.get('after') ?? 0);

  const pending = eventsAfter(after);
  if (pending.length > 0) return Response.json(pending);

  const events = await new Promise<RtEvent[]>((resolve) => {
    const finish = (result: RtEvent[]) => {
      clearTimeout(timer);
      unsubscribe();
      resolve(result);
    };
    const timer = setTimeout(() => finish([]), TIMEOUT_MS);
    const unsubscribe = onEvent(() => finish(eventsAfter(after)));
    request.signal.addEventListener('abort', () => finish([]));
  });

  return Response.json(events);
}
```

**`app/api/rt/sse/route.ts`** — Server-Sent Events:

```ts
import { eventsAfter, onEvent, type RtEvent } from '@/lib/rt-bus';

// Server-Sent Events: one long HTTP response that the server keeps writing events into.
export async function GET(request: Request) {
  const lastId = Number(request.headers.get('last-event-id') ?? 0);
  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream({
    start(controller) {
      const send = (e: RtEvent) => controller.enqueue(encoder.encode(`id: ${e.id}\ndata: ${JSON.stringify(e)}\n\n`));

      eventsAfter(lastId).forEach(send); // replay what the client missed while disconnected
      const unsubscribe = onEvent(send);
      const heartbeat = setInterval(() => controller.enqueue(encoder.encode(': ping\n\n')), 15_000);

      cleanup = () => {
        clearInterval(heartbeat);
        unsubscribe();
      };
      request.signal.addEventListener('abort', () => {
        cleanup();
        controller.close();
      });
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-store',
      connection: 'keep-alive',
    },
  });
}
```

**`app/api/rt/upload/route.ts`** — receives an upload:

```ts
// Receives an upload and reports its size. The progress is measured in the browser, not here.
export async function POST(request: Request) {
  const body = await request.arrayBuffer();
  return Response.json({ receivedBytes: body.byteLength });
}
```

**`reto05/ws-server.mjs`** — a WebSocket chat server on port 3001:

```js
// A WebSocket chat server for reto 05: every message is broadcast to every connected client.
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (socket) => {
  console.log('client connected; total', wss.clients.size);
  socket.on('message', (data) => {
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) client.send(String(data));
    }
  });
  socket.on('close', () => console.log('client left; total', wss.clients.size));
});

console.log('WebSocket server on ws://localhost:3001');
```

Quick check from a terminal: `curl -N http://localhost:3000/api/rt/sse` stays open; in another terminal, `curl -X POST -H 'content-type: application/json' -d '{"text":"hi"}' http://localhost:3000/api/rt/send` makes an event appear in the first one.

The client you write lives in `app/rt/hooks.ts` and `app/rt/page.tsx`, at `http://localhost:3000/rt`.

---

## Level 0 — Predict before you build

Read `app/api/rt/long/route.ts` again. A client calls `GET /api/rt/long?after=0` in a loop: when a response arrives, it immediately asks again with the last id it received.

1. With nobody publishing, how many requests does that client make in one minute? How many with short polling every 2 seconds?
2. In the Network tab, what does a long-poll request look like while it waits?
3. Three notifications are published within 10 ms. How many responses does the client get, and why is `after` what makes that safe?
4. Why does the server give up after 25 seconds instead of holding the request forever?

> [!success]- Solution — Level 0
> 1. Long polling: about **3** in a minute — one per 25-second timeout. Short polling every 2 s: **30**, almost all of them answering `[]`.
> 2. A request in **pending** state for up to 25 s, then a `200` with `[]` or with events — and immediately a new one.
> 3. Usually **one or two**. The first event resolves the waiting request with everything after `after`; any event that lands before the client's next request is returned straight away by the `pending.length > 0` branch. Because the client always sends the **last id it saw**, nothing is lost or duplicated between two requests. Without that cursor, events published between two requests would vanish.
> 4. Proxies, load balancers and browsers drop HTTP requests that stay silent too long — often after 30–60 s — and a dropped request looks like an error. A timeout shorter than theirs turns that into a clean empty answer. It also frees the server's resources for clients that left.

---

## Level 1 — Long polling, by hand

In `app/rt/hooks.ts` (start it with `'use client';`), write `useLongPoll(): RtEvent[]`:

1. Loops: request `/api/rt/long?after=<last id>`, append what arrives, ask again.
2. Stops cleanly when the component unmounts — no request left running.
3. If the server is down, it does not hammer it: it waits before retrying.

Create `app/rt/page.tsx` with a "Publish a notification" button that POSTs to `/api/rt/send`, and render the events. Then:

- Watch the Network tab for a minute without clicking. Then click three times quickly.
- Stop `npm run dev` for ten seconds and start it again. What happens to your loop?

> [!success]- Solution — Level 1
> ```ts
> 'use client';
>
> import { useEffect, useRef, useState } from 'react';
>
> export type RtEvent = { id: number; text: string; at: number };
>
> export function useLongPoll(): RtEvent[] {
>   const [events, setEvents] = useState<RtEvent[]>([]);
>
>   useEffect(() => {
>     const controller = new AbortController();
>     let after = 0;
>
>     (async () => {
>       while (!controller.signal.aborted) {
>         try {
>           const res = await fetch(`/api/rt/long?after=${after}`, { signal: controller.signal });
>           const batch = (await res.json()) as RtEvent[];
>           if (batch.length > 0) {
>             after = batch[batch.length - 1].id;
>             setEvents((prev) => [...prev, ...batch]);
>           }
>         } catch {
>           if (controller.signal.aborted) return;
>           await new Promise((resolve) => setTimeout(resolve, 2000)); // server down: wait before retrying
>         }
>       }
>     })();
>
>     return () => controller.abort();
>   }, []);
>
>   return events;
> }
> ```
>
> And the start of `app/rt/page.tsx`:
>
> ```tsx
> 'use client';
>
> import { useLongPoll } from './hooks';
>
> async function send(text: string) {
>   await fetch('/api/rt/send', { method: 'POST', body: JSON.stringify({ text }) });
> }
>
> export default function RealtimePage() {
>   const longPoll = useLongPoll();
>   return (
>     <main style={{ display: 'grid', gap: 24, padding: 24, fontFamily: 'system-ui' }}>
>       <button onClick={() => send(`notification at ${new Date().toLocaleTimeString()}`)}>Publish a notification</button>
>       <section>
>         <h2>Long polling</h2>
>         <ul>{longPoll.map((e) => <li key={e.id}>{e.text}</li>)}</ul>
>       </section>
>     </main>
>   );
> }
> ```
>
> ✅ Tested: a published notification shows up immediately, and the dev log shows the waiting request finishing as soon as the event arrives (`GET /api/rt/long?after=2 200 in 14.5s`).
>
> - The `AbortController` cancels the request in flight on unmount. In development, StrictMode mounts, unmounts and mounts again, so without it you get two loops.
> - The `catch` waits 2 s: without it, a dead server means a tight loop of failed requests. In production that wait grows (exponential backoff) and has jitter, so a thousand clients don't all retry at the same instant after a deploy.
> - When the server comes back, the loop resumes with the same `after`, so nothing is lost — that's the cursor doing its job.

---

## Level 2 — Server-Sent Events

Add `useSse(): { events: RtEvent[]; status: string }` to `hooks.ts`, using the browser's `EventSource` on `/api/rt/sse`, and render it next to the long-poll list. Show the connection status: `connecting`, `open` or `reconnecting`.

Then break it: with the page open, stop `npm run dev`, publish nothing, start it again, and publish.

1. What does the status show while the server is down? Did you write any reconnect code?
2. Read the SSE route: what is `Last-Event-ID`, who sends it, and what does the server do with it?
3. What is the `: ping` line every 15 seconds for?

> [!success]- Solution — Level 2
> ```ts
> export function useSse(): { events: RtEvent[]; status: string } {
>   const [events, setEvents] = useState<RtEvent[]>([]);
>   const [status, setStatus] = useState('connecting');
>
>   useEffect(() => {
>     const source = new EventSource('/api/rt/sse');
>     source.onopen = () => setStatus('open');
>     source.onerror = () => setStatus('reconnecting');
>     source.onmessage = (e) => setEvents((prev) => [...prev, JSON.parse(e.data) as RtEvent]);
>     return () => source.close();
>   }, []);
>
>   return { events, status };
> }
> ```
>
> 1. `reconnecting`, and then `open` again — **with no reconnect code**. `EventSource` reconnects on its own. That is one of the main reasons to choose SSE over a hand-made socket for server-to-client feeds.
> 2. Every event the server sends carries an `id:`. When `EventSource` reconnects, it sends the last id it received in the **`Last-Event-ID`** request header. The server replays everything after it, so a dropped connection loses nothing. (Here the store is in memory, so after a server restart there is nothing left to replay; in production it is a database or a stream with retention.)
> 3. A **comment line** (it starts with `:`); the client ignores it. It keeps the connection from looking idle to proxies that close silent connections, and it makes a dead connection fail fast.

---

## Level 3 — WebSocket, and the reconnect it doesn't give you

Add `useChat(url)` returning `{ messages, status, send }` for `ws://localhost:3001`, and a small form. Open the page in **two tabs** and chat between them.

Then kill `node reto05/ws-server.mjs`, wait, and start it again.

1. Without your own code, does the socket come back?
2. Write a reconnect with **exponential backoff and jitter**. Why both?
3. What is the first thing a WebSocket costs the **server** that long polling doesn't?

> [!success]- Solution — Level 3
> ```ts
> export function useChat(url: string) {
>   const [messages, setMessages] = useState<string[]>([]);
>   const [status, setStatus] = useState('connecting');
>   const socketRef = useRef<WebSocket | null>(null);
>
>   useEffect(() => {
>     let attempt = 0;
>     let timer: ReturnType<typeof setTimeout> | undefined;
>     let stopped = false;
>
>     const connect = () => {
>       const socket = new WebSocket(url);
>       socketRef.current = socket;
>       socket.onopen = () => {
>         attempt = 0;
>         setStatus('open');
>       };
>       socket.onmessage = (e) => setMessages((prev) => [...prev, String(e.data)]);
>       socket.onclose = () => {
>         if (stopped) return;
>         const delay = Math.min(30_000, 1000 * 2 ** attempt++) * (0.5 + Math.random() / 2);
>         setStatus(`reconnecting in ${Math.round(delay / 1000)} s`);
>         timer = setTimeout(connect, delay);
>       };
>     };
>
>     connect();
>     return () => {
>       stopped = true;
>       clearTimeout(timer);
>       socketRef.current?.close();
>     };
>   }, [url]);
>
>   const send = (text: string) => {
>     if (socketRef.current?.readyState === WebSocket.OPEN) socketRef.current.send(text);
>   };
>
>   return { messages, status, send };
> }
> ```
>
> 1. **No.** A closed `WebSocket` stays closed; reconnection is entirely your job.
> 2. **Backoff** (1 s, 2 s, 4 s… capped at 30 s) stops a client from hammering a server that is down. **Jitter** (the random factor) spreads clients out: after a deploy, ten thousand sockets drop at the same instant, and without jitter they all reconnect at the same instant too — a thundering herd that can take the server down again.
> 3. **A long-lived, stateful connection per client.** The server must keep it open, in memory, on one specific instance. Scaling out then needs sticky sessions, or a pub-sub backplane (Redis, Kafka) so that a message published on instance A reaches a client connected to instance B. Plus heartbeats to detect dead connections. Long polling is plain stateless HTTP: any instance can answer any request, behind any load balancer.

---

## Level 4 — Upload progress, the right tool

In the interview, upload progress was given as a WebSocket use case. Add a button that uploads a 20 MB blob to `/api/rt/upload` and shows a percentage. Use DevTools → Network → throttling → **Fast 4G** to see it move.

1. Which browser API reports **upload** progress?
2. Can `fetch` do it?
3. When *would* a separate channel make sense for a progress bar?

> [!success]- Solution — Level 4
> ```ts
> export function uploadWithProgress(file: Blob, onProgress: (percent: number) => void): Promise<unknown> {
>   return new Promise((resolve, reject) => {
>     const xhr = new XMLHttpRequest();
>     xhr.open('POST', '/api/rt/upload');
>     xhr.upload.onprogress = (e) => {
>       if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
>     };
>     xhr.onload = () => resolve(JSON.parse(xhr.responseText));
>     xhr.onerror = () => reject(new Error('Upload failed'));
>     xhr.send(file);
>   });
> }
> ```
>
> In the page: `<button onClick={() => uploadWithProgress(new Blob([new Uint8Array(20_000_000)]), setProgress)}>Upload 20 MB</button>`. ✅ Tested: reaches 100% and the route reports the bytes.
>
> 1. **`XMLHttpRequest`**, through `xhr.upload.onprogress` — the browser counts the bytes it has sent.
> 2. **No.** `fetch` has no upload progress events. That is the one place XHR is still the right choice.
> 3. When the slow part happens **on the server after the upload** — transcoding a video, processing a 3D scan. The browser can't measure that, so the server reports it, and SSE is the simple fit, since it is one-way.

---

## Level 5 — HTTP/1.1, HTTP/2, HTTP/3

Create `public/rt/limit.html`:

```html
<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>Seven streams</title></head>
  <body>
    <ol id="out"></ol>
    <script>
      // Opens seven SSE streams to the same host and reports which ones connect.
      for (let i = 1; i <= 7; i++) {
        const li = document.createElement('li');
        li.textContent = `stream ${i}: waiting`;
        document.getElementById('out').append(li);
        const source = new EventSource(`/api/rt/sse?stream=${i}`);
        source.onopen = () => (li.textContent = `stream ${i}: open`);
      }
    </script>
  </body>
</html>
```

1. Predict, then open `http://localhost:3000/rt/limit.html`. How many streams open?
2. In DevTools → Network, right-click the column headers and enable **Protocol**. What does localhost use? Now open any large public site. What do you see there?
3. Why does stream 7 wait, and why would it not on an HTTP/2 site?
4. Besides multiplexing, what three other things did HTTP/2 add?
5. What problem does HTTP/3 fix that HTTP/2 could not?

> [!success]- Solution — Level 5
> ✅ Measured: streams 1–6 `open`, stream 7 `waiting`; `nextHopProtocol` = `http/1.1`.
>
> 1. **Six.** The seventh waits until one of the others closes.
> 2. Localhost in development: `http/1.1`. A large site: `h2` or `h3`.
> 3. Over HTTP/1.1 a connection carries **one request at a time**, so browsers open up to **six connections per host** and queue the rest. Six open SSE streams use them all, and every other request to that host — API calls, images — waits behind them. Over **HTTP/2** all requests share **one connection** as independent, interleaved **streams** (multiplexing), so the limit is negotiated and typically about 100. That is why SSE went from "careful, it eats connections" to a sensible default.
> 4. **Binary framing** (requests split into frames that can interleave); **HPACK header compression** (headers like cookies and user-agent are sent once and then referenced, instead of repeated in full on every request); **stream prioritisation**. Also **server push**, which was a failure — Chrome removed it in 2022, and `103 Early Hints` covers the use case.
> 5. **Head-of-line blocking at the TCP level.** HTTP/2 multiplexes over one TCP connection, so one lost packet stalls **every** stream until it is retransmitted. HTTP/3 runs over **QUIC**, on UDP, where streams are independent — a lost packet only stalls its own stream. The handshake is also faster (TLS is built in; 1-RTT, or 0-RTT on resumption), and a connection survives a network change, such as Wi-Fi to 4G.
>
> Practical consequence: domain sharding and concatenating everything into one bundle were HTTP/1.1 workarounds. On HTTP/2 they are usually counter-productive.

---

## Level 6 — Client case: pick the transport

For each scenario, choose short polling, long polling, SSE or WebSocket, and give the **one** reason that decides it:

1. **Nordstrom POS** — a store tablet must show *"order ready for pickup"* notifications, a few per hour. The store network has a strict corporate proxy.
2. **Hyatt** — a booking-status page that updates while payment is processed: three or four updates in thirty seconds, then done.
3. **Securin** — a security dashboard streaming vulnerability findings as a scan runs: hundreds per minute, server to client.
4. **A collaborative editor** — several people type in the same document, and each sees the others' cursors.
5. **A daily report** that a user opens once, which changes every few hours.

> [!success]- Solution — Level 6
> 1. **Long polling** (or SSE with long polling as a fallback). Low frequency, and corporate proxies are exactly where WebSockets break. Plain HTTP passes through anything, works with the existing auth headers and load balancers, and a few requests an hour cost nothing.
> 2. **SSE** — or long polling. One-way, short-lived, a handful of events. A WebSocket's state and scaling cost buys nothing here.
> 3. **SSE.** One-way, high frequency, and you get reconnection with resume (`Last-Event-ID`) for free. Over HTTP/2 the connection limit doesn't matter.
> 4. **WebSocket.** Truly bidirectional, high frequency and latency-sensitive. This is what it's for, and the scaling cost (sticky sessions or a pub-sub backplane) is worth paying.
> 5. **Short polling**, or simply fetch on load and on focus. Real-time machinery for data that changes every few hours is cost without benefit.

---

## Level 7 — Say it out loud

Without looking, in English:

1. Explain long polling in two sentences.
2. When does long polling beat a WebSocket? Give three reasons.
3. What does SSE give you that a WebSocket doesn't, and what can't it do?
4. What does a WebSocket cost on the server side, at scale?
5. HTTP/1.1 vs HTTP/2 vs HTTP/3, one sentence each.

> [!success]- Solution — Level 7
> 1. The client sends a request and the server doesn't answer until it has something new or a timeout expires; then the client immediately sends the next request. It gives near-real-time delivery over plain HTTP.
> 2. Low-frequency updates, where a held request costs almost nothing. Networks with proxies or firewalls that break WebSockets. And when you want stateless HTTP — normal auth, caching rules, load balancing on any instance — or a fallback for when WebSockets fail.
> 3. SSE is plain HTTP, reconnects by itself and resumes from the last event id. It is one-way only — server to client — and text only.
> 4. A stateful, long-lived connection per client, pinned to one instance: sticky sessions or a pub-sub backplane to fan messages out across instances, heartbeats to detect dead clients, and reconnection with backoff and jitter on the client.
> 5. HTTP/1.1: one request at a time per connection, so about six connections per host. HTTP/2: one connection with multiplexed binary streams, HPACK header compression and prioritisation. HTTP/3: the same ideas over QUIC on UDP, so a lost packet only stalls its own stream, with a faster handshake.

> [!question] Short answer for the interview
> "Long polling is the client asking and the server holding the request until there's news or a timeout. It beats a WebSocket when updates are infrequent, when proxies or corporate networks break WebSockets, and when I want plain stateless HTTP behind any load balancer — notifications are the classic case. For one-way streams I'd usually go to SSE, which reconnects and resumes by itself. I keep WebSockets for truly bidirectional, high-frequency traffic like collaboration or chat, because each client is a stateful connection I have to scale with sticky sessions or a pub-sub backplane."

---

## Done when

- [ ] Level 0 predicted on paper
- [ ] Level 1 long-poll loop working; survives a server restart
- [ ] Level 2 SSE working; reconnect seen without writing reconnect code
- [ ] Level 3 chat between two tabs; reconnect with backoff and jitter written
- [ ] Level 4 upload progress reaching 100% with throttling on
- [ ] Level 5 seven-stream limit seen; HTTP/2 and HTTP/3 explained
- [ ] Level 6 five scenarios decided, one reason each
- [ ] Level 7 answered out loud without notes
