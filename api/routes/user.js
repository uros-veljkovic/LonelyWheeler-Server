const express = require("express")
const router = express.Router();

const userController = require("../../controllers/user");

router.post('/sign-up', userController.signUpUser)
router.post('/sign-in', userController.signInUser)

router.get('/read', userController.readAll)
router.get('/read/:id', userController.read)

router.patch('/update', userController.updateUser)
router.delete('/delete', userController.deleteUser)


module.exports = router;
