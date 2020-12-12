const mongoose = require("mongoose")

const MotorVehicleModel = require('../api/model/motor-vehicle')

// exports.createOrUpdate = (request, response, next) => {

//     const vehicle = new MotorVehicleModel({
//         ...request.body,
//         _id: mongoose.Types.ObjectId(),
//     })

//     vehicle.save(vehicle).then(savedVehicle => {
//         if (savedVehicle) {
//             onSuccess(response, savedVehicle, "Offer saved !", 202)
//         } else {
//             onFail(response, null, "Fail saving offer !")
//         }
//     }).catch(error => {
//         onFail(response, null, "Saving unsuccessful !")
//     });
// };

exports.createOrUpdate = (request, response, next) => {

    let entityId = request.body._id

    if (entityId === "") {
        prettyPrint("Create new id for entity", ".", 5)
        entityId = mongoose.Types.ObjectId()
    }

    let vehicle = new MotorVehicleModel({
        ...request.body,
        _id: entityId,
    })

    const filter = {
        _id: entityId,
    }

    const options = {
        upsert: true,
        new: true
    }


    MotorVehicleModel.findOneAndUpdate(filter, vehicle, options, function (err, savedVehicle) {
        if (err) {
            onFail(response, null, "Fail saving offer !", 500)
        } else {
            onSuccess(response, savedVehicle, "Offer saved !", 200)
        }
    });
};

exports.readAll = (request, response, next) => {

    MotorVehicleModel.find({}, function (error, docs) {
        if (docs) {
            onSuccess(response, docs, "Motor-vehicle offers loaded !", 200)
        } else if (error) {
            onFail(response, null, "No offers loaded...", 500)
        } else {

        }

    });
};

exports.read = (request, response, next) => {

    const vehicleId = request.params.id

    MotorVehicleModel.findById(vehicleId, function (error, vehicle) {
        if (vehicle) {
            message = "Motor-vehicle with ID: " + vehicle.id + " loaded successfully !"
            onSuccess(response, vehicle, message, 200)
        } else if (error) {
            onFail(response, null, "ERROR loading vehicle with id " + vehicleId, 500)
        } else {
            onFail(response, null, "No vehicles found with id!" + vehicleId, 400)
        }

    });
};

exports.delete = (request, response, next) => {
    const vehicleId = request.params.id

    MotorVehicleModel.findByIdAndRemove(vehicleId, function (error, deletedVehicle) {
        if (error) {
            onFail(response, null, "Failed to delete offer...", 500)
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