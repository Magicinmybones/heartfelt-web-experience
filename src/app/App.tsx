import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ScreenDecorations } from "../components/decorations/ScreenDecorations";
import { SectionReveal } from "../components/transitions/SectionReveal";
import { CelebrationSection } from "../sections/CelebrationSection";
import { FinalSection } from "../sections/FinalSection";
import { FoodSection } from "../sections/FoodSection";
import { QuestionSection } from "../sections/QuestionSection";
import { ScheduleSection } from "../sections/ScheduleSection";
import {
  contentTransition,
  modalLayoutTransition,
  screenAssets,
  screenFadeTransition,
  screenPresentation,
  screenSequence,
} from "./config";
import type { ScheduleChoice, Screen } from "./types";

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

  let currentSection: ReactNode;

  switch (screen) {
    case "question":
      currentSection = (
        <QuestionSection
          cardRef={modalRef}
          onYes={() => navigate("celebration")}
        />
      );
      break;
    case "celebration":
      currentSection = (
        <CelebrationSection onContinue={() => navigate("schedule")} />
      );
      break;
    case "schedule":
      currentSection = (
        <ScheduleSection
          onContinue={(choice) => {
            navigate("food", () => setScheduleChoice(choice));
          }}
        />
      );
      break;
    case "food":
      currentSection = (
        <FoodSection
          onContinue={(foods) => {
            navigate("final", () => setFoodChoices(foods));
          }}
        />
      );
      break;
    case "final":
      currentSection = scheduleChoice ? (
        <FinalSection schedule={scheduleChoice} foods={foodChoices} />
      ) : null;
      break;
  }

  const currentPresentation = screenPresentation[screen];

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

        <SectionReveal screen={screen} />

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
                  {currentSection}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.section>
        </main>
      </MotionConfig>
    </div>
  );
}
