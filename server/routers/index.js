const router = require("express").Router()
const userRouter = require("./user")
const authRouter = require('./auth')
const apiRouter = require("./apiRoutes")
const { authentication } = require('../middlewares/auth')

router.get("/", (req, res) => {
  res.send(`Hallo`)
})

router.use(authRouter)

router.use(authentication)

router.use('/', apiRouter)
router.use('/user', userRouter)

module.exports = router