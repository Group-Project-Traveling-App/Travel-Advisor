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
  
    static async getHotel(req, res, next){
        try {
            const city = req.body.city
            const limit = req.body.limit
            const api_key = process.env.TRAVELPAYOUT_API_KEY
            let find = await axios.get(`http://engine.hotellook.com/api/v2/lookup.json?query=${city}&lang=en&lookFor=city&limit=1&token=${api_key}`)
            if (find) {
                const locationId = find.data.results.locations[0].id
                let hotelList = await axios.get(`http://yasen.hotellook.com/tp/public/widget_location_dump.json?currency=usd&language=en&limit=${limit}&id=${locationId}&type=luxury&check_in=2021-01-10&check_out=2021-01-15&token=${api_key}`)
                let hotels = []
                hotelList.data.luxury.forEach(el => {
                    hotels.push({
                        id: el.hotel_id,
                        name: el.name,
                        stars: el.stars,
                        rating: el.rating,
                        summary: el.ty_summary,
                        type: el.hotel_type
                    })
                });
                let hotelsId = []
                hotels.forEach(el => {
                    hotelsId.push(`${el.id}`)
                })
                let imagesId = await axios.get(`https://yasen.hotellook.com/photos/hotel_photos?id=${hotelsId}`)
                for (let i = 0; i < hotelsId.length; i++) {
                    hotels[i].image = `https://photo.hotellook.com/image_v2/limit/${imagesId.data[hotelsId[i]][0]}/800/520.auto`
                }
                res.status(200).json(hotels)
            } else {
                throw { name: 'Invalid City'}
            }
        } catch (err) {
            console.log(err);
            res.status(404).json(err)
        }

    }
}

module.exports = ApiController