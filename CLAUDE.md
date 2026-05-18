# Project: La República — Platón (reader)

Personal Vite + React site showing Plato's *Republic* in Spanish with an
English hover translation. `src/data/bookN.json` is the single source of truth,
edited by hand / via agents. No extraction scripts, no machine alignment.

This file is self-contained: it is both the project guide and the full
strategy for adding a book. Hand it to an orchestrator agent as-is.

---

## Source PDF

`sources/republica-nueva.pdf` — Gredos edition (trad. Conrado Eggers Lan).
It is a SCAN with NO usable text layer. Spanish MUST be transcribed by
**reading the PDF page images directly** (the Read tool renders PDF pages),
one page at a time. `pdftotext` output is garbage — never use it.

Each PDF page shows TWO printed pages side by side (left column = one printed
page, right column = the next).

Locate a book: Stephanus numbers are in the margins. I 327–354, II 357–383,
III 386–417, IV 419–445, V 449–480, VI 484–511, VII 514–541, VIII 543–569,
IX 571–592, X 595–621. Find the start by reading PDF pages and matching the
printed running header ("REPÚBLICA N") + marginal Stephanus numbers. Printed
page numbers ≠ Stephanus numbers ≠ PDF page numbers — establish the mapping by
inspection. Record exactly which PDF page the book starts on, whether it
starts mid-page (e.g. "page 51 right column only"), and where it ends
("page 74 left column only"). Known: Book I = PDF pp. 27–50,
Book II = PDF pp. 51 (right col)–74 (left col).

## Segment schema (`src/data/bookN.json`)

```json
{ "book": 2, "title": { "es": "...", "en": "..." },
  "sourceLang": "es", "translations": ["en"],
  "segments": [
    { "id": "b2-0001", "stephanus": "357a", "kind": "speech|narration|gap",
      "text": { "es": "...", "en": "..." },
      "sentences": [ { "es": "...", "en": "..." } ]  // only on long segments
    }
  ] }
```

- `kind`: `speech` (paragraph starting with `—`), `narration`, or `gap`
  (placeholder for un-transcribed text).
- `sentences` is ADDITIVE and only on long segments. It MUST NOT change the
  outer segment list (same ids; `text.es`/`text.en` kept as the full block /
  fallback). Short segments have no `sentences` key.
- Working dir for intermediate agent files: `/tmp/bookN/`.

---

## Pipeline architecture

3 sequential stages. Each stage = a **main process** that divides the work and
spawns ~5 **fresh `general-purpose` sub-agents IN PARALLEL** (no conversation
memory; each prompt fully self-contained). Within a stage agents run in
parallel; stages run in order 1 → 2 → 3.

**The main process owns correctness.** Never trust a sub-agent's self-report —
agents over-report success. The main process independently re-validates every
artifact before merging.

### STAGE 1 — Transcribe Spanish (parallel by PDF page range)

1. Determine the book's PDF page range and column boundaries.
2. Divide pages into ~5 contiguous blocks (e.g. 51–55, 56–60, …). Spawn 5
   agents in parallel, one per block.
3. Each agent (self-contained prompt): read `sources/republica-nueva.pdf` one
   page at a time; transcribe Spanish VERBATIM (accents, ¿¡, em-dash `—`,
   « » quotes); SKIP editor footnotes and running headers/page numbers;
   ONE object per speech turn (`—` start) or narration paragraph; stitch
   sentences crossing column/page boundaries (never cut a sentence mid-way);
   tag `kind`; assign marginal `stephanus`; respect column-only limits at the
   book's first/last page. Output `[{stephanus, kind, es}]` to
   `/tmp/bookN/pass1_<X>.json`.
4. **Content-filter contingency (critical).** Some PDF pages are blocked by
   the API content filter when read as images — a mature-content false
   positive on classical text. Confirmed blocked: Republic I 342e–344c &
   347a–348b; Republic II first half (PDF pp. ~51–65, Stephanus 357a–~374a).
   Agent prompt MUST say: on a blocked/unreadable page, do NOT abort — emit a
   gap placeholder and continue. When the main process detects blocked pages,
   the fallback is: the human pastes that page's text in chat (pasted text
   bypasses the image filter); the main process then segments it. Do NOT loop
   retrying a blocked page — it keeps failing.
5. Main process validates: valid JSON, no empty `es`, reading order intact,
   footnotes/headers absent (spot-check), continuous Stephanus coverage across
   the concatenation with no broken mid-sentence seams between adjacent
   blocks. Concatenate in page order, assign sequential ids `bN-0001…`, write
   `src/data/bookN.json` with `text.en = ""`.

### STAGE 2 — English translation (parallel by segment span)

1. Split the segment list into ~5 contiguous spans → `/tmp/bookN/chunkK.json`
   as `[{id, kind, stephanus, es}]`.
2. Spawn 5 agents in parallel. Each (self-contained): read the whole span
   first, then translate IN ORDER (replies match questions, speaker continuity
   preserved); faithful scholarly register (Grube/Reeve/Shorey tone); no
   paraphrase/summary/omission. Enforce a SHARED fixed glossary book-wide:
   justice / what is just / the just man / unjust / the stronger / excellence
   / soul / city (for *Estado*) / the craft / the ruler / function / wages.
   Render `—` speech as English double quotes with natural attributions.
   Output `[{id, en}]` to `/tmp/bookN/outK.json`.
3. Main process validates: union of outputs is exactly 1:1 with source ids
   (no missing/extra/duplicate), no empty `en`. Merge `en` by id. Add `"en"`
   to `translations`.

### STAGE 3 — Break up long segments (parallel by segment span)

1. Flag long segments: ≥3 sentences OR >~320 chars of `es`.
2. Split flagged segments into ~5 contiguous spans; spawn 5 agents in
   parallel, each given its long segments as `[{id, es, en}]`.
3. Each agent (self-contained): for each segment RE-SEGMENT (do NOT
   retranslate) the existing `es` and `en` into short aligned pieces — split
   on sentence boundaries, then clause boundaries if still huge; `es` and `en`
   piece arrays EQUAL length and 1:1 aligned (rebalance English wording across
   pieces for natural alignment); keep leading `—` on the first piece of a
   speech. Output `[{id, sentences:[{es,en},…]}]`.
4. Main process validates HARD: for every item `len(es)==len(en)>=2`; no
   empty pieces; whitespace-normalized concatenation of `es` pieces exactly
   equals original `es` (same for `en`) — nothing invented or dropped. Merge
   as additive `sentences` arrays. Outer segment list byte-for-byte unchanged
   except added `sentences` keys.

---

## Wire-up (after Stage 3)

1. `import bookN from "./bookN.json"` in `src/data/loadBook.js`; add to map.
2. Flip `available: true` for book N in `src/data/books.js`.
The reader already renders per-sentence hover when `sentences` exists and
falls back to block hover otherwise.

## Invariants (do not violate)

- Sub-agents are stateless and disposable; the main process owns correctness
  and re-validates every artifact independently.
- Stages sequential (1→2→3); within a stage, agents parallel.
- Spanish transcribed VERBATIM from page images; never machine-extracted.
- `sentences` additive only; outer segment structure immutable after Stage 1
  (only `text.en` filled in Stage 2, `sentences` added Stage 3).
- Blocked pages → gap marker + human-paste fallback; never silently skip,
  never loop-retry.
- Spanish dialogue: `—` opens speech and inline attributions (`—dijo`).
- Two git commits exist: (1) Vite scaffold, (2) the app. Don't commit unless
  asked. 20MB `sources/republica-nueva.pdf` is gitignored.
