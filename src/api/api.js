import Icons from '../constants/icons'
import DatesMap from '../constants/dates'

/**
 * Apixu API
 * JSON and XML Weather API and Geo Developer API
 * WebSite: https://www.apixu.com/
 *
 * Base API params for requests.
 * @key {string} developer key to access API
 * @source {string} base API url
 * @forecast {string} API Method to get Forecast Data
 * @history {string} API Method to get History Data
 */
const key = '4b2eb6e1e8194cb18c2123214180705';
const source = 'https://api.apixu.com/v1/';
const forecast = 'forecast.json';
const history = 'history.json';

/**
 * Sync Weather data for selected location - City Name or Geo Coordinates.
 * @location {string} location search query - {city.name} or {lat.lon}
 * @returns {Promise<Object>}
 */
export default function syncWeather(location) {
  return getForecastData(location).then(mapForecastData);
}

/**
 * Make http requests (GET).
 * @url {string} API request address
 * @returns {Promise<Object>}
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.send();

    xhr.onload = function() {
      if (this.status === 200) {
        resolve(JSON.parse(this.response));
      } else {
        const error = new Error(this.statusText);

        error.code = this.status;
        reject(error);
      }
    };

    xhr.onerror = function() {
      reject(new Error("Network Error"));
    };
  });
}

/**
 * Get weather's current and forecast (7 days) data by location.
 * @location {string} location search query - {city.name} or {lat.lon}
 * @returns {Promise<Object>}
 */
async function getForecastData(location) {
  const url = `${source}${forecast}?key=${key}&q=${encodeURIComponent(location)}&days=7`;
  return await httpGet(url);
}

/**
 * Map weather' current and forecast data from response.
 * @Response {object} JSON response from API.
 *    => @location {object} information about founded location
 *    => @current {object} information about current weather
 *    => @forecast {object} information about 7 days forecast
 * @returns {Promise<Object>}
 */
async function mapForecastData({ location, current, forecast }){
  return {
    location: location.name,
    current: {
      date: getLocalDate(location.localtime), // Date format: Sunday, May 18th 2018
      temp_c: Math.round(current.temp_c), // current temperature C
      temp_f: Math.round(current.temp_f), // current temperature F
      condition: {
        text: current.condition.text,  // condition text
        icon: getConditionIcon(current.is_day, current.condition.code), // condition icon
      },
      history: await getHistoryData(location).then(mapHistoryData),
    },
    forecast: mapForecastDays(forecast.forecastday)
  };
}

/**
 * Map forecast data by Days.
 * @forecastDays {array} forecast information for each day.
 * @returns {object}
 */
function mapForecastDays(forecastDays) {
  return forecastDays.map(forecastDay => {
    const date = new Date(forecastDay.date);
    return {
      name: DatesMap.dayNames[date.getDay()], // day name
      temp_c: Math.round(forecastDay.day.avgtemp_c), // average temperature C
      temp_f: Math.round(forecastDay.day.avgtemp_f), // average temperature F
      icon: getConditionIcon(true, forecastDay.day.condition.code), // condition icon
    }
  })
}

/**
 * Find condition Icon from Icons constants map.
 * @isDay {boolean} used to specify is icon-day or icon-night.
 * @code {number} icon code.
 * @returns {string}
 */
function getConditionIcon(isDay, code) {
  const icon = Icons.find((icon) => icon.code === code);
  return isDay ? icon.day : icon.night;
}


/**
 * Get weather history (24 Hours) for location by selected day.
 *
 * NOTE: APIXU API free developer account has limit to 10 000 calls Per Month (on May 2018).
 *       So to avoid using 4 calls for each day time (morning / day / evening / night) here
 *       we use 1 call to retrieve information about all 24 hours for selected date
 *       and after map data from response JSON to find day time we need.
 *
 * @location {object} param contains founded location information (from getForecastData response)
 *   => @Name {string} location name - {city.name} or {lat.lon}
 *   => @localtime {string} location local time
 * @returns {Promise<Object>}
 */
async function getHistoryData({name, localtime}) {
  const historyDate = getHistoryDate(localtime);
  const url = `${source}${history}?key=${key}&q=${encodeURIComponent(name)}&dt=${historyDate}`;
  return await httpGet(url);
}

/**
 * Map Day history data by hours.
 * @forecast {object} forecast information about Day and each Hour.
 * @returns {Promise<Object>}
 */
async function mapHistoryData({ forecast }) {
  const date = forecast.forecastday[0].date;
  const hours = forecast.forecastday[0].hour;
  return {
    morning:  getHistoryTemperature(hours, `${date} 09:00`),
    day:      getHistoryTemperature(hours, `${date} 15:00`),
    evening:  getHistoryTemperature(hours, `${date} 21:00`),
    night:    getHistoryTemperature(hours, `${date} 03:00`),
  }
}

/**
 * Find Temperature information for provided day time.
 * @hours {array} forecast information for each hour.
 * @time {string} day time (morning / day / evening / night) .
 * @returns {object}
 */
function getHistoryTemperature(hours, time) {
  const { temp_c, temp_f } = hours.find((hour) => hour.time === time);
  return {
    temp_c: Math.round(temp_c),
    temp_f: Math.round(temp_f),
  };
}

/**
 * Get Date in 'Friday, May 18th 2018' format.
 * @localtime {string} param contains founded location local time (from getForecastData response)
 * @returns {string}
 */
function getLocalDate(localTime) {
  const localDate = new Date(localTime.replace(/-/g, "/")); // set 'YYYY/MM/DD' format for new Date() support in safari
  const weekday = DatesMap.dayNames[localDate.getDay()];
  const month = DatesMap.monthNames[localDate.getMonth()];
  const date = localDate.getDate();
  const datePrefix = getDayPrefix(date);
  const year = localDate.getFullYear();

  return `${weekday}, ${month} ${date}${datePrefix} ${year}`;
}

/**
 * Get Prefix for month's date - 1st / 2nd / 7th ...
 * @day {number} month's date number
 * @returns {string}
 */
function getDayPrefix(date) {
  if(date>3 && date<21) return 'th';
  switch (date % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}

/**
 * Get Date in 'YYYY-MM-DD' format for correct History Data Request.
 * @localtime {string} param contains founded location local time (from getForecastData response)
 * @returns {string}
 */
function getHistoryDate(localTime) {
  const localDate = new Date(localTime.replace(/-/g, "/")); // set 'YYYY/MM/DD' format for new Date() support in safari
  const year = localDate.getFullYear();
  const date = ('0' + localDate.getDate()).slice(-2);
  const month = ('0' + (localDate.getMonth() + 1)).slice(-2);

  return `${year}-${month}-${date}`;
}
