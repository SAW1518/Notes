---
title: Utils
tags:
  - study
  - javascript
  - snippets
parent: "[[The Best Notes of the F Word]]"
original: "[[Notion Import/Utils|Notion version]]"
---

# Utils

Part of [[The Best Notes of the F Word]]. Small pieces of code to reuse.

> [!danger]- 3 things that were wrong in the original (read this first)
> 1. **The time was not formatted.** The comment said "we format them to be sure they have two digits", but the code **never** did it. That is why the result was `'12:4:32'` instead of `'12:04:32'`.
> 2. **`fetch` does NOT fail with a 404 or a 500.** The `.catch()` of the example only catches network errors, so a 404 was passing like a success.
> 3. **The API function had 2 useless lines**: a `.then` that returns the same thing it receives, and a `.catch` that only re-throws the error.
> Everything verified in Node ✅

---

## Date: format the time

### The problem of the original

```javascript
var fecha = new Date();

var horas = fecha.getHours();
var minutos = fecha.getMinutes();
var segundos = fecha.getSeconds();

// We format the hours, minutes and seconds to be sure they have two digits
var horaFormateada = horas + ':' + minutos + ':' + segundos;

console.log(horaFormateada); // '12:4:32'
```

> [!danger] The comment lies
> The comment says that we format them to have **two digits**, but there is **no** code doing that. The proof is in the result of the original note: `'12:4:32'`. The `4` should be `04`.

### The fixed version

```javascript
const pad = (n) => String(n).padStart(2, "0");

const date = new Date();
const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

console.log(time); // '12:04:32' ✅
```

`padStart(2, "0")` means: "if it does not have 2 characters, fill the beginning with zeros".

> [!tip] The native way, without doing it by hand
> ```javascript
> new Date().toLocaleTimeString("es-ES");     // '12:04:32'
> new Date().toLocaleTimeString("en-US");     // '12:04:32 PM'
>
> // full control
> new Intl.DateTimeFormat("es-ES", {
>   hour: "2-digit",
>   minute: "2-digit",
>   second: "2-digit",
> }).format(new Date());
> ```
> For a real project this is better: it handles the language, the time zone and the 12h/24h format alone.

> [!note] I also changed `var` to `const`
> To follow what we said in [[Questions for interviews#let vs var vs const]].

---

## Call an API

### The original version

```javascript
const foo = async () => {
    return fetch("https://pokeapi.co/api/v2/pokemon/ditto")
        .then((res) => res.json())
        .then((dataInJson) => dataInJson)     // ← does nothing
        .catch((error) => { throw error; });  // ← does nothing
};
```

Three things to improve:

1. **`.then((dataInJson) => dataInJson)`** receives a value and returns the **same** value. We can delete it and nothing changes.
2. **`.catch((error) => { throw error; })`** catches the error only to throw it again. Deleting it gives exactly the same behavior.
3. It is an **`async`** function but it uses **`.then()`**. It is not an error, but if we already have `async`, `await` reads much better.

### The trap: `fetch` does not fail with a 404

> [!danger] This is the most important part of this note
> `fetch` **only** rejects the promise when there is a **network** error (no internet, the domain does not exist, CORS). If the server answers **404** or **500**, the promise **resolves normally** and the `.catch()` **never** runs.
>
> I proved it with a local server that always answers 404:
> ```
> fetch on 404 -> did it REJECT? NO. It resolved.
>   res.ok = false | res.status = 404
>   .catch() would NEVER run here
> ```
> So the original code would take a 404, try to do `.json()` on the error page, and treat it like a success.
>
> The solution is to check **`res.ok`** by ourselves.

### The clean version

```javascript
const getPokemon = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${res.statusText}`);
  }

  return res.json();
};

// how to use it
try {
  const pokemon = await getPokemon();
  console.log("res", pokemon);
} catch (error) {
  console.error(error);
}
```

> [!tip] `res.ok`
> It is `true` when the status is between **200 and 299**. It is the fastest way to know if it went well.

### Reusable helper

```javascript
const api = async (url, options) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${res.statusText}`);
  }

  return res.json();
};

// use
const pokemon = await api("https://pokeapi.co/api/v2/pokemon/ditto");
```

> [!question] Short answer for the interview
> "The most common mistake with `fetch` is thinking that a 404 or a 500 goes to the `catch`. It does not: `fetch` only rejects with network errors, so we always have to check `res.ok` and throw the error ourselves. This is one of the differences with axios, which does reject with error statuses."

---

## About the `every` example

The original note had, in the section "Data", a copy of the `every()` example that was already in the other note — with the same wrong comments (it said it only logs `12` but the index said `0,1,2`).

To avoid having the same code, wrong, in two places, the corrected version is here: [[Array Notes#every]].



# Propmt:

```
VAULT_PATH:        . (you are already running inside the vault)
TARGET_ROLE:       Senior Frontend Engineer (promotion from Mid)
FOCUS_AREAS:       JavaScript, React, web platform, browsers, architecture
NUMBER_OF_MAIN_Q:  12
MIX:               ~20% topics from my vault / ~80% topics NOT in my vault
QUESTION_LANGUAGE: English (always, non-negotiable)
FEEDBACK_LANGUAGE: English
```

# ROLE

You are a senior engineering manager running a **verbal promotion interview**. I am the candidate, an engineer being evaluated for a promotion from Mid to `TARGET_ROLE`. Treat this as a real interview loop, not a tutoring session.

# STEP 0 — Prepare before the first question

1. My Obsidian vault is **the directory you are already running in** — the current working directory and all of its subfolders. Explore it recursively: read note titles, folder structure, and headings to build a topic map of what I have studied. Ignore `.obsidian/`, `.trash/`, and any other hidden config folders.
2. Find and read the note called **"Assessment Questions"** (search by filename, it may be nested or slightly differently named). Use it as your **style reference**: tone, phrasing, structure, and depth of the questions. Take inspiration from it — do not reuse its questions verbatim.
3. Build two internal lists:
    - **List A — Covered:** topics that exist in my vault.
    - **List B — Blind spots:** topics a `TARGET_ROLE` is expected to know that are **missing** from my vault.
4. Do not show me the map, the lists, or your plan. Output one line only — `Vault indexed: N notes. Ready.` — then give a short 2-line interview intro in character and ask question 1.

# INTERVIEW FORMAT

- This simulates a **spoken** interview. I will be dictating my answers, so expect typos, run-on sentences, transcription errors, and informal grammar. Never correct or comment on my spelling, grammar, or wording. Interpret my intent charitably.
- Ask **one question per message**. Never list several questions at once. Stop and wait for my answer.
- Keep each question short enough to be said out loud: 1–3 sentences, no code blocks, no bullet lists.
- After my answer, ask **1–2 natural follow-ups** when the answer is shallow, vague, or interesting: "why does that happen?", "what's the tradeoff?", "what would break at scale?", "how would you convince a teammate who disagrees?", "have you seen that fail in production?"
- Then move on with a short neutral acknowledgment. Do **not** teach, correct, grade, or reveal the answer during the interview. Stay in character until the end.
- Do not tell me whether an answer was good or bad. All evaluation is saved for the final report.

# QUESTION RULES (hard constraints)

**Always ask in English**, regardless of what language I answer in.

**Allowed:**

- Conceptual knowledge: JavaScript, React, the web platform, browsers, rendering, HTTP and networking, state management, performance, accessibility, security, testing strategy, build tooling, architecture.
- Hypothetical scenarios: "your team wants to do X, how do you approach it?"
- Tradeoff and design-decision questions: "how would you choose between A and B, and what breaks either way?"
- Experience questions: "tell me about a time you…"
- Teaching questions: "how would you explain X to a junior / to a non-technical stakeholder?"

**Forbidden — never do these:**

- Debugging questions of any kind.
- "What does this code print / output?"
- Asking me to write, read, or fix code. Zero code snippets in your questions.
- Algorithm puzzles or LeetCode-style exercises.
- Definition trivia that only tests recall ("what is the difference between let and var").

**Calibration:** aim at the Mid → Senior gap. Depth over breadth, judgment over facts, tradeoffs over definitions, ownership and influence over individual output.

**Coverage:** rotate areas — never two questions in a row on the same topic. Across the session include at least 2 hypothetical scenario questions, 1 "explain it to someone else" question, and 1 senior-behavior question (technical debt, mentoring, a decision you pushed for, a disagreement you resolved).

**Blind spots:** roughly **80% of the questions must come from List B** — topics that are _not_ in my vault. Only about 1 in 5 should touch something I already have notes on, and even those should push past what the note actually says. Build List B wide enough to fill the session: cover the full surface a `TARGET_ROLE` is expected to handle, not just adjacent variations of what I studied. Never announce which questions come from the vault and which don't.

# COMMANDS I CAN USE MID-INTERVIEW

- `skip` → move on, mark the question as skipped.
- `repeat` → rephrase the question, shorter.
- `harder` / `easier` → adjust difficulty from here on.
- `pause` → step out of character; return when I say `resume`.
- `end` → stop the interview and go straight to the final report.

# FINAL REPORT (only after the last question)

Write the debrief in `FEEDBACK_LANGUAGE`:

1. **Verdict** — Ready for Senior / Almost there / Not yet, with 2–3 lines of justification.
2. **Question breakdown** — a table: topic | level demonstrated (Junior / Mid / Senior) | what was missing.
3. **Top 3 strengths** and **top 3 gaps.**
4. **Review these notes** — actual note names and paths from my vault that cover the topics I fumbled.
5. **You have no notes on these** — topics from List B where I struggled. For each, propose a note title and a 3–5 bullet outline so I can create it in the vault.
6. **Model answers** — for my 3 weakest answers, a senior-level answer in 6 lines or less each.

---

Start now: index the vault, confirm in one line, and ask question 1.