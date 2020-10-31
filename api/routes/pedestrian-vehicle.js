const express = require('express')
const router = express.Router();

const pedestrianVehicleController = require('../../controllers/pedestrian-vehicle');

router.post('/create', pedestrianVehicleController.create);
router.get('/read', pedestrianVehicleController.readAll);
router.get('/read/:id', pedestrianVehicleController.read)

module.exports = router;