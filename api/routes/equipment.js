const express = require("express")
const router = express.Router()

const equipmentController = require("../../controllers/equipment")

router.post('/create', equipmentController.createOrUpdate)
router.get('/read', equipmentController.readAll)
router.get('/read/:id', equipmentController.read)
router.delete('/delete/:id', equipmentController.delete)


module.exports = router;