const axios = require('axios')

class ApiController{
    static getZomato(req, res, next){
        //get city
        const city = 'jakarta'
        const api_key = process.env.ZOMATO_API_KEY
        const url = `https://developers.zomato.com/api/v2.1/cities?q=${city}`
        const options = {
            method: 'GET',
            headers: { 'user-key': api_key },
            url,
          };
        axios(options)
        .then(response => {
            res.status(200).json(response.data)
        })
        .catch(err => {
            console.log(err);
            // next(err)
        })
    }
}

module.exports = ApiController