import Image from "next/image";

const decorations = [
  { className: "heart heart-one", symbol: "♥" },
  { className: "heart heart-two", symbol: "♥" },
  { className: "heart heart-three", symbol: "♥" },
  { className: "heart heart-four", symbol: "♥" },
  { className: "sparkle sparkle-one", symbol: "✦" },
  { className: "sparkle sparkle-two", symbol: "✦" },
  { className: "sparkle sparkle-three", symbol: "✦" },
];

export default function Home() {
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

      <section className="proposal-card" aria-labelledby="proposal-title">
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

        <div className="button-group" aria-label="Valentine response options">
          <button className="yes-button" type="button">
            <span>Yes!</span>
            <span className="button-sparkles" aria-hidden="true">
              ✨
            </span>
          </button>
          <button className="no-button" type="button">
            No
          </button>
        </div>

        <p className="card-note" aria-hidden="true">
          made with a whole lot of love
        </p>
      </section>
    </main>
  );
}
