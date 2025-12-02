import { useHabitStore } from '../store/habitStore';
import { getCurrentWeek } from '../utils/dates';
import type { Habit, HabitStatus } from '../types';
import clsx from 'clsx';

interface HabitWeekViewProps {
  habit: Habit;
}

export function HabitWeekView({ habit }: HabitWeekViewProps) {
  const toggleDay = useHabitStore((state) => state.toggleDay);
  const week = getCurrentWeek();

  const getStatus = (dateString: string): HabitStatus => {
    if (habit.completedDates.includes(dateString)) return 'done';
    if (habit.skippedDates.includes(dateString)) return 'skip';
    return null;
  };

  const handleDayClick = (dateString: string) => {
    const currentStatus = getStatus(dateString);
    let newStatus: HabitStatus = null;

    // Cycle: null -> done -> skip -> null
    if (currentStatus === null) {
      newStatus = 'done';
    } else if (currentStatus === 'done') {
      newStatus = 'skip';
    } else {
      newStatus = null;
    }

    toggleDay(habit.id, dateString, newStatus);
  };

  return (
    <div className="flex gap-2 md:gap-3">
      {week.map((day) => {
        const status = getStatus(day.dateString);
        return (
          <button
            key={day.dateString}
            onClick={() => handleDayClick(day.dateString)}
            className={clsx(
              'flex flex-col items-center justify-center',
              'w-10 h-10 md:w-12 md:h-12',
              'rounded-lg transition-all duration-200',
              'border-2',
              day.isToday && 'ring-2 ring-blue-400 ring-offset-2',
              status === 'done' &&
                'bg-green-500 border-green-600 text-white hover:bg-green-600',
              status === 'skip' &&
                'bg-red-500 border-red-600 text-white hover:bg-red-600',
              status === null &&
                'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
            )}
            title={`${day.dayName} - ${day.dateString}`}
          >
            <span className="text-xs font-medium">{day.dayName}</span>
            <span className="text-lg font-bold leading-none">
              {status === 'done' ? '✓' : status === 'skip' ? '✕' : ''}
            </span>
          </button>
        );
      })}
    </div>
  );
}
