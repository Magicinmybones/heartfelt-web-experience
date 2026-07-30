import type { Transition } from "motion/react";
import type { Screen } from "./types";

type ScreenPresentation = {
  pageClass: string;
  cardClass: string;
  labelledBy: string;
};

export const modalLayoutTransition = {
  type: "tween",
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1],
} satisfies Transition;

export const screenFadeTransition = {
  duration: 0.34,
  ease: [0.22, 1, 0.36, 1],
} satisfies Transition;

export const contentTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
} satisfies Transition;

export const screenPresentation: Record<Screen, ScreenPresentation> = {
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

export const screenSequence: Screen[] = [
  "question",
  "celebration",
  "schedule",
  "food",
  "final",
];

export const screenAssets: Record<Screen, string[]> = {
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
