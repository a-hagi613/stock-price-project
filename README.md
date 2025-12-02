# Stock Alerts App

A mobile stock alert system prototype built for HCI CS6750. Shows portfolio info on your lock screen, has smart notifications, and lets you organize alerts by custom groups.

## What it does

- Live portfolio widgets on lock screen that update automatically
- Custom alert groups with colors (makes it easy to spot different categories)
- AI summaries that explain why alerts triggered
- Max 3 notifications in the drawer so it doesn't get cluttered
- Quiet hours and other preferences

## Tech

React + TypeScript + Vite
TailwindCSS for styling
Framer Motion for animations
Zustand for state (persists to localStorage)
React Router for navigation

Also uses react-device-frameset to show it in an iPhone frame, lucide-react for icons, and date-fns for dates.

## Running it

```bash
npm install
npm run dev
```

Goes to http://localhost:5173

## How to use

1. Starts on lock screen - check out the widgets
2. Click unlock
3. Tap the settings icon
4. You'll see 2 alerts already set up (NVDA and TSLA)
5. Try creating a new one
6. Test the alerts to see notifications
7. Click the bell to see the drawer
8. Toggle between beginner/advanced mode to see different options

## Building

```bash
npm run build
npm run preview  # test it locally
```

Deploy to Vercel or Netlify - they auto-detect Vite config.

## Notes

Some toggles are just for show (location-based alerts, aggregator) - focused on the AI summaries and grouping since that's what users wanted most.

Data saves to localStorage so it won't reset if you refresh.
