// controllers/shareController.js

const Share = require('../models/ShareCount');

const shareController = {};

shareController.sharePost = (req, res) => {
    const postId = req.body.postId;
    const socialMedia = req.params.socialMedia;
 res.json({ success: true, message: `${socialMedia} share successful for post ID ${postId}` });
};

module.exports = shareController;
