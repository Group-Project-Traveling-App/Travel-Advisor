const { User } = require("../models")
const { compare } = require('../helpers/hashPassword')
const { generateToken } = require('../helpers/jwt')
const { OAuth2Client } = require('google-auth-library');

class UserController {

  static register(req, res, next) {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }

    User.create(newUser)
    .then(user => {
      let output = {
        name: user.name,
        email: user.email
      }
      res.status(201).json(output)
    })
    .catch(err => {
      if (err) {
        let errors = []
        err.errors.map(e => {
          errors.push(e.message)
        })
        next({
          status: 400,
          errors: err.errors
        })
      } else {
        next(err)
      }
    })
  }

  static async login(req, res, next) {
    try {
      const {email, password} = req.body

      const user = await User.findOne({where: {email}})

      if (user) {
        const matchPassword = compare(password, user.password)
        
        if (matchPassword) {
          const payload = {
            id: user.id,
            email: user.email
          }
          const access_token = generateToken(payload)
          return res.status(200).json({access_token})
        } else {
          next({
            status: 400,
            errors: [
                { message: "Invalid email or password" }
            ]
        })
        }
      } else {
        next({
          status: 401,
          message: "Email not found, please register first"
      })
      }
    } catch (err) {
      next(err)
    }
  }

  static handleGoogleLogin(req, res, next){
    const { id_token } = req.body
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    let email
    let name

    client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    .then(ticket => {
      const payload = ticket.getPayload()
      email = payload.email
      name = payload.name
      return User.findOne({
          where: {
              email
          }
      })
    })
    .then(data => {
      if(!data){
          return User.create({
              email,
              name,
              password: Math.random()*1000+'traveladvisor'
          })
      } else {
          return data
      }
    })
    .then(data => {
      let access_token = generateToken({
          id: data.id,
          email: data.email
      })
      res.status(200).json({access_token})
    })
    .catch(err => {
      next(err)
    })
}

}

module.exports = UserController