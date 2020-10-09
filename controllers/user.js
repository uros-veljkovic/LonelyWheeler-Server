const mongoose = require("mongoose")

const userModule = require('../api/model/user')
const User = userModule.userModel
const PersonalInfo = userModule.personalInfoModel
const AccountInfo = userModule.accountInfoModel


exports.signUpUser = (req, res, next) => {

    const entity = req.body

    User.findOne({ "accountInfo.username": entity.accountInfo.username },
        (error, user) => {
            console.log(user)
            if (error) {
                console.log("ERROR")
                return
            } else if (user) {
                console.log("FOUND 1")
                respondRequestFail(res, null, "User with this username/email already exist !")
            } else {
                console.log("FOUND 0")
                persistAndRespond(req, res)
            }
        })

}


exports.getUserById = (req, res, next) => {
    const id = req.params.id;
    const user = User.findById(id)
    let message = "";

    if (object.exists) {
        message = "User found !"
        respondSuccess(res, user, message)
    } else {
        message = "User with this id not found !"
        respondRequestFail(res, user, message)
    }
};

exports.getAllUsers = (req, res, next) => {

    User.find({}, (error, resultObjects) => {
        if (error) {
            respondRequestFail(res, null, "Users not found !")
        } else {
            respondSuccess(res, resultObjects, "Users found !")
        }
    });
};

exports.signInUser = (req, res, next) => {
    let entity = User.findOne({
        email: req.body.email,
        password: req.body.password
    })
    if (entity.exists) {
        respondSuccess(res, entity, "SignUp successful !")
    } else {
        respondRequestFail(res, null, "SignUp failed...")
    }
};


exports.updateUser = (req, res, next) => {
    const query = { id: entity.id }
    const entity = req.body
    const options = { new: true }

    User.findOneAndUpdate(query, entity, options)
        .then(user => {
            respondSuccess(res, entity, "Profile updated successfully.")
        }).error(err => {
            respondRequestFail(res, null, "Error updating profile.")
        })
};

exports.deleteUser = (req, res, next) => {

}

function persistAndRespond(request, response) {

    const user = new User({
        ...request.body,
        _id: mongoose.Types.ObjectId(),
    })

    user.save(user).then(savedUser => {
        console.log("SignUp successful !")
        respondSuccess(response, savedUser, "SignUp successful !")
    }).catch(error => {
        console.log("SignUp UNSUCCESSFUL !")
        respondServerFail(response, null, "Server Error 505")
    });

}

function respondSuccess(response, object, message) {
    response.status(201).json({
        message: message,
        entity: object
    });
}

function respondRequestFail(response, object, message) {
    response.status(400).json({
        message: message,
        entity: object
    });
}

function respondServerFail(response, object, message) {
    response.status(500).json({
        message: message,
        entity: object
    });
}
