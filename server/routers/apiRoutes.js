const router = require("express").Router()
const ApiController = require('../controllers/apiController')

router.get('/restaurants', ApiController.getZomato)


module.exports = router