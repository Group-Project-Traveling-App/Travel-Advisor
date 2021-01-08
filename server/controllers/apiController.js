const axios = require('axios')

class ApiController{
    static getZomato(req, res, next){
        const city = req.body.city
        const api_key = process.env.ZOMATO_API_KEY
        const url = `https://developers.zomato.com/api/v2.1/locations?query=${city}`
        const options = {
            method: 'GET',
            headers: { 'user-key': api_key },
            url,
          };
        axios(options)
        .then(response => {
            const entity_id = response.data.location_suggestions[0].entity_id
            const url2 = `https://developers.zomato.com/api/v2.1/search?entity_id=${entity_id}&entity_type=city`
            return axios({
                method: 'GET',
                headers: { 'user-key': api_key },
                url: url2
            })
        })
        .then(response=> {
            res.status(200).json(response.data.restaurants)
        })
        .catch(err => {
            console.log(err);
            // next(err)
        })
    }
}

module.exports = ApiController