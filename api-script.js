const apikey = "b5ead4eb00824616bcc185039232604";
const url = "http://api.weatherapi.com/v1/forecast.json?key=" + apikey + "&q=";
const searchBarInput = document.getElementById("search-form");

function apiCall(link) {
    fetch(link)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const weatherData = {
                name: data.location.name,
                coords: [data.location.lat, data.location.lon],
                currentTemp: {
                    temp_c: data.current.temp_c,
                    condition: data.current.condition,

                },
                todayForecast: data.forecast.forecastday[0],
                todayConditions: data.current,
                sevenDayForecast: data.forecast.forecastday,
            }
            console.log(weatherData);
            setValues(weatherData);
        }).catch(err => {
        console.log(err);
        alert("An error occured while fetching weather data from the api");
    });
}
searchBarInput.addEventListener("submit", function (event) {
    event.preventDefault();
    const city = searchBarInput.elements.city.value;
    searchBarInput.elements.city.value = "";
    apiCall(url + city +"&days=7");
});

/**
 * The fillTodayForecast function takes in the todayForecast object and fills the HTML elements with data from that object.
 *
 *
 * @param todayForecast Get the data from the api
 *
 * @return
 *
 *
 */

function fillTodayForecast(todayForecast) {
    const todayData = todayForecast['hour']
    const todayCast = [todayData[6], todayData[9], todayData[12], todayData[15], todayData[18], todayData[21]];
    let temp, tempIcon, icon, cityTemp;
    const timeMap = {
        "06:00": ["city-img-six", "city-temp-six"],
        "09:00": ["city-img-nine", "city-temp-nine"],
        "12:00": ["city-img-twelve", "city-temp-twelve"],
        "15:00": ["city-img-three", "city-temp-three"],
        "18:00": ["city-img-sixpm", "city-temp-sixpm"],
        "21:00": ["city-img-ninepm", "city-temp-ninepm"]
    };
    const elements = Object.keys(timeMap).reduce((acc, key) => {
        acc[key] = {
            icon: document.getElementById(timeMap[key][0]),
            temp: document.getElementById(timeMap[key][1])
        };
        return acc;
    }, {});

    todayCast.forEach(day => {
        temp = `${Math.floor(Number(day.temp_c))}º`;
        tempIcon = day.condition.icon;
        const [hour, minute] = day.time.split(" ")[1].split(":");
        const { icon, temp: cityTemp } = elements[`${hour}:${minute}`];
        icon.src = tempIcon;
        cityTemp.textContent = temp;
    });
}

function fillAirConditions(todayConditions) {
    const realFeelVal = document.getElementById("real-feel-val");
    const windVal = document.getElementById("wind-val");
    const uv = document.getElementById("uv-val");
    realFeelVal.innerText = `${Math.floor(Number(todayConditions.feelslike_c))}°`;
    windVal.innerText = `${Math.floor(Number(todayConditions.wind_kph))} K/PH`;
    uv.innerText = todayConditions.uv;
}
function fillCitySection(weatherData) {
    const cityName = document.getElementById("city-name");
    const rainChance = document.getElementById("chance-of-rain");
    const cityTemperature = document.getElementById("city-temp");
    const cityTempIcon = document.getElementById("cityImage");
    const chanceOfRain = document.getElementById("rain-chance-val");
    const { name, currentTemp, todayForecast } = weatherData;
    const temp = `${Math.floor(Number(currentTemp.temp_c))}º`;

    cityName.textContent = name;
    cityTemperature.textContent = temp;
    cityTempIcon.src = currentTemp.condition.icon;
    rainChance.innerText = `Chance of rain: ${todayForecast.day.daily_chance_of_rain}%`;
    chanceOfRain.innerText = `${todayForecast.day.daily_chance_of_rain}%`;
}
function fillForecast(forecastData) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dayVal, tempVal, code, codeImg;

    let date;// new Date(forecastData[0].date.replace(/-/g, '/'));
    let day = "";

    for (let i = 0; i < forecastData.length; i++) {
        if(i===0){
            date = new Date(forecastData[0].date.replace(/-/g, '/'));
            day="Today";
        }else {
            date = new Date(forecastData[i].date.replace(/-/g, '/'));
            day = weekday[date.getDay()];
        }
        dayVal = document.getElementById(`n${i}`);
        dayVal.innerHTML = day;

        tempVal = document.getElementById(`n${i}-temp`);
        tempVal.innerHTML = `${Math.floor(Number(forecastData[i].day.maxtemp_c))}º / ${Math.floor(Number(forecastData[i].day.mintemp_c))}º`;

        code = document.getElementById(`n${i}-code`);
        codeImg = document.getElementById(`n${i}-img`);
        code.innerHTML = forecastData[i].day.condition.text;
        codeImg.src = forecastData[i].day.condition.icon;
    }
}
function setValues(weatherData) {
    fillCitySection(weatherData);
    fillTodayForecast(weatherData.todayForecast);
    fillAirConditions(weatherData.todayConditions);
    fillForecast(weatherData.sevenDayForecast);

}


apiCall(url+"Winnipeg&days=7");
