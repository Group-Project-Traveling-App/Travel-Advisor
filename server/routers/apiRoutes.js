const router = require("express").Router()
const ApiController = require('../controllers/apiController')

router.post('/restaurants', ApiController.getZomato)


module.exports = router