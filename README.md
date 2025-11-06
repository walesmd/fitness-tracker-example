# Fitness Tracker Application

A full-stack fitness tracker application that allows users to log their daily workouts and exercises.

## Features

- Log daily workouts with multiple exercises
- Track exercise details (type, duration, distance, repetitions, etc.)
- View workout history
- SQLite database for data persistence

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React
- **Database**: SQLite

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm

### Running the Application

#### 1. Start the Backend

Open a terminal and run:

```bash
cd backend
npm install
npm run dev
```

The backend API will start on http://localhost:3001

#### 2. Start the Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm start
```

The React app will start on http://localhost:3000 and automatically open in your browser.

### Testing the Application

1. Open http://localhost:3000 in your browser
2. You should see the Fitness Tracker interface
3. Try logging a workout:
   - Set today's date (or any date)
   - Add an exercise (e.g., "Running" with 2 miles)
   - Add more exercises (e.g., "Pushups" with 50 reps)
   - Click "Log Workout"
4. Your workout will appear in the "Workout History" section below
5. Click on a workout to expand and see all exercises
6. Click "Delete" to remove a workout

### API Endpoints

#### Workouts
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:id` - Get a specific workout with exercises
- `POST /api/workouts` - Create a new workout with exercises
- `DELETE /api/workouts/:id` - Delete a workout

#### Exercises
- `GET /api/exercises` - Get all exercises
- `POST /api/exercises` - Add an exercise to a workout

## Development

Both the backend and frontend use hot-reloading during development. Changes to the code will automatically restart the servers.

## Project Structure

```
fitness-tracker/
├── backend/           # Express API server
│   ├── src/
│   │   ├── server.js
│   │   ├── database.js
│   │   └── routes/
│   └── package.json
├── frontend/          # React application
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   └── services/
│   └── package.json
└── README.md
```

## Troubleshooting

**Backend won't start:**
- Make sure port 5000 is not in use by another application
- Check that you're in the `backend` directory when running `npm install` and `npm run dev`

**Frontend won't start:**
- Make sure port 3000 is not in use
- Make sure the backend is running first
- Check that you're in the `frontend` directory

**Can't connect to backend:**
- Verify the backend is running on http://localhost:5000
- Check the browser console for errors
- Make sure no firewall is blocking the connection
# fitness-tracker-example
# fitness-tracker-example
