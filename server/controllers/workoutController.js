const User = require('../models/User');
const Workout = require('../models/Workout');

const createWorkout = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.exercises || !Array.isArray(req.body.exercises)) {
      return res.status(400).json({ error: "Invalid workout data format" });
    }

    // Add user reference to workout
    const workout = new Workout({
      ...req.body,
      user: req.user._id // From auth middleware
    });

    await workout.save();

    // Push the workout ID to the user's workouts array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { workouts: workout._id }
    })

    return res.status(201).json({
      success: true,
      workout
    });

  } catch (error) {
    console.error("Error saving workout:", error);
    return res.status(500).json({
      error: "Failed to save workout",
      details: error.message
    });
  }
}

const deleteWorkout = async (req, res) => {
  try {
    const workout = req.body;
    
    if (!workout._id) {
      return res.status(400).json({
        success: false,
        error: "Workout ID is required"
      });
    }

    // Remove workout document
    await Workout.findByIdAndDelete(workout._id);
    
    // Update user's workouts array to remove the reference
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { workouts: workout._id }
    });

    res.json({
      success: true,
      message: "Workout deleted successfully!"
    });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}

module.exports = {
    createWorkout,
    deleteWorkout
}