const apiKey = 'ec112e164c3b7dd3ec382aca02d7083a'; /* ← I want to use .env  */

const weatherIcon = document.getElementById("displayWeather");
const weatherIconFive = document.getElementById("displayWeatherFive");



/*----- to get a city name from the search bar -----*/
function clickSearch() {
    const city = document.getElementById("place").value;
    console.log(city);

    // insert the function about current weather
    getCurrentWeather(city);

    // insert the function about five days weather forecast
    getFiveWeather(city);
}



/*----- to get an url of current weather using fetch API -----*/
function getCurrentWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data, "Successful");

            // to display current weather data on the app
            displayWeatherData(data);

        })
        .catch(error => {
            console.error("There is an error :", error);
        });
}



/*----- to display current weather data -----*/
function displayWeatherData(data) {

    //----- for city name -----
    // to get the city name from data
    const cityName = data.name;

    // to get element from HTML to put the city name in it
    const cityNameElement = document.getElementById("displayCityName");

    // to display it on the app
    cityNameElement.textContent = cityName;

    //----- for temprature ----- 
    // to get the temprature from data and convert from Kelvin to Celsius
    const temperatureHigh = data.main.temp_max - 273.15;
    const temperatureLow = data.main.temp_min - 273.15;

    // to get element from HTML to put the temperature in it
    const temperatureElementHigh = document.getElementById("displayTempHigh");
    const temperatureElementLow = document.getElementById("displayTempLow");

    // to adjust the number of digits after the decimal point to 2 digits, and display it on the app
    temperatureElementHigh.textContent = `${temperatureHigh.toFixed(2)}°C`;
    temperatureElementLow.textContent = `${temperatureLow.toFixed(2)}°C`;

    //----- for weather icon ----- 
    // get the icon from openweathermap and display it on the app 
    const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    weatherIcon.setAttribute('src', iconURL);


    // ----- for speed (m/sec) -----  
    // to get the wind speed from data
    const windSpeed = data.wind.speed;

    // to get element from HTML to put the temperature in it
    const windSpeedElement = document.getElementById("displayWindSpeed");

    // to display it on the app
    windSpeedElement.textContent = windSpeed + "(m/sec)";

}



/*-----  to get an url of 5 days weather forecast using Ajax -----*/
function getFiveWeather(city) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`,
        dataType: 'json',
        type: 'GET'
    })
    .done(function (data) {
        console.log(data, "Five Successful");

        // to get 5 days weather data 
        const fiveDayData = data.list.slice(1, 6);

        // to display it on the app
        fiveDayData.forEach(function (dayData, index) {
            const temperatureFive = dayData.main.temp - 273.15;
            const iconFiveURL = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;

            // to get the each element 
            const temperatureElementFive = $(".displayTempFive").eq(index);
            const weatherIconFive = $(".displayWeatherFive").eq(index);

    // to get the temprature from data and convert from Kelvin to Celsius
            temperatureElementFive.text(`${temperatureFive.toFixed(2)}°C`);
            weatherIconFive.attr('src', iconFiveURL);
        });
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error('There was a problem with the request:', textStatus, errorThrown);
    });
}
