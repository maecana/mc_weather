window.onload = () => {
    getWeatherData('taguig');
}

let API_KEY = 'a8e71c9932b20c4ceb0aed183e6a83bb';

getWeatherData = (city) => {
    const URL = 'https://api.openweathermap.org/data/2.5/weather';
    const FULL_URL = `${URL}?q=${city}&appid=${API_KEY}&units=imperial`;
    
    const weatherPromise = fetch(FULL_URL);
    weatherPromise.then((response) => {
        return response.json();
    }).then((jsonData) => {
        console.log(jsonData);
    }).catch((error) => {
        alert(`Error: ${error}`);
    });
}