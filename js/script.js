window.onload = () => {
    $('.alert').alert();
}

let API_KEY = 'a8e71c9932b20c4ceb0aed183e6a83bb';

getWeatherData = (city) => {
    const URL = 'https://api.openweathermap.org/data/2.5/weather';
    const FULL_URL = `${URL}?q=${city}&appid=${API_KEY}&units=imperial`;
    
    const weatherPromise = fetch(FULL_URL);
    return weatherPromise.then((response) => {
        return response.json();
    });
}

searchCity = () => {
    let city = document.querySelector('.city').value;
    if(city != '') {
        let cityPromise = getWeatherData(city);
        cityPromise.then((response) => {
            displayWeather(response);
        }).catch((error) => {
            showError(error);
            hideDetails();
        });
    } else {
        showError('Please enter a city.');
    }
}

displayWeather = (data) => {
    if(data.cod != "404") {
        document.querySelector('.city_name').innerHTML = data.name;
        document.querySelector('.weather_type').innerHTML = data.weather[0].main;
        document.querySelector('.temp').innerHTML = `${data.main.temp}&#176;`;
        document.querySelector('.temp_min').innerHTML = `${data.main.temp_min}&#176;`;
        document.querySelector('.temp_max').innerHTML = `${data.main.temp_max}&#176;`;
        document.querySelector('.desc').innerHTML = data.weather[0].description;
        document.querySelector('.hum').innerHTML = `${data.main.humidity} %`;
        document.querySelector('.pre').innerHTML = data.main.pressure;
        showDetails();
    } else {
        showError(data.message);
        hideDetails()
    }
}

showDetails = () => {
    let details = document.querySelector('.details');
    if(details.classList.contains('hide') == true)
        details.classList.remove('hide');
}

hideDetails = () => {
    let details = document.querySelector('.details');
    details.classList.add('hide');
}

showError = (error) => {
    let div = document.createElement('div');
    div.setAttribute('class', 'alert alert-warning alert-dismissible fade show');
    div.setAttribute('role', 'alert');

    let strong = document.createElement('strong');
    let strongText = document.createTextNode('Error!');
    strong.appendChild(strongText);

    let errorText = document.createTextNode(` ${error}`);

    div.appendChild(strong);
    div.appendChild(errorText);

    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'close');
    button.setAttribute('data-dismiss', 'alert');
    button.setAttribute('aria-label', 'Close');

    let span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = "&times;";

    button.appendChild(span);

    div.appendChild(button);

    let container = document.querySelector('.container');
    container.prepend(div);
}