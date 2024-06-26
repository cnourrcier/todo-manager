const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { eventLogger } = require('../utils/eventLogger');


const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        maxLength: 60, // Max length constraint
        minLength: 1,
        trim: true // Trim leading/trailing whitespace
    },
    description: {
        type: String,
        maxLength: 200, // Max length constraint
        trim: true // Trim leading/trailing whitespace
    },
    priority: {
        type: Number,
        required: true,
        min: 1,
        max: 3,
        default: 1,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: function () {
            // Only set the createdAt field if it's not already set
            if (this.isNew) {
                return new Date();
            }
        }
    },
    completed: {
        type: Boolean,
        default: false
    }
});


// DOCUMENT MIDDLEWARE

// post save hook
// does not have access to 'this'
todoSchema.post('save', function (doc, next) {
    const message = `${doc.title}\tcreated by: ${doc.createdBy} | ${doc.createdAt}\n`
    eventLogger(message, 'newTodoLog.txt')
    next();
})



const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;

