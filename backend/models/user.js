const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: '../../frontend/src/assets/Jatin-profile.jpeg.jpg'
    },
    uploadedResumes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);