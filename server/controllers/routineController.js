const Routine = require('../models/routine');
const User = require('../models/user');

const createRoutine = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.exercises || !Array.isArray(req.body.exercises)) {
      return res.status(400).json({ error: "Invalid routine data format" });
    }

    // Add user reference to workout
    const routine = new Routine({
      ...req.body,
      user: req.user._id // From auth middleware
    });

    await routine.save();

    // Push the workout ID to the user's workouts array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { routines: routine._id }
    })

    return res.status(201).json({
      success: true,
      routine
    });

  } catch (error) {
    console.error("Error saving routine:", error);
    return res.status(500).json({
      error: "Failed to save routine",
      details: error.message
    });
  }
}

const updateRoutine = async (req, res) => {
  const routineData = req.body;

  if (!routineData || !routineData._id) {
    return res.status(401).json({ error: "Routine data to be updated is required" });
  }

  try {
    const routine = await Routine.findByIdAndUpdate(
      routineData._id,
      {
        $set: {
          title: routineData.title,
          exercises: routineData.exercises.map(exercise => ({
            name: exercise.name,
            set_1: exercise.set_1,
            set_2: exercise.set_2,
            set_3: exercise.set_3,
            one_rep_max: exercise.one_rep_max,
            notes: exercise.notes
          }))
        }
      },
      { new: true }
    );

    if (!routine) {
      return res.status(404).json({ error: "Routine not found" });
    }

    res.status(200).json({ success: true, message: "Routine Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Backend Error" });
  }
}

const deleteRoutine = async (req, res) => {
  try {
    const routine = req.body;
    
    if (!routine._id) {
      return res.status(400).json({
        success: false,
        error: "Routine ID is required"
      });
    }

    // Remove routine document
    await Routine.findByIdAndDelete(routine._id);
    
    // Update user's routines array to remove the reference
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { routines: routine._id }
    });

    res.json({
      success: true,
      message: "Routine deleted successfully!"
    });
  } catch (error) {
    console.error('Error deleting routine:', error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}

module.exports = {
    createRoutine,
    updateRoutine,
    deleteRoutine
}