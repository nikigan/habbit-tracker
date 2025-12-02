import { useState, useRef, useEffect } from 'react';
import { useHabitStore } from '@/store/habitStore';
import { getDaysRange } from '@/utils/dates';
import type { WeekDay } from '@/utils/dates';
import type { HabitStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { t } from '@/i18n';
import clsx from 'clsx';

export function HabitTable() {
  const { habits, addHabit, deleteHabit, toggleDay } = useHabitStore();
  const [newHabitName, setNewHabitName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const days = getDaysRange(30, 7); // Last 30 days + today + next 7 days
  const [showScrollToToday, setShowScrollToToday] = useState(false);
  const [arrowDirection, setArrowDirection] = useState<'left' | 'right'>('left');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newHabitName.trim();
    if (trimmedName) {
      addHabit(trimmedName);
      setNewHabitName('');
      setIsAdding(false);
    }
  };

  const getStatus = (habitId: string, dateString: string): HabitStatus => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return null;
    if (habit.completedDates.includes(dateString)) return 'done';
    if (habit.skippedDates.includes(dateString)) return 'skip';
    return null;
  };

  const handleDayClick = (habitId: string, dateString: string) => {
    const currentStatus = getStatus(habitId, dateString);
    let newStatus: HabitStatus = null;

    // Cycle: null -> done -> skip -> null
    if (currentStatus === null) {
      newStatus = 'done';
    } else if (currentStatus === 'done') {
      newStatus = 'skip';
    } else {
      newStatus = null;
    }

    toggleDay(habitId, dateString, newStatus);
  };

  const scrollToToday = () => {
    if (!scrollContainerRef.current) return;

    // Find today's index in the daysWithSeparators array
    const todayItemIndex = daysWithSeparators.findIndex(
      item => item.type === 'day' && item.isToday
    );
    if (todayItemIndex === -1) return;

    // Calculate scroll position accounting for separators
    let scrollPosition = 0;
    for (let i = 0; i < todayItemIndex; i++) {
      const item = daysWithSeparators[i];
      if (item.type === 'separator') {
        scrollPosition += window.innerWidth < 768 ? 48 : 56; // w-12 = 48px, md:w-14 = 56px
      } else {
        scrollPosition += window.innerWidth < 768 ? 64 : 80; // w-16 = 64px, md:w-20 = 80px
      }
    }

    scrollContainerRef.current.scrollTo({
      left: Math.max(0, scrollPosition - 100),
      behavior: 'smooth'
    });
  };

  // Check if this is the first day of a month
  const isFirstDayOfMonth = (index: number): boolean => {
    if (index === 0) return true; // Always show for first day
    const currentDay = days[index];
    const previousDay = days[index - 1];
    return currentDay.date.getMonth() !== previousDay.date.getMonth();
  };

  // Get month name
  const getMonthName = (date: Date): string => {
    return date.toLocaleDateString(undefined, { month: 'short' });
  };

  // Create array with month separator cells inserted
  const daysWithSeparators = days.reduce((acc, day, index) => {
    if (isFirstDayOfMonth(index) && index > 0) {
      // Add separator cell before this day
      acc.push({ type: 'separator' as const, month: getMonthName(day.date), date: day.date });
    }
    acc.push({ type: 'day' as const, ...day, originalIndex: index });
    return acc;
  }, [] as Array<{ type: 'separator'; month: string; date: Date } | { type: 'day' } & WeekDay & { originalIndex: number }>);

  // Check scroll position to show/hide "Back to Today" button
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Find today's position accounting for separators
      const todayItemIndex = daysWithSeparators.findIndex(
        item => item.type === 'day' && item.isToday
      );
      if (todayItemIndex === -1) return;

      let todayPosition = 0;
      for (let i = 0; i < todayItemIndex; i++) {
        const item = daysWithSeparators[i];
        if (item.type === 'separator') {
          todayPosition += window.innerWidth < 768 ? 48 : 56;
        } else {
          todayPosition += window.innerWidth < 768 ? 64 : 80;
        }
      }

      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;

      // Show button if today is not in visible area
      const isTodayVisible =
        todayPosition >= scrollLeft &&
        todayPosition <= scrollLeft + containerWidth;

      setShowScrollToToday(!isTodayVisible);

      // Determine arrow direction based on scroll position
      if (todayPosition > scrollLeft + containerWidth) {
        setArrowDirection('right');
      } else if (todayPosition < scrollLeft) {
        setArrowDirection('left');
      }
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => container.removeEventListener('scroll', handleScroll);
  }, [daysWithSeparators]);

  // Scroll to today on mount
  useEffect(() => {
    scrollToToday();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-2 md:p-4 pb-2 md:pb-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          {t('appTitle')}
        </h1>
        <p className="text-gray-600 text-xs md:text-sm">
          {t('appSubtitle')}
        </p>
      </div>

      {/* Table Container - Full height */}
      {habits.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-2 md:p-4">
          <Card className="w-full max-w-md py-12">
            <div className="text-center text-gray-500">
              <p className="text-base mb-1">{t('noHabitsYet')}</p>
              <p className="text-xs mb-4">{t('noHabitsDescription')}</p>
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden px-2 md:px-4">
          <Card className="flex-1 overflow-hidden p-0 relative mb-2">
            <div className="flex h-full">
              {/* Fixed Habits Column */}
              <div className="flex-shrink-0 w-32 md:w-48 border-r border-gray-200 bg-gray-50 flex flex-col">
                {/* Header */}
                <div className="h-12 border-b border-gray-200 flex items-center px-2 md:px-3 font-semibold text-gray-700 text-sm">
                  {t('habits')}
                </div>
                {/* Habit Names */}
                <div className="flex-1 overflow-y-auto">
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      className="h-14 border-b border-gray-200 flex items-center justify-between px-2 md:px-3 hover:bg-gray-100 transition-colors group"
                    >
                      <span className="font-medium text-gray-800 truncate pr-1 text-xs md:text-sm">
                        {habit.name}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(t('deleteConfirm'))) {
                            deleteHabit(habit.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scrollable Days Column with Snap Scroll */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div
                  ref={scrollContainerRef}
                  className="flex-1 overflow-x-auto overflow-y-auto snap-x snap-mandatory"
                  style={{
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  <div className="inline-block min-w-full">
                    {/* Header Row */}
                    <div className="h-12 border-b border-gray-200 flex bg-gray-50 sticky top-0 z-10">
                      {daysWithSeparators.map((item) => {
                        if (item.type === 'separator') {
                          return (
                            <div
                              key={`separator-${item.date.getTime()}`}
                              className="flex-shrink-0 w-12 md:w-14 bg-accent flex items-center justify-center border-l-2 border-r-2 border-accent/70"
                            >
                              <span className="text-accent-foreground text-[10px] md:text-xs font-bold">
                                {item.month}
                              </span>
                            </div>
                          );
                        }
                        const day = item;
                        return (
                          <div
                            key={day.dateString}
                            className={clsx(
                              'flex-shrink-0 w-16 md:w-20 flex flex-col items-center justify-center snap-start',
                              day.isToday && 'bg-blue-100'
                            )}
                          >
                            <span className="text-xs font-medium text-gray-500">
                              {day.dayName}
                            </span>
                            <span className="text-xs md:text-sm font-semibold text-gray-700">
                              {day.date.getDate()}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Days Grid */}
                    {habits.map((habit) => (
                      <div key={habit.id} className="h-14 border-b border-gray-200 flex">
                        {daysWithSeparators.map((item) => {
                          if (item.type === 'separator') {
                            return (
                              <div
                                key={`separator-${item.date.getTime()}`}
                                className="flex-shrink-0 w-12 md:w-14 bg-accent/30 border-l-2 border-r-2 border-accent/70"
                              />
                            );
                          }
                          const day = item;
                          const status = getStatus(habit.id, day.dateString);
                          const isFuture = day.date > new Date();
                          return (
                            <button
                              key={day.dateString}
                              onClick={() => handleDayClick(habit.id, day.dateString)}
                              disabled={isFuture}
                              className={clsx(
                                'flex-shrink-0 w-16 md:w-20 snap-start',
                                'flex items-center justify-center',
                                'transition-all duration-200',
                                'text-xl md:text-2xl font-bold',
                                isFuture && 'bg-gray-50 opacity-40 cursor-not-allowed',
                                !isFuture && 'hover:bg-gray-50',
                                day.isToday && !isFuture && 'bg-blue-50',
                                status === 'done' &&
                                  'bg-green-100 text-green-600 hover:bg-green-200',
                                status === 'skip' &&
                                  'bg-red-100 text-red-600 hover:bg-red-200',
                                status === null && !isFuture && 'text-gray-300 hover:text-gray-400'
                              )}
                              title={`${day.dayName} - ${day.dateString}`}
                            >
                              {status === 'done' ? '✓' : status === 'skip' ? '✕' : '·'}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Habit Section - Fixed at bottom */}
      <div className="flex-shrink-0 p-2 md:p-4 pt-0 md:pt-2">
        {!isAdding ? (
          <Button onClick={() => setIsAdding(true)} className="w-full" size="sm">
            + {t('addHabit')}
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder={t('addHabitPlaceholder')}
              autoFocus
              maxLength={100}
              className="flex-1 h-9"
            />
            <Button type="submit" variant="default" size="sm">
              {t('add')}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewHabitName('');
              }}
              variant="outline"
              size="sm"
            >
              {t('cancel')}
            </Button>
          </form>
        )}
      </div>

      {/* Scroll to Today Button - Fixed at bottom right */}
      {showScrollToToday && habits.length > 0 && (
        <Button
          onClick={scrollToToday}
          className="fixed bottom-20 right-6 z-20 shadow-lg rounded-full h-12 px-4"
          size="sm"
          variant="default"
        >
          {arrowDirection === 'left' ? '←' : '→'} {t('today')}
        </Button>
      )}
    </div>
  );
}
