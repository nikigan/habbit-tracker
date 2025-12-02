// Auto-detect user's locale
const userLocale = navigator.language || 'en-US';

// Translations
const translations: Record<string, Record<string, string>> = {
  'en-US': {
    appTitle: 'Habit Tracker',
    appSubtitle: 'Track your daily habits',
    addHabit: 'Add Habit',
    addHabitPlaceholder: 'Habit name...',
    add: 'Add',
    cancel: 'Cancel',
    habits: 'Habits',
    noHabitsYet: 'No habits yet',
    noHabitsDescription: 'Click "Add Habit" to start',
    deleteConfirm: 'Delete this habit?',
    today: 'Today',
  },
  'ru-RU': {
    appTitle: 'Трекер привычек',
    appSubtitle: 'Отслеживайте свои привычки',
    addHabit: 'Добавить',
    addHabitPlaceholder: 'Название привычки...',
    add: 'Добавить',
    cancel: 'Отмена',
    habits: 'Привычки',
    noHabitsYet: 'Пока нет привычек',
    noHabitsDescription: 'Нажмите "Добавить" чтобы начать',
    deleteConfirm: 'Удалить эту привычку?',
    today: 'Сегодня',
  },
  'ru': {
    appTitle: 'Трекер привычек',
    appSubtitle: 'Отслеживайте свои привычки',
    addHabit: 'Добавить',
    addHabitPlaceholder: 'Название привычки...',
    add: 'Добавить',
    cancel: 'Отмена',
    habits: 'Привычки',
    noHabitsYet: 'Пока нет привычек',
    noHabitsDescription: 'Нажмите "Добавить" чтобы начать',
    deleteConfirm: 'Удалить эту привычку?',
    today: 'Сегодня',
  },
};

// Get translation with fallback to English
export function t(key: string): string {
  // Try exact locale match
  if (translations[userLocale]?.[key]) {
    return translations[userLocale][key];
  }

  // Try language code only (e.g., 'ru' from 'ru-RU')
  const languageCode = userLocale.split('-')[0];
  if (translations[languageCode]?.[key]) {
    return translations[languageCode][key];
  }

  // Fallback to English
  return translations['en-US'][key] || key;
}

export { userLocale };
