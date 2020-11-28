const mongoose = require("mongoose")

const PedestrianVehicleModel = require('../api/model/pedestrian-vehicle')
const OfferModel = require('../api/model/offer')

// exports.createOrUpdate = (request, response, next) => {

//     const vehicle = new PedestrianVehicleModel({
//         ...request.body,
//         _id: mongoose.Types.ObjectId(),
//     })

//     vehicle.save(vehicle).then(savedVehicle => {
//         if (savedVehicle) {
//             onSuccess(response, savedVehicle, "Offer saved !", 202)
//         } else {
//             onFail(response, null, "Fail saving PEDESTRIAN VEHICLE OFFER !")
//         }
//     }).catch(error => {
//         console.log(error)
//         onFail(response, null, "Saving PEDESTRIAN VEHICLE OFFER unsuccessful !")
//     });
// };

exports.createOrUpdate = (request, response, next) => {

    let entityId = request.body._id

    if (entityId === "") {
        entityId = mongoose.Types.ObjectId()
    }

    let vehicle = new PedestrianVehicleModel({
        ...request.body,
        _id: entityId,
    })

    const filter = { _id: entityId }
    const options = {
        upsert: true,
        new: true
    }


    PedestrianVehicleModel.findOneAndUpdate(filter, vehicle, options, function (err, savedVehicle) {
        if (err) {
            onFail(response, null, "Fail saving offer !", 500)
        } else {
            onSuccess(response, savedVehicle, "Offer saved !", 200)
        }
    });
};

exports.readAll = (request, response, next) => {

    PedestrianVehicleModel.find({}, function (error, docs) {
        if (docs) {
            onSuccess(response, docs, "PEDESTRIAN VEHICLE OFFERS loaded !", 200)
        } else if (error) {
            onFail(response, null, "No PEDESTRIAN VEHICLE OFFERS loaded...", 400)
        } else {

        }

    });
};

exports.read = (request, response, next) => {

    const vehicleId = request.params.id

    PedestrianVehicleModel.findById(vehicleId, function (error, vehicle) {
        if (vehicle) {
            onSuccess(response, vehicle, "PEDESTRIAN VEHICLE OFFER with id " + vehicleId + " found !", 200)
        } else if (error) {
            onFail(response, null, "ERROR loading PEDESTRIAN VEHICLE OFFER with id " + vehicleId, 500)
        } else {
            onFail(response, null, "No PEDESTRIAN VEHICLE OFFER with id!" + vehicleId, 400)
        }

    });
};

exports.delete = (request, response, next) => {
    const vehicleId = request.params.id

    PedestrianVehicleModel.findByIdAndRemove(vehicleId, function (error, deletedVehicle) {
        if (error) {
            onFail(response, null, "Failed to delete offer...", 400)
        } else {
            onSuccess(response, deletedVehicle, "Offer deleted !", 200)
        }
    })

}

function onSuccess(response, object, message, code) {
    prettyPrint(message, "$", 5)
    response.status(200).json({
        code: code,
        message: message,
        entity: object
    });
}

function onFail(response, object, message, code) {
    prettyPrint(message, "!", 5)
    response.status(200).json({
        code: code,
        message: message,
        entity: object
    });
}

function prettyPrint(message, separator, numOfRows) {
    // 6
    console.log()
    var dateTime = new Date().toLocaleTimeString()
    console.log(" ".repeat(102) + dateTime)
    for (i = 0; i < numOfRows; i++) {
        if (i != 2) {
            let stars = ""
            for (j = 0; j < (message.length + 100); j++) {
                stars = stars + separator
            }
            console.log(stars)
        } else {
            console.log(separator.repeat(40) + " ".repeat(10) + message + " ".repeat(10) + separator.repeat(40));
        }

    }
}