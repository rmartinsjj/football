# Football Tournament App

A comprehensive React application for managing football tournaments with features for player management, team creation, match tracking, scoring, and tournament standings.

## Features

- **Player Management**: Add, remove, and organize players
- **Team Creation**: Automatically distribute players into balanced teams
- **Live Match Tracking**: Real-time match management with timer and score tracking
- **Interactive Field View**: Visual field representation with player positions
- **Goal Tracking**: Track individual goals and maintain scorer statistics
- **Tournament Standings**: Automatic calculation of team rankings
- **Colete System**: Special lottery system for equipment responsibility

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── LiveFieldView.jsx
│   └── MatchesList.jsx
├── screens/            # Main application screens
│   ├── HomeScreen.jsx
│   ├── PlayersScreen.jsx
│   ├── TeamsScreen.jsx
│   ├── MatchesScreen.jsx
│   ├── StandingsScreen.jsx
│   ├── ScorersScreen.jsx
│   └── ColeteScreen.jsx
├── hooks/              # Custom React hooks
│   └── useTimer.js
├── utils/              # Utility functions
│   └── tournamentUtils.js
├── constants/          # Application constants
│   └── index.js
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build

Create a production build:
```bash
npm run build
```

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **ESLint** - Code linting

## Key Components

### Timer System
- Configurable match durations (7 minutes normal, 10 minutes final)
- Play/pause/reset functionality
- Automatic timeout alerts

### Team Management
- Automatic player distribution across 4 teams
- Team color coding and visual representation
- Support for team-based actions

### Match Tracking
- Dual view modes (List view and Live Field view)
- Real-time score updates
- Goal event tracking with player attribution

### Standings Calculation
- Points-based ranking (3 points win, 1 point draw)
- Goal difference and goals scored tiebreakers
- Visual indicators for championship positions

### Colete System
- Champion immunity selection
- Team-based or individual player selection
- Random drawing with exclusions

## Usage

1. **Add Players**: Use the Players screen to add tournament participants
2. **Create Teams**: Use the Teams screen to automatically distribute players
3. **Manage Matches**: Use the Matches screen to track games and scores
4. **View Standings**: Check real-time tournament rankings
5. **Track Scorers**: Monitor individual goal statistics
6. **Colete Draw**: Conduct equipment responsibility lottery

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.