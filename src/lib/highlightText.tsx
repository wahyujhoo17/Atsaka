import React from "react";

// Renders admin-entered text: *word* gets the highlight class, newlines become <br />
export const highlightText = (text: string, highlightClassName: string) =>
  text.split("\n").map((line, lineIndex) => (
    <React.Fragment key={lineIndex}>
      {lineIndex > 0 && <br />}
      {line.split("*").map((part, partIndex) =>
        partIndex % 2 === 1 ? (
          <span key={partIndex} className={highlightClassName}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </React.Fragment>
  ));
