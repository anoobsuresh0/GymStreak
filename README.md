# GymStreak

GymStreak is a Progressive Web App (PWA) designed to help you track your gym attendance and manage your gym membership plan. With GymStreak, you can easily record your gym visits, view your attendance history in a calendar format, analyze your gym attendance patterns, and get notifications about your membership expiration.

## Features

- **Daily Attendance Tracking:** Mark whether you attended the gym each day
- **Calendar View:** Visual representation of your attendance history with color coding
- **Analytics Dashboard:** View statistics and charts about your gym attendance
- **Membership Plan Management:** Set your gym membership details and get expiration reminders
- **Push Notifications:** Get reminders to log your attendance
- **Installable on Mobile:** Works as a mobile app through PWA technology
- **Works Offline:** Access your data even without an internet connection

## Installation on Mobile

### For iPhone/iOS:

1. Open Safari browser on your iPhone
2. Go to the GymStreak web app (after deployment)
3. Tap the Share button (the square with an arrow pointing upward)
4. Scroll down and tap "Add to Home Screen"
5. Name the app "GymStreak" and tap "Add"
6. The app icon will appear on your home screen

### For Android:

1. Open Chrome browser on your Android device
2. Go to the GymStreak web app (after deployment)
3. Tap the three-dot menu in the top-right corner
4. Tap "Add to Home screen" or "Install app"
5. Tap "Add" in the confirmation dialog
6. The app icon will appear on your home screen

## Development Setup

If you want to run the app locally or make changes:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd gym-tracker
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Building for Production

To create a production build:

```
npm run build
```

This builds the app for production to the `build` folder. The build is minified and the filenames include hashes for cache management.

## Technologies Used

- React
- TypeScript
- Material UI
- Date-fns
- Chart.js
- PWA features (service workers, offline support)
- Local Storage for data persistence

## License

MIT
