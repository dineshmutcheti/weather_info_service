const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Weather Information Service');
});

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).send('City is required');
    }

    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`);
        const data = response.data;

        if (response.status !== 200) {
            return res.status(response.status).send(data.message);
        }

        res.json({
            location: data.name,
            temperature: data.main.temp,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            wind_speed: data.wind.speed,
        });
    } catch (error) {
        res.status(500).send('Error fetching weather data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
