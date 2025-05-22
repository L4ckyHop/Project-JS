//Инициализация элементов
const audio = document.getElementById('audioElement');//аудио
const progress = document.getElementById('progress');//Момент из аудио
const speedSelect = document.getElementById('speedSelect');//Выбор скорости
// Функция изменения скорости
function changeSpeed(speed) {
    audio.playbackRate = parseFloat(speed);
    // Опциональное сохранение в localStorage
    localStorage.setItem('playbackSpeed', speed);
}
// Восстановление скорости при загрузке
window.addEventListener('load', () => {
    const savedSpeed = localStorage.getItem('playbackSpeed') || '1';
    document.getElementById('speedControl').value = savedSpeed;
    audio.playbackRate = parseFloat(savedSpeed);
});