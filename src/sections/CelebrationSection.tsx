export function CelebrationSection({
  onContinue,
}: {
  onContinue: () => void;
}) {
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
