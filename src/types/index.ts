import { z } from 'zod';

// Zod schemas for validation
export const HabitSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  createdAt: z.number(),
  completedDates: z.array(z.string()),
  skippedDates: z.array(z.string()),
});

export const HabitStoreSchema = z.object({
  habits: z.array(HabitSchema),
});

// TypeScript types inferred from schemas
export type Habit = z.infer<typeof HabitSchema>;

export type HabitStatus = 'done' | 'skip' | null;

export interface HabitStore {
  habits: Habit[];
  addHabit: (name: string) => void;
  deleteHabit: (id: string) => void;
  toggleDay: (habitId: string, date: string, status: HabitStatus) => void;
}
