import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HabitStore, HabitStatus } from '../types';

export const useHabitStore = create<HabitStore>()(
  persist(
    (set) => ({
      habits: [],

      addHabit: (name: string) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id: crypto.randomUUID(),
              name,
              createdAt: Date.now(),
              completedDates: [],
              skippedDates: [],
            },
          ],
        })),

      deleteHabit: (id: string) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        })),

      toggleDay: (habitId: string, date: string, status: HabitStatus) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== habitId) return habit;

            // Remove date from both arrays first
            const newCompletedDates = habit.completedDates.filter((d) => d !== date);
            const newSkippedDates = habit.skippedDates.filter((d) => d !== date);

            // Add to appropriate array based on new status
            if (status === 'done') {
              newCompletedDates.push(date);
            } else if (status === 'skip') {
              newSkippedDates.push(date);
            }
            // If status is null, date remains removed from both arrays

            return {
              ...habit,
              completedDates: newCompletedDates,
              skippedDates: newSkippedDates,
            };
          }),
        })),
    }),
    {
      name: 'habit-tracker-storage',
      version: 1,
    }
  )
);
