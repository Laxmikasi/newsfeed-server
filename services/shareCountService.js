// File: services/shareCountService.js

const shareCountService = {
    saveShareCounts: async (shareCount) => {
        console.log('Received share counts for post ID:', shareCount.postId);
        console.log('Facebook share count:', shareCount.facebookShareCount);
        console.log('Twitter share count:', shareCount.twitterShareCount);
        console.log('WhatsApp share count:', shareCount.whatsAppShareCount);
        console.log('LinkedIn share count:', shareCount.linkedInShareCount);
        console.log('Email share count:', shareCount.emailShareCount);
    }
};

module.exports = shareCountService;
