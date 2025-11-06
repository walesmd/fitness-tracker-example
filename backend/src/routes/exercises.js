const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all exercises
router.get('/', (req, res) => {
  const query = 'SELECT * FROM exercises ORDER BY created_at DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add an exercise to a workout
router.post('/', (req, res) => {
  const { workout_id, exercise_type, distance, distance_unit, repetitions, sets, duration, duration_unit, notes } = req.body;
  
  if (!workout_id || !exercise_type) {
    res.status(400).json({ error: 'workout_id and exercise_type are required' });
    return;
  }
  
  const query = `
    INSERT INTO exercises (workout_id, exercise_type, distance, distance_unit, 
                          repetitions, sets, duration, duration_unit, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    workout_id,
    exercise_type,
    distance || null,
    distance_unit || null,
    repetitions || null,
    sets || null,
    duration || null,
    duration_unit || null,
    notes || null
  ], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.status(201).json({
      id: this.lastID,
      workout_id,
      exercise_type,
      distance,
      distance_unit,
      repetitions,
      sets,
      duration,
      duration_unit,
      notes
    });
  });
});

module.exports = router;
