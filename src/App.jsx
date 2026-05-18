import { useMemo, useState } from "react";
import TableOfContents from "./components/TableOfContents";
import Reader from "./components/Reader";
import { loadBook } from "./data/loadBook";
import { LANGUAGES } from "./config/languages";
import "./App.css";

export default function App() {
  const [openBook, setOpenBook] = useState(null); // book number or null

  const book = openBook ? loadBook(openBook) : null;

  // Only offer hover languages that this book actually contains data for,
  // ordered as declared in the book's `translations`.
  const availableTargets = useMemo(() => {
    if (!book) return [];
    return book.translations.filter(
      (code) =>
        LANGUAGES[code] &&
        book.segments.some((s) => s.text[code] && s.text[code].length)
    );
  }, [book]);

  return (
    <main className="app">
      {book ? (
        <Reader
          book={book}
          availableTargets={availableTargets}
          onBack={() => setOpenBook(null)}
        />
      ) : (
        <TableOfContents onOpen={setOpenBook} />
      )}
      <footer className="app-foot">
        Uso personal · Español: xtec.cat · English: D. Horan translation
      </footer>
    </main>
  );
}
