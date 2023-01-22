const apiKey = 'a71e1dbc556af89167017b8f90cda21e';
const form = document.querySelector('#form');
const input = document.querySelector('#inputCity');
const content = document.querySelector('.content');


renderHistory();

form.onsubmit = submitHandler;

function submitHandler (e) {
	e.preventDefault();

	content.innerHTML = '';
	let city = input.value.trim();

	input.value = '';

    showWeather(city);
}

async function showWeather(city) {

	saveHistory(city);
	renderHistory();

	const cityInfo = await getGeo(city); // 51.5073219 -0.1276474

	const weatherInfo = await getWeather(cityInfo.lat, cityInfo.lon);
	const currentWeather = parseCurrentWeather(weatherInfo);
	renderCurrentWeather(cityInfo, currentWeather);
	const nextDaysWeather = findNextDaysWeather(weatherInfo);
	renderNextDays(nextDaysWeather);
};


async function getGeo (city) {
	`https://openweathermap.org/api/geocoding-api`
	const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
	const response = await fetch(geoUrl);
	const data = await response.json();
    console.log('getGeo', data);

    const object = {
		name: data[0]['name'],
		country: data[0]['country'],
		lat: data[0]['lat'],
		lon: data[0]['lon'],
	};

	return object;
}

async function getWeather(lat, lon) {
	const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
	const response = await fetch(url);
	const data = await response.json();
	console.log('getWeather', data);
	return data;
}

function parseCurrentWeather (data) {
    const current = data.list[0];
    console.log('current', current);

    const object = {
        city: data.city.name,
        time: current.dt,
        temp: current.main.temp,
        desc: current.weather[0]['description'],
        wind: current.wind.speed,
        icon: current.weather[0]['icon'],
    };

    console.log('object', object);
    return object;
}

function renderCurrentWeather(cityInfo, currentWeather) {
	const date = new Date(currentWeather.time * 1000).toLocaleDateString('en'); 
	const icon = `http://openweathermap.org/img/wn/${currentWeather.icon}.png `;

	const card = `<div class="card card--wide">
                <h2 class="title">
                    ${cityInfo.name}
                    <span class="title__date">${date}</span>
                    <span class="weather-icon"><img src="${icon}" alt="Weather"></span>
                </h2>

                <ul class="details">
                    <li class="details__item">${currentWeather.temp}°f</li>
                    <li class="details__item">${currentWeather.desc}</li>
                    <li class="details__item">wind ${currentWeather.wind} м/с</li>
                </ul>
            </div>`;

	content.insertAdjacentHTML('afterbegin', card);
}

function findNextDaysWeather(findNextDay) {
    console.log('today', new Date());
	const tomorrow = new Date();
	tomorrow.setUTCDate(tomorrow.getDate() + 1);
    tomorrow.setUTCHours(12, 0, 0, 0)
    console.log('tomorrow', tomorrow);

    const days = []

    for (let index = 1; index < 6; index++){
        let nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + index);
        nextDay.setHours(12, 0, 0, 0);
        console.log('nextDay', nextDay);
        days.push(nextDay.getTime());
    }

    console.log(days);

    const nextDaysWeather = findNextDay.list.filter((item)=>{

        for (const day of days) {
            if (item.dt * 1000 === day) {
                return true;
			}
		}
    })

    console.log('nextDaysWeather', nextDaysWeather);
    return nextDaysWeather;
}

function renderNextDays (nextDays){
	const futureEl = document.createElement('section');
	futureEl.classList.add('future');

	futureEl.insertAdjacentHTML(
		'afterbegin',
		`<h2 class="title-2">Weather Forecast ${nextDays.length} days</h2>`
	);

    const cardsRow = document.createElement('div');
	cardsRow.classList.add('cards-row');

	for (const day of nextDays) {
		console.log('day', day);

		const card = `<section class="card">
                        <h3 class="title-date">${new Date(
							day.dt * 1000
						).toLocaleDateString('en')}</h3>
                        <div class="weather-icon"><img src="./img/example.png" alt="Weather"></div>
                        <ul class="details">
                            <li class="details__item">${day.main.temp}°f</li>
                            <li class="details__item">${
								day.weather[0]['main']
							}</li>
                            <li class="details__item">${day.wind.speed} m/c</li>
                        </ul>
                    </section>`;

		cardsRow.insertAdjacentHTML('beforeend', card);
	}

    futureEl.insertAdjacentElement('beforeend', cardsRow);
    content.insertAdjacentElement('beforeend', futureEl);
}


function saveHistory(city) {
    let history = [];
    if (localStorage.getItem('history')) {
        history = JSON.parse(localStorage.getItem('history'))
    }

    if (history.length >= 5) history.pop();

    history.unshift(city);

    localStorage.setItem('history', JSON.stringify(history));
}

function renderHistory () {
    const historyWrapper = document.querySelector('.history');
    historyWrapper.innerHTML = '';

    let history = [];
	if (localStorage.getItem('history')) {
		history = JSON.parse(localStorage.getItem('history'));
	}

    if (history.length === 0) return false


    for (let item of history) {
        let button = document.createElement('button');
        button.classList.add('history__item');
        button.innerText = item;

        button.onclick = () => {
            showWeather(item);
        };

    
        historyWrapper.insertAdjacentElement('beforeend', button);
    }
}