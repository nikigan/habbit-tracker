import { useState } from 'react';
import { useHabitStore } from '../store/habitStore';
import { HabitWeekView } from './HabitWeekView';

export function HabitList() {
  const { habits, addHabit, deleteHabit } = useHabitStore();
  const [newHabitName, setNewHabitName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newHabitName.trim();
    if (trimmedName) {
      addHabit(trimmedName);
      setNewHabitName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Habit Tracker
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Track your daily habits with a simple click
        </p>
      </div>

      {/* Add Habit Section */}
      <div className="mb-6">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            + Add New Habit
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Enter habit name..."
              autoFocus
              maxLength={100}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewHabitName('');
              }}
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No habits yet</p>
          <p className="text-sm">Click "Add New Habit" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-white rounded-lg shadow-md p-4 md:p-5 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                  {habit.name}
                </h3>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this habit?')) {
                      deleteHabit(habit.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
              <HabitWeekView habit={habit} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
