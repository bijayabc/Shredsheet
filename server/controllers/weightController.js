const User = require('../models/user')
const Weight = require('../models/weight')

const updateWeight = async (req, res) => {
    let { date, weight } = req.body

    // Sanitize and Validate
    if (!date || isNaN(Date.parse(date))) {
        date = new Date()
    } else {
        date = new Date(date)
    }

    if (!weight || weight <= 0 || isNaN(weight)) {
        return res.status(400).json({
            success: false,
            error: "Valid weight is required!"
        })
    }

    try {
        // Create new weight record with user reference
        const weightRecord = new Weight({
            date: date,
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

const deleteWeight = async (req, res) => {
    const id = req.params.id

    try {
        const weightLog = await Weight.findByIdAndDelete(id)
        if (!weightLog) {
            return res.status(404).json({
                success: false,
                error: "Weight Log Not Found!"
            });
        }
        // Remove the reference from user's weights array
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { weights: id }
        })

        return res.json({
            success: true,
            message: "Weight log deleted successfully"
        });
    } catch (error) {
        console.log("Error Deleting WeightLog: ", error);
        return res.status(500).json({
            success: false,
            error: "Failed to delete WeightLog. Please try again."
        });
    }
}

module.exports = {
    updateWeight,
    deleteWeight
}