const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const workoutsRouter = require('./routes/workouts');
const exercisesRouter = require('./routes/exercises');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/workouts', workoutsRouter);
app.use('/api/exercises', exercisesRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fitness Tracker API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
