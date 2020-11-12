const mongoose = require("mongoose")

const userModule = require('../api/model/user')
const UserModel = userModule.userModel


exports.signInUser = (request, response, next) => {
    const entity = request.body

    // console.log(entity)

    UserModel.findOne({
        "accountInfo.email": entity.accountInfo.email,
        "accountInfo.password": entity.accountInfo.password
    },
        (error, user) => {
            // console.log(user)
            if (error) {
                onFail(response, null, "SERVER ERROR")
            } else if (user) {
                onSuccess(response, user, "Sign in SUCCESSFUL !")
            } else {
                onFail(response, null, "Sign in FAILED !")
            }
        })
};

exports.signUpUser = (request, response, next) => {

    const entity = request.body

    // console.log(entity)

    UserModel.findOne({ "accountInfo.username": entity.accountInfo.username },
        (error, user) => {
            // console.log(user)
            if (error) {
                onFail(response, null, "SERVER ERROR")
                return
            } else if (user) {
                onFail(response, null, "Username/Email already exists !")
            } else {
                persistAndRespond(request, response)
            }
        })

}


exports.read = (request, response, next) => {
    const userId = request.params.id

    UserModel.findById(userId, function (error, user) {
        if (user) {
            onSuccess(response, user, "User found !")
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
                onSuccess(response, resultObjects, "Users found !")
            } else {
                onFail(response, null, "Users not found !")
            }
        });
};


exports.updateUser = (request, response, next) => {
    const query = { id: entity.id }
    const entity = request.body
    const options = { new: true }

    UserModel.findOneAndUpdate(query, entity, options)
        .then(user => {
            onSuccess(response, entity, "Profile updated successfully.")
        }).error(error => {
            onFail(response, null, "Error updating profile.")
        })
};

exports.deleteUser = (request, response, next) => {

    const entity = request.body

}

function persistAndRespond(request, response) {

    const user = new UserModel({
        ...request.body,
        _id: mongoose.Types.ObjectId(),
    })

    user.save(user).then(savedUser => {
        console.log("SignUp successful !")
        onSuccess(response, savedUser, "SignUp successful !")
    }).catch(error => {
        console.log("SignUp UNSUCCESSFUL !")
        onFail(response, null, "Server Error 505")
    });

}

function onSuccess(response, object, message) {
    prettyPrint(message, "$", 5)
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
