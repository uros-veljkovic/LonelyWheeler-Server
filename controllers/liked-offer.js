const mongoose = require("mongoose")
const LikedOffersModel = require('../api/model/liked-offer')

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

    const userId = request.params.userId

    LikedOffersModel.find({ "userId": userId }, function (error, docs) {
        if (docs) {
            onSuccess(response, docs, "Favorites for user " + userId + " loaded successfully!")
        } else if (error) {
            onFail(response, null, "No favorites loaded for user " + userId)
        } else {
            onFail(response, null, "No favorites loaded for user " + userId)
        }

    });
};

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