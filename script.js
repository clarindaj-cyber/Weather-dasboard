
// 1. Select HTML elements
const searchButton = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const dateTime = document.getElementById("dateTime");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const weatherIcon = document.getElementById("weatherIcon");
const message = document.getElementById("message");


// 2. Convert weather codes into descriptions and icons
function getWeatherInfo(code, isDay) {

    const weatherTypes = {
        0: ["Clear Sky", isDay ? "☀️" : "🌙"],
        1: ["Mainly Clear", "🌤️"],
        2: ["Partly Cloudy", "⛅"],
        3: ["Overcast", "☁️"],
        45: ["Foggy", "🌫️"],
        48: ["Foggy", "🌫️"],
        51: ["Light Drizzle", "🌦️"],
        53: ["Drizzle", "🌦️"],
        55: ["Heavy Drizzle", "🌧️"],
        61: ["Light Rain", "🌦️"],
        63: ["Rain", "🌧️"],
        65: ["Heavy Rain", "🌧️"],
        71: ["Light Snow", "🌨️"],
        73: ["Snow", "🌨️"],
        75: ["Heavy Snow", "❄️"],
        80: ["Rain Showers", "🌦️"],
        81: ["Rain Showers", "🌧️"],
        82: ["Heavy Rain Showers", "⛈️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm with Hail", "⛈️"],
        99: ["Thunderstorm with Hail", "⛈️"]
    };

    return weatherTypes[code] || ["Unknown Weather", "🌡️"];
}


// 3. Get weather information for a city
async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        message.innerText = "Please enter a city name!";
        return;
    }

    message.innerText = "Loading weather information...";
    searchButton.disabled = true;

    try {

        // Step A: Find city coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to find the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please try another city.");
        }

        const location = geoData.results[0];

        // Step B: Get weather using latitude and longitude
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to get weather information.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        // Step C: Get weather description and icon
        const weatherInfo = getWeatherInfo(
            current.weather_code,
            current.is_day
        );

        // Step D: Display weather information
        cityName.innerText =
            location.name + ", " + location.country;

        temperature.innerText =
            Math.round(current.temperature_2m) + "°C";

        dateTime.innerText = new Intl.DateTimeFormat("en-US", {
            timeZone: weatherData.timezone,
            dateStyle: "full",
            timeStyle: "short"
        }).format(new Date(current.time));

        condition.innerText = weatherInfo[0];

        weatherIcon.innerText = weatherInfo[1];

        humidity.innerText =
            current.relative_humidity_2m + "%";

        wind.innerText =
            current.wind_speed_10m + " km/h";

        feelsLike.innerText =
            Math.round(current.apparent_temperature) + "°C";

        message.innerText = "Weather updated successfully!";

    } catch (error) {

        message.innerText = error.message;

    } finally {

        searchButton.disabled = false;

    }
}


// 4. Search when the button is clicked
searchButton.addEventListener("click", getWeather);


// 5. Search when Enter key is pressed
cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});


// 6. Display Coimbatore weather when website opens
cityInput.value = "Coimbatore";
getWeather();
