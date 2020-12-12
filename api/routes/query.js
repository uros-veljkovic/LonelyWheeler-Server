const express = require("express")
const router = express.Router()

const queryController = require("../../controllers/query")

// router.post('/createOrDelete', offerController.createOrDelete)
// router.get('/read', offerController.read)
router.post('/', queryController.makeQuery)

module.exports = router;