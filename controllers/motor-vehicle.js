const mongoose = require("mongoose")

const MotorVehicleModel = require('../api/model/motor-vehicle')
const OfferModel = require('../api/model/offer')

exports.create = (request, response, next) => {

    const vehicle = new MotorVehicleModel({
        ...request.body,
        _id: mongoose.Types.ObjectId(),
    })

    vehicle.save(vehicle).then(savedVehicle => {
        if (savedVehicle) {
            onSuccess(response, savedVehicle, "Offer saved !")
        } else {
            onFail(response, null, "Fail saving offer !")
        }
    }).catch(error => {
        onFail(response, null, "Saving unsuccessful !")
    });
};

exports.readAll = (request, response, next) => {

    MotorVehicleModel.find({}, function (error, docs) {
        if (docs) {
            onSuccess(response, docs, "Motor-vehicle offers loaded !")
        } else if (error) {
            onFail(response, null, "No offers loaded...")
        } else {

        }

    });
};

exports.read = (request, response, next) => {

    const vehicleId = request.params.id

    MotorVehicleModel.findById(vehicleId, function (error, vehicle) {
        if (vehicle) {
            onSuccess(response, vehicle, "Motor-vehicle with !")
        } else if (error) {
            onFail(response, null, "ERROR loading vehicle with id " + vehicleId)
        } else {
            onFail(response, null, "No vehicles found with id!" + vehicleId)
        }

    });
};

function onSuccess(response, object, message) {
    console.log(message)
    response.status(200).json({
        message: message,
        entity: object
    });
}

function onFail(response, object, message) {
    console.log(message)
    response.status(201).json({
        message: message,
        entity: object
    });
}