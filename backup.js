const apiKey = 'a71e1dbc556af89167017b8f90cda21e';

async function getGeo (city) {
	 https:openweathermap.org/api/geocoding-api
	const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
	const response = await fetch(geoUrl);
	const data = await response.json();
	console.log(data);
	console.log(data[0]['name']);
	console.log(data[0]['country']);
	console.log(data[0]['lat']);
	console.log(data[0]['lon']);
	return data[0];
}

getGeo('London'); // 51.5073219 -0.1276474

async function getWeatherCurrent(lat, lon) {
	https:openweathermap.org/current
	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
	const response = await fetch(url);
	const data = await response.json();
	console.log(data);
	console.log(data.main.temp);
	console.log(data.weather[0]['description']);
	console.log('Wind speed', data.wind.speed);
	return data;
}

getWeatherCurrent(51.5073219, -0.1276474);

async function getWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
	const response = await fetch(url);
	const data = await response.json();
	console.log(data);
	return data;
}

getWeather(51.5073219, -0.1276474);
