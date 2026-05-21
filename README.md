# Memorize

Memorize is a browser-based memory game built with React, TypeScript, and Vite. Watch the highlighted tiles, remember the pattern, and repeat it before time runs out.

## Tech Stack

- React 19
- TypeScript
- Vite
- CSS Modules
- Framer Motion
- localStorage

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

Deploy the `dist` folder to any static host.

## How To Play

1. Watch the glowing tiles.
2. Remember which tiles were highlighted.
3. Select the same tiles after the preview ends.
4. Complete the pattern before the timer expires.
5. Keep playing as the grid gets harder.

Selecting a wrong tile ends the game. Correct selections are order-independent.

## Features

- Progressive memory rounds
- Increasing grid size and pattern difficulty
- 100 points per completed round
- Score and high score tracking
- Game stats saved locally
- Responsive touch and mouse controls
- Home, game, and game over screens

## Project Structure

```text
src/
  components/   UI screens, HUD, grid, tiles, effects
  constants/    Shared game constants
  game/         Difficulty, pattern generation, scoring
  hooks/        Game hook
  types/        TypeScript interfaces
  utils/        Storage helpers
```

## Notes

- The app is fully frontend-only.
- High score and basic stats are stored in `localStorage`.
