const express = require('express');
const server = express();

const mongoose = require("mongoose")
const uri = "mongodb+srv://urkeev14:JKAr1brliXRVlugt@lonely-wheeler.ehdx9.mongodb.net/lonely-wheeler-db?retryWrites=true&w=majority"

const bodyParser = require('body-parser')

const userRoutes = require('./api/routes/user')
const productRoutes = require('./api/routes/product');

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("================================")
        console.log("\tMongoDB connected")
        console.log("================================")

        server.use(bodyParser.json({ limit: '50mb' }))
        server.use('/users', userRoutes);
        server.use('/products', productRoutes);

        server.listen(3000);
    }
    )
    .catch((error) =>
        console.log("SOME SHIT\n" + error)
    )