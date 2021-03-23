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
        let _this = this;

        let alert = document.createElement('div');
        alert.classList.add('alert');

        let text_div = document.createElement('div');
        let strong = document.createElement('strong');
        let strongText = document.createTextNode('Error!');
        strong.appendChild(strongText);

        let errorText = document.createElement(`span`);
        errorText.classList.add('capitalize');
        errorText.innerHTML = ` ${error}`;

        text_div.appendChild(strong);
        text_div.appendChild(errorText);
        alert.appendChild(text_div);

        let button = document.createElement('button');
        button.classList.add('btn-round');
        button.classList.add('close_alert');
        button.setAttribute('onclick', "close_alert()")

        let span = document.createElement('span');
        span.innerHTML = "&times;";

        button.appendChild(span);
        alert.appendChild(button);

        let container = document.querySelector('.container');
        container.prepend(alert);

        this.timed_close_alert();
    }

    timed_close_alert = () => {
        setTimeout((e) => {
            this.close_alert();
            search_input.value = 'Manila';
            this.searchCity();
        }, 2000);
    }

    close_alert = () => {
        let close_alert_btn = document.querySelector('.alert .close_alert');
        let alert_el = document.querySelector('.container .alert');
        if(alert_el) { alert_el.remove(); }
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