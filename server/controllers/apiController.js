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
            next(err)
        })
    }

    static getWeather(req, res, next){
        const params = {
        access_key: process.env.WEATHERSTACK_API_KEY,
        query: req.body.city
        }

        axios.get('http://api.weatherstack.com/current', {params})
        .then(response => {
            const location = response.data.location
            const weather = response.data.current
            const result = {
                city: location.name,
                region: `${location.region}, ${location.country}`,
                temperature: weather.temperature,
                weather_icons: weather.weather_icons,
                weather_descriptions: weather.weather_descriptions,
                humidity: weather.humidity,
                cloudcover: weather.cloudcover
            };
            res.status(200).json(result);
        }).catch(error => {
            res.status(404).json({ message: "City not found" })
        });
    }

    static async getHotel(req, res, next){
        try {
            const city = req.body.city
            const limit = req.body.limit
            const api_key = process.env.TRAVELPAYOUT_API_KEY
            let find = await axios.get(`http://engine.hotellook.com/api/v2/lookup.json?query=${city}&lang=en&lookFor=city&limit=1&token=${api_key}`)
            if (find) {
                const locationId = find.data.results.locations[0].id
                // console.log(locationId);
                let hotelList = await axios.get(`http://yasen.hotellook.com/tp/public/widget_location_dump.json?currency=usd&language=en&limit=${limit}&id=${locationId}&type=luxury&check_in=2021-01-10&check_out=2021-01-15&token=${api_key}`)
                let hotels = []
                hotelList.data.luxury.forEach(el => {
                    hotels.push({
                        name: el.name,
                        stars: el.stars,
                        rating: el.rating,
                        summary: el.ty_summary,
                        type: el.hotel_type
                    })
                });
                res.status(200).json(hotels)
            } else {
                throw { name: 'Invalid City'}
            }
        } catch (err) {
            // console.log(err);
            res.status(404).json(err)
        }

    }
}

module.exports = ApiController