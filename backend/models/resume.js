const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    analyzed: {
        type: Boolean,
        default: false
    },
    analysisReport: {
        type: Object,
        default: {}
    }
});

module.exports = mongoose.model('Resume', resumeSchema);