const mongoose = require("mongoose")

const PersonalInfoSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    city: String,
    street: String,
    mobileNumber: String
});

const AccountInfoSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    picture: String,
    timesSupported: Number,
    timesReported: Number,
    offersLiked: [Number],
    myOffers: [Number]
});

const UserSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    personalInfo: PersonalInfoSchema,
    accountInfo: AccountInfoSchema
});

const userModel = mongoose.model("UserModel", UserSchema);
const personalInfoModel = mongoose.model("PersonalInfoModel", PersonalInfoSchema)
const accountInfoModel = mongoose.model("AccountInfoModel", AccountInfoSchema)

exports.userModel = userModel
exports.personalInfoModel = personalInfoModel
exports.accountInfoModel = accountInfoModel
