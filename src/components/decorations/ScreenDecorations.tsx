import type { Screen } from "../../app/types";

const questionDecorations = [
  { className: "heart heart-one", symbol: "♥" },
  { className: "heart heart-two", symbol: "♥" },
  { className: "heart heart-three", symbol: "♥" },
  { className: "heart heart-four", symbol: "♥" },
  { className: "sparkle sparkle-one", symbol: "✦" },
  { className: "sparkle sparkle-two", symbol: "✦" },
  { className: "sparkle sparkle-three", symbol: "✦" },
];

function QuestionDecorations() {
  return (
    <>
      <div className="background-glow" aria-hidden="true" />
      <div className="decorations" aria-hidden="true">
        {questionDecorations.map((decoration) => (
          <span className={decoration.className} key={decoration.className}>
            {decoration.symbol}
          </span>
        ))}
      </div>
    </>
  );
}

export function ScreenDecorations({ screen }: { screen: Screen }) {
  if (screen === "question") {
    return <QuestionDecorations />;
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
