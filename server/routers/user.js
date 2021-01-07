const router = require("express").Router()
const UserController = require("../controllers/userController")

router.post("/register", UserController.register)
router.get("/login", UserController.login)
router.get("/user", UserController.getUser)
router.put("/user/:id", UserController.updateUser)

module.exports = router