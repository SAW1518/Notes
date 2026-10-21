---
title: "Reto 08 — RAG and agents from scratch"
tags:
  - challenge
  - genai
plan: "Assessment Plan — Tier 2"
status: todo
---

# Reto 08 — RAG and agents from scratch

**Goal:** build a retrieval-augmented question answerer over a hotel's policy in about 150 lines, with no framework — chunking with overlap, embeddings (a toy version, then a real model), similarity search, the augmented prompt, and an **eval** that measures it — and then a minimal **agent loop**, so you can explain both from the inside.

**Why it matters:** the Gen AI feedback lists exactly these gaps: *chunks and chunk overlap; RAG only mentioned as document storage; embedding models and how vectors are used; evals.* The panel also asked nine AI questions (00:19:28 to 01:12:25): agent vs prompt, skills, subagents, MCP, prompt structure, RAG under the hood, AI leading you the wrong way, checking AI outside your expertise, and when not to use it. Four of the six positions in `Vacantes/` ask for Gen AI too.

> [!warning] Do each level before opening its solution
> Predict first, write it down, then run and compare.

---

## The theory you need first

**RAG** — retrieval-augmented generation — answers questions about knowledge the model was never trained on (private, recent, or too specific), without retraining it:

```
INDEX (once, and again when the documents change)
  documents → chunk (size + overlap) → embed each chunk → store the vectors (vector DB)

QUERY (every question)
  question → embed it → find the nearest chunk vectors (cosine similarity, top-k)
           → put those chunks in the prompt as sources → the LLM answers, citing them
```

- An **embedding** is a list of numbers (384 for the model used here) that places a text in a space where texts with similar **meaning** are close together. "Money back" and "refund" land near each other although they share no word.
- **Cosine similarity** compares two vectors by their *direction*, from -1 to 1. With normalised vectors, it is just the dot product.
- **Chunking** exists because you retrieve and pay for pieces, not whole documents. **Overlap** repeats the end of one chunk at the start of the next, so a fact that falls on a boundary survives whole in at least one chunk.
- **Evals** measure it: did retrieval bring the right chunk (recall@k)? Is the answer faithful to the sources?

An **agent** is different from a prompt: a prompt is one request and one response. An agent is a **loop** — the model decides to call a **tool**, your program runs it, the **result** goes back into the conversation, and it repeats until the model gives a final answer or hits a step limit.

---

## Setup

In `Retos/retos-sandbox/`:

1. `npm install @huggingface/transformers` — runs a small embedding model locally. The first run downloads it (about 23 MB).
2. Create `reto08/tsconfig.json`, so the files can import each other with the `.mts` extension Node needs:

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": { "incremental": false, "plugins": [], "allowImportingTsExtensions": true },
  "include": ["*.mts"],
  "exclude": []
}
```

3. In the root `tsconfig.json`, change `"exclude": ["node_modules"]` to `"exclude": ["node_modules", "reto08"]`, so `next build` does not type-check this folder with the wrong settings.

Run files with `node reto08/<file>.mts` and type-check with `npx tsc -p reto08 --noEmit`, both from `retos-sandbox/`.

**The knowledge base**, `reto08/corpus.mts`:

```ts
// The knowledge base for reto 08: a hotel's guest policy, as one long text.
export const policy = `
Check-in starts at 15:00 and check-out is until 12:00. Late check-out until 14:00 costs 50 USD and depends on availability; ask at the front desk on the morning of departure.
Cancellation is free up to 48 hours before arrival. After that, the first night is charged. No-shows are charged the full stay. Refunds for prepaid rates are processed within 7 business days and always go back to the original card used for the booking.
Dogs up to 15 kg are welcome for a fee of 30 USD per night, with a maximum of one dog per room. Cats and other animals are not allowed, except service animals.
Valet parking costs 25 USD per day. Self parking is not available. EV chargers are on level -2 of the garage and are free for guests while the car is parked with the valet.
Breakfast is served from 7:00 to 10:30 in the lobby restaurant. It is included in Member rates and costs 22 USD per person otherwise. Room service runs all day.
Basic Wi-Fi is free in rooms and public areas. Premium Wi-Fi for video calls and streaming costs 10 USD per day per device.
Loyalty members earn 10 points per dollar spent on rooms, dining and spa. Points expire after 24 months without any account activity, so one stay or one purchase keeps them alive.
`.trim();
```

**The eval set**, `reto08/golden.mts`:

```ts
// The evaluation set: a question, and the phrases one retrieved chunk must contain to answer it.
export const golden = [
  { question: 'What time can I check in?', mustContain: ['15:00'] },
  { question: 'How much does it cost to bring my dog?', mustContain: ['Dogs up to 15 kg', '30 USD per night'] },
  { question: 'How much is parking?', mustContain: ['25 USD per day'] },
  { question: 'Can I get my money back if I cancel?', mustContain: ['Cancellation is free'] },
  { question: 'How long until a refund reaches my card?', mustContain: ['7 business days'] },
  { question: 'When is breakfast?', mustContain: ['7:00 to 10:30'] },
  { question: 'Do my points expire?', mustContain: ['24 months'] },
  { question: 'Is there somewhere to charge my electric car?', mustContain: ['EV chargers'] },
  { question: 'Can I leave my room later than noon?', mustContain: ['Late check-out'] },
];

export function answers(chunk: string, mustContain: string[]): boolean {
  return mustContain.every((phrase) => chunk.includes(phrase));
}
```

---

## Level 0 — Predict: cosine by hand

Three tiny "embeddings": `a = [1, 1, 0]`, `b = [1, 0, 1]`, `c = [2, 2, 0]`.

1. Compute `cosine(a, b)` and `cosine(a, c)`. Formula: `dot(x, y) / (|x| · |y|)`.
2. `c` is twice as long as `a`. Why is their similarity what it is, and why is that what we want for text?
3. If every vector is normalised to length 1 first, what does cosine become?

> [!success]- Solution — Level 0
> 1. `cosine(a, b)`: dot = 1, lengths √2 and √2 → **0.5**. `cosine(a, c)`: dot = 4, lengths √2 and √8 → 4/4 = **1**.
> 2. Cosine measures the **angle**, not the length. `c` points in exactly the same direction as `a`, so they are "the same meaning, louder". For text that matters: a long chunk and a short question about the same thing should still match, and length alone should not win.
> 3. Just the **dot product** — that's why embedding code asks for `normalize: true`, and why vector databases can use a fast dot product.

---

## Level 1 — Chunking, and the fact that falls on the boundary

Create `reto08/chunk.mts` with `chunk(text, size, overlap): string[]`, which splits on whitespace into chunks of `size` words, each starting `size - overlap` words after the previous one. Throw if `overlap >= size`.

Then print every chunk of the policy for `size 40, overlap 0`, and read the boundaries.

1. Find two facts that are **cut in half** by a boundary.
2. Now print `size 40, overlap 10`. Are those facts whole in some chunk now?
3. What does a bigger chunk buy you, and what does it cost? And bigger overlap?

> [!success]- Solution — Level 1
> ```ts
> // Splits a text into chunks of `size` words, where each chunk repeats the last `overlap` words of the previous one.
> export function chunk(text: string, size: number, overlap: number): string[] {
>   if (overlap >= size) throw new Error('overlap must be smaller than size');
>   const words = text.split(/\s+/);
>   const chunks: string[] = [];
>   for (let start = 0; start < words.length; start += size - overlap) {
>     chunks.push(words.slice(start, start + size).join(' '));
>     if (start + size >= words.length) break;
>   }
>   return chunks;
> }
> ```
>
> 1. With `overlap 0` (6 chunks), chunk 1 ends `…Dogs up to 15 kg are` and chunk 2 starts `welcome for a fee of 30 USD per night…` — the dog **and** its price are never together. Chunk 2 ends `…Self parking is not available. EV` and chunk 3 starts `chargers are on level -2` — "EV chargers" is split in two.
> 2. Yes. With `overlap 10` (8 chunks) one chunk contains `Dogs up to 15 kg are welcome for a fee of 30 USD per night` in full, and another contains `EV chargers are on level -2`.
> 3. **Bigger chunks**: more context per hit and fewer split facts, but each chunk's embedding becomes a blurred average of several topics (worse matching), and every retrieved chunk costs more tokens. **More overlap**: fewer facts lost at boundaries, at the price of more chunks, more storage and duplicated tokens. Typical starting points are a few hundred tokens per chunk with 10–20% overlap — then you **measure** (level 2). Production systems also split on **structure** (headings, paragraphs) rather than a fixed word count, so chunks follow the document's meaning.

---

## Level 2 — Toy embeddings, and an eval that shows where they fail

Create `reto08/vectors.mts` with: a tokenizer, a vocabulary builder, `toyEmbed(text, vocab)` (a vector of word counts), `cosine(a, b)` and `topK(query, vectors, k)`. Then `reto08/toy-eval.mts`, which for `size 40` and overlaps `0` and `10` reports **recall@1** and **recall@2** over the golden set — the share of questions where at least one of the top-k chunks `answers` it — and prints the misses.

1. Predict which questions a word-count model **cannot** answer, whatever the chunking.
2. Run it. Explain every miss in one line.

> [!success]- Solution — Level 2
> `reto08/vectors.mts`:
>
> ```ts
> // Toy embeddings: a vector of word counts over the corpus vocabulary. No model, no meaning — only shared words.
> const STOP = new Set('a an the is are and or of to in on for at by it its be can i my do does how what when where is there with from per after up until'.split(' '));
>
> export function tokenize(text: string): string[] {
>   return text.toLowerCase().match(/[a-z0-9:]+/g)?.filter((w) => !STOP.has(w)) ?? [];
> }
>
> export function buildVocabulary(texts: string[]): Map<string, number> {
>   const vocab = new Map<string, number>();
>   for (const t of texts) for (const w of tokenize(t)) if (!vocab.has(w)) vocab.set(w, vocab.size);
>   return vocab;
> }
>
> export function toyEmbed(text: string, vocab: Map<string, number>): number[] {
>   const v = new Array(vocab.size).fill(0);
>   for (const w of tokenize(text)) {
>     const i = vocab.get(w);
>     if (i !== undefined) v[i] += 1;
>   }
>   return v;
> }
>
> export function cosine(a: number[], b: number[]): number {
>   let dot = 0, na = 0, nb = 0;
>   for (let i = 0; i < a.length; i++) {
>     dot += a[i] * b[i];
>     na += a[i] * a[i];
>     nb += b[i] * b[i];
>   }
>   return na === 0 || nb === 0 ? 0 : dot / Math.sqrt(na * nb);
> }
>
> export function topK(query: number[], vectors: number[][], k: number): { index: number; score: number }[] {
>   return vectors
>     .map((v, index) => ({ index, score: cosine(query, v) }))
>     .sort((x, y) => y.score - x.score)
>     .slice(0, k);
> }
> ```
>
> `reto08/toy-eval.mts`:
>
> ```ts
> import { policy } from './corpus.mts';
> import { chunk } from './chunk.mts';
> import { buildVocabulary, toyEmbed, topK } from './vectors.mts';
> import { answers, golden } from './golden.mts';
>
> for (const [size, overlap] of [[40, 0], [40, 10]] as const) {
>   const chunks = chunk(policy, size, overlap);
>   const vocab = buildVocabulary(chunks);
>   const vectors = chunks.map((c) => toyEmbed(c, vocab));
>   for (const k of [1, 2]) {
>     let hits = 0;
>     const misses: string[] = [];
>     for (const { question, mustContain } of golden) {
>       const found = topK(toyEmbed(question, vocab), vectors, k).some((r) => answers(chunks[r.index], mustContain));
>       if (found) hits++;
>       else misses.push(question);
>     }
>     console.log(`toy · size ${size} overlap ${overlap} · recall@${k} = ${hits}/${golden.length}`);
>     for (const m of misses) console.log(`    miss: ${m}`);
>   }
> }
> ```
>
> ✅ Measured:
>
> | toy | recall@1 | recall@2 |
> |---|---|---|
> | size 40, overlap 0 | 5/9 | 6/9 |
> | size 40, overlap 10 | 5/9 | 7/9 |
>
> 1. The ones whose words are not in the text: **"charge my electric car"** (the text says *EV*), **"leave my room later than noon"** (the text says *late check-out*), and **"money back if I cancel"** (the text says *cancellation*, *refunds*). Note that *dog* and *dogs* are different words to it as well.
> 2. Electric car and leave-later: **vocabulary mismatch** — no shared words, so no similarity. Money back: it matches the *refund* sentence through "card"-like words and misses the cancellation one. The dog question with overlap 0: a **chunking** failure — no chunk contains both the dog and the price, so nothing retrieval does can fix it; overlap 10 fixes it.
>
> That is the case for real embeddings: a word-count model only finds shared **words**; an embedding model finds shared **meaning**. (Keyword search is not useless — for codes, names and exact terms it beats embeddings, which is why production uses **hybrid** search.)

---

## Level 3 — Real embeddings

Create `reto08/embed.mts`:

```ts
// Real embeddings with a small open model that runs locally (about 23 MB, downloaded on first use).
import { pipeline } from '@huggingface/transformers';

const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

export async function embed(texts: string[]): Promise<number[][]> {
  const output = await extractor(texts, { pooling: 'mean', normalize: true });
  return output.tolist() as number[][];
}
```

Write `reto08/real-eval.mts`: the same eval, using `embed` instead of `toyEmbed` (and the same `topK`). Print the length of one embedding too.

1. Predict the recall for each row before running.
2. Which configuration answers all nine with k = 2?
3. What do `pooling: 'mean'` and `normalize: true` do?

> [!success]- Solution — Level 3
> ```ts
> import { policy } from './corpus.mts';
> import { chunk } from './chunk.mts';
> import { topK } from './vectors.mts';
> import { answers, golden } from './golden.mts';
> import { embed } from './embed.mts';
>
> const [first] = await embed(['How long until a refund reaches my card?']);
> console.log(`one embedding: ${first.length} numbers, starting ${first.slice(0, 3).map((n) => n.toFixed(3)).join(', ')}…`);
>
> for (const [size, overlap] of [[40, 0], [40, 10]] as const) {
>   const chunks = chunk(policy, size, overlap);
>   const vectors = await embed(chunks);
>   const queries = await embed(golden.map((g) => g.question));
>   for (const k of [1, 2]) {
>     let hits = 0;
>     const misses: string[] = [];
>     golden.forEach(({ question, mustContain }, i) => {
>       const found = topK(queries[i], vectors, k).some((r) => answers(chunks[r.index], mustContain));
>       if (found) hits++;
>       else misses.push(question);
>     });
>     console.log(`real · size ${size} overlap ${overlap} · recall@${k} = ${hits}/${golden.length}`);
>     for (const m of misses) console.log(`    miss: ${m}`);
>   }
> }
> ```
>
> ✅ Measured (`one embedding: 384 numbers`):
>
> | real embeddings | recall@1 | recall@2 |
> |---|---|---|
> | size 40, overlap 0 | 7/9 | 7/9 |
> | size 40, overlap 10 | 8/9 | **9/9** |
>
> 1. With overlap 0 the two misses are the **chunking** failures — the dog and the EV chargers — which no model can fix. Meaning-based matching fixes "money back", "electric car" and "leave later".
> 2. **Overlap 10, k = 2.** The model fixes vocabulary, overlap fixes boundaries, and k = 2 gives a second chance when the best chunk is close but not the one.
> 3. The model produces one vector **per token**; **mean pooling** averages them into one vector for the whole text. **Normalising** scales it to length 1, so cosine similarity becomes a dot product.
>
> What a production system adds here: a **vector database** (pgvector, Pinecone, Qdrant) with an approximate nearest-neighbour index instead of comparing against every chunk; **hybrid** search (embeddings plus keywords); a **reranker** that rescores the top 20–50 candidates with a more precise model; **metadata filters** (brand, language, date); and **re-indexing** when documents change. The embedding model is a choice too — dimensions, languages, cost — and changing it means re-embedding everything.

---

## Level 4 — Augment: the prompt that uses the sources

Write `reto08/ask.mts`: take a question from `process.argv[2]`, retrieve the top 2 chunks with real embeddings (`size 40, overlap 10`), and print the **prompt** you would send to the LLM.

1. What three instructions must the prompt give the model, and why each?
2. Run it with *"Is there a swimming pool?"* — the policy says nothing about it. What does retrieval return anyway, and what must the answer be?
3. Paste one of your prompts into Claude and check the answer against the sources.

> [!success]- Solution — Level 4
> ```ts
> // Retrieval-augmented prompt: retrieve, then put the sources in front of the question.
> import { policy } from './corpus.mts';
> import { chunk } from './chunk.mts';
> import { topK } from './vectors.mts';
> import { embed } from './embed.mts';
>
> const question = process.argv[2] ?? 'Can I bring my dog, and what does it cost?';
>
> const chunks = chunk(policy, 40, 10);
> const vectors = await embed(chunks);
> const [q] = await embed([question]);
> const sources = topK(q, vectors, 2);
>
> const prompt = [
>   'Answer the guest using ONLY the sources below. Cite the source number after each fact, like [1].',
>   'If the sources do not contain the answer, say you do not know and suggest asking the front desk.',
>   '',
>   ...sources.map((s, i) => `[${i + 1}] (score ${s.score.toFixed(2)}) ${chunks[s.index]}`),
>   '',
>   `Question: ${question}`,
> ].join('\n');
>
> console.log(prompt);
> ```
>
> ✅ For the default question the first source (score 0.59) contains `Dogs up to 15 kg are welcome for a fee of 30 USD per night`.
>
> 1. **Use only the sources** — that is the whole point: grounding, not the model's memory. **Cite them** — so a person can check each claim, and so you can measure faithfulness. **Say "I don't know" when they don't contain the answer** — otherwise the model fills the gap with something plausible.
> 2. Retrieval **always** returns the k nearest chunks, even when none is relevant — "nearest" is not "relevant". ✅ Measured: the parking and breakfast chunks come back, both with a score of 0.16, against 0.59 for the dog question. The right answer is *"I don't know — please ask the front desk"*. Production systems also set a **minimum score**, below which they don't call the model at all.
> 3. The answer should match the sources and cite `[1]`. If it adds facts that aren't in them, that is a **faithfulness** failure — which is what level 5 measures.

---

## Level 5 — Evals: measuring more than retrieval

Your eval so far measures **retrieval** only. Answer:

1. Write three new golden questions: one **unanswerable** from the policy, one that needs **two** facts from different places, and one with a **typo**.
2. Retrieval can be perfect and the answer still wrong. How?
3. How do you evaluate the **answers** at scale, when you can't read them all?
4. When do evals run?

> [!success]- Solution — Level 5
> 1. For example: *"Is there a swimming pool?"* (expected: *I don't know*), *"If I cancel the day before, do I get my money back, and how long does it take?"* (needs the 48-hour rule **and** the 7-business-day refund), *"wen is brekfast?"* (embeddings usually survive typos; word counts don't).
> 2. The model ignores the sources and answers from memory, mixes up two chunks, adds a fact that isn't there (**hallucination**), or ignores "I don't know". Retrieval recall says the right chunk was **available**; **faithfulness** says the answer actually **used** it.
> 3. Three layers: **deterministic checks** where possible (the answer contains "30 USD"; the answer cites a source; unanswerable questions get "I don't know"). **LLM-as-judge**: a second model scores each answer against a rubric — faithful to the sources? does it answer the question? — calibrated by people grading a sample and comparing. And **production feedback**: thumbs up and down, escalations to a human.
> 4. On **every change** that can move quality — the prompt, the model, the chunk size, the embedding model — in CI, like tests, with a threshold that blocks a regression. And continuously in production on a sample.

---

## Level 6 — The agent loop

Create `reto08/agent.mts`:

```ts
// An agent is a loop: the model picks a tool, the program runs it, the result goes back, repeat until an answer.
// The "model" here is a scripted stand-in, so you can watch the loop without an API key.
import { policy } from './corpus.mts';
import { chunk } from './chunk.mts';
import { buildVocabulary, toyEmbed, topK } from './vectors.mts';

type Message =
  | { role: 'user'; content: string }
  | { role: 'assistant'; toolCall?: { name: string; input: Record<string, string> }; answer?: string }
  | { role: 'tool'; name: string; result: string };

const chunks = chunk(policy, 40, 10);
const vocab = buildVocabulary(chunks);
const vectors = chunks.map((c) => toyEmbed(c, vocab));

const tools: Record<string, (input: Record<string, string>) => string> = {
  search_policy: ({ query }) => topK(toyEmbed(query, vocab), vectors, 1).map((r) => chunks[r.index]).join('\n'),
  convert_currency: ({ usd }) => `${usd} USD is about ${(Number(usd) * 17.2).toFixed(0)} MXN`,
};

function scriptedModel(history: Message[]): Message {
  const toolResults = history.filter((m): m is Extract<Message, { role: 'tool' }> => m.role === 'tool');
  if (toolResults.length === 0) {
    return { role: 'assistant', toolCall: { name: 'search_policy', input: { query: 'dogs fee per night' } } };
  }
  if (toolResults.length === 1) {
    const usd = toolResults[0].result.match(/fee of (\d+) USD/)?.[1] ?? '0';
    return { role: 'assistant', toolCall: { name: 'convert_currency', input: { usd } } };
  }
  return { role: 'assistant', answer: `Yes, dogs up to 15 kg are welcome. ${toolResults[1].result} per night.` };
}

const history: Message[] = [{ role: 'user', content: 'Can I bring my dog, and how much is it in pesos?' }];

for (let step = 1; step <= 5; step++) {
  const reply = scriptedModel(history);
  history.push(reply);
  if (reply.role === 'assistant' && reply.answer) {
    console.log(`step ${step} · answer: ${reply.answer}`);
    break;
  }
  if (reply.role === 'assistant' && reply.toolCall) {
    const { name, input } = reply.toolCall;
    const result = tools[name](input);
    console.log(`step ${step} · tool ${name}(${JSON.stringify(input)}) → ${result.slice(0, 70)}…`);
    history.push({ role: 'tool', name, result });
  }
}
```

Run it, then answer:

1. Point at the four parts of an agent in this file: the **model**, the **tools**, the **loop**, the **stopping condition**.
2. In a real agent, what replaces `scriptedModel`, and how does the model know which tools exist?
3. Where does **MCP** fit in this picture?
4. What is a **skill**, and how is it different from writing more instructions in the prompt?
5. When would you hand part of this work to a **subagent**?

> [!success]- Solution — Level 6
> ✅ Output:
> ```
> step 1 · tool search_policy({"query":"dogs fee per night"}) → business days and always go back to the original card used for the boo…
> step 2 · tool convert_currency({"usd":"30"}) → 30 USD is about 516 MXN…
> step 3 · answer: Yes, dogs up to 15 kg are welcome. 30 USD is about 516 MXN per night.
> ```
>
> 1. **Model**: `scriptedModel` decides the next step from the history. **Tools**: the `tools` map — functions with a name and an input. **Loop**: the `for` that sends the history, runs the requested tool and appends its result. **Stopping condition**: a final `answer`, or the 5-step cap — always cap an agent's steps.
> 2. A real LLM call — the Messages API with a `tools` parameter. Each tool is described by a **name, a description and a JSON Schema** for its input; the model reads those descriptions and returns a structured tool call instead of text. The model never runs anything itself — **your program** executes the tool and returns the result.
> 3. **MCP (Model Context Protocol)** standardises the `tools` map. An MCP **server** exposes tools (and resources and prompts) over a common protocol; any MCP-compatible **client** — Claude Code, an IDE, your own agent — can discover and call them. Without it, every agent writes its own Jira, GitHub or database integration (N agents × M systems); with it, each system is wrapped once and every agent can use it (N + M).
> 4. A **skill** is a packaged set of instructions — sometimes with scripts and reference files — that the agent loads **only when the task matches**; until then, only its short description sits in the context. More prompt instructions are always loaded, in every conversation. A skill is the better choice when the procedure repeats, is long, or needs to be shared and versioned across a team; a one-off constraint belongs in the prompt.
> 5. When a sub-task is **self-contained** and would flood the main context — searching a large codebase, reading many documents, trying several approaches in parallel. The subagent starts with a clean context and returns only its conclusion. The cost: it starts cold, re-reads what it needs, and the main agent only sees its summary.

---

## Level 7 — Client case: design it for OXXO

OXXO's position asks for GenAI features. Design, out loud, in two minutes: *a store-staff assistant that answers questions about procedures and product manuals (hundreds of PDFs, updated monthly).* Cover: ingestion, chunking, retrieval, the prompt, evals, and what you would **not** let it do.

> [!success]- Solution — a model answer
> "I'd build it as RAG. Ingestion: parse the PDFs, split them on structure — headings and sections — into chunks of a few hundred tokens with some overlap, and keep metadata on each: document, section, date, store type. Embed the chunks with an embedding model and store them in a vector database. Re-index every month when the manuals change, and delete old versions so it never quotes a retired procedure.
>
> At question time: embed the question, run hybrid search — vectors plus keywords, because staff will type product codes — filter by store type, rerank the top candidates, and send the best few to the model with instructions to answer only from them, cite the section, and say 'I don't know, ask your supervisor' below a confidence threshold.
>
> Before launch, a golden set of real staff questions with the expected sections, measuring retrieval recall and answer faithfulness, running in CI on every prompt or model change. In production, thumbs up and down, and a sample reviewed every week.
>
> What I wouldn't let it do: anything with money or customer data — refunds, prices that change by region — without a tool that reads the real system, and nothing it can't cite."

---

## Level 8 — Say it out loud: the panel's nine AI questions

Answer each in under a minute, in English, without looking.

1. What makes an AI agent different from sending a prompt to an LLM?
2. What is an agent skill, and when would you create a reusable skill instead of adding instructions to the prompt?
3. When would you delegate work to subagents?
4. What problem does MCP solve?
5. How do you structure a prompt for a coding task?
6. What is RAG, what problem does it solve, and how does it work under the hood?
7. Tell me about a time AI pointed you in the wrong direction. *(Your own story — see the fold for the shape.)*
8. How do you check AI output in an area where you are not an expert?
9. When should you not use AI?

> [!success]- Solution — Level 8
> 1. "A prompt is one request and one response. An agent is a loop: the model can call tools, the program runs them, the results go back into the context, and it keeps going until the goal is met or it hits a limit. So it can act and observe, not only answer."
> 2. "A skill is a packaged procedure — instructions, sometimes scripts — that the agent loads only when the task needs it; until then only its description costs context. I'd make one when the same procedure repeats across sessions or people, or needs to be versioned and shared — like our accessibility review checklist. A one-off constraint stays in the prompt."
> 3. "When a sub-task is self-contained and noisy — searching a big codebase, reviewing many files, trying independent approaches in parallel. The subagent works in its own context and returns a summary, so the main session stays focused. I don't use them for small tasks, because they start cold."
> 4. "It standardises how agents connect to tools and data. Instead of every agent writing its own Jira or database integration, a system is wrapped once as an MCP server that exposes tools and resources, and any MCP client can use it. N times M integrations become N plus M."
> 5. "Context first — the goal, the relevant files, the constraints and conventions. Then the task, with acceptance criteria — what done looks like, including tests. Then the output format. For anything non-trivial I start in plan mode, review the plan, and only then let it change code."
> 6. "Retrieval-augmented generation lets a model answer from knowledge it wasn't trained on, without retraining. You split the documents into chunks with some overlap, embed each chunk into a vector, and store them. For a question, you embed it, retrieve the nearest chunks by cosine similarity, and put them in the prompt with instructions to answer only from them and cite them. Then you evaluate retrieval recall and answer faithfulness."
> 7. The shape, with your own facts: **the situation** (what you asked the AI to do) → **what it proposed** (concrete: a library, an API, a fix) → **the signal it was wrong** (a failing test, docs that contradicted it, a deprecated API, a version mismatch) → **how you verified** (official docs, a minimal reproduction) → **what you changed in your workflow** (always ask for sources, check versions first, add a test before accepting a fix).
> 8. "I make it show its sources and check them, cross-check with a second source or model, and run a small experiment where I can. For anything with real impact — in our case medical rules — the decision goes through a domain expert. The AI accelerates the research; it doesn't sign off on it."
> 9. "When regulation or data policy forbids sending the data. When I need to genuinely understand something myself — summaries skip the part I'd learn from. And when a confident wrong answer is expensive and I can't verify it cheaply."

> [!question] Short answer for the interview — RAG
> "RAG grounds a model in documents it wasn't trained on. Index once: chunk the documents with overlap so facts on a boundary survive, embed each chunk with an embedding model, store the vectors. Per question: embed it, retrieve the nearest chunks by cosine similarity — usually hybrid with keywords and a reranker — and give them to the model with instructions to answer only from them and cite them. Then I measure it: retrieval recall on a golden set, answer faithfulness with deterministic checks and an LLM judge, in CI on every change."

---

## Done when

- [ ] Level 0 cosine computed by hand
- [ ] Level 1 chunker written; both boundary splits found
- [ ] Level 2 toy eval run; every miss explained
- [ ] Level 3 real eval run; 9/9 at overlap 10, k = 2
- [ ] Level 4 prompt printed; the pool question handled
- [ ] Level 5 three new golden questions; answer evals explained
- [ ] Level 6 agent loop run; the five questions answered
- [ ] Level 7 the OXXO design said out loud in two minutes
- [ ] Level 8 the nine questions answered out loud, including your own story for 7
