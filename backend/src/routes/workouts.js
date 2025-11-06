const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all workouts
router.get('/', (req, res) => {
  const query = `
    SELECT w.*, 
           COUNT(e.id) as exercise_count
    FROM workouts w
    LEFT JOIN exercises e ON w.id = e.workout_id
    GROUP BY w.id
    ORDER BY w.date DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get a single workout with exercises
router.get('/:id', (req, res) => {
  const workoutId = req.params.id;
  
  const workoutQuery = 'SELECT * FROM workouts WHERE id = ?';
  const exercisesQuery = 'SELECT * FROM exercises WHERE workout_id = ?';
  
  db.get(workoutQuery, [workoutId], (err, workout) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }
    
    db.all(exercisesQuery, [workoutId], (err, exercises) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({
        ...workout,
        exercises: exercises
      });
    });
  });
});

// Create a new workout with exercises
router.post('/', (req, res) => {
  const { date, notes, exercises } = req.body;
  
  if (!date) {
    res.status(400).json({ error: 'Date is required' });
    return;
  }
  
  const insertWorkout = 'INSERT INTO workouts (date, notes) VALUES (?, ?)';
  
  db.run(insertWorkout, [date, notes || ''], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const workoutId = this.lastID;
    
    if (!exercises || exercises.length === 0) {
      res.status(201).json({
        id: workoutId,
        date,
        notes,
        exercises: []
      });
      return;
    }
    
    const insertExercise = `
      INSERT INTO exercises (workout_id, exercise_type, distance, distance_unit, 
                            repetitions, sets, duration, duration_unit, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    let completed = 0;
    const exerciseResults = [];
    
    exercises.forEach((exercise) => {
      db.run(insertExercise, [
        workoutId,
        exercise.exercise_type,
        exercise.distance || null,
        exercise.distance_unit || null,
        exercise.repetitions || null,
        exercise.sets || null,
        exercise.duration || null,
        exercise.duration_unit || null,
        exercise.notes || null
      ], function(err) {
        if (err) {
          console.error('Error inserting exercise:', err.message);
        } else {
          exerciseResults.push({
            id: this.lastID,
            ...exercise
          });
        }
        
        completed++;
        if (completed === exercises.length) {
          res.status(201).json({
            id: workoutId,
            date,
            notes,
            exercises: exerciseResults
          });
        }
      });
    });
  });
});

// Delete a workout
router.delete('/:id', (req, res) => {
  const workoutId = req.params.id;
  
  // First delete exercises
  db.run('DELETE FROM exercises WHERE workout_id = ?', [workoutId], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Then delete workout
    db.run('DELETE FROM workouts WHERE id = ?', [workoutId], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Workout not found' });
        return;
      }
      
      res.json({ message: 'Workout deleted successfully' });
    });
  });
});

module.exports = router;
