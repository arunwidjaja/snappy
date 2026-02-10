# Snappy

A React Native app built with Expo.

## Prerequisites

- Node.js v20.19.4+ (v22 recommended)
- npm
- Android Studio (for Android emulator)
- Expo Go app (for testing on physical device)

## Setup

```bash
cd snappy
npm install
```

## Running the App

Start the development server:

```bash
npm start
```

### On Physical Device

1. Install **Expo Go** from the Play Store (Android) or App Store (iOS)
2. Scan the QR code shown in the terminal

### On Android Emulator

1. Open Android Studio
2. Open Device Manager and start an AVD (Android Virtual Device)
3. Press `a` in the terminal where Expo is running

### In Browser

Press `w` in the terminal to open the web version.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo development server |
| `npm run android` | Start and open on Android |
| `npm run ios` | Start and open on iOS (macOS only) |
| `npm run web` | Start and open in browser |

## Stopping the Server

If running in a terminal:
- Press `Ctrl+C`

If running in the background (no terminal window):
```bash
# Find the process using port 8081
netstat -ano | findstr :8081

# Kill by PID (replace <PID> with the number from above)
taskkill /F /PID <PID>

# Or kill all node processes
taskkill /F /IM node.exe
```

Or use **Task Manager** > find `node.exe` > End Task

## Project Structure

```
snappy/
├── App.js          # Main app component
├── app.json        # Expo configuration
├── assets/         # Images, fonts, icons
├── index.js        # Entry point
└── package.json    # Dependencies and scripts
```

## Development

Edit `App.js` to start building your app. Changes will hot-reload automatically.

## Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
