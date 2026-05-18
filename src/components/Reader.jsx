import { useMemo, useState } from "react";
import Sentence from "./Sentence";
import { LANGUAGES } from "../config/languages";

// Each segment is its own block. `kind` ("speech" | "narration" | "gap")
// drives layout: speeches get their own line with air around them, narration
// reads as a plain paragraph, gaps render as a muted placeholder.
function blockClass(kind) {
  if (kind === "gap") return "block is-gap";
  if (kind === "narration") return "block is-narration";
  return "block is-speech";
}

export default function Reader({ book, onBack, availableTargets }) {
  const hasTargets = availableTargets.length > 0;
  const [targetLang, setTargetLang] = useState(availableTargets[0] ?? null);
  const sourceLang = book.sourceLang;

  const segments = useMemo(
    () => book.segments.map((s) => ({ ...s, _sourceLang: sourceLang })),
    [book, sourceLang]
  );

  return (
    <article className="reader">
      <header className="reader-head">
        <button className="link-btn" onClick={onBack}>
          ← Índice
        </button>
        <h1>{book.title[sourceLang]}</h1>
        {hasTargets ? (
          <>
            <div className="lang-switch">
              <span className="lang-switch-label">
                Traducción al pasar el cursor:
              </span>
              {availableTargets.map((code) => (
                <button
                  key={code}
                  className={`chip${code === targetLang ? " is-on" : ""}`}
                  onClick={() => setTargetLang(code)}
                >
                  {LANGUAGES[code]?.label ?? code}
                </button>
              ))}
            </div>
            <p className="hint">
              Pasa el cursor sobre una frase para ver su traducción.
            </p>
          </>
        ) : (
          <p className="hint">Texto en español.</p>
        )}
      </header>

      <div className="text-body">
        {segments.map((seg) => (
          <p key={seg.id} className={blockClass(seg.kind)}>
            <Sentence segment={seg} targetLang={targetLang} />
          </p>
        ))}
      </div>
    </article>
  );
}
