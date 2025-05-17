const Routine = require('../models/routine');
const User = require('../models/user');

const createRoutine = async (req, res) => {
  const { date, weight } = req.body

  // Input validation
  if (!weight || weight <= 0) {
      return res.status(400).json({ 
          success: false,
          error: "Valid weight is required!" 
      })
  }

  try {
      // Create new weight record with user reference
      const weightRecord = new Weight({
          date: date || Date.now(),
          weight,
          user: req.user._id
      })
      await weightRecord.save()

      // Add weight record to user's weights array
      await User.findByIdAndUpdate(req.user._id, {
          $push: { weights: weightRecord._id }
      })

      res.status(201).json({
          success: true,
          data: weightRecord
      })
  } catch (error) {
      console.error('Error logging weight:', error)
      res.status(500).json({
          success: false,
          error: "Failed to log weight. Please try again."
      })
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