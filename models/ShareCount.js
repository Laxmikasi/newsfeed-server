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
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Share = mongoose.model('Share', shareSchema);

module.exports = Share;
