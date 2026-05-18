// Single place that maps a book number to its aligned JSON.
// Add future books here as they are produced.
import book1 from "./book1.json";

const BOOK_DATA = {
  1: book1,
};

export function loadBook(n) {
  return BOOK_DATA[n] ?? null;
}
