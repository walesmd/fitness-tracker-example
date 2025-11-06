import React, { useState, useEffect } from 'react';
import './App.css';
import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';
import api from './services/api';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const data = await api.getWorkouts();
      setWorkouts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load workouts. Please try again.');
      console.error('Error fetching workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutAdded = (newWorkout) => {
    setWorkouts([newWorkout, ...workouts]);
  };

  const handleWorkoutDelete = async (workoutId) => {
    try {
      await api.deleteWorkout(workoutId);
      setWorkouts(workouts.filter(w => w.id !== workoutId));
    } catch (err) {
      setError('Failed to delete workout. Please try again.');
      console.error('Error deleting workout:', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>💪 Fitness Tracker</h1>
        <p>Log your daily workouts and track your progress</p>
      </header>
      
      <main className="App-main">
        {error && <div className="error-message">{error}</div>}
        
        <section className="workout-form-section">
          <h2>Log New Workout</h2>
          <WorkoutForm onWorkoutAdded={handleWorkoutAdded} />
        </section>

        <section className="workout-list-section">
          <h2>Workout History</h2>
          {loading ? (
            <p className="loading">Loading workouts...</p>
          ) : (
            <WorkoutList 
              workouts={workouts} 
              onWorkoutDelete={handleWorkoutDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
