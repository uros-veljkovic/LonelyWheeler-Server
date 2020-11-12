const mongoose = require("mongoose")
const OfferModel = require('../api/model/offer')
const MotorVehicleModel = require('../api/model/motor-vehicle')
const PedestrianVehicleModel = require('../api/model/pedestrian-vehicle')
const EquipmentModel = require('../api/model/equipment')


exports.readAll = async function (request, response, next) {

    const id = request.query.sellerID

    const entities1 = await MotorVehicleModel.find({ sellerId: id }).exec()
    const entities2 = await PedestrianVehicleModel.find({ sellerId: id }).exec()
    const entities3 = await EquipmentModel.find({ sellerId: id }).exec()

    let array = [entities1, entities2, entities3]

    onSuccess(response, flatten(array), "Good")

};

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

async function getMotorVehicles(queryParam) {
    return MotorVehicleModel.find({ sellerId: queryParam }).exec()
};

exports.read = (request, response, next) => {

    const userId = request.query.userId
    const offerId = request.query.offerId

    console.log("USER ID: " + userId)
    console.log("OFFER ID: " + offerId)


    OfferModel.findOne(
        {
            userId: userId,
            offerId: offerId
        }, function (error, doc) {
            if (doc) {
                onSuccess(response, true, "Favorite offer for user " + userId + " EXIST!")
            } else if (error) {
                console.log(error)
                onFail(response, false, "Favorite offer for user " + userId + " DOES NOT EXIST!")
            } else {
                onFail(response, false, "Favorite offer for user " + userId + " DOES NOT EXIST!")
            }
        });
};

function create(offer, response) {
    offer.save(offer).then(docSaved => {
        if (docSaved) {
            onSuccess(response, docSaved, "Added to favorites !");
        } else {
            onServerFailed(response, null, "Fail adding to favorites...");
        }
    }).catch(error => {
        console.log(error);
        onFail(response, null, "SERVER[ERROR] Fail adding to favorites...");
    });
}

function remove(offer, response) {
    OfferModel.deleteOne({
        userId: offer.userId,
        offerId: offer.offerId
    }).then(docDeleted => {
        onSuccess(response, docDeleted, "Removed from favorites.");
    }).catch(error => {
        console.log(error);
        onFail(response, null, "SERVER[ERROR] Fail adding to favorites...");
    });
}

function onSuccess(response, object, message) {
    prettyPrint(message, "#", 5)
    response.status(200).json({
        message: message,
        entity: object
    });
}

function onFail(response, object, message) {
    prettyPrint(message, "!", 5)
    response.status(201).json({
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