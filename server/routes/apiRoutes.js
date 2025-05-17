const express = require('express')
const router = express.Router()
const { registerUser, loginUser } = require('../controllers/authController')
const { getUserInfo, updateUserInfo } = require('../controllers/userController')
const { createWorkout, deleteWorkout } = require('../controllers/workoutController')
const { createRoutine, updateRoutine, deleteRoutine } = require('../controllers/routineController')
const authenticateToken = require('../middleware/authMiddleware');
const { updateWeight, deleteWeight } = require('../controllers/weightController')

// Auth routes
router.post('/register', registerUser)
router.post('/login', loginUser)

// User routes
router.get('/userinfo', authenticateToken, getUserInfo)
router.put('/userinfo', authenticateToken, updateUserInfo)

// Workout routes
router.post('/workout', authenticateToken, createWorkout)
router.delete('/workout', authenticateToken, deleteWorkout)

// Routine routes
router.post('/routine', authenticateToken, createRoutine)
router.put('/routine', authenticateToken, updateRoutine)
router.delete('/routine', authenticateToken, deleteRoutine)

// Weight routes
router.post('/weight', authenticateToken, updateWeight)
router.delete('/weight/:id', authenticateToken, deleteWeight)

// Catch-all middleware for undefined routes
router.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`
  });
});

module.exports = router