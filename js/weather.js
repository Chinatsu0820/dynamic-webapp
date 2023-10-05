const apiKey = 'ec112e164c3b7dd3ec382aca02d7083a'; // open weather map
const dateApiKey = '65ce17885e4d4c8699532647232209'; // weather api for getting the date

/*----- to get a city name from the search bar -----*/
function clickSearch() {
    const city = document.getElementById("cityName").value;
    console.log(city);

    // insert the function about current weather
    getCurrentWeather(city);
    getCurrentDate(city);

    // insert the function about five days weather forecast
    getFiveWeather(city);
}


/*----- to save the city-name data which the user searched in local and display it on the app ------*/
function saveSearchedCity(cityName) {
    // Get history from local storage
    let cityHistory = localStorage.getItem("searchedCity");

    // Initialize an empty array if there is no history
    if (!cityHistory) {
        cityHistory = [];
    } else {
        // Parse JSON string to JavaScript array
        cityHistory = JSON.parse(cityHistory);
    }

    // Add the new city name to the beggining of the history array
    cityHistory.unshift(cityName);

    // Delete the item of the history array if there are over 5 items
    if(cityHistory.length > 5) { 
        cityHistory.pop();
    }

    // Save the new history in local storage after converting it back to JSON string
    localStorage.setItem("searchedCity", JSON.stringify(cityHistory));

    // Display the searched cities
    document.getElementById("savedCityName").textContent = cityHistory.join(", ");

   
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
    saveSearchedCity(cityName);

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
    temperatureElementHigh.textContent = `Highest : ${temperatureHigh.toFixed(2)}°C`;
    temperatureElementLow.textContent = `Lowest : ${temperatureLow.toFixed(2)}°C`;
    temperatureElementHigh.style.color = "pink";
    temperatureElementLow.style.color = "skyblue";

    //----- for weather icon ----- 
    // get the icon from openweathermap and display it on the app 
    const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    const weatherIcon = document.getElementById("displayWeather");

    weatherIcon.setAttribute('src', iconURL);
    weatherIcon.style.opacity = "100"
    weatherIcon.style.width = "10vw"
    weatherIcon.style.minWidth = "80px"


    // ----- for speed (m/sec) -----  
    // to get the wind speed from data
    const windSpeed = data.wind.speed;

    // to get element from HTML to put the temperature in it
    const windSpeedElement = document.getElementById("displayWindSpeed");

    // to display it on the app
    windSpeedElement.textContent = windSpeed + "(m/sec)";

}


/*----- to get an url of current date at the city which the user serched using fetch API -----*/
function getCurrentDate(city) {
    fetch(`https://api.weatherapi.com/v1/timezone.json?key=${dateApiKey}&q=${city}`)
        .then(response => response.json())
        .then(data => {
            console.log(data, "Got Date");
            displayCurrentDate(data);
        })
        .catch(error => {
            console.error("There is an error about date :", error);
        });

}

/*----- to display current date data -----*/
function displayCurrentDate(data) {
    const currentDate = data.location.localtime;
    const currentDateElement = document.getElementById("displayDateToday");
    currentDateElement.textContent = currentDate;
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

            // to select the data which has 12:00:00 at the end of dt.txt
            const twelveOclockData = data.list.filter(item => {
                return item.dt_txt.endsWith("12:00:00");
            });

            // Those code will be executed for each element in twelveOclockData.(= 5 )
            twelveOclockData.forEach(function (data, index) {

                // -----for temprature -----
                // to get the temp element 
                const temperatureElementFive = $(".displayTempFive").eq(index);

                // to get the temp data and convert it from Kelvin to Celsius 
                const temperatureFive = data.main.temp - 273.15;

                // to display the temp on the app
                temperatureElementFive.text(`${temperatureFive.toFixed(2)}°C`);


                // -----for icon -----
                // to get the icon element 
                const weatherIconFive = $(".displayWeatherFive").eq(index);

                // to get the icon data from the url
                const iconFiveURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

                // to display the icon on the app
                weatherIconFive.attr('src', iconFiveURL);
                weatherIconFive.css("display", "inline-block");


                // ----- for date -----
                // to get the date element 
                const dateElementFive = $(".displayDateFive").eq(index);

                // to get the date data
                const dateTimeText = data.dt_txt; // e.g. "2023-09-15 12:00:00"
                const parts = dateTimeText.split(" ")[0].split("-"); // ["2023", "09", "15"]
                const monthAndDay = `${parts[2]}/${parts[1]}`; // "09/15"

                // to display the date on the app
                dateElementFive.text(monthAndDay);


                console.log(`Day ${index + 1} - Date and Time: ${dateTimeText}`);
                console.log(`Temperature: ${temperatureFive.toFixed(2)}°C`);
                console.log(`Weather Icon URL: ${iconFiveURL}`);
            });
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error('There was a problem with the request:', textStatus, errorThrown);
        });
}

