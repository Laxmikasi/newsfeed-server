// File: controllers/shareCountController.js

const ShareCount = require('../models/ShareCount');
const shareCountService = require('../services/shareCountService');

const receiveShareCounts = async (req, res) => {
    try {
        const { postId, facebookShareCount, twitterShareCount, whatsAppShareCount, linkedInShareCount, emailShareCount } = req.body;

        // Create a ShareCount object
        const shareCount = new ShareCount(postId, facebookShareCount, twitterShareCount, whatsAppShareCount, linkedInShareCount, emailShareCount);

        // Call the service to save the share counts
        await shareCountService.saveShareCounts(shareCount);

        res.status(200).send('Share counts received and processed successfully');
    } catch (error) {
        console.error('Error receiving share counts:', error);
        res.status(500).send('Internal server error');
    }
};
const getShareCounts = async (req, res) => {
    try {
      const { postId } = req.params;
      // Logic to retrieve share counts from the database or other storage
      // For demonstration purposes, assuming share counts are fetched from a database
      const shareCounts = await ShareCountModel.findOne({ postId });
      res.status(200).json(shareCounts);
    } catch (error) {
      console.error('Error retrieving share counts:', error);
      res.status(500).send('Internal server error');
    }
  };
module.exports = {
    receiveShareCounts,
    getShareCounts 
};
