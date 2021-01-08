const router = require("express").Router()
const ApiController = require('../controllers/apiController')

router.post('/restaurants', ApiController.getZomato)

router.get('/weathers', ApiController.getWeather)

router.get('/hotels', ApiController.getHotel)

module.exports = router