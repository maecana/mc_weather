window.addEventListener('DOMContentLoaded', (e) => {
    let API_KEY = 'a8e71c9932b20c4ceb0aed183e6a83bb';
    let search_btn = document.querySelector('.search_btn');
    let search_input = document.querySelector('.search_input');
    let details = document.querySelector('.details');
    let content_top = document.querySelector('.content .top');
    let loadingIcon = './img/spinner-solid.svg';
    let date_el = document.querySelector('.date');
    let date_today = new Date();

    search_btn.addEventListener('click', (e) => {
        this.searchCity();
    });

    search_input.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.searchCity();
        }
    });

    getWeatherData = (city) => {
        const URL = 'https://api.openweathermap.org/data/2.5/weather';
        const FULL_URL = `${URL}?q=${city}&appid=${API_KEY}&units=imperial`;

        const weatherPromise = fetch(FULL_URL);
        return weatherPromise.then((response) => {
            return response.json();
        });
    }

    searchCity = () => {
        search_input.blur();
        this.hideDetails();
        this.showLoading();
        let city = search_input.value;
        if (city != '') {
            let cityPromise = getWeatherData(city);
            cityPromise.then((response) => {
                this.hideLoading();
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
        if (data.cod != "404") {
            let temp = this.convert_fahrenheit_to_celcius(data.main.temp);
            let temp_min = this.convert_fahrenheit_to_celcius(data.main.temp_min);
            let temp_max = this.convert_fahrenheit_to_celcius(data.main.temp_max);
            let city = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            let country = data.sys.country;

            search_input.value = `${city}, ${country}`;
            document.querySelector('.temp').innerHTML = `${temp}&#176;C`;
            document.querySelector('.temp_min').innerHTML = `${temp_min} &#176;C`;
            document.querySelector('.temp_max').innerHTML = `${temp_max} &#176;C`;
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
        if (details.classList.contains('hide') == true) {
            details.classList.remove('hide');
            details.classList.add('show');
        }
    }

    hideDetails = () => {
        if (details.classList.contains('show') == true) {
            details.classList.remove('show');
            details.classList.add('hide');
        }
    }

    showError = (error) => {
        // let div = document.createElement('div');
        // div.setAttribute('class', 'alert alert-warning alert-dismissible fade show');
        // div.setAttribute('role', 'alert');

        // let strong = document.createElement('strong');
        // let strongText = document.createTextNode('Error!');
        // strong.appendChild(strongText);

        // let errorText = document.createTextNode(` ${error}`);

        // div.appendChild(strong);
        // div.appendChild(errorText);

        // let button = document.createElement('button');
        // button.setAttribute('type', 'button');
        // button.setAttribute('class', 'close');
        // button.setAttribute('data-dismiss', 'alert');
        // button.setAttribute('aria-label', 'Close');

        // let span = document.createElement('span');
        // span.setAttribute('aria-hidden', 'true');
        // span.innerHTML = "&times;";

        // button.appendChild(span);

        // div.appendChild(button);

        // let container = document.querySelector('.container');
        // container.prepend(div);
    }

    displayLoading = () => {
        let img = document.createElement('img');
        img.src = loadingIcon;
        img.height = '30';
        img.width = '30';

        let loading_container = document.createElement('div');
        loading_container.classList.add('loading_container');
        loading_container.appendChild(img);

        return loading_container;
    }

    showLoading = () => {
        let loading_container = document.querySelector('.loading_container');
        
        if(!loading_container) {
            let loadingIcon = this.displayLoading();
            content_top.appendChild(loadingIcon);
        }
    }

    hideLoading = () => {
        let loading_container = document.querySelector('.loading_container');

        if (loading_container) {
            content_top.lastChild.remove();
        }
    }

    convert_fahrenheit_to_celcius = (fahrenheit_value) => {
        let celcius_value = (fahrenheit_value - 32) * (5 / 9);
        return celcius_value.toFixed(2);
    }
    

    formatted_date = () => {
        let month = date_today.toLocaleString('default', { month: 'long' });
        let dd = date_today.getDate();
        let yyyy = date_today.getFullYear();
        let week_day_int = date_today.getDay();
        
        let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let week_day_str = weekday[week_day_int];

        return `${month} ${dd}, ${yyyy} - ${week_day_str}`;
    };

    init = (() => {
        this.searchCity();
        date_el.innerHTML = this.formatted_date();
    })();
});