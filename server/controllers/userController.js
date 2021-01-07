const { User } = require("../models")
const { hashPassword, compare } = require('../helpers/hashPassword')

class UserController {

  static register(req, res) {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: hashPassword(req.body.password)
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
        res.status(400).json(errors)
      } else {
        res.status(500).json({message: `Internal Server Error`})
      }
    })
  }

  static async login(req, res) {
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
          const access_token = replaceaja
          return res.status(200).json({access_token})
        } else {
          res.status(400).json({message: `Invalid email or password`})
        }
      } else {
        res.status(400).json({message: `Invalid email or password`})
      }
    } catch (err) {
      res.status(500).json({message: `Internal Server Error`})
    }
  }

  static getUser(req, res) {
    const {email} = req.body

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
    const id = req.params.id
    
    const {name} = req.body
    User.update(name, {where: {id}})
    .then(data => {
      res.status(200).json({name: data.name})
    })
    .catch(err => {
      if (err) {
        res.status(400).json({message: `Something Wrong`})
      } else {
        res.status(500).json({message: `Internal Server Error`})
      }
    })
  }

}

module.exports = UserController