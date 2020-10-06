const express = require("express")
const router = express.Router();

const userController = require("../../controllers/user");

router.post('/sign-up', userController.signUpUser)

module.exports = router;
