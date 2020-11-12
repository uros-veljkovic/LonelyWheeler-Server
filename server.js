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
        prettyPrint("SERVER STARTED !", "-", 5);


        server.use(bodyParser.json({ limit: '100mb' }))

        server.use('/users', userRoutes);
        server.use('/motor-vehicles', motorVehicleRoutes);
        server.use('/equipment', equipmentRoutes)
        server.use('/pedestrian-vehicles', pedestrianVehicleRoutes)
        server.use('/liked-offer', likedOfferRoutes)
        server.use('/offer', offerRouter)

        server.listen(process.env.PORT || 5050);
    })
    .catch((error) =>
        prettyPrint("ERROR STARTING SERVER", "+", 5)
    )

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
