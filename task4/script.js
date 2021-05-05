/*
    Сверстайте кнопку, по клику на которую будет отправляться запрос к Timezone API. 
    В запросе нужно отправить координаты местоположения пользователя, полученные с 
    помощью Geolocation API. В ответ на запрос придёт объект, из которого нужно вывести на 
    экран следующую информацию:
        - временная зона, в которой находится пользователь: параметр timezone;
        - местные дата и время: параметр date_time_txt.
    Строка запроса к API выглядит следующим образом:
    https://api.ipgeolocation.io/timezone?apiKey=32bcd4a6e4b548968e7afcdb682ac679&lat=latitude&long=longitude.
    Вместо latitude и longitude нужно подставить широту и долготу.
*/

const btn = document.querySelector('.btn');
const timeZone = document.querySelector('.time__zone');
const dateTime = document.querySelector('.date__time');
const APIKey = '32bcd4a6e4b548968e7afcdb682ac679';
let url = '';

// функция ошибки определения геопозиции
function geoError() {
    dateTime.textContent = 'Информация о местоположении недоступна';
}

// функция успешного определения геопозиции
function geoSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // запись в API link
    url = `https://api.ipgeolocation.io/timezone?apiKey=${APIKey}&lat=${latitude}&long=${longitude}`;
    
    // делаем запрос к API
    fetchApi();
}

// функиця fetch запроса к API
function fetchApi() {
    fetch(url)
        .then(response => response.json())
        .then(json => {
            // выводим данные на экран
            timeZone.textContent = `Временная зона: ${json.timezone}`;
            dateTime.textContent = `Местные дата и время: ${json.date_time_txt}`;
        });
}

// функция нажатия кнопки
btn.addEventListener('click', () => {
    // определяем геолокацию
    if (!navigator.geolocation) {
        geoError();
    } else {
        dateTime.textContent = 'Определяем координаты...';
        timeZone.textContent = '';
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    }
});
