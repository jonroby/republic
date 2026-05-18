import { useId, useState } from "react";

// One source-language segment. When a target language is selected AND this
// segment has text for it, hover/focus reveals the gloss in a tooltip.
// With no translation available the text just renders plainly.
export default function Sentence({ segment, targetLang }) {
  const [open, setOpen] = useState(false);
  const tipId = useId();

  const sourceText = segment.text[segment._sourceLang];
  const gloss = targetLang ? segment.text[targetLang] : "";
  const hasGloss = Boolean(gloss);

  if (!hasGloss) {
    return <span className="sentence is-plain">{sourceText}</span>;
  }

  return (
    <span
      className={`sentence${open ? " is-active" : ""}`}
      tabIndex={0}
      role="button"
      aria-describedby={open ? tipId : undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {sourceText}
      {open && (
        <span className="tooltip" id={tipId} role="tooltip">
          {gloss}
        </span>
      )}
    </span>
  );
}
