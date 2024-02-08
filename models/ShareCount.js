
class ShareCount {
    constructor(postId, facebookShareCount, twitterShareCount, whatsAppShareCount, linkedInShareCount, emailShareCount) {
        this.postId = postId;
        this.facebookShareCount = facebookShareCount;
        this.twitterShareCount = twitterShareCount;
        this.whatsAppShareCount = whatsAppShareCount;
        this.linkedInShareCount = linkedInShareCount;
        this.emailShareCount = emailShareCount;
    }
}

module.exports = ShareCount;
