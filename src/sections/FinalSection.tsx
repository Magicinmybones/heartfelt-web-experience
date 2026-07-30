import type { ScheduleChoice } from "../app/types";
import { foodOptions } from "../data/food-options";

type FinalSectionProps = {
  schedule: ScheduleChoice;
  foods: string[];
};

export function FinalSection({ schedule, foods }: FinalSectionProps) {
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
