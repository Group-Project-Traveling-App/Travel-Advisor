const { User } = require('../models')
const { checkToken } = require('../helpers/jwt')

async function authentication(req, res, next) {
    try {
        const decoded = checkToken(req.headers.access_token)
        const email = decoded.email
        let find = await User.findOne({ where: { email } })
        if (find) {
            req.user = {
                id: find.id,
                email: find.email
            }
            next()
        } else {
            // throw { name: "invalidAccessToken"}
            next({status: 401})
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    authentication
}