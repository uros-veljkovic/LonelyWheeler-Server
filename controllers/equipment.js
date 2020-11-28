const mongoose = require("mongoose")

const EquipmentModel = require('../api/model/equipment')

// exports.create = (request, response, next) => {

//     const equipment = new EquipmentModel({
//         ...request.body,
//         _id: mongoose.Types.ObjectId(),
//     })

//     equipment.save(equipment).then(savedEquipment => {
//         if (savedEquipment) {
//             onSuccess(response, savedEquipment, "Offer saved !", 202)
//         } else {
//             onServerFailed(response, null, "Fail saving offer !")
//         }
//     }).catch(error => {
//         onFail(response, null, "Saving unsuccessful !")
//     });
// };

exports.createOrUpdate = (request, response, next) => {

    let entityId = request.body._id

    if (entityId === "") {
        entityId = mongoose.Types.ObjectId()
    }

    let vehicle = new EquipmentModel({
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


    EquipmentModel.findOneAndUpdate(filter, vehicle, options, function (err, savedVehicle) {
        if (err) {
            onFail(response, null, "Fail saving offer !", 500)
        } else {
            onSuccess(response, savedVehicle, "Offer saved !", 200)
        }
    });
};

exports.readAll = (request, response, next) => {

    EquipmentModel.find({}, function (error, docs) {
        if (docs) {
            onSuccess(response, docs, "Equipment offers loaded !", 200)
        } else if (error) {
            onFail(response, null, "No offers loaded...", 500)
        } else {

        }

    });
};

exports.read = (request, response, next) => {

    const id = request.params.id

    EquipmentModel.findById(id, function (error, equipment) {
        if (equipment) {
            onSuccess(response, equipment, "Equipment with id " + id + " was found !", 200)
        } else if (error) {
            onFail(response, null, "ERROR loading equipment with id " + id, 500)
        } else {
            onFail(response, null, "No equipment found with id!" + id, 400)
        }

    });
};

exports.delete = (request, response, next) => {
    const vehicleId = request.params.id

    EquipmentModel.findByIdAndRemove(vehicleId, function (error, deletedVehicle) {
        if (error) {
            onFail(response, null, "Failed to delete offer...", 500)
        } else {
            onSuccess(response, deletedVehicle, "Offer deleted !", 200)
        }
    })

}

function onSuccess(response, object, message, code) {
    prettyPrint(message, "=", 5)
    response.status(code).json({
        code: code,
        message: message,
        entity: object
    });
}

function onFail(response, object, message, code) {
    prettyPrint(message, "!", 5)
    response.status(204).json({
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