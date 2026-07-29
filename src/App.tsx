import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

const timeOptions = [
  { time: "5:00 PM", note: "are we eating with the retirees?" },
  { time: "6:00 PM", note: "this is the right answer tbh" },
  { time: "7:00 PM", note: "you’re making me hungry already" },
  { time: "8:00 PM", note: "are we eating dinner or breakfast?" },
  { time: "9:00 PM", note: "late night fun??" },
];

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const foodOptions = [
  { name: "Pizza", emoji: "🍕", note: "cheesy & classic" },
  { name: "Sushi", emoji: "🍣", note: "tiny fancy bites" },
  { name: "Pasta", emoji: "🍝", note: "main character energy" },
  { name: "Burger", emoji: "🍔", note: "messy but worth it" },
  { name: "Tacos", emoji: "🌮", note: "always a good idea" },
  { name: "Ramen", emoji: "🍜", note: "cozy bowl moment" },
];

type Screen = "question" | "celebration" | "schedule" | "food";

function QuestionScreen({ onYes }: { onYes: () => void }) {
  const cardRef = useRef<HTMLElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
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
  }, []);

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

  return (
    <main className="valentine-page question-page">
      <BackgroundDecorations />

      <section
        className="proposal-card"
        aria-labelledby="proposal-title"
        ref={cardRef}
      >
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
          <p className="supporting-copy">
            this is a yes or yes situation, btw
          </p>
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
              if (isEvasive || !hasDodged) {
                event.preventDefault();
                handleNoApproach();
              }
            }}
            style={
              isFloating
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
            : `${noReplies[replyIndex]}. This button dodges once, then becomes clickable.`}
        </p>

        <p className="card-note" aria-hidden="true">
          made with a whole lot of love
        </p>
      </section>
    </main>
  );
}

function CelebrationScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <main className="valentine-page celebration-page">
      <div className="celebration-glow" aria-hidden="true" />
      <div className="confetti-layer" aria-hidden="true">
        <span className="confetti confetti-one">◆</span>
        <span className="confetti confetti-two">●</span>
        <span className="confetti confetti-three">★</span>
        <span className="confetti confetti-four">◆</span>
        <span className="confetti confetti-five">●</span>
        <span className="confetti confetti-six">★</span>
      </div>

      <section
        className="proposal-card celebration-card"
        aria-labelledby="celebration-title"
      >
        <div className="portrait-shell celebration-portrait-shell">
          <img
            src="/celebration-cat.png"
            alt="A delighted orange cat standing with both paws raised"
            width="132"
            height="132"
            className="kitten-portrait"
          />
          <span className="portrait-heart celebration-badge" aria-hidden="true">
            ✦
          </span>
        </div>

        <div className="copy-block">
          <p className="eyebrow">Plot twist!</p>
          <h1 id="celebration-title">Wait… you actually said yes??</h1>
          <p className="supporting-copy">
            I was so ready for you to say no
          </p>
        </div>

        <div className="celebration-emojis" aria-label="Celebration">
          <span>🎉</span>
          <span>💃</span>
          <span>🥹</span>
          <span>💖</span>
        </div>

        <button
          className="yes-button celebration-button"
          type="button"
          onClick={onContinue}
        >
          Okay okay! <span aria-hidden="true">😊</span>
        </button>

        <p className="card-note" aria-hidden="true">
          best answer ever
        </p>
      </section>
    </main>
  );
}

function ScheduleScreen({ onContinue }: { onContinue: () => void }) {
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();

    return Array.from({ length: 42 }, (_, index) => {
      return new Date(year, month, index - firstWeekday + 1);
    });
  }, [visibleMonth]);

  const isCurrentMonth =
    visibleMonth.getFullYear() === today.getFullYear() &&
    visibleMonth.getMonth() === today.getMonth();
  const selectionComplete = Boolean(selectedDate && selectedTime);

  const moveMonth = (offset: number) => {
    setVisibleMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + offset, 1),
    );
  };

  const formatDateLabel = (date: Date) =>
    new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(date);

  return (
    <main className="valentine-page schedule-page">
      <div className="schedule-glow" aria-hidden="true" />

      <section className="schedule-card" aria-labelledby="schedule-title">
        <header className="schedule-header">
          <p className="eyebrow">One tiny detail</p>
          <h1 id="schedule-title">So… when are you free?</h1>
          <p>Pick a day, any day — I cleared my schedule.</p>
        </header>

        <div className="calendar" aria-label="Choose a date">
          <div className="calendar-toolbar">
            <button
              type="button"
              className="month-arrow"
              aria-label="Previous month"
              disabled={isCurrentMonth}
              onClick={() => moveMonth(-1)}
            >
              ‹
            </button>
            <p aria-live="polite">
              {visibleMonth.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </p>
            <button
              type="button"
              className="month-arrow"
              aria-label="Next month"
              onClick={() => moveMonth(1)}
            >
              ›
            </button>
          </div>

          <div className="calendar-grid calendar-weekdays" aria-hidden="true">
            {weekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="calendar-grid calendar-dates">
            {calendarDays.map((date) => {
              const isOutside =
                date.getMonth() !== visibleMonth.getMonth();
              const isPast = date < today;
              const isSelected =
                selectedDate?.getTime() === date.getTime();
              const isToday = date.getTime() === today.getTime();
              const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

              return (
                <button
                  type="button"
                  key={dateKey}
                  className={[
                    "date-button",
                    isOutside ? "is-outside" : "",
                    isSelected ? "is-selected" : "",
                    isToday ? "is-today" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  disabled={isOutside || isPast}
                  aria-label={formatDateLabel(date)}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedDate(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <fieldset className="time-picker">
          <legend>What time?</legend>
          <div className="time-options">
            {timeOptions.map(({ time, note }) => (
              <label
                className={`time-option${
                  selectedTime === time ? " is-selected" : ""
                }`}
                key={time}
              >
                <input
                  type="radio"
                  name="date-time"
                  value={time}
                  checked={selectedTime === time}
                  onChange={() => setSelectedTime(time)}
                />
                <span className="time-label">{time}</span>
                <span className="time-note">— {note}</span>
                <span className="time-check" aria-hidden="true">
                  ♥
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          className="yes-button schedule-button"
          type="button"
          disabled={!selectionComplete}
          onClick={onContinue}
        >
          Okay, next →
        </button>

        <p className="schedule-status">
          {selectedDate && selectedTime
            ? `${formatDateLabel(selectedDate)} at ${selectedTime}`
            : "\u00A0"}
        </p>
      </section>
    </main>
  );
}

function FoodScreen() {
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleFood = (food: string) => {
    setSelectedFoods((current) =>
      current.includes(food)
        ? current.filter((item) => item !== food)
        : [...current, food],
    );
    setSubmitted(false);
  };

  return (
    <main className="valentine-page food-page">
      <div className="food-glow" aria-hidden="true" />

      <section className="food-card" aria-labelledby="food-title">
        <div className="portrait-shell food-portrait-shell">
          <img
            src="/food-picker-cat.png"
            alt="A hungry tabby cat waiting eagerly behind an empty plate"
            width="132"
            height="132"
            className="kitten-portrait"
          />
          <span className="portrait-heart food-badge" aria-hidden="true">
            🍴
          </span>
        </div>

        <header className="food-header">
          <p className="eyebrow">The delicious part</p>
          <h1 id="food-title">What are we feeling?</h1>
          <p>You can pick more than one, btw.</p>
        </header>

        <div className="food-grid" aria-label="Choose one or more foods">
          {foodOptions.map(({ name, emoji, note }) => {
            const isSelected = selectedFoods.includes(name);

            return (
              <button
                type="button"
                className={`food-option${isSelected ? " is-selected" : ""}`}
                key={name}
                aria-pressed={isSelected}
                onClick={() => toggleFood(name)}
              >
                <span className="food-emoji" aria-hidden="true">
                  {emoji}
                </span>
                <span className="food-name">{name}</span>
                <span className="food-note">{note}</span>
                <span className="food-selected-mark" aria-hidden="true">
                  ✓
                </span>
              </button>
            );
          })}
        </div>

        <button
          className={`yes-button food-submit${submitted ? " is-confirmed" : ""}`}
          type="button"
          disabled={selectedFoods.length === 0}
          onClick={() => setSubmitted(true)}
        >
          {submitted ? "Excellent choices! 💖" : "This one!! 🎉"}
        </button>

        <p className="food-status" aria-live="polite">
          {submitted
            ? `Perfect — ${selectedFoods.join(", ")} it is!`
            : selectedFoods.length > 0
              ? `${selectedFoods.length} selected`
              : "\u00A0"}
        </p>
      </section>
    </main>
  );
}

function BackgroundDecorations() {
  return (
    <>
      <div className="background-glow" aria-hidden="true" />
      <div className="decorations" aria-hidden="true">
        {decorations.map((decoration) => (
          <span className={decoration.className} key={decoration.className}>
            {decoration.symbol}
          </span>
        ))}
      </div>
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("question");

  return (
    <div className="app-shell" key={screen}>
      {screen === "question" && (
        <QuestionScreen onYes={() => setScreen("celebration")} />
      )}
      {screen === "celebration" && (
        <CelebrationScreen onContinue={() => setScreen("schedule")} />
      )}
      {screen === "schedule" && (
        <ScheduleScreen onContinue={() => setScreen("food")} />
      )}
      {screen === "food" && <FoodScreen />}
    </div>
  );
}
