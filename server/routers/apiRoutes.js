const router = require("express").Router()
const ApiController = require('../controllers/apiController')

router.post('/restaurants', ApiController.getZomato)

router.post('/hotels', ApiController.getHotel)

module.exports = router