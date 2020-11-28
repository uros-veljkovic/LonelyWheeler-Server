const express = require('express')
const router = express.Router();

const pedestrianVehicleController = require('../../controllers/pedestrian-vehicle');

router.post('/create', pedestrianVehicleController.createOrUpdate);
router.get('/read', pedestrianVehicleController.readAll);
router.get('/read/:id', pedestrianVehicleController.read)
router.delete('/delete/:id', pedestrianVehicleController.delete)

module.exports = router;