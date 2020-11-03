const express = require("express")
const router = express.Router()

const offerController = require("../../controllers/offer")

// router.post('/createOrDelete', offerController.createOrDelete)
// router.get('/read', offerController.read)
router.get('/readAll', offerController.readAll)

module.exports = router;