const mongoose = require("mongoose")

const EquipmentSchema = mongoose.Schema({
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
    entityClassSimpleName: String,
    condition: String,
    pictures: [String],
    valueFixed: Boolean,
    firstOwner: Boolean,
    sellerInForExchange: Boolean,
    otherInfo: String,
    colorExterior: String,
    colorInterior: String,
    materialInterior: String,
    equipmentType: String

});

module.exports = mongoose.model("Equipment", EquipmentSchema);