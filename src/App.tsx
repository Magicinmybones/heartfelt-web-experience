import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
} from "motion/react";

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
  "Nope, catch me! 💨",
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

type Screen = "question" | "celebration" | "schedule" | "food" | "final";

type ScheduleChoice = {
  date: Date;
  time: string;
};

const modalLayoutTransition = {
  type: "tween",
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1],
} satisfies Transition;

const screenFadeTransition = {
  duration: 0.34,
  ease: [0.22, 1, 0.36, 1],
} satisfies Transition;

const contentTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
} satisfies Transition;

const screenPresentation: Record<
  Screen,
  { pageClass: string; cardClass: string; labelledBy: string }
> = {
  question: {
    pageClass: "question-page",
    cardClass: "proposal-card",
    labelledBy: "proposal-title",
  },
  celebration: {
    pageClass: "celebration-page",
    cardClass: "proposal-card celebration-card",
    labelledBy: "celebration-title",
  },
  schedule: {
    pageClass: "schedule-page",
    cardClass: "schedule-card",
    labelledBy: "schedule-title",
  },
  food: {
    pageClass: "food-page",
    cardClass: "food-card",
    labelledBy: "food-title",
  },
  final: {
    pageClass: "final-page",
    cardClass: "final-card",
    labelledBy: "final-title",
  },
};

const screenSequence: Screen[] = [
  "question",
  "celebration",
  "schedule",
  "food",
  "final",
];

const screenAssets: Record<Screen, string[]> = {
  question: ["/valentine-watercolor-bg.webp", "/shy-kitten.png"],
  celebration: ["/celebration-watercolor-bg.webp", "/celebration-cat.png"],
  schedule: ["/schedule-watercolor-bg.webp"],
  food: ["/food-watercolor-bg.webp", "/food-picker-cat.png"],
  final: [
    "/celebration-watercolor-bg.webp",
    "/final-cuddle-cats.png",
    "/final-approval-cat.png",
  ],
};

function QuestionContent({
  onYes,
  cardRef,
}: {
  onYes: () => void;
  cardRef: RefObject<HTMLElement | null>;
}) {
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

  const finishNoPointerGesture = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
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

function CelebrationContent({ onContinue }: { onContinue: () => void }) {
  return (
    <>
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
        <p className="supporting-copy">I was so ready for you to say no</p>
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
    </>
  );
}

function ScheduleContent({
  onContinue,
}: {
  onContinue: (choice: ScheduleChoice) => void;
}) {
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
    <>
      <header className="schedule-header">
        <p className="eyebrow">One tiny detail</p>
        <h1 id="schedule-title">So… when are you free?</h1>
        <p>Pick a day, any day. I cleared my schedule.</p>
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
            const isOutside = date.getMonth() !== visibleMonth.getMonth();
            const isPast = date < today;
            const isSelected = selectedDate?.getTime() === date.getTime();
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
              <span className="time-note">· {note}</span>
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
        onClick={() => {
          if (selectedDate) {
            onContinue({ date: selectedDate, time: selectedTime });
          }
        }}
      >
        Okay, next →
      </button>

      <p className="schedule-status">
        {selectedDate && selectedTime
          ? `${formatDateLabel(selectedDate)} at ${selectedTime}`
          : "\u00A0"}
      </p>
    </>
  );
}

function FoodContent({
  onContinue,
}: {
  onContinue: (foods: string[]) => void;
}) {
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);

  const toggleFood = (food: string) => {
    setSelectedFoods((current) =>
      current.includes(food)
        ? current.filter((item) => item !== food)
        : [...current, food],
    );
  };

  return (
    <>
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
        className="yes-button food-submit"
        type="button"
        disabled={selectedFoods.length === 0}
        onClick={() => onContinue(selectedFoods)}
      >
        This one!! 🎉
      </button>

      <p className="food-status">
        {selectedFoods.length > 0
          ? `${selectedFoods.length} selected`
          : "\u00A0"}
      </p>
    </>
  );
}

function FinalContent({
  schedule,
  foods,
}: {
  schedule: ScheduleChoice;
  foods: string[];
}) {
  const dayName = schedule.date.toLocaleDateString(undefined, {
    weekday: "long",
  });
  const fullDate = schedule.date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <div className="final-hero">
        <img
          src="/final-cuddle-cats.png"
          alt="Two cats cuddling with their tails forming a heart"
          width="150"
          height="150"
        />
        <span aria-hidden="true">💞</span>
      </div>

      <header className="final-header">
        <p className="eyebrow">Officially official</p>
        <h1 id="final-title">It’s a date.</h1>
        <p className="final-compliment">
          I’ll be the happiest person you’ve ever seen <span>✨</span>
        </p>
        <p className="final-subtitle">
          You can’t cancel btw. The cats have already been informed.
        </p>
      </header>

      <div className="date-receipt" aria-label="Your date plan">
        <div className="receipt-section">
          <p className="receipt-label">
            <span aria-hidden="true">//</span> Date
          </p>
          <p className="receipt-value">{dayName}</p>
          <p className="receipt-detail">{fullDate}</p>
          <p className="receipt-detail">at {schedule.time}</p>
        </div>

        <div className="receipt-divider" aria-hidden="true" />

        <div className="receipt-section">
          <p className="receipt-label">
            <span aria-hidden="true">//</span> Food
          </p>
          <div className="receipt-foods">
            {foods.map((food) => {
              const foodOption = foodOptions.find(
                (option) => option.name === food,
              );

              return (
                <span className="receipt-food" key={food}>
                  <span aria-hidden="true">{foodOption?.emoji ?? "🍽️"}</span>
                  {food}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="approval-cat-shell">
        <img
          src="/final-approval-cat.png"
          alt="An orange tabby giving an enthusiastic thumbs-up"
          width="92"
          height="92"
        />
      </div>

      <p className="final-note">
        p.s. this is officially production-ready, so there’s no taking it back{" "}
        <span aria-hidden="true">💌</span>
      </p>
      <p className="final-signoff">
        made with <span aria-hidden="true">♥</span> and excellent taste
      </p>
    </>
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

function ScreenDecorations({ screen }: { screen: Screen }) {
  if (screen === "question") {
    return <BackgroundDecorations />;
  }

  if (screen === "celebration") {
    return (
      <>
        <div className="celebration-glow" aria-hidden="true" />
        <div className="confetti-layer" aria-hidden="true">
          <span className="confetti confetti-one">◆</span>
          <span className="confetti confetti-two">●</span>
          <span className="confetti confetti-three">★</span>
          <span className="confetti confetti-four">◆</span>
          <span className="confetti confetti-five">●</span>
          <span className="confetti confetti-six">★</span>
        </div>
      </>
    );
  }

  if (screen === "schedule") {
    return <div className="schedule-glow" aria-hidden="true" />;
  }

  if (screen === "food") {
    return <div className="food-glow" aria-hidden="true" />;
  }

  return (
    <>
      <div className="final-glow" aria-hidden="true" />
      <div className="final-confetti" aria-hidden="true">
        <span>✦</span>
        <span>♥</span>
        <span>✧</span>
        <span>♥</span>
      </div>
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("question");
  const [scheduleChoice, setScheduleChoice] = useState<ScheduleChoice | null>(
    null,
  );
  const [foodChoices, setFoodChoices] = useState<string[]>([]);
  const modalRef = useRef<HTMLElement>(null);
  const scrollRegionRef = useRef<HTMLDivElement>(null);
  const activeTransitionRef = useRef(false);

  useLayoutEffect(() => {
    scrollRegionRef.current?.scrollTo({ top: 0, left: 0 });
  }, [screen]);

  useEffect(() => {
    const nextScreen = screenSequence[screenSequence.indexOf(screen) + 1];

    if (!nextScreen) {
      return;
    }

    const preloaders = screenAssets[nextScreen].map((source) => {
      const image = new Image();
      image.decoding = "async";
      image.src = source;
      return image;
    });

    return () => {
      preloaders.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [screen]);

  const navigate = useCallback(
    (nextScreen: Screen, updateBeforeNavigation?: () => void) => {
      if (activeTransitionRef.current) {
        return;
      }

      activeTransitionRef.current = true;
      updateBeforeNavigation?.();
      setScreen(nextScreen);
    },
    [],
  );

  const currentPresentation = screenPresentation[screen];

  const currentContent =
    screen === "question" ? (
      <QuestionContent
        cardRef={modalRef}
        onYes={() => navigate("celebration")}
      />
    ) : screen === "celebration" ? (
      <CelebrationContent onContinue={() => navigate("schedule")} />
    ) : screen === "schedule" ? (
      <ScheduleContent
        onContinue={(choice) => {
          navigate("food", () => setScheduleChoice(choice));
        }}
      />
    ) : screen === "food" ? (
      <FoodContent
        onContinue={(foods) => {
          navigate("final", () => setFoodChoices(foods));
        }}
      />
    ) : scheduleChoice ? (
      <FinalContent schedule={scheduleChoice} foods={foodChoices} />
    ) : null;

  return (
    <div className="app-shell">
      <MotionConfig reducedMotion="user">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            className={`screen-stage valentine-page ${currentPresentation.pageClass}`}
            key={screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={screenFadeTransition}
          >
            <ScreenDecorations screen={screen} />
          </motion.div>
        </AnimatePresence>

        <main className="modal-viewport" data-screen={screen}>
          <motion.section
            ref={modalRef}
            layout
            className={`persistent-modal ${currentPresentation.cardClass}`}
            aria-labelledby={currentPresentation.labelledBy}
            initial={false}
            transition={{ layout: modalLayoutTransition }}
          >
            <div className="card-scroll-region" ref={scrollRegionRef}>
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  layout="position"
                  key={screen}
                  className="modal-content-stage"
                  data-screen={screen}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={contentTransition}
                  onAnimationComplete={() => {
                    activeTransitionRef.current = false;
                  }}
                >
                  {currentContent}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.section>
        </main>
      </MotionConfig>
    </div>
  );
}
