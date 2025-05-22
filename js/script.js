//Инициализация элементов
const audio = document.getElementById('audioElement');//аудио
const progress = document.getElementById('progress');//Момент из аудио
const speedSelect = document.getElementById('speedSelect');//Выбор скорости
//Изменение скорости
function changeSpeed(speed) {//Функция
    audio.playbackRate = parseFloat(speed);
}