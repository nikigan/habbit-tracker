# Habit Tracker

Minimalist daily habit tracker with a clean table interface. Track your habits throughout the week with simple clicks.

## Features

- 📊 **Table Layout** - Fixed habit names with horizontally scrollable weekdays
- ✓ **Quick Tracking** - Click to toggle: empty → done (✓) → skip (✕) → empty
- 💾 **Offline First** - All data stored locally, works without internet
- 📱 **Responsive** - Works on desktop and mobile devices
- 🎨 **Clean UI** - Built with shadcn/ui and Tailwind CSS
- 🚀 **PWA Ready** - Install as a standalone app

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Add a Habit**: Click "Add New Habit" button and enter a habit name
2. **Track Progress**: Click on any day cell to toggle status
   - First click: ✓ (done)
   - Second click: ✕ (skip)
   - Third click: back to empty
3. **Delete Habit**: Hover over a habit name and click the × button

## Technology Stack

- **Vite** - Fast build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management
- **date-fns** - Date utilities
- **vite-plugin-pwa** - PWA support

## Data Storage

All habit data is stored locally in your browser's localStorage. No data is sent to any server. Your privacy is protected.

## Future Enhancements

- Cloud sync across devices
- Statistics and streaks
- Custom week start day
- Export/import data
- Native mobile app

## License

MIT
