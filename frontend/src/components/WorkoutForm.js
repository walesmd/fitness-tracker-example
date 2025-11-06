import React, { useState } from 'react';
import './WorkoutForm.css';
import api from '../services/api';

const WorkoutForm = ({ onWorkoutAdded }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({
    exercise_type: '',
    distance: '',
    distance_unit: 'miles',
    repetitions: '',
    sets: '',
    duration: '',
    duration_unit: 'minutes',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleExerciseChange = (field, value) => {
    setCurrentExercise({
      ...currentExercise,
      [field]: value
    });
  };

  const addExercise = () => {
    if (!currentExercise.exercise_type) {
      alert('Please enter an exercise type');
      return;
    }

    setExercises([...exercises, { ...currentExercise }]);
    setCurrentExercise({
      exercise_type: '',
      distance: '',
      distance_unit: 'miles',
      repetitions: '',
      sets: '',
      duration: '',
      duration_unit: 'minutes',
      notes: ''
    });
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    setSubmitting(true);
    
    try {
      const workoutData = {
        date,
        notes,
        exercises: exercises.map(ex => ({
          exercise_type: ex.exercise_type,
          distance: ex.distance ? parseFloat(ex.distance) : null,
          distance_unit: ex.distance ? ex.distance_unit : null,
          repetitions: ex.repetitions ? parseInt(ex.repetitions) : null,
          sets: ex.sets ? parseInt(ex.sets) : null,
          duration: ex.duration ? parseInt(ex.duration) : null,
          duration_unit: ex.duration ? ex.duration_unit : null,
          notes: ex.notes || null
        }))
      };

      const newWorkout = await api.createWorkout(workoutData);
      onWorkoutAdded(newWorkout);
      
      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setExercises([]);
      alert('Workout logged successfully!');
    } catch (err) {
      alert('Failed to log workout. Please try again.');
      console.error('Error creating workout:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="workout-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Workout Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about your workout..."
            rows="2"
          />
        </div>

        <div className="exercise-input-section">
          <h3>Add Exercise</h3>
          
          <div className="form-group">
            <label>Exercise Type:</label>
            <input
              type="text"
              value={currentExercise.exercise_type}
              onChange={(e) => handleExerciseChange('exercise_type', e.target.value)}
              placeholder="e.g., Running, Pushups, Situps"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Distance:</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  step="0.1"
                  value={currentExercise.distance}
                  onChange={(e) => handleExerciseChange('distance', e.target.value)}
                  placeholder="2"
                />
                <select
                  value={currentExercise.distance_unit}
                  onChange={(e) => handleExerciseChange('distance_unit', e.target.value)}
                >
                  <option value="miles">miles</option>
                  <option value="km">km</option>
                  <option value="meters">meters</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Repetitions:</label>
              <input
                type="number"
                value={currentExercise.repetitions}
                onChange={(e) => handleExerciseChange('repetitions', e.target.value)}
                placeholder="50"
              />
            </div>

            <div className="form-group">
              <label>Sets:</label>
              <input
                type="number"
                value={currentExercise.sets}
                onChange={(e) => handleExerciseChange('sets', e.target.value)}
                placeholder="3"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Duration:</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={currentExercise.duration}
                onChange={(e) => handleExerciseChange('duration', e.target.value)}
                placeholder="30"
              />
              <select
                value={currentExercise.duration_unit}
                onChange={(e) => handleExerciseChange('duration_unit', e.target.value)}
              >
                <option value="minutes">minutes</option>
                <option value="seconds">seconds</option>
                <option value="hours">hours</option>
              </select>
            </div>
          </div>

          <button type="button" onClick={addExercise} className="btn-add-exercise">
            + Add Exercise
          </button>
        </div>

        {exercises.length > 0 && (
          <div className="exercises-list">
            <h3>Exercises for this workout:</h3>
            {exercises.map((exercise, index) => (
              <div key={index} className="exercise-item">
                <div className="exercise-info">
                  <strong>{exercise.exercise_type}</strong>
                  <div className="exercise-details">
                    {exercise.distance && <span>{exercise.distance} {exercise.distance_unit}</span>}
                    {exercise.repetitions && <span>{exercise.repetitions} reps</span>}
                    {exercise.sets && <span>{exercise.sets} sets</span>}
                    {exercise.duration && <span>{exercise.duration} {exercise.duration_unit}</span>}
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeExercise(index)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? 'Logging Workout...' : 'Log Workout'}
        </button>
      </form>
    </div>
  );
};

export default WorkoutForm;
