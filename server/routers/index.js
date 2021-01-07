const router = require("express").Router()
const auth = require("./user")

router.get("/", (req, res) => {
  res.send(`Hallo`)
})

router.use("/", auth)

module.exports = router