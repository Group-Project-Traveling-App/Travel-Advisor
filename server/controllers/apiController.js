const axios = require('axios')

class ApiController{
    static getZomato(req, res, next){
        const city = req.body.city 
        if (!city){
            next({
                status: 400,
                message: "Please insert city"
            })
        }
        const api_key = process.env.ZOMATO_API_KEY
        const url = `https://developers.zomato.com/api/v2.1/locations?query=${city}`
        const options = {
            method: 'GET',
            headers: { 'user-key': api_key },
            url,
        };
        let restaurant    
        let weather    
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
        .then( response => {
            let result = []
            response.data.restaurants.forEach(el => {
                result.push({
                    name: el.restaurant.name,
                    imgUrl: el.restaurant.featured_image,
                    url: el.restaurant.url,
                    locality: el.restaurant.location.locality,
                    city: el.restaurant.location.city,
                    rating: el.restaurant.user_rating.aggregate_rating,
                    votes: el.restaurant.user_rating.votes
                })
            });
            restaurant = result
            const apiKey = process.env.WEATHER_API_KEY
            const unit = "metric";
            const url =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
            return axios({
                method: 'GET',
                url: url,
            })
        })
        .then(response => {
            let result = [{
                city: response.data.name,
                description: response.data.weather[0].description,
                icon: response.data.weather[0].icon,
                temp: response.data.main.temp
            }]

            weather = result
            console.log(result);
            res.status(200).json({
                restaurant,
                weather
            })
        })
        .catch(err => {
            next(err)
        })
    }

}

module.exports = ApiController