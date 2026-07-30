export type Screen =
  | "question"
  | "celebration"
  | "schedule"
  | "food"
  | "final";

export type ScheduleChoice = {
  date: Date;
  time: string;
};
