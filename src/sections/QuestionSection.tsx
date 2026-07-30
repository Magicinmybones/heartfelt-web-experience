import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";

const noReplies = [
  "No",
  "Lol, nice try 😏",
  "Aww, you’re funny 😂",
  "Still trying? 👀",
  "Nope, catch me! 💨",
];

type QuestionSectionProps = {
  onYes: () => void;
  cardRef: RefObject<HTMLElement | null>;
};

export function QuestionSection({ onYes, cardRef }: QuestionSectionProps) {
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const ignoreNextNoClickRef = useRef(false);
  const [replyIndex, setReplyIndex] = useState(0);
  const [hasDodged, setHasDodged] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const isEvasive = replyIndex === noReplies.length - 1;
  const isFloating = hasDodged || isEvasive;

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
  }, [cardRef]);

  useEffect(() => {
    if (!isFloating) {
      return;
    }

    const keepButtonInCard = () => moveNoButton();
    window.addEventListener("resize", keepButtonInCard);
    return () => window.removeEventListener("resize", keepButtonInCard);
  }, [isFloating, moveNoButton]);

  const handleNoApproach = () => {
    if (isEvasive) {
      moveNoButton();
      return;
    }

    if (!hasDodged) {
      setHasDodged(true);
      moveNoButton();
    }
  };

  const handleNoClick = () => {
    if (ignoreNextNoClickRef.current) {
      return;
    }

    if (isEvasive) {
      moveNoButton();
      return;
    }

    const nextIndex = Math.min(replyIndex + 1, noReplies.length - 1);
    setReplyIndex(nextIndex);
    setHasDodged(nextIndex === noReplies.length - 1);

    if (nextIndex === noReplies.length - 1) {
      window.requestAnimationFrame(moveNoButton);
    }
  };

  const finishNoPointerGesture = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    window.requestAnimationFrame(() => {
      ignoreNextNoClickRef.current = false;
    });
  };

  return (
    <>
      <div className="portrait-shell">
        <img
          src="/shy-kitten.png"
          alt="A tiny gray kitten raising its paw"
          width="132"
          height="132"
          className="kitten-portrait"
        />
        <span className="portrait-heart" aria-hidden="true">
          ♥
        </span>
      </div>

      <div className="copy-block">
        <p className="eyebrow">A little question for you</p>
        <h1 id="proposal-title">Will you be my valentine?</h1>
        <p className="supporting-copy">this is a yes or yes situation, btw</p>
      </div>

      <div
        className={`button-group${isFloating ? " is-floating" : ""}`}
        aria-label="Valentine response options"
      >
        <button
          className="yes-button"
          type="button"
          ref={yesButtonRef}
          onClick={onYes}
        >
          <span>Yes!</span>
          <span className="button-sparkles" aria-hidden="true">
            ✨
          </span>
        </button>
        <span className="no-button-slot">
          <span className="no-button no-button-placeholder" aria-hidden="true">
            {noReplies[replyIndex]}
          </span>
          <button
            className={`no-button${isFloating ? " is-floating" : ""}${
              isEvasive ? " is-evasive" : ""
            }`}
            type="button"
            ref={noButtonRef}
            onClick={handleNoClick}
            onFocus={handleNoApproach}
            onPointerEnter={handleNoApproach}
            onPointerDown={(event) => {
              const shouldDodge = isEvasive || !hasDodged;

              if (!shouldDodge) {
                return;
              }

              ignoreNextNoClickRef.current = true;
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              handleNoApproach();
            }}
            onPointerUp={finishNoPointerGesture}
            onPointerCancel={finishNoPointerGesture}
            style={
              isFloating
                ? { left: `${noPosition.x}px`, top: `${noPosition.y}px` }
                : undefined
            }
          >
            {noReplies[replyIndex]}
          </button>
        </span>
      </div>

      <p className="sr-only" aria-live="polite">
        {isEvasive
          ? "The No button is running away. The Yes button is still available."
          : `${noReplies[replyIndex]}. This button dodges once, then becomes clickable.`}
      </p>

      <p className="card-note" aria-hidden="true">
        made with a whole lot of love
      </p>
    </>
  );
}
