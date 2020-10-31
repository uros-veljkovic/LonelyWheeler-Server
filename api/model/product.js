const mongoose = require("mongoose")

const ProductSchema = mongoose.Schema({
    _id: String,
    sellerId: String,
    basicInfo: {
        title: String,
        value: Number,
        dateModified: Number,
        model: String,
        brand: String,
        yearOfProduction: Number
    },
    condition: String,
    pictures: [String],
    valueFixed: Boolean,
    firstOwner: Boolean,
    sellerInForExchange: Boolean,
    otherInfo: String,
    colorExterior: String,
    colorInterior: String,
    materialInterior: String,
});

module.exports = mongoose.model("Product", ProductSchema);