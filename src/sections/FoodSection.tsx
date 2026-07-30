import { useState } from "react";
import { foodOptions } from "../data/food-options";

export function FoodSection({
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
