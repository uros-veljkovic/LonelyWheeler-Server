const mongoose = require("mongoose")

const LikedOfferSchema = mongoose.Schema({
    _id: String,
    userId: String,
    offerId: String
});

module.exports = mongoose.model("LikedOffer", LikedOfferSchema);