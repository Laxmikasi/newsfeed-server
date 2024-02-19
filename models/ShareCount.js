// models/Share.js
const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    socialMedia: {
        type: String,
        required: true
    },
    count: {  // Add a count field to track share count
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Share = mongoose.model('Share', shareSchema);

module.exports = Share;
