import React, { useState } from 'react';
import './WorkoutList.css';
import api from '../services/api';

const WorkoutList = ({ workouts, onWorkoutDelete }) => {
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [workoutDetails, setWorkoutDetails] = useState({});

  const toggleWorkout = async (workoutId) => {
    if (expandedWorkout === workoutId) {
      setExpandedWorkout(null);
      return;
    }

    if (!workoutDetails[workoutId]) {
      try {
        const details = await api.getWorkout(workoutId);
        setWorkoutDetails({
          ...workoutDetails,
          [workoutId]: details
        });
      } catch (err) {
        console.error('Error fetching workout details:', err);
        return;
      }
    }

    setExpandedWorkout(workoutId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleDelete = (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      onWorkoutDelete(workoutId);
    }
  };

  if (!workouts || workouts.length === 0) {
    return (
      <div className="no-workouts">
        <p>No workouts logged yet. Start by adding your first workout!</p>
      </div>
    );
  }

  return (
    <div className="workout-list">
      {workouts.map((workout) => (
        <div key={workout.id} className="workout-card">
          <div className="workout-header" onClick={() => toggleWorkout(workout.id)}>
            <div className="workout-date">
              <span className="date-icon">📅</span>
              {formatDate(workout.date)}
            </div>
            <div className="workout-summary">
              <span className="exercise-count">
                {workout.exercise_count} exercise{workout.exercise_count !== 1 ? 's' : ''}
              </span>
              <button 
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(workout.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>

          {expandedWorkout === workout.id && workoutDetails[workout.id] && (
            <div className="workout-details">
              {workoutDetails[workout.id].notes && (
                <div className="workout-notes">
                  <strong>Notes:</strong> {workoutDetails[workout.id].notes}
                </div>
              )}
              
              <div className="exercises">
                <h4>Exercises:</h4>
                {workoutDetails[workout.id].exercises.map((exercise) => (
                  <div key={exercise.id} className="exercise-card">
                    <div className="exercise-name">{exercise.exercise_type}</div>
                    <div className="exercise-metrics">
                      {exercise.distance && (
                        <span className="metric">
                          📏 {exercise.distance} {exercise.distance_unit}
                        </span>
                      )}
                      {exercise.repetitions && (
                        <span className="metric">
                          🔢 {exercise.repetitions} reps
                        </span>
                      )}
                      {exercise.sets && (
                        <span className="metric">
                          📊 {exercise.sets} sets
                        </span>
                      )}
                      {exercise.duration && (
                        <span className="metric">
                          ⏱️ {exercise.duration} {exercise.duration_unit}
                        </span>
                      )}
                    </div>
                    {exercise.notes && (
                      <div className="exercise-notes">{exercise.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkoutList;
