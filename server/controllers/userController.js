const { User } = require("../models")
const { hashPassword, compare } = require('../helpers/hashPassword')
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
        // res.status(400).json(errors)
        next({
          status: 400,
          errors: err.errors
        })
      } else {
        next(err)
        // res.status(500).json({message: `Internal Server Error`})
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
          // res.status(400).json({message: `Invalid email or password`})
          next({
            status: 400,
            errors: [
                { message: "Invalid email or password" }
            ]
        })
        }
      } else {
        // res.status(400).json({message: `Invalid email or password`})
        next({
          status: 401,
          message: "Email not found, please register first"
      })
      }
    } catch (err) {
      // res.status(500).json({message: `Internal Server Error`})
      next(err)
    }
  }

  static getUser(req, res) {
    const { email } = req.user

    User.findOne({where: {email}})
    .then(data => {
      res.status(200).json({name: data.name, email: data.email})
    })
    .catch(err => {
      if (err) {
        let errors = []
        err.errors.map(e => {
          errors.push(e.message)
        })
        res.status(400).json(errors)
      } else {
        res.status(500).json({message: `Internal Server Error`})
      }
    })
  }

  static updateUser(req, res) {
    const { name } = req.body
    const { id } = req.params
    console.log(req.user, name, id);
    User.update({ name }, {
      where: { id },
      returning: true
    })
    .then(data => {
      if (data[0] === 0) {
        throw { name: "resourceNotFound"}
      } else {
        const output = {
          name: data[1][0].name,
          email: data[1][0].email
        }
        res.status(200).json(output)
      }
    })
    .catch(err => {
      if (err) {
        res.status(400).json({message: `Something Wrong`})
      } else {
        res.status(500).json({message: `Internal Server Error`})
      }
    })
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
      // res.status(500).json({message: `Internal Server Error`})
      next(err)
    })
}

}

module.exports = UserController