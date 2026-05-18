// Table of contents for all 10 books of the Republic.
// Only books with `available: true` have data and are clickable.
// To add a book later: create src/data/bookN.json (same shape as book1.json),
// import it in src/data/loadBook.js, and flip `available` to true here.

export const BOOKS = [
  { n: 1, available: true,  title: { es: "Libro I",    en: "Book I" },    stephanus: "327–354" },
  { n: 2, available: true,  title: { es: "Libro II",   en: "Book II" },   stephanus: "357–383" },
  { n: 3, available: false, title: { es: "Libro III",  en: "Book III" },  stephanus: "386–417" },
  { n: 4, available: false, title: { es: "Libro IV",   en: "Book IV" },   stephanus: "419–445" },
  { n: 5, available: false, title: { es: "Libro V",    en: "Book V" },    stephanus: "449–480" },
  { n: 6, available: false, title: { es: "Libro VI",   en: "Book VI" },   stephanus: "484–511" },
  { n: 7, available: false, title: { es: "Libro VII",  en: "Book VII" },  stephanus: "514–541" },
  { n: 8, available: false, title: { es: "Libro VIII", en: "Book VIII" }, stephanus: "543–569" },
  { n: 9, available: false, title: { es: "Libro IX",   en: "Book IX" },   stephanus: "571–592" },
  { n: 10, available: false, title: { es: "Libro X",   en: "Book X" },    stephanus: "595–621" },
];
