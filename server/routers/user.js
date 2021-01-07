const router = require("express").Router()
const UserController = require("../controllers/userController")

router.get("/", UserController.getUser)

router.patch("/:id", UserController.updateUser)

module.exports = router