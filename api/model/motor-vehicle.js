const mongoose = require("mongoose")

const MotorVehicleSchema = mongoose.Schema({
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
    equipmentType: String,
    carBodyType: String,
    fuelType: String,
    emissionStandard: String,
    gearboxType: String,
    steeringWheelSide: String,
    drivetrain: String,
    maxSpeed: Number,
    maxHorsePower: Number,
    mileage: Number,
    cubicCapacity: Number,
    registeredUntil: Number,
    numberOfDoors: Number,
    numberOfSeats: Number,
    hasMultimedia: Boolean,

});

module.exports = mongoose.model("MotorVehicle", MotorVehicleSchema);