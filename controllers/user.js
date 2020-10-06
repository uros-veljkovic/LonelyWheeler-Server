const mongoose = require("mongoose")

const userModule = require('../api/model/user')
const User = userModule.userModel
const PersonalInfo = userModule.personalInfoModel
const AccountInfo = userModule.accountInfoModel

exports.getUserById = (req, res, next) => {
    const id = req.params.id;
    const user = User.findById(id)
    let message = "";

    if (object.exists) {
        message = "User found !"
        respondSuccess(res, user, message)
    } else {
        message = "User with this id not found !"
        respondFail(res, user, message)
    }
};

function respondSuccess(response, object, message) {
    response.status(201).json({
        object: object,
        message: message
    });
}

function respondFail(response, object, message) {
    response.status(400).json({
        object: object,
        message: message
    });
}

exports.getAllUsers = (req, res, next) => {

    User.find({}, (error, resultObjects) => {
        if (error) {
            respondFail(res, null, "Users not found !")
        } else {
            respondSuccess(res, resultObjects, "Users found !")
        }
    });
};


exports.signUpUser = (req, res, next) => {

    let entity = req.body

    User.find().or([
        { username: entity.username },
        { email: entity.email }
    ])
        .then(() =>
            respondFail(res, null, "User with this username/email already exist !")
        )
        .catch(() =>
            persistAndRespond(res, entity, "Sign up successful !", "Sing up failed (server error)")
        )

};


exports.signInUser = (req, res, next) => {
    let entity = User.findOne({
        email: req.body.email,
        password: req.body.password
    })
    if (entity.exists) {
        respondSuccess(res, entity, "SignUp successful !")
    } else {
        respondFail(res, null, "SignUp failed...")
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
            respondFail(res, null, "Error updating profile.")
        })
};

exports.deleteUser = (req, res, next) => {

}

function persistObjectFromRequestAndRespond(req, res) {
    const body = req.body
    const personal_info = body.personal_info
    const account_info = body.account_info

    const user = new User({
        _id: mongoose.Types.ObjectId(),
        personalInfo: new PersonalInfo({
            firstName: personal_info.first_name,
            lastName: personal_info.last_name,
            city: personal_info.city,
            street: personal_info.street,
            mobileNumber: personal_info.mobile_number,
        }),
        accountInfo: new AccountInfo({
            username: account_info.username,
            email: account_info.email,
            password: account_info.password,
            picture: account_info.picture,
            timesSupported: 0,
            timesReported: 0,
            offersLiked: null,
            myOffers: null,
        }
        )
    })

    saveAndRespond(user, res)
}

function persistAndRespond(object, response, messageSuccess, messageFail) {
    object.save().then(result => {
        response.status(201).json({
            message: messageSuccess,
            object: result
        });
    }).catch(error => {
        response.status(500).json({
            message: messageFail,
            object: null
        });
    });
}

