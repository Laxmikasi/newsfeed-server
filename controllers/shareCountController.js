// controllers/shareController.js
const Share = require('../models/ShareCount');  // Correct model import

const shareController = {};

shareController.sharePost = async (req, res) => {
    try {
        const postId = req.body.postId;
        const socialMedia = req.params.socialMedia;

        // Increment share count for the specific post and social media platform
        let share = await Share.findOneAndUpdate(
            { postId, socialMedia },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        );
         
        res.json({ success: true, message: `${socialMedia} share successful for post ID ${postId}`, shareCount: share.count });
    } catch (error) {
        console.error('Error sharing:', error);
        res.status(500).json({ success: false, message: 'Error sharing' });
    }
};

module.exports = shareController;
