const express = require('express');
const server = express();

const mongoose = require("mongoose")
const uri = "mongodb+srv://urkeev14:JKAr1brliXRVlugt@lonely-wheeler.ehdx9.mongodb.net/lonely-wheeler-db?retryWrites=true&w=majority"

const bodyParser = require('body-parser')

const userRoutes = require('./api/routes/user')
const motorVehicleRoutes = require('./api/routes/motor-vehicle');
const equipmentRoutes = require('./api/routes/equipment')
const pedestrianVehicleRoutes = require('./api/routes/pedestrian-vehicle')
const likedOfferRoutes = require('./api/routes/liked-offer')
const offerRouter = require('./api/routes/offer')

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("================================")
        console.log("\tMongoDB connected")
        console.log("================================")

        server.use(bodyParser.json({ limit: '50mb' }))

        server.use('/users', userRoutes);
        server.use('/motor-vehicles', motorVehicleRoutes);
        server.use('/equipment', equipmentRoutes)
        server.use('/pedestrian-vehicles', pedestrianVehicleRoutes)
        server.use('/liked-offer', likedOfferRoutes)
        server.use('/offer', offerRouter)

        server.listen(process.env.PORT || 5050);
    })
    .catch((error) =>
        console.log("SOME SHIT\n" + error)
    )