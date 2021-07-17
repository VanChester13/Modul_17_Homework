const wsUri = "wss://echo.websocket.org/";

 // загрузка страницы
function pageLoaded() {
  const infoOutput = document.querySelector(".info_output");
  const chatOutput = document.querySelector(".chat_output");
  const input = document.querySelector("input");
  const sendBtn = document.querySelector(".btn_send");
  const geoLocation = document.querySelector('.btn_geo');
  const clearInf = document.querySelector('.btn_clear');
  
  geoLocation.addEventListener('click', getLocation);
  clearInf.addEventListener('click', clearInformation);
  
  let socket = new WebSocket(wsUri);
  
  socket.onopen = () => {
    infoOutput.innerText = "";
  }
  
  socket.onmessage = (event) => {
    writeToChat(event.data, true);
  }
  
  socket.onerror = () => {
    infoOutput.innerText = "При передаче данных произошла ошибка";
  }
  
  sendBtn.addEventListener("click", sendMessage);
  
  // отправка сообщения
  function sendMessage() {
    if (!input.value) return;
    socket.send(input.value);
    writeToChat(input.value, false);
    input.value === "";
  }
  
  // вывод сообщения в чат
  function writeToChat(message, isRecieved) {
    let messageHTML = `<div class="${isRecieved? "recieved" : "sent"}">${message}</div>`;
    chatOutput.innerHTML += messageHTML;
  }
  
   // Получение гео-локации
  function getLocation() {
    if ("geolocation" in navigator) {
      let locationOptions = {
        enableHighAccuracy: true
      };
      navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
    } else {
      writeOutput("Ваш браузер не поддерживает функцию определения местоположения");
    }
  }
  
  // положительный исход
  function locationSuccess(data) {
    let link = `https://yandex.ru/maps/?pt=${data.coords.longitude},${data.coords.latitude}&z=18&l=map`;
    writeOutput(`<a href="${link}" target="_blank">Гео-локация</a>`);
  }
  
  // отрицательный исход
  function locationError() {
    writeOutput("Информация о местоположении недоступна");
  }
  
  // вывод гео-локации
  function writeOutput(message) {
    chatOutput.innerHTML += `<div class="sent"}">${message}</div>`;
  }

  // очистка переписки
 function clearInformation() {
    chatOutput.innerHTML = '';
 }
}

document.addEventListener("DOMContentLoaded", pageLoaded);