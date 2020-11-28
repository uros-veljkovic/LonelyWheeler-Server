const mongoose = require("mongoose")

const UserLikingSellerSchema = mongoose.Schema({
    userID: String,
    sellerID: String,
    liked: Boolean,
    disliked: Boolean,
});

const userLikingSellerModel = mongoose.model("UserLikingSellerModel", UserLikingSellerSchema)

exports.userLikingSellerModel = userLikingSellerModel