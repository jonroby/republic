# La República — Platón

Personal reading site: Plato's *Republic* in **Spanish**, with an English
translation revealed when you hover over a sentence. Built with Vite + React.

Currently: a table of contents for all 10 books; **Book I** has the full
Spanish text (English not filled in yet). The other books show as
*próximamente*.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
```

## Data model

`src/data/book1.json` holds the text as language-keyed segments:

```json
{ "id": "b1-0001", "stephanus": "327a", "kind": "speech",
  "text": { "es": "…", "en": "" } }
```

- `es` — Spanish, transcribed verbatim from the Gredos edition
  (trad. Conrado Eggers Lan), `sources/republica-nueva.pdf`, paragraphs as
  printed, editor footnotes omitted.
- `en` — empty for now. The structure is ready: fill the field per segment,
  then add `"en"` to `translations` in the book JSON.
- `kind` — `speech` or `narration`. The reader puts each speech turn on its
  own line.

Book I is complete: Stephanus 327a → 354c, no gaps.

## Transcription method

The Gredos PDF is a scan with no usable text layer, so the Spanish was
transcribed by reading the page images directly, page by page, Stephanus
327a → 354c. No extraction scripts or machine alignment are involved — the
JSON is the single source of truth and is edited by hand.

## Adding more books

1. Create `src/data/bookN.json` with the same shape.
2. Import it in `src/data/loadBook.js`.
3. Flip `available: true` for that book in `src/data/books.js`.
