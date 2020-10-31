const mongoose = require("mongoose")

const EquipmentModel = require('../api/model/equipment')

exports.create = (request, response, next) => {

    const equipment = new EquipmentModel({
        ...request.body,
        _id: mongoose.Types.ObjectId(),
    })

    equipment.save(equipment).then(savedEquipment => {
        if (savedEquipment) {
            onSuccess(response, savedEquipment, "Offer saved !")
        } else {
            onServerFailed(response, null, "Fail saving offer !")
        }
    }).catch(error => {
        onFail(response, null, "Saving unsuccessful !")
    });
};

exports.readAll = (request, response, next) => {

    EquipmentModel.find({}, function(error, docs) {
        if (docs) {
            onSuccess(response, docs, "Equipment offers loaded !")
        } else if (error) {
            onFail(response, null, "No offers loaded...")
        } else {

        }

    });
};

exports.read = (request, response, next) => {

    const id = request.params.id

    EquipmentModel.findById(id, function (error, equipment) {
        if (equipment) {
            onSuccess(response, equipment, "Equipment with id " + id + " was found !")
        } else if (error) {
            onFail(response, null, "ERROR loading equipment with id " + id)
        } else {
            onFail(response, null, "No equipment found with id!" + id)
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