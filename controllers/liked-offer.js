const mongoose = require("mongoose")
const LikedOffersModel = require('../api/model/liked-offer')
const MotorVehicleModel = require('../api/model/motor-vehicle')
const PedestrianVehicleModel = require('../api/model/pedestrian-vehicle')
const EquipmentModel = require('../api/model/equipment')

var assert = require('assert')


exports.createOrDelete = (request, response, next) => {

    const likedOffer = new LikedOffersModel({
        ...request.body,
        _id: mongoose.Types.ObjectId(),
    })

    console.log("LIKED OFFER:\n")
    console.log(likedOffer)

    LikedOffersModel.find({
        userId: likedOffer.userId,
        offerId: likedOffer.offerId
    }, function (error, doc) {
        if (error) {
            console.log(error);
        } else if (doc.length) {
            console.log(doc);
            remove(likedOffer, response);
        }
        else {
            create(likedOffer, response);
        }
    })

};

exports.readAll = (request, response, next) => {

    const userId = request.query.userId
    console.log("\n\n=========================================")
    console.log("USER " + userId + " -> LOADING FAVORITES.")
    console.log("=========================================\n")

    LikedOffersModel.find({ userId: userId }, 'offerId', function (error, docs) {
        if (docs) {
            const arrayOfOfferIDs = []
            docs.forEach(doc => {
                arrayOfOfferIDs.push(doc.offerId)
            })
            console.log(arrayOfOfferIDs)
            loadOffers(response, arrayOfOfferIDs)
        } else if (error) {
            onFail(response, null, "No favorites loaded for user " + userId)
        } else {
            onFail(response, null, "No favorites loaded for user " + userId)
        }

    });
};

function loadOffers(response, offerIds) {
    Promise.all([
        MotorVehicleModel.find({ '_id': { $in: offerIds } }),
        PedestrianVehicleModel.find({ '_id': { $in: offerIds } }),
        EquipmentModel.find({ '_id': { $in: offerIds } })
    ]).then(([docs1, docs2, docs3]) => {
        const arrayOfArrays = [docs1, docs2, docs3]
        const array = flatten(arrayOfArrays)
        array.forEach(item => {
            console.log(item._id)
        })
        onSuccess(response, array, "Liked offers loaded !")
    }).catch(() => {
        onFail(response, null, "Error loading favorite offers for user...")
    });
}

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

exports.read = (request, response, next) => {

    const userId = request.query.userId
    const offerId = request.query.offerId

    console.log("USER ID: " + userId)
    console.log("OFFER ID: " + offerId)


    LikedOffersModel.findOne(
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

function create(likedOffer, response) {
    likedOffer.save(likedOffer).then(docSaved => {
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

function remove(likedOffer, response) {
    LikedOffersModel.deleteOne({
        userId: likedOffer.userId,
        offerId: likedOffer.offerId
    }).then(docDeleted => {
        onSuccess(response, docDeleted, "Removed from favorites.");
    }).catch(error => {
        console.log(error);
        onFail(response, null, "SERVER[ERROR] Fail adding to favorites...");
    });
}

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