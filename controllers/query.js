const mongoose = require("mongoose")
const OfferModel = require('../api/model/offer')
const MotorVehicleModel = require('../api/model/motor-vehicle')
const PedestrianVehicleModel = require('../api/model/pedestrian-vehicle')
const EquipmentModel = require('../api/model/equipment')

exports.makeQuery = async function (request, response, next) {

    const returnFields = "basicInfo pictures"

    const body = request.body
    console.log(body)

    const brand = { $regex: '.*' + body.brand + '.*' }
    const model = { $regex: '.*' + body.model + '.*' }
    const minYearOfProduction = body.yearOfProduction.min
    const maxYearOfProduction = body.yearOfProduction.max
    const minPrice = body.price.min
    const maxPrice = body.price.max
    const dateModified = body.dateModified

    const query = {
        "basicInfo.brand": brand,
        "basicInfo.model": model,
        "basicInfo.dateModified": { $gte: dateModified },
        "basicInfo.yearOfProduction": {
            $gte: minYearOfProduction,
            $lte: maxYearOfProduction
        },
        "basicInfo.value": {
            $gte: minPrice,
            $lte: maxPrice
        }
    }

    const entities1 = await MotorVehicleModel.find(query, returnFields).exec()
    const entities2 = await PedestrianVehicleModel.find(query, returnFields).exec()
    const entities3 = await EquipmentModel.find(query, returnFields).exec()

    let array = [entities1, entities2, entities3]

    const arrayFlattened = flatten(array)
    // console.log(arrayFlattened)

    onSuccess(response, arrayFlattened, "Sellers offers loaded successfully !", 200)

};

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

function onSuccess(response, object, message, code) {
    // prettyPrint(message, "#", 5)
    response.status(code).json({
        code: code,
        message: message,
        entity: object
    });
}

function onFail(response, object, message, code) {
    // prettyPrint(message, "!", 5)
    response.status(200).json({
        code: code,
        message: message,
        entity: object
    });
}