import { useMemo, useState } from "react";
import type { ScheduleChoice } from "../app/types";

const timeOptions = [
  { time: "5:00 PM", note: "are we eating with the retirees?" },
  { time: "6:00 PM", note: "this is the right answer tbh" },
  { time: "7:00 PM", note: "you’re making me hungry already" },
  { time: "8:00 PM", note: "are we eating dinner or breakfast?" },
  { time: "9:00 PM", note: "late night fun??" },
];

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function ScheduleSection({
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
