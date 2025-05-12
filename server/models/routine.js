const mongoose = require('mongoose');

// Define the Exercise schema
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
  one_rep_max: {
    type: String,
    trim: true,
    default: ''
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be longer than 500 characters'],
    default: ''
  }
});

// Define the Routine schema
const routineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true  // Add index for better query performance
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Title cannot be longer than 100 characters']
  },
  exercises: [exerciseSchema]
}, { timestamps: true });

// Create a model for Routine
const Routine = mongoose.model('Routine', routineSchema);

module.exports = Routine;