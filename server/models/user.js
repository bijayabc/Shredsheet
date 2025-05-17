const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/  // email pattern
      },
      weight: {
        type: Number,
        min: 0
      },
      dob: {
        type: Date,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      // Reference to workouts and routines
      workouts: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Workout'
      }],
      routines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Routine'
      }],
      weights: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Weight'
      }]
}, { timestamps: true})

const User = mongoose.model('User', userSchema)
module.exports = User