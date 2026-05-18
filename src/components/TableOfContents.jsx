import { BOOKS } from "../data/books";
import { SOURCE_LANG } from "../config/languages";

export default function TableOfContents({ onOpen }) {
  return (
    <section className="toc">
      <header className="toc-head">
        <h1>La República</h1>
        <p className="byline">Platón · texto en español con traducción al pasar el cursor</p>
      </header>

      <ol className="toc-list">
        {BOOKS.map((b) => (
          <li key={b.n} className={b.available ? "" : "is-locked"}>
            <button
              className="toc-item"
              disabled={!b.available}
              onClick={() => b.available && onOpen(b.n)}
            >
              <span className="toc-title">{b.title[SOURCE_LANG]}</span>
              <span className="toc-steph">{b.stephanus}</span>
              <span className="toc-status">
                {b.available ? "Leer →" : "próximamente"}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
