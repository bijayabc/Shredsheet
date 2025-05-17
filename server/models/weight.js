const mongoose = require('mongoose')

const weightSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true  // Add index for better query performance
    },
    date: {
        type: Date,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
        min: 0
    }
})

const Weight = mongoose.model('Weight', weightSchema)
module.exports = Weight