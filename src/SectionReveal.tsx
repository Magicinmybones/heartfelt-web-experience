import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";

export type RevealSection =
  | "question"
  | "celebration"
  | "schedule"
  | "food"
  | "final";

type RevealMotif = "petal" | "ribbon" | "orbit" | "steam" | "vow" | "spark";

type RevealTheme = {
  seed: number;
  palette: readonly [string, string, string];
  motifs: readonly RevealMotif[];
  particleCount: number;
};

type RevealParticle = {
  id: string;
  motif: RevealMotif;
  color: string;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  size: number;
  rotation: number;
  spin: number;
  delay: number;
  duration: number;
};

type RevealRootStyle = CSSProperties & {
  "--reveal-primary": string;
  "--reveal-secondary": string;
  "--reveal-highlight": string;
};

type RevealParticleStyle = CSSProperties & {
  "--reveal-color": string;
  "--reveal-x": string;
  "--reveal-y": string;
  "--reveal-drift-x": string;
  "--reveal-drift-y": string;
  "--reveal-size": string;
  "--reveal-rotation": string;
  "--reveal-spin": string;
  "--reveal-delay": string;
  "--reveal-duration": string;
};

const revealSequence: RevealSection[] = [
  "question",
  "celebration",
  "schedule",
  "food",
  "final",
];

const revealThemes: Record<RevealSection, RevealTheme> = {
  question: {
    seed: 143,
    palette: ["#ef6f91", "#f6b0aa", "#fff0d1"],
    motifs: ["petal", "ribbon", "spark"],
    particleCount: 11,
  },
  celebration: {
    seed: 277,
    palette: ["#e95379", "#f0a94e", "#f8c5a0"],
    motifs: ["ribbon", "petal", "spark"],
    particleCount: 15,
  },
  schedule: {
    seed: 419,
    palette: ["#de6887", "#9d88b7", "#f2c777"],
    motifs: ["orbit", "ribbon", "spark"],
    particleCount: 12,
  },
  food: {
    seed: 563,
    palette: ["#e46369", "#ef9e53", "#e9c46d"],
    motifs: ["steam", "petal", "spark"],
    particleCount: 13,
  },
  final: {
    seed: 701,
    palette: ["#d93c70", "#f29a87", "#e8b962"],
    motifs: ["vow", "petal", "spark"],
    particleCount: 16,
  },
};

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let result = state;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function createRevealParticles(
  section: RevealSection,
  theme: RevealTheme,
): RevealParticle[] {
  const random = createSeededRandom(theme.seed);

  return Array.from({ length: theme.particleCount }, (_, index) => {
    const motif = theme.motifs[index % theme.motifs.length];
    const sizeMultiplier =
      motif === "orbit" || motif === "vow" ? 1.45 : motif === "spark" ? 0.72 : 1;

    return {
      id: `${section}-${motif}-${index}`,
      motif,
      color: theme.palette[index % theme.palette.length],
      x: 7 + random() * 86,
      y: 10 + random() * 76,
      driftX: (random() - 0.5) * 150,
      driftY: -48 - random() * 108,
      size: (12 + random() * 18) * sizeMultiplier,
      rotation: -48 + random() * 96,
      spin: (random() > 0.5 ? 1 : -1) * (55 + random() * 110),
      delay: random() * 0.24,
      duration: 0.78 + random() * 0.34,
    };
  });
}

const revealParticles = Object.fromEntries(
  revealSequence.map((section) => [
    section,
    createRevealParticles(section, revealThemes[section]),
  ]),
) as Record<RevealSection, RevealParticle[]>;

export function SectionReveal({ screen }: { screen: RevealSection }) {
  const theme = revealThemes[screen];
  const rootStyle: RevealRootStyle = {
    "--reveal-primary": theme.palette[0],
    "--reveal-secondary": theme.palette[1],
    "--reveal-highlight": theme.palette[2],
  };

  return (
    <AnimatePresence mode="sync">
      <motion.div
        className={`section-reveal section-reveal--${screen}`}
        key={screen}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
        style={rootStyle}
      >
        <span className="section-reveal__wash" />
        <span className="section-reveal__sweep" />
        <span className="section-reveal__halo section-reveal__halo--outer" />
        <span className="section-reveal__halo section-reveal__halo--inner" />

        {revealParticles[screen].map((particle) => {
          const particleStyle: RevealParticleStyle = {
            "--reveal-color": particle.color,
            "--reveal-x": `${particle.x}%`,
            "--reveal-y": `${particle.y}%`,
            "--reveal-drift-x": `${particle.driftX}px`,
            "--reveal-drift-y": `${particle.driftY}px`,
            "--reveal-size": `${particle.size}px`,
            "--reveal-rotation": `${particle.rotation}deg`,
            "--reveal-spin": `${particle.spin}deg`,
            "--reveal-delay": `${particle.delay}s`,
            "--reveal-duration": `${particle.duration}s`,
          };

          return (
            <span
              className={`section-reveal__motif section-reveal__motif--${particle.motif}`}
              key={particle.id}
              style={particleStyle}
            />
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
