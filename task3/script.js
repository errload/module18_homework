/*
    Сверстайте кнопку, клик на которую будет выводить на экран следующие данные:
        - Размеры экрана пользователя (ширина и высота).
        - Координаты местонахождения пользователя. Если пользователь отказался дать доступ 
        к местоположению или данная функция недоступна в бразуере, вывести вместо координат 
        сообщение «Информация о местоположении недоступна».
*/

const btn = document.querySelector('.btn');
const sizeWindow = document.querySelector('.size__window');
const geoPosition = document.querySelector('.geo__position');

// функция определения размеров окна
function getSizeWindow() {
    const width = window.screen.width;
    const height = window.screen.height;

    // выводим размеры экрана
    sizeWindow.textContent = `Ширина экрана: ${width} px, высота экрана: ${height} px`;
}

// функция ошибки определения геопозиции
function geoError() {
    geoPosition.textContent = 'Информация о местоположении недоступна';
}

// функция успешного определения геопозиции
function geoSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    // вывод геопозиции на экран
    geoPosition.textContent = `Широта: ${latitude}, долгота: ${longitude}`;
}

// функция нажатия кнопки
btn.addEventListener('click', () => {
    // выводим размеры экрана
    getSizeWindow();

    // определяем геолокацию
    if (!navigator.geolocation) {
        geoError();
    } else {
        geoPosition.textContent = 'Определяем координаты...';
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    }
});
