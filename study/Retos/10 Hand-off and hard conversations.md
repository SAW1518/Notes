---
title: "Reto 10 — Hand-off and hard conversations"
tags:
  - challenge
  - behavioural
  - leadership
plan: "Assessment Plan — Tier 2 and 3"
status: todo
---

# Reto 10 — Hand-off and hard conversations

**Goal:** turn the behavioural questions of the assessment into **written, rehearsed answers** — a real hand-off document for a half-done feature, a KT session, feedback that gets delivered, a disagreement that ends in a decision — and a bank of your own stories that each **end with an outcome**.

**Why it matters:** the Delegation feedback says the hand-off answer named prerequisites but *not how to delegate: no explanation of what is done and what is pending, no KT session, no expectations or support*. The Conflict feedback says *it never covered how to push for the best decision in the end*. The panel asked at 01:14:03 (hand off a 60% feature to a junior), 01:19:57 (tough feedback), 01:21:50 (repeated under-delivery), 01:23:42 (explaining to a non-technical PO), 01:25:20 (the PO who quotes ChatGPT), and 00:37:24 (a disagreement with a senior developer — and was your solution chosen?).

> [!warning] Do each level before opening its solution
> These are writing exercises. Write yours first — the model answers are one good shape, not the only one.

---

## The theory you need first

**STAR** — the shape of every behavioural answer: **S**ituation (one sentence of context), **T**ask (what *you* had to do), **A**ction (what *you* did — most of the answer, first person, concrete), **R**esult (what happened, with a number if you have one, and what you learned). The most common failure is describing a **process** ("I always try to…") instead of a **story** ("Last March, I…"), and the second is stopping before the **result**.

**SBI** — the shape of feedback: **S**ituation (when and where), **B**ehaviour (what the person did — observable, not a judgement), **I**mpact (what it caused). Then a question, and an agreement.

**Delegation levels** — delegating is not on or off. From closest to freest: *tell* (I decide, you execute) → *consult* (you research, we decide together) → *advise* (you decide, I'm available) → *delegate* (you own it, tell me if something exceptional happens). The level depends on the person's experience **with that kind of task**.

---

## Level 0 — Spot what is missing

You are pulled onto a production bug and post this to the junior engineer taking over your feature:

> "Hey! I have to jump on the payments incident. The saved-cards page is on my branch, most of it is done. Just finish the remaining bits and open the PR, should be easy. Ping me if anything 🙏"

List everything the junior **doesn't know** after reading it.

> [!success]- Solution — Level 0
> - **Which branch**, and whether it builds and its tests pass right now.
> - **What "done" means** — the acceptance criteria, the ticket, the design.
> - **What is done** and **what is left** — "most of it" and "the remaining bits" are not a list.
> - **Decisions already taken, and why** — so they don't undo them, or redo the research.
> - **Traps** — the thing that took you a day to find out.
> - **How to run and test it** locally — test accounts, feature flags, mock data.
> - **The deadline**, and what to do if they won't make it.
> - **How much they can decide alone** — the delegation level.
> - **When you're reachable** — "ping me" during an incident usually means "don't".
> - **Who else** can help when you can't.

---

## Level 1 — Write the hand-off document

The scenario: the **saved payment cards** page of a booking site. The user can list their cards, set a default, and delete a card. You are 60% done. Invent the remaining details, and write the hand-off as it would appear in the ticket or the PR description. Use these headings:

**Goal and acceptance criteria · Where it is · Done · Pending (as sub-tasks) · Decisions and why · Traps · How to run and test · Deadline and level of autonomy · Who to ask**

> [!success]- Solution — a model hand-off
> ```markdown
> ## Hand-off: Saved payment cards page (PAY-412)
>
> **Goal** — Users can see their saved cards, set one as default, and delete one.
> Acceptance criteria are in PAY-412; design in Figma ("Wallet v2").
>
> **Where it is** — branch `feat/pay-412-saved-cards`, draft PR #1840.
> It builds, and all tests pass as of commit `a3f9c1e`.
>
> **Done**
> - List of cards (brand, last 4, expiry) with loading, empty and error states — tested.
> - API client for GET /wallet/cards and PATCH /wallet/cards/:id/default, with Zod parsing.
> - "Set as default" with optimistic update and rollback on error — tested.
>
> **Pending** (sub-tasks created under PAY-412)
> 1. PAY-413 Delete a card: confirmation dialog, DELETE call, remove from the list. ~1 day.
> 2. PAY-414 Block deleting the default card while others exist (rule in AC #4). ~0.5 day.
> 3. PAY-415 Accessibility pass: focus returns to the list after the dialog; screen-reader labels on the card buttons. ~0.5 day.
> 4. PAY-416 E2E smoke test for list + set default. ~0.5 day.
>
> **Decisions and why**
> - Optimistic update for "set default": the API takes ~800 ms and the UI felt broken. Rollback is in `useSetDefaultCard`.
> - Cards are never cached in localStorage — PCI review asked for that. Don't add it.
>
> **Traps**
> - The staging API returns `expiry` as "MM/YY" but production as "MM/YYYY". The parser accepts both; keep it that way.
> - Expired cards come back from the API and must still be listed (greyed out), not filtered.
>
> **How to run and test** — `npm run dev`, log in with the staging account `wallet-qa` (credentials in 1Password,
> vault "QA"), flag `wallet_v2=on`. `npm test -- wallet` runs the unit and component tests.
>
> **Deadline and autonomy** — Sprint ends Thursday. You own the pending tasks: decide the implementation details
> yourself; check with me before changing the API client or anything in "Decisions". If Thursday looks
> at risk, tell me by Tuesday and we'll cut PAY-416 first.
>
> **Who to ask** — Me: free 12:00–12:30 and after 17:00 while the incident lasts. Ana (backend) for the API.
> Luis reviews the PR if I'm still on the incident.
> ```
>
> What makes it work: the junior can start **without talking to you**, knows **what not to touch**, and knows **when to raise a flag**. The pending list is sized and ordered, so cutting scope is a decision already prepared.

---

## Level 2 — The KT session

The document is necessary, not sufficient. Plan a **20-minute** knowledge-transfer call for the same hand-off. Write the agenda, minute by minute, and answer: who drives the keyboard, and why?

> [!success]- Solution — Level 2
> - **0–3 min** — Why the feature matters, and the acceptance criteria. The *why* lets them make good small decisions alone.
> - **3–10 min** — **They** share their screen, pull the branch, run it, and walk through the code while you talk: the folder layout, the API client, the optimistic hook.
> - **10–15 min** — The pending list in order, the decisions not to undo, and the two traps — shown in the code, not just mentioned.
> - **15–18 min** — They explain back what they'll do first and how they'll test it. Gaps show up here, not on Thursday.
> - **18–20 min** — The check-ins: a 10-minute call tomorrow at 10:00, and how to reach you meanwhile.
>
> **They drive** because explaining makes you feel understood, while doing exposes what isn't. If they can run it and narrate the code back, the hand-off worked.

---

## Level 3 — Close the loop

Two short messages, written:

1. To the **PM / tech lead**: the owner of the feature changed, and what that means for the date.
2. To the **junior**, after the first check-in, when they're doing well but slower than planned: keep their ownership, and adjust the plan.

> [!success]- Solution — Level 3
> 1. "Heads-up on PAY-412: I'm on the payments incident, so Marco is taking over the saved-cards page. It's about 60% done, and he has a written hand-off and a KT call behind him. The date holds if the incident is over by Wednesday; if not, we'll cut the e2e test (PAY-416) to a follow-up and still ship Thursday. I'll confirm on Tuesday."
> 2. "Nice work on the delete flow — the confirmation dialog is exactly right. We're about half a day behind, which is fine: let's move PAY-416 to next sprint so you can finish the accessibility pass properly. Keep going on PAY-414; I'll review it tonight."
>
> The first one is what **"communicate expectations"** means upwards: a new owner, a risk, and a prepared plan B. The second one keeps the **delegation level** — you adjust scope; you don't take the work back.

---

## Level 4 — Tough feedback, and when it happens again

The panel's scenario (01:21:50): all sprint, a developer reported "90% done" on a story; on the last day, nothing was done. You talked, agreed a plan, offered support. **Next sprint, the same thing.**

1. Write the **first** conversation, using SBI, in five or six lines.
2. Write what you do the **second** time. What changes?

> [!success]- Solution — Level 4
> 1. Privately, the same day, not in the retro:
>    > "I want to talk about the profile-export story. *(S)* In every stand-up this sprint, you said it was about 90% done. *(B)* Today we found it isn't working yet, and the PR has two days of changes. *(I)* We had to pull it from the release and I couldn't warn the PM earlier. I'm not here to blame you — I want to understand what happened. What made it hard to say it was stuck?"
>
>    Then **listen** — it is usually overload, a blocker they were embarrassed to raise, or not understanding the task. Agree on something concrete: tasks split into pieces small enough to finish in a day, a PR opened on day one, and "blocked" said in stand-up as a normal thing.
> 2. The second time it is no longer a misunderstanding — it is a **pattern**, and it gets more structure and more visibility:
>    - The same SBI conversation, naming the pattern plainly: "this is the second sprint, and the plan we agreed didn't change the outcome."
>    - Closer follow-up for a while: daily visibility of the work (draft PRs, small tasks), a lower delegation level, pairing on the next story.
>    - **Involve the manager** — not as a punishment, but because a repeated performance problem is part of their job too, and the person may need support you can't give (workload, personal issues, a different role).
>    - Write down what was agreed and when you'll review it.
>
> What the answer must not be: only "check whether the story points were wrong". Check it, yes — but if the estimate was fine, the conversation still has to happen.

---

## Level 5 — Push the disagreement to a decision

Two scripts.

1. **With a senior developer** (00:37:24): they want to add a global state library for the new search page; you think URL state and server-state caching are enough. Write how it goes from disagreement to a **decision**, and how you behave if the decision goes against you.
2. **With the PO and ChatGPT** (01:25:20): you estimated a week using the current approach. The PO says ChatGPT told them it can be done in three days with library X, and insists.

> [!success]- Solution — Level 5
> 1. - **Agree on the criteria first**, before the options: bundle size, how state survives a reload or a shared link, testability, what the team already knows.
>    - **Get evidence instead of opinions**: a time-boxed spike — half a day each, the same search filters built both ways — or a comparison against those criteria.
>    - **Name who decides, and by when**: usually the tech lead or the code owner, by the end of the week.
>    - **If it stays split**, write both options down (an RFC) and let the decision owner choose.
>    - **Disagree and commit**: if it goes the other way, you build it properly and record the decision in an ADR, with your concern as a stated risk to check in three months. No passive resistance.
>    - **And say the outcome** in the interview: "we went with URL state, and the spike showed it at a third of the code" — or "we went with their option, and here's what I learned."
> 2. "That's worth checking — if it's faster, great. Let me look at it today." Then, the same day:
>    - **Check X against your constraints**: does it support your framework version, your auth, your accessibility needs? Its licence, its maintenance, security advisories?
>    - **Explain in the PO's terms**, with the comparison side by side: "X does the main part, so it saves two days. It doesn't handle multi-currency, which we need, so we'd build that ourselves — four days total, not three. And it hasn't had a release in 18 months, which is a security risk for a payment page."
>    - **Offer options with their trade-offs**, and let the PO choose scope: "Four days with X and the risk, or five without it — or three days if we ship without multi-currency first."
>    - If the PO still insists on something unsafe, **escalate with the written comparison** — not because ChatGPT is wrong, but because the facts are.
>
> The common thread, and the gap the committee named: **a decision is the goal, not winning the argument**. Criteria, evidence, an owner, a deadline — then commit.

---

## Level 6 — Explaining to a non-technical person

The panel's 01:23:42 question. Explain to a product owner, in under a minute and without jargon, **why the hotel page needs a week of work to stop the price flickering from USD to EUR** (the reto 01 problem: the server doesn't know the user's currency, so it renders USD and the browser corrects it).

> [!success]- Solution — Level 6
> "When someone opens the hotel page, our server builds it before it knows which currency the guest chose — that choice is stored on their device, not with us. So the server shows dollars, and a moment later the browser switches to euros. That flicker looks broken, and on a price it hurts trust. The fix is to save the currency choice where the server can read it on the very first request, so the page arrives already in euros. It's about a week, because every page that shows a price has to use the new setting, and we need to test it for each currency."
>
> The shape: **what the user sees → why it happens, in one everyday sentence → what we change → why it costs what it costs**. Then ask: "Does that make sense? What would you like to know more about?"

---

## Level 7 — Your story bank

Write **five** STAR stories, from your own experience, each **under 90 seconds spoken**, each ending with a **result**:

1. A **disagreement** you had, how it became a decision, and whether your option won.
2. **Tough feedback** you gave — or received and acted on.
3. A time **AI pointed you in the wrong direction**, and how you noticed.
4. A feature you built **end to end**.
5. Something you **improved about yourself** — the communication rating of 3/5 is the obvious one, told as a plan with progress, not as an apology.

> [!success]- Solution — the shape of story 5
> The details below are placeholders — replace every fact with your own before rehearsing it.
>
> *Situation*: "In my last feedback cycle, my reviewers rated my communication three out of five, while the rest was fours and fives." *Task*: "For a senior role I need to explain decisions clearly in English, to both engineers and non-technical people." *Action*: "I started weekly classes with an English teacher focused on technical conversation, I rehearse my answers out loud and record them, and in every meeting I've started by restating the question in one sentence before answering. At work I volunteer for the demo in sprint reviews." *Result*: "My answers are shorter and more structured, and in the last review my lead mentioned the demos specifically. It's still my main area of growth, and I'm treating it like any other skill: practice and feedback."
>
> Why this shape works: it names the gap **without minimising it**, shows a **system** (not good intentions), and ends with **evidence of progress**.

---

## Level 8 — Say it out loud

Record yourself answering, in English, under two minutes each, then listen back once:

1. *"You're 60% through a feature and must hand it to a junior to take a critical bug. How do you do the hand-off?"*
2. *"Tell me about a time you had to give tough feedback."*
3. *"The same person under-delivers sprint after sprint, after you talked. What do you do?"*
4. *"Tell me about a strong disagreement with a senior developer. How was it resolved, and was your solution chosen?"*
5. *"Your PO says ChatGPT disagrees with your estimate and your library choice. What do you do?"*

When listening back, check three things: did you **restate the question** first? Did you tell a **story** rather than a process? Did you reach the **result**?

> [!question] Short answer for the interview — the hand-off
> "First, a written hand-off in the ticket: the goal and acceptance criteria, the branch and its state, what's done, what's pending as sized sub-tasks, the decisions not to undo and why, the traps, how to run it, the deadline, and what they can decide alone. Then a short KT call where they drive — they run it and explain it back. Then expectations and support: a check-in the next morning, when I'm reachable during the incident, and who else can help. And I tell the PM the owner changed and what that means for the date."

---

## Done when

- [ ] Level 0 the missing pieces listed
- [ ] Level 1 hand-off document written with all nine headings
- [ ] Level 2 KT agenda written
- [ ] Level 3 both messages written
- [ ] Level 4 first and second conversations written
- [ ] Level 5 both disagreement scripts written, each ending in a decision
- [ ] Level 6 the currency explanation said in under a minute
- [ ] Level 7 five stories written, each with a result
- [ ] Level 8 five answers recorded and listened to
