const express = require("express")
const router = express.Router();

const userController = require("../../controllers/user");

router.post('/sign-up', userController.signUpUser)
router.post('/sign-in', userController.signInUser)
router.post('/like', userController.like)
router.post('/dislike', userController.dislike)

router.get('/read', userController.readAll)
router.get('/read/:id', userController.read)
router.get('/:userID/likedOrDisliked/:sellerID', userController.isLiked)
router.get('/:userID/rateCounter', userController.rateCounter)

router.patch('/update', userController.updateUser)
router.delete('/delete', userController.deleteUser)


module.exports = router;
