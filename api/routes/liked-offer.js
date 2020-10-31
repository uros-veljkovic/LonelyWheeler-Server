const express = require("express")
const router = express.Router()

const likedOfferController = require("../../controllers/liked-offer")

router.post('/createOrDelete', likedOfferController.createOrDelete)
router.get('/read', likedOfferController.read)
router.get('/readAll', likedOfferController.readAll)

module.exports = router;