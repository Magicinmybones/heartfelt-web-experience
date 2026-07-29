"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const decorations = [
  { className: "heart heart-one", symbol: "♥" },
  { className: "heart heart-two", symbol: "♥" },
  { className: "heart heart-three", symbol: "♥" },
  { className: "heart heart-four", symbol: "♥" },
  { className: "sparkle sparkle-one", symbol: "✦" },
  { className: "sparkle sparkle-two", symbol: "✦" },
  { className: "sparkle sparkle-three", symbol: "✦" },
];

const noReplies = [
  "No",
  "Lol, nice try 😏",
  "Aww, you’re funny 😂",
  "Still trying? 👀",
  "Nope — catch me! 💨",
];

export default function Home() {
  const cardRef = useRef<HTMLElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const [replyIndex, setReplyIndex] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const isEvasive = replyIndex === noReplies.length - 1;

  const moveNoButton = useCallback(() => {
    const card = cardRef.current;
    const yesButton = yesButtonRef.current;
    const noButton = noButtonRef.current;

    if (!card || !yesButton || !noButton) {
      return;
    }

    const cardRect = card.getBoundingClientRect();
    const yesRect = yesButton.getBoundingClientRect();
    const noRect = noButton.getBoundingClientRect();
    const safeGap = 16;
    const maxX = Math.max(safeGap, cardRect.width - noRect.width - safeGap);
    const maxY = Math.max(safeGap, cardRect.height - noRect.height - safeGap);
    const yesZone = {
      left: yesRect.left - cardRect.left - 14,
      right: yesRect.right - cardRect.left + 14,
      top: yesRect.top - cardRect.top - 14,
      bottom: yesRect.bottom - cardRect.top + 14,
    };

    let nextPosition = { x: safeGap, y: safeGap };

    for (let attempt = 0; attempt < 16; attempt += 1) {
      const candidate = {
        x: safeGap + Math.random() * Math.max(0, maxX - safeGap),
        y: safeGap + Math.random() * Math.max(0, maxY - safeGap),
      };
      const overlapsYes =
        candidate.x < yesZone.right &&
        candidate.x + noRect.width > yesZone.left &&
        candidate.y < yesZone.bottom &&
        candidate.y + noRect.height > yesZone.top;

      if (!overlapsYes) {
        nextPosition = candidate;
        break;
      }
    }

    setNoPosition(nextPosition);
  }, []);

  useEffect(() => {
    if (!isEvasive) {
      return;
    }

    const keepButtonInCard = () => moveNoButton();
    window.addEventListener("resize", keepButtonInCard);

    return () => window.removeEventListener("resize", keepButtonInCard);
  }, [isEvasive, moveNoButton]);

  const handleNoClick = () => {
    if (isEvasive) {
      moveNoButton();
      return;
    }

    const nextIndex = Math.min(replyIndex + 1, noReplies.length - 1);
    setReplyIndex(nextIndex);

    if (nextIndex === noReplies.length - 1) {
      window.requestAnimationFrame(moveNoButton);
    }
  };

  return (
    <main className="valentine-page">
      <div className="background-glow" aria-hidden="true" />

      <div className="decorations" aria-hidden="true">
        {decorations.map((decoration) => (
          <span className={decoration.className} key={decoration.className}>
            {decoration.symbol}
          </span>
        ))}
      </div>

      <section
        className="proposal-card"
        aria-labelledby="proposal-title"
        ref={cardRef}
      >
        <div className="portrait-shell">
          <Image
            src="/shy-kitten.png"
            alt="A tiny gray kitten raising its paw"
            width={132}
            height={132}
            priority
            className="kitten-portrait"
          />
          <span className="portrait-heart" aria-hidden="true">
            ♥
          </span>
        </div>

        <div className="copy-block">
          <p className="eyebrow">A little question for you</p>
          <h1 id="proposal-title">Will you be my valentine?</h1>
          <p className="supporting-copy">
            this is a yes or yes situation, btw
          </p>
        </div>

        <div
          className={`button-group${isEvasive ? " is-evasive" : ""}`}
          aria-label="Valentine response options"
        >
          <button className="yes-button" type="button" ref={yesButtonRef}>
            <span>Yes!</span>
            <span className="button-sparkles" aria-hidden="true">
              ✨
            </span>
          </button>
          <button
            className={`no-button${isEvasive ? " is-evasive" : ""}`}
            type="button"
            ref={noButtonRef}
            onClick={handleNoClick}
            onFocus={isEvasive ? moveNoButton : undefined}
            onPointerEnter={isEvasive ? moveNoButton : undefined}
            onPointerDown={
              isEvasive
                ? (event) => {
                    event.preventDefault();
                    moveNoButton();
                  }
                : undefined
            }
            style={
              isEvasive
                ? { left: `${noPosition.x}px`, top: `${noPosition.y}px` }
                : undefined
            }
          >
            {noReplies[replyIndex]}
          </button>
        </div>

        <p className="sr-only" aria-live="polite">
          {isEvasive
            ? "The No button is running away. The Yes button is still available."
            : `No button now says: ${noReplies[replyIndex]}`}
        </p>

        <p className="card-note" aria-hidden="true">
          made with a whole lot of love
        </p>
      </section>
    </main>
  );
}
