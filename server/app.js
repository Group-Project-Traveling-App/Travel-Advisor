if (process.env.NODE_ENV === "development"){
  require('dotenv').config()
}

const express = require("express")
const cors = require("cors")
const app = express()
const router = require("./routers")
const port = 3000

app.use(express.urlencoded({extended: false}))

app.use(cors())
app.use(router)

app.listen(port, () => {
  console.log(`App is running on port ${port}`)
})