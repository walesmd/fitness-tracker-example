import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = {
  // Get all workouts
  getWorkouts: async () => {
    const response = await axios.get(`${API_URL}/api/workouts`);
    return response.data;
  },

  // Get a single workout with exercises
  getWorkout: async (id) => {
    const response = await axios.get(`${API_URL}/api/workouts/${id}`);
    return response.data;
  },

  // Create a new workout with exercises
  createWorkout: async (workoutData) => {
    const response = await axios.post(`${API_URL}/api/workouts`, workoutData);
    return response.data;
  },

  // Delete a workout
  deleteWorkout: async (id) => {
    const response = await axios.delete(`${API_URL}/api/workouts/${id}`);
    return response.data;
  },

  // Get all exercises
  getExercises: async () => {
    const response = await axios.get(`${API_URL}/api/exercises`);
    return response.data;
  },

  // Add an exercise
  addExercise: async (exerciseData) => {
    const response = await axios.post(`${API_URL}/api/exercises`, exerciseData);
    return response.data;
  }
};

export default api;
