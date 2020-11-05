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

    UserModel.find({}, (error, resultObjects) => {
        if (error) {
            onFail(response, null, "Users not found !")
        } else {
            onSuccess(response, resultObjects, "Users found !")
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
