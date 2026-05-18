// Central language config.
export const SOURCE_LANG = "es";

export const LANGUAGES = {
  es: { code: "es", label: "Español", dir: "ltr" },
  en: { code: "en", label: "English", dir: "ltr" },
};

// Which translation appears on hover. Switchable in the UI; defaults to English.
// Only languages that actually have data in the loaded book will be offered.
export const DEFAULT_TARGET_LANG = "en";
