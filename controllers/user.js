const mongoose = require("mongoose")

const userModule = require('../api/model/user')
const userLikingSellerModule = require('../api/model/liked-seller')
const { query } = require("express")

const UserModel = userModule.userModel
const MotorVehicleModel = require('../api/model/motor-vehicle')
const PedestrianVehicleModel = require('../api/model/pedestrian-vehicle')
const EquipmentModel = require('../api/model/equipment')
const LikedOffersModel = require('../api/model/liked-offer')
const UserLikingSellerModel = userLikingSellerModule.userLikingSellerModel


exports.signInUser = (request, response, next) => {
    const entity = request.body

    UserModel.findOne({
        "accountInfo.email": entity.accountInfo.email,
        "accountInfo.password": entity.accountInfo.password
    },
        (error, user) => {
            if (error) {
                onFail(response, null, "SERVER ERROR", 500)
            } else if (user) {
                onSuccess(response, user, "Hello " + user.accountInfo.username + " !", 200)
            } else {
                onFail(response, null, "Sign in FAILED !", 400)
            }
        })
};

exports.signUpUser = (request, response, next) => {

    const entity = request.body

    // const query = { "accountInfo.username": entity.accountInfo.username }
    const query = {
        $or: [
            { "accountInfo.username": entity.accountInfo.username },
            { "accountInfo.email": entity.accountInfo.email }
        ]
    }

    UserModel.findOne(query,
        (error, user) => {
            if (error) {
                onFail(response, null, "SERVER ERROR", 500)
                return
            } else if (user) {
                onFail(response, null, "Username/Email already exists !", 400)
            } else {
                persistAndRespond(request, response)
            }
        })

}

function persistAndRespond(request, response) {

    const user = new UserModel({
        ...request.body,
        _id: mongoose.Types.ObjectId(),
    })

    user.save(user).then(savedUser => {
        console.log("SignUp successful !")
        onSuccess(response, savedUser, "SignUp successful !", 200)
    }).catch(error => {
        console.log("SignUp UNSUCCESSFUL !")
        onFail(response, null, "Server Error 505", 400)
    });

}


exports.read = (request, response, next) => {
    const userId = request.params.id

    UserModel.findById(userId, function (error, user) {
        if (user) {
            onSuccess(response, user, "User found !", 200)
        } else if (error) {
            onFail(response, null, "ERROR loading user with id " + userId)
        } else {
            onFail(response, null, "No users found with id!" + userId)
        }

    });
};

exports.readAll = (request, response, next) => {
    UserModel.find(
        {},
        '_id accountInfo.picture accountInfo.username',
        (error, resultObjects) => {
            if (resultObjects) {
                onSuccess(response, resultObjects, "Users found !", 200)
            } else {
                onFail(response, null, "Users not found !")
            }
        });
};

exports.isLiked = (request, response, next) => {
    const userID = request.params.userID
    const sellerID = request.params.sellerID

    // console.log(entity)

    const query = { "userID": userID, "sellerID": sellerID }

    UserLikingSellerModel.findOne(query, function (err, doc) {
        if (err) {
            // console.log("isLiked: ERROR -> " + err)
            onFail(response, null, "Server failed to fetch data about liking this user.", 500)
        } else {
            // console.log("isLiked: DOC -> " + doc)
            onSuccess(response, doc, "", 200)
        }
    })
}

exports.rateCounter = async function (request, response, next) {
    const sellerID = request.params.userID

    //In collection UserLikingSellerModel count every document which has this specific sellerID
    // count liked, and then separately dislikes and return that 
    const queryLikes = { sellerID: sellerID, liked: true }
    const queryDislikes = { sellerID: sellerID, disliked: true }

    const liked = await UserLikingSellerModel.countDocuments(queryLikes).exec()
    const disliked = await UserLikingSellerModel.countDocuments(queryDislikes).exec()

    const entity = { userId: sellerID, likes: liked, dislikes: disliked }
    console.log(entity)

    onSuccess(response, entity, "", 200)
}

exports.like = (request, response, next) => {
    const entity = request.body

    console.log(entity)

    const userID = entity.userID
    const sellerID = entity.sellerID

    const query = { userID: userID, sellerID: sellerID }
    const options = { new: true, upsert: true }

    UserLikingSellerModel.findOneAndUpdate(query, entity, options,
        function (error, doc) {
            if (doc) {
                onSuccess(response, doc, "", 200)
            } else {
                onFail(response, null, "Error liking this seller.", 500)
            }
        }
    )
}

exports.dislike = (request, response, next) => {
    const entity = request.body

    console.log(entity)

    const userID = entity.userID
    const sellerID = entity.sellerID

    const query = { userID: userID, sellerID: sellerID }
    const options = { new: true, upsert: true }

    UserLikingSellerModel.findOneAndUpdate(query, entity, options,
        function (error, doc) {
            if (doc) {
                onSuccess(response, doc, "", 200)
            } else {
                onFail(response, null, "Error liking this seller.", 500)
            }
        }
    )
}

exports.updateUser = (request, response, next) => {
    const query = { id: entity.id }
    const entity = request.body
    const options = { new: true }

    UserModel.findOneAndUpdate(query, entity, options)
        .then(user => {
            onSuccess(response, entity, "Profile updated successfully.", 200)
        }).error(error => {
            onFail(response, null, "Error updating profile.", 500)
        })
};

exports.deleteUser = (request, response, next) => {
    const entityID = request.params.id

    UserModel.deleteMany({ _id: entityID }).exec()

    MotorVehicleModel.deleteMany({ sellerId: entityID }).exec()
    PedestrianVehicleModel.deleteMany({ sellerId: entityID }).exec()
    EquipmentModel.deleteMany({ sellerId: entityID }).exec()

    LikedOffersModel.deleteMany({ userId: entityID }).exec()
    UserLikingSellerModel.deleteMany({ $or: [{ userID: entityID }, { sellerId: entityID }] }).exec()

    onSuccess(response, null, "", 200)

}



function onSuccess(response, object, message, code) {
    if (message !== "") {
        prettyPrint(message, "$", 5)
    }
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
