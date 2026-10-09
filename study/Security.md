---
title: Security
tags:
  - study
  - interview
  - security
  - xss
  - csrf
---

# Security

The two attacks that get asked every time, where the token goes, and the process around it.

The React-specific escape hatches are in [[React#Is React safe against XSS by default?]].

---

# XSS vs CSRF — never swap these two words

The single highest-value table on the page. Getting these two backwards is the classic way to lose a security question.

| | XSS | CSRF |
|---|---|---|
| What it is | The attacker **runs JavaScript on my origin** | The attacker's site makes **the browser send my cookie** |
| What it needs | An injection sink | An authenticated session and automatic credentials |
| `httpOnly` cookie | **Mitigates it** (JS cannot read the token) | **Does nothing** — the browser still sends it |
| Defences | Escaping, DOMPurify, protocol validation, **CSP** | `SameSite`, anti-CSRF token, check `Origin`/`Referer`, no state changes on GET |

---

# XSS — Cross-Site Scripting

XSS happens when an attacker injects JavaScript into our pages, using attack vectors such as input fields, URL parameters and redirects.

## The three kinds

| Kind | Where the payload lives |
|---|---|
| **Stored** | In the database — it reaches every user who loads that content |
| **Reflected** | In the URL or the request, echoed back into the response |
| **DOM-based** | Never touches the server: client-side JS reads `location.hash` or similar and writes it into a sink |

## Ways to protect ourselves

- **Escape on output, not on input.** Escaping depends on the context — HTML body, attribute, URL, JS, CSS all need different escaping. This is why frameworks do it for you and hand-rolling it goes wrong.
- **Sanitize rich text** with `DOMPurify` before it reaches an HTML sink. Never a regex, never a denylist of tags.
- **Validate the protocol** of any user-supplied URL: only `http:`, `https:`, `mailto:`. A `href="javascript:alert(1)"` is XSS.
- **Content Security Policy (CSP)** — a header (or meta tag) that tells the browser which scripts the page may execute. An injected external script is then ignored. The modern form is nonce or hash based, not a host allowlist, and `'unsafe-inline'` defeats the whole point.
- **`httpOnly` cookies** — prevent JavaScript from reading the session token, so an XSS cannot steal it.
- **Server-side validation** of every payload — the client is not a trust boundary ([[TypeScript Boundary#Where the boundaries are]]).

> [!warning] "Modern frameworks are protected" is only half true
> React, Vue and Angular escape automatically what is **interpolated** into the template, which covers text. They all keep an explicit escape hatch — `dangerouslySetInnerHTML`, `v-html`, `bypassSecurityTrustHtml` — and those are where the real holes are. Safe **by default**, not safe **by construction**. The full list of React's escape hatches is in [[React#Is React safe against XSS by default?]].

## The sinks to grep for

`innerHTML` · `outerHTML` · `document.write` · `insertAdjacentHTML` · `eval` · `new Function` · `setTimeout` with a string · `location` / `location.href` assignment · `dangerouslySetInnerHTML` · `v-html` · jQuery `.html()`

---

# CSRF — Cross-Site Request Forgery

CSRF happens when an attacker forces an authenticated user to perform unauthorized actions on another website where they are logged in, without their knowledge or consent. The attacker creates a malicious request — a hidden form, a link, some JavaScript on their own site — and the browser **automatically attaches the user's cookies** to it, so the target website sees a request that looks like the user's.

The key asymmetry: the attacker never needs to **read** anything. They only need the browser to **send**.

## Ways to protect ourselves

- **CSRF tokens** — the server generates a unique token per form or per session, the client includes it in the body or in a header, and the server validates it before processing. An attacker cannot generate a valid token, so their requests are rejected.
- **`SameSite` cookie attribute** — `Strict` blocks the cookie on every cross-site request; `Lax` (the modern default) allows it only on top-level navigations; `None` turns the protection off and requires `Secure`.
- **Validate `Origin` and `Referer`** on every state-changing request. Reject unknown origins.
- **HTTPS and `Secure` cookies**, so the cookie is only transmitted over an encrypted connection.
- **Never change state on a GET.** CORS does **not** stop a simple cross-origin request from being *sent* — it only stops the attacker from *reading the response*. A GET that deletes something is exploitable with a plain `<img src>`.

> [!note] Who protects you by default
> Backends usually have it: Express with `csurf`, Django's CSRF middleware, Laravel's tokens. Frontend frameworks like React and Vue do **not** protect against CSRF on their own — they just need to send whatever token the backend issues.

---

# Where do you store the token, and what does that create?

**`httpOnly` + `Secure` + `SameSite` cookie.** Not readable by JS, sent automatically. That is the right answer, and it is only half of it:

> [!important] The follow-up that catches people
> *"The automatic sending — what does that create?"* → **CSRF.** Not XSS. XSS is what `httpOnly` already mitigates; naming it again loops back to the defence instead of naming the new hole.
>
> The browser attaches that cookie to *any* request to my API, including one triggered by `evil.com`. So an attacker's page can perform a state change while the user is authenticated, **without ever reading the token**.

The chain to say out loud:

1. `SameSite=Lax` blocks cross-site sends except top-level navigations; `Strict` blocks them entirely.
2. **A cross-domain setup forces `SameSite=None; Secure`, which turns SameSite off.** So an anti-CSRF token and `Origin` validation on every state-changing request become mandatory.
3. No state changes on GET, ever.

## The alternative pattern

**Access token in memory + refresh token in an `httpOnly` cookie.** Survives XSS reads better — a stolen access token dies with the tab — and costs a refresh round-trip on every reload. The concurrency problem it creates (several 401s at once) is [[Design Patterns#Single-flight]].

Third-party cookie deprecation is pushing everything toward same-site APIs or a **BFF** (backend for frontend) that holds the session server-side.

> [!danger] Never in `localStorage`
> Any XSS reads it, synchronously, with one line. `localStorage` has no `httpOnly` equivalent and no expiry.

---

# Handling sensitive data

- **Never in `localStorage`** — any XSS can read it. Tokens go in cookies: `HttpOnly` + `Secure` + `SameSite`.
- **HTTPS everywhere**, plus HSTS.
- **Never log it** — not `console.log`, not the error tracker, not analytics. This includes parse errors that echo a payload ([[TypeScript Boundary#What happens when parsing fails (the part people forget)]]).
- **Minimize**: if a field is not displayed, do not send it to the frontend at all. Mask it in the backend (`**** **** **** 4242`).
- **Short-lived tokens** with refresh, and clear them on logout.
- **Careful with URLs** — query strings end up in server logs, browser history and `Referer` headers.

---

# Vulnerable packages

- **`npm audit`** — runs on `npm install`; `npm audit fix` applies the safe upgrades.
- **Snyk** — deeper scan, with reachability analysis (does my code actually call the vulnerable path?).
- **Dependabot / Renovate** — automatic PRs for updates.
- **Integrate it in the pipeline**, so a critical vulnerability **breaks the build** instead of sitting in a report nobody opens.

Lockfile discipline matters as much as the scanner: commit the lockfile, use `npm ci` in CI, and review what a transitive bump actually pulled in.

---

# How do you handle security threats in the app?

The process answer, which is what the question is really asking for:

- **Automated quality gate** — a scanner (Black Duck, Snyk) in the pipeline. What it finds becomes a defect with a normal priority; a critical one is fixed immediately.
- **Framework guidelines** — follow the framework's own documentation on injection and templating.
- **Code review** — look for the sinks above, and for anything that builds HTML or a URL from input.
- **Training** — the **OWASP Top 10**, and the framework-specific vulnerabilities.

> [!tip] Why this answers the question
> Security questions at senior level are about the **loop**, not a list of attack names: a gate that fails the build, a review habit, and a trained team. Listing XSS and CSRF shows knowledge; describing the gate shows ownership.

---

# Recall triggers

| When I hear / say… | The words that must come out |
|---|---|
| "the attacker ran a script" | **XSS** — needs an injection sink |
| "the browser sent my cookie" | **CSRF** — needs an authenticated session |
| "`httpOnly` fixes it" | fixes **XSS token theft**; does **nothing** for CSRF |
| "where do you store the token?" | `httpOnly` + `Secure` + `SameSite` cookie — **never `localStorage`** |
| "and what does the automatic sending create?" | **CSRF**, not XSS |
| "cross-domain API" | `SameSite=None` → SameSite is **off** → anti-CSRF token + `Origin` check |
| "CORS protects us" | CORS blocks **reading** the response, not **sending** the request |
| "React is safe" | safe for **interpolated text**; name the escape hatches |
| "we sanitize the input" | escape on **output**, per **context**; sanitize rich text with DOMPurify |
| "CSP" | nonce or hash based; `'unsafe-inline'` defeats it |

---

# Drill — say these out loud

1. **XSS = they run code on my origin. CSRF = they make my browser send my cookie.**
2. `httpOnly` stops the **read**, not the **send**.
3. Cross-domain forces `SameSite=None`, which **removes** the SameSite defence.
4. **CORS does not stop the request being sent** — only the response being read.
5. **No state changes on GET.**
6. Never store a token in `localStorage`.
7. Escape on **output**, and the escaping depends on the **context**.
8. Frameworks are safe **by default**, not by construction — every one has an escape hatch.
9. CSP with `'unsafe-inline'` is not a CSP.
10. A critical vulnerability should **break the build**.

---

# Still to study

- [ ] OWASP Top 10, current edition — the full list, with a frontend example each
- [ ] CSP in practice: nonces with SSR, `report-uri`, and rolling one out report-only first
- [ ] CORS properly: preflight, `credentials`, `Access-Control-Allow-*`, and what a wildcard cannot do
- [ ] Subresource Integrity (SRI) and the supply-chain risk of a CDN script
- [ ] OAuth 2.0 / OIDC: authorization code + PKCE, and why implicit flow is dead
- [ ] JWT: signature vs encryption, `alg: none`, why they cannot be revoked, and when a session beats a token
- [ ] Clickjacking and `X-Frame-Options` / `frame-ancestors`
- [ ] The BFF pattern — moving the session server-side, and what it costs
