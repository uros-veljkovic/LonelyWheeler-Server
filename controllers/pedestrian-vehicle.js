const mongoose = require("mongoose")

const PedestrianVehicleModel = require('../api/model/pedestrian-vehicle')
const ProductModel = require('../api/model/product')

exports.create = (request, response, next) => {

    const vehicle = new PedestrianVehicleModel({
        ...request.body,
        _id: mongoose.Types.ObjectId(),
    })

    vehicle.save(vehicle).then(savedVehicle => {
        if (savedVehicle) {
            onSuccess(response, savedVehicle, "PEDESTRIAN VEHICLE OFFER saved !")
        } else {
            onFail(response, null, "Fail saving PEDESTRIAN VEHICLE OFFER !")
        }
    }).catch(error => {
        console.log(error)
        onFail(response, null, "Saving PEDESTRIAN VEHICLE OFFER unsuccessful !")
    });
};

exports.readAll = (request, response, next) => {

    PedestrianVehicleModel.find({}, function (error, docs) {
        if (docs) {
            onSuccess(response, docs, "PEDESTRIAN VEHICLE OFFERS loaded !")
        } else if (error) {
            onFail(response, null, "No PEDESTRIAN VEHICLE OFFERS loaded...")
        } else {

        }

    });
};

exports.read = (request, response, next) => {

    const vehicleId = request.params.id

    PedestrianVehicleModel.findById(vehicleId, function (error, vehicle) {
        if (vehicle) {
            onSuccess(response, vehicle, "PEDESTRIAN VEHICLE OFFER with id " + vehicleId + " found !")
        } else if (error) {
            onFail(response, null, "ERROR loading PEDESTRIAN VEHICLE OFFER with id " + vehicleId)
        } else {
            onFail(response, null, "No PEDESTRIAN VEHICLE OFFER with id!" + vehicleId)
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