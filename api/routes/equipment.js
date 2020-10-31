const express = require("express")
const router = express.Router()

const equipmentController = require("../../controllers/equipment")

router.post('/create', equipmentController.create)
router.get('/read', equipmentController.readAll)
router.get('/read/:id', equipmentController.read)

module.exports = router;