/*
    Реализовать чат на основе эхо-сервера wss://echo.websocket.org/
    Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».
    При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.
    Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат.
    Добавить в чат механизм отправки гео-локации.
    При клике на кнопку «Гео-локация» необходимо отправить данные серверу и в чат вывести 
    ссылку на https://www.openstreetmap.org/ с вашей гео-локацией. 
    Сообщение, которое отправит обратно эхо-сервер, не выводить.
*/

// данные html страницы
const btnSend = document.querySelector('.btnSend');
const btnGeo = document.querySelector('.btn--geo');
const input = document.querySelector('.input');
const contentMessage = document.querySelector('.content__message');
let websocket;
let URIGeo;
// URL сервера
const wsURI = 'wss://echo.websocket.org/';

// открываем соединение
websocket = new WebSocket(wsURI);

// печатаем сообщение с сервера в чат
websocket.onmessage = function(e) {
    // если нажата кнопка гео-локация и была передана ссылка
    if (URIGeo) {
        // обнуляем ее
        URIGeo = null;
        // и прекращаем вывод в чат
        return;
    }

    writeToMessage(e.data, 'left');
}

// печатаем ошибку с сервера в чат
websocket.onerror = function(e) {
    writeToMessage(`Error: ${e.data}`, 'left');
}

// функция вставки сообщения
function writeToMessage(message, position) {
    // создаем <div> с классом позиционирования position
    let div = document.createElement('div');
    div.classList.add(`div--${position}`);

    // создаем <p> с текстом сообщения
    let pre = document.createElement('p');
    pre.classList.add('message');

    // если ссылка с гео-локации, вставляем ее, иначе сообщение
    pre.innerHTML = URIGeo ?
        `<a href="${URIGeo}" class="link__geo" target="_blank">https://www.openstreetmap.org/</a>` :
        message;

    // добавляем <div>
    contentMessage.append(div);
    // и в него вставляем <p>
    div.append(pre);

    // обнуляем input
    input.value = '';
}

// функция нажатия кнопки Отправить
btnSend.addEventListener('click', () => {
    const message = input.value;
    // возвращаем нормальный цвет input
    input.style.border = '1px solid #c9c9c9';

    // если сообщение пустое, выделяем input красным
    if (message === '') {
        input.style.border = '1px solid red';
        return;
    }

    // выводим наше сообщение в чат
    writeToMessage(message, 'right');
    // и отправляем его на сервер
    websocket.send(message);
});

// функция нажатия кнопки Гео-локация
btnGeo.addEventListener('click', () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(position => {
        // определяем координаты и вставляем в ссылку
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        URIGeo = `https://www.openstreetmap.org/search?query=${latitude}%${longitude}
                  #map=19/${latitude}/${longitude}`;

        // отправляем ссылку в чат и на сервер
        writeToMessage(URIGeo, 'right');
        websocket.send(URIGeo);
    });
});
