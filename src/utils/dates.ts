import { startOfWeek, addDays, subDays, format, isToday, isSameDay } from 'date-fns';

export interface WeekDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayName: string; // Mon, Tue, etc
  isToday: boolean;
}

export function getCurrentWeek(): WeekDay[] {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday

  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      dateString: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'EEE'),
      isToday: isToday(date),
    };
  });
}

export function getDaysRange(daysBack: number = 30, daysForward: number = 7): WeekDay[] {
  const today = new Date();
  const startDate = subDays(today, daysBack);
  const totalDays = daysBack + daysForward + 1; // +1 for today

  return Array.from({ length: totalDays }, (_, i) => {
    const date = addDays(startDate, i);
    return {
      date,
      dateString: format(date, 'yyyy-MM-dd'),
      dayName: date.toLocaleDateString(undefined, { weekday: 'short' }),
      isToday: isToday(date),
    };
  });
}

export function isCurrentWeek(visibleDates: WeekDay[]): boolean {
  const today = new Date();
  return visibleDates.some(day => isSameDay(day.date, today));
}

export function formatDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
