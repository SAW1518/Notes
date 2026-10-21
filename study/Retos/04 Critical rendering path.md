---
title: "Reto 04 — Critical rendering path"
tags:
  - challenge
  - browser
  - performance
plan: "Assessment Plan — Tier 2"
status: todo
---

# Reto 04 — Critical rendering path

**Goal:** see, with your own numbers, what keeps a page blank — which resources block **rendering**, which block **parsing**, and which are discovered too late — then fix each one and measure the difference.

**Why it matters:** the panel asked it twice (00:41:08 and 00:42:28): *"what is the critical rendering path, and how do you optimise it for a high-traffic web application?"* It is a Level Up resource (web.dev/critical-rendering-path) and a named gap under Browser APIs.

> [!warning] Do each level before opening its solution
> Predict first, write it down, then load the page and compare. The numbers in the solutions were measured on localhost in Chrome; yours will differ by a few tens of milliseconds.

---

## The theory you need first

The **critical rendering path** is the sequence of steps between the first byte of HTML and the first pixels on screen:

1. **HTML → DOM.** The parser builds the DOM as bytes arrive.
2. **CSS → CSSOM.** Every stylesheet is parsed into the CSSOM.
3. **DOM + CSSOM → render tree.** Only visible nodes, with their computed styles.
4. **Layout.** The geometry of every box.
5. **Paint**, then **composite** the layers.

Two rules decide what blocks it:

- **CSS is render-blocking.** The browser will not paint without the CSSOM, because painting unstyled content and then restyling it would flash.
- **A classic `<script>` is parser-blocking.** The parser stops, downloads and runs it, because the script might change the DOM (`document.write`). And a script also waits for the stylesheets **before** it, because it might read styles.

Optimising the path means three levers: **fewer critical resources**, **fewer critical bytes**, and a **shorter critical path** (fewer round trips one after another).

---

## Setup

In `Retos/retos-sandbox/`:

**1. A slow server.** Create `app/api/slow/route.ts`. It answers after `ms` milliseconds with a CSS file, a script or an image:

```ts
// A test server for reto 04: answers after `ms` milliseconds with a CSS file, a script or an image.

// An uncompressed bitmap of random pixels. Chrome ignores flat, low-information images
// as LCP candidates, so the hero must look like a real photo to the browser.
function noiseBitmap(width: number, height: number): Uint8Array {
  const rowSize = Math.ceil((width * 3) / 4) * 4;
  const pixels = rowSize * height;
  const buf = new Uint8Array(54 + pixels);
  const view = new DataView(buf.buffer);
  buf.set([0x42, 0x4d]); // "BM"
  view.setUint32(2, buf.length, true);
  view.setUint32(10, 54, true); // where the pixels start
  view.setUint32(14, 40, true); // header size
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true); // planes
  view.setUint16(28, 24, true); // bits per pixel
  view.setUint32(34, pixels, true);
  for (let i = 54; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 256);
  return buf;
}

const bodies = {
  css: 'body { font-family: system-ui; background: #fef3c7; } h1 { color: #92400e; }',
  js: "console.log('slow script ran at', Math.round(performance.now()), 'ms');",
  img: noiseBitmap(800, 300),
};
const types = { css: 'text/css', js: 'text/javascript', img: 'image/bmp' };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ms = Number(searchParams.get('ms') ?? 0);
  const type = (searchParams.get('type') ?? 'css') as keyof typeof bodies;
  await new Promise((resolve) => setTimeout(resolve, ms));
  return new Response(bodies[type], {
    headers: { 'content-type': types[type], 'cache-control': 'no-store' },
  });
}
```

**2. A metrics logger.** Create `public/crp/metrics.js`. It prints paint timings to the console:

```js
// Logs paint timings to the console. Read them in DevTools → Console.
window.__metrics = [];
const log = (label, ms) => {
  window.__metrics.push(`${label}: ${Math.round(ms)} ms`);
  console.log(`[crp] ${label}: ${Math.round(ms)} ms`);
};
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) log(e.name, e.startTime);
}).observe({ type: 'paint', buffered: true });
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) log('LCP candidate', e.startTime);
}).observe({ type: 'largest-contentful-paint', buffered: true });
document.addEventListener('DOMContentLoaded', () => log('DOMContentLoaded', performance.now()));
```

The pages are plain HTML in `public/crp/`, so you see the browser's behaviour without React in the way. With `npm run dev` running, open `http://localhost:3000/crp/<page>.html`, with DevTools → Console open. Reload with the tab in the foreground: a background tab does not paint.

What the numbers mean:

- **first-contentful-paint (FCP)** — the first text or image on screen.
- **LCP candidate** — the largest element painted so far. The last candidate is the page's **Largest Contentful Paint**.
- **DOMContentLoaded** — the HTML is fully parsed and the synchronous and deferred scripts have run.

---

## Level 0 — Predict before you load

Create `public/crp/blocking.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>CRP — blocking</title>
    <script src="/crp/metrics.js"></script>
    <link rel="stylesheet" href="/api/slow?type=css&ms=3000" />
    <script src="/api/slow?type=js&ms=2000"></script>
  </head>
  <body>
    <h1>Hello, critical rendering path</h1>
    <p>Some text the user wants to read.</p>
  </body>
</html>
```

The CSS takes 3 s, the script 2 s. **On paper**:

1. When does the heading first appear (FCP)? About 2 s, 3 s or 5 s?
2. The script downloads in 2 s. When does it **run**? Check the `slow script ran at` line.
3. When does `DOMContentLoaded` fire?
4. Which of the two resources blocks *rendering*, and which blocks *parsing*?

> [!success]- Solution — Level 0
> Measured: `DOMContentLoaded: 3043 ms`, `first-contentful-paint: 3084 ms`.
>
> 1. **About 3 s**, not 5 s. The browser's **preload scanner** reads ahead in the HTML and starts both downloads in parallel, so the total is the longest one, not the sum. Nothing paints before the CSS arrives, because CSS is render-blocking.
> 2. At about **3 s**, although it finished downloading at 2 s. A classic script must wait for the stylesheets before it, because it is allowed to read computed styles.
> 3. About **3 s**: the parser was stopped at the `<script>` tag until the script ran, so the `<body>` was not even parsed before then.
> 4. The **CSS blocks rendering**: no CSSOM, no render tree, no paint. The **script blocks parsing**: the parser cannot go past it until it has run, so the DOM below it does not exist yet.

---

## Level 1 — Move the script, and read what changes

Create `public/crp/script-end.html`: the CSS now takes 500 ms, and the 3-second script moves to the end of `<body>`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>CRP — script at the end</title>
    <script src="/crp/metrics.js"></script>
    <link rel="stylesheet" href="/api/slow?type=css&ms=500" />
  </head>
  <body>
    <h1>Hello, critical rendering path</h1>
    <p>Some text the user wants to read.</p>
    <script src="/api/slow?type=js&ms=3000"></script>
  </body>
</html>
```

1. Predict FCP and `DOMContentLoaded`, then load the page.
2. Why can the browser paint before the script has arrived?
3. Between FCP and the script running, what is broken for the user if that script attaches the page's click handlers? Which React concept is the same problem?

> [!success]- Solution — Level 1
> Measured: `first-contentful-paint: 596 ms`, `DOMContentLoaded: 3066 ms`.
>
> 1. FCP at about **0.6 s** (the CSS plus a few milliseconds), `DOMContentLoaded` at about **3 s**.
> 2. The parser has already built the heading and the paragraph before it reaches the `<script>`. With the CSSOM ready, the browser paints what it has, then the parser waits for the script.
> 3. The page **looks** ready but does not **work**: buttons do nothing until the script runs. That is exactly the gap between server-rendered HTML and **hydration** in React — visible early, interactive late. FCP measures the first; Interaction to Next Paint (INP) and Total Blocking Time measure the cost of the second.

---

## Level 2 — Fix the blocking page

Create `public/crp/fixed.html`, with the same content as `blocking.html`. Requirements:

1. The heading appears in **under 200 ms**, while the 3-second stylesheet and the 2-second script are still referenced.
2. The page still ends up with the full styles and runs the script.
3. Nothing is removed — only *how* things load changes.

Then answer: with your fix, `DOMContentLoaded` is still around 2 s. Why? Which attribute would not delay it?

> [!info]- Hint (open only if stuck)
> Which styles does the first screen need? They can travel inside the HTML. The rest can load without blocking, and `<script>` has two attributes that stop it blocking the parser.

> [!success]- Solution — Level 2
> ```html
> <!doctype html>
> <html>
>   <head>
>     <meta charset="utf-8" />
>     <title>CRP — fixed</title>
>     <script src="/crp/metrics.js"></script>
>     <style>
>       body { font-family: system-ui; background: #fef3c7; }
>       h1 { color: #92400e; }
>     </style>
>     <link rel="stylesheet" href="/api/slow?type=css&ms=3000" media="print" onload="this.media='all'" />
>     <script src="/api/slow?type=js&ms=2000" defer></script>
>   </head>
>   <body>
>     <h1>Hello, critical rendering path</h1>
>     <p>Some text the user wants to read.</p>
>   </body>
> </html>
> ```
>
> Measured: `first-contentful-paint: 80 ms`, `DOMContentLoaded: 2052 ms`.
>
> - **Critical CSS inline**: the styles for the first screen ship inside the HTML, so the first paint needs no extra round trip. In a real project a build step extracts them.
> - **The rest of the CSS loads non-blocking**: `media="print"` tells the browser the sheet does not apply to the screen, so it downloads it at low priority without blocking; `onload` switches it to `all` when it arrives.
> - **`defer`**: the script downloads in parallel and runs **after parsing finishes**, in document order. The parser never stops.
>
> Why `DOMContentLoaded` is still about 2 s: **deferred scripts run before `DOMContentLoaded`**, so the event waits for them. With **`async`**, the script runs as soon as it arrives, whenever that is, and `DOMContentLoaded` does not wait for it. The cost of `async`: no guaranteed order. Use it for independent scripts like analytics, and `defer` for the app's own code. `type="module"` scripts are deferred by default.

---

## Level 3 — The image the browser finds too late

The first screen of a hotel page is a large hero image, and it is usually the **LCP element**. Create `public/crp/hero-late.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>CRP — late hero</title>
    <script src="/crp/metrics.js"></script>
  </head>
  <body>
    <h1>Hotel deals</h1>
    <div id="hero"></div>
    <script src="/api/slow?type=js&ms=1000" defer></script>
    <script>
      // Like a client-rendered hero: the <img> only exists after the JS runs.
      document.addEventListener('DOMContentLoaded', () => {
        const img = new Image(800, 300);
        img.src = '/api/slow?type=img&ms=1500';
        document.getElementById('hero').append(img);
      });
    </script>
  </body>
</html>
```

1. The image takes 1.5 s. Predict the LCP.
2. Make a copy, `hero-preload.html`, and add **one line** to the `<head>` so that the image finishes about a second earlier, without touching the script.
3. That line is a patch. What is the real fix, and why does it work?

> [!success]- Solution — Level 3
> Measured: late hero `LCP candidate: 2616 ms`, with the image requested at 1059 ms. With preload, `LCP candidate: 1572 ms`, with the image requested at 10 ms.
>
> 1. About **2.6 s**: the request cannot start until `DOMContentLoaded` (about 1 s, waiting for the deferred script), and then it takes 1.5 s. The browser had no way to know the image existed.
> 2. In the `<head>`:
>    ```html
>    <link rel="preload" as="image" href="/api/slow?type=img&ms=1500" fetchpriority="high" />
>    ```
>    `preload` starts the download as soon as the HTML arrives; `fetchpriority="high"` puts it ahead of other images. When the script later creates the `<img>` with the same URL, the bytes are already there.
> 3. The real fix is to put the `<img>` **in the server HTML** — server rendering or static generation — with `fetchpriority="high"` and without `loading="lazy"`. Then the preload scanner finds it in the first bytes, with no hint needed. A client-rendered hero is a late-discovered LCP resource by design.
>
> The rest of the hint family:
> - **`preconnect`** — open the DNS, TCP and TLS connection to another origin early (a CDN, a font host), saving one or more round trips.
> - **`dns-prefetch`** — only the DNS part; a cheap fallback.
> - **`prefetch`** — low priority, for the **next** navigation. It does not help the current page; this is what was described in the interview, and it is a different tool.

---

## Level 4 — Measure it like you would at work

No new code. Use the tools on `blocking.html` and `fixed.html`:

1. **Network panel**: reload `blocking.html` and read the waterfall. Which requests start together, and which bar does the first paint line up with?
2. **Performance panel**: record a reload. Find the FCP and LCP markers. Find where the main thread is idle, waiting on the network.
3. **Lighthouse** (Navigation, mobile): run it on both pages. Which insight names the blocking stylesheet and script, and what estimated saving does it give?
4. Turn on **Network → throttling → Slow 4G** and repeat on `fixed.html`. What changes, and why does the inline CSS matter more on a slow network?

> [!success]- Solution — Level 4
> 1. The CSS and the script start at the same time — the preload scanner found both — and FCP lines up with the end of the **CSS** bar, the longest blocking one.
> 2. FCP and LCP sit at about 3 s on `blocking.html`. Before them the main thread is almost empty: the page is not busy, it is **waiting**. That is the signature of a critical-path problem, as opposed to a JavaScript problem (a main thread full of long tasks).
> 3. The **render-blocking requests** insight lists both resources with the time they cost. On `fixed.html` it disappears.
> 4. Every round trip gets longer. Inline critical CSS removes a whole round trip from the path, so it saves more the slower the network — which is why the advice targets mobile users first.

---

## Level 5 — Client case: a high-traffic public site

Porter Airlines and Hyatt run public, high-traffic, SEO-sensitive pages: the home page, search results, a hotel page. Answer the panel's exact question out loud, as a plan you would apply there: *"what is the critical rendering path, and how do you optimise it for a high-traffic web application?"*

Give it in this order: definition → what blocks it → the three levers → concrete tactics → how you measure, and how you stop it regressing.

> [!success]- Solution — the spoken answer
> "The critical rendering path is everything between the first byte of HTML and the first pixels: the DOM, the CSSOM, the render tree, layout and paint. Two things block it. CSS blocks rendering, because the browser won't paint without the CSSOM. Classic scripts block parsing, and they also wait for any CSS before them. So I work on three levers: fewer critical resources, fewer critical bytes, and fewer round trips in a row.
>
> Concretely: server-render or statically generate the first screen, so the HTML already has the content and the LCP image is in it, with `fetchpriority="high"`. Inline the critical CSS and load the rest without blocking. Every script `defer` or `async`, and code-split so the first screen ships only what it needs. `preconnect` to the CDN and the font host, and `font-display: swap` so text isn't invisible while fonts load. Compression, a CDN, and long cache lifetimes on hashed assets.
>
> I measure FCP and LCP in the lab with Lighthouse and the Performance panel, and in the field with real-user data, because high traffic means a lot of slow devices. And I put a performance budget in CI, so a new blocking script fails the build instead of reaching production."

---

## Level 6 — Say it out loud

Without looking, in English:

1. Name the steps of the critical rendering path.
2. Why is CSS render-blocking, and why is a classic script parser-blocking?
3. `defer` vs `async` — when does each one run, and which one delays `DOMContentLoaded`?
4. `preload` vs `prefetch` vs `preconnect`.
5. What is a late-discovered LCP resource, and how do you fix it properly?

> [!success]- Solution — Level 6
> 1. HTML to DOM, CSS to CSSOM, both combined into the render tree, then layout, paint and composite.
> 2. CSS: the browser won't paint until it can style what it paints, or the page would flash unstyled. Script: it may change the document while it is being parsed, so the parser stops until it has run — and it waits for earlier stylesheets because it might read styles.
> 3. `defer` downloads in parallel and runs after parsing, in order, **before** `DOMContentLoaded`. `async` downloads in parallel and runs as soon as it arrives, in any order, and does not hold `DOMContentLoaded`.
> 4. `preload`: fetch this now, the current page needs it. `prefetch`: fetch this at low priority, the **next** page may need it. `preconnect`: open the connection to that origin now, before any request to it.
> 5. A resource the LCP depends on that the browser can't see in the initial HTML — a hero inserted by JavaScript, or a background image inside a CSS file. The proper fix is to put it in the server HTML as an `<img>` with `fetchpriority="high"`; `preload` is the patch when you can't.

> [!question] Short answer for the interview
> "It's the path from HTML bytes to first pixels: DOM, CSSOM, render tree, layout, paint. CSS blocks rendering and classic scripts block parsing, so I cut the number of critical resources, their bytes and the round trips: server-rendered first screen with the LCP image in the HTML, inline critical CSS, every script deferred, `preconnect` to the CDN. I check it with Lighthouse and field data, and a performance budget in CI keeps it from regressing."

---

## Done when

- [ ] Level 0 predicted on paper, then checked against the console
- [ ] Level 1 explained, including the "looks ready, doesn't work" gap
- [ ] Level 2 fixed: FCP under 200 ms; the `defer` vs `async` question answered
- [ ] Level 3 LCP improved by about a second with one line; the real fix explained
- [ ] Level 4 found the blocking requests in the Network and Performance panels and in Lighthouse
- [ ] Level 5 answer recorded, under two minutes
- [ ] Level 6 answered out loud without notes
