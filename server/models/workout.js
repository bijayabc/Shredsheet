const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Exercise name cannot be longer than 100 characters']
      },
      set_1: {
        type: String,
        trim: true,
        default: ''
      },
      set_2: {
        type: String,
        trim: true,
        default: ''
      },
      set_3: {
        type: String,
        trim: true,
        default: ''
      },
});

const workoutSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    body_parts: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    exercises: [exerciseSchema],
    notes: String
}, { timestamps: true })

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;