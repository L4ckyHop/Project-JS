 const audioPlayer = document.getElementById('audioPlayer');
        const currentTimeDisplay = document.getElementById('currentTime');
        const durationDisplay = document.getElementById('duration');
        const progressBar = document.querySelector('.progress-bar');
        const progressFilled = document.querySelector('.progress-filled');

        // Получаем длительность трека
        audioPlayer.addEventListener('loadedmetadata', () => {
            durationDisplay.textContent = formatTime(audioPlayer.duration);
        });

        // Обновляем прогресс бара и таймеры
        audioPlayer.addEventListener('timeupdate', () => {
            currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
            const percentage = Math.floor((audioPlayer.currentTime / audioPlayer.duration) * 100);
            progressFilled.style.width = `${percentage}%`;
        });

        // Переключатель воспроизведения
        function togglePlayPause() {
            if (audioPlayer.paused) {
                audioPlayer.play();
                document.querySelector('.controls > button:nth-child(1)').innerText = '❚❚ Пауза';
            } else {
                audioPlayer.pause();
                document.querySelector('.controls > button:nth-child(1)').innerText = '▶️ Воспроизвести';
            }
        }

        // Перемотка на указанное количество секунд
        function rewind(seconds) {
            audioPlayer.currentTime += seconds;
        }

        // Форматирование времени (секунды → минуты:секунды)
        function formatTime(secs) {
            const mins = Math.floor(secs / 60);
            secs %= 60;
            return `${mins}:${secs.toFixed(0)}`.padStart(5, '0');
        }
        function parseSRT(data) {
    const subtitles = [];
    const lines = data.split('\n');
    let index = 0;
    while (index < lines.length) {
        const startTime = lines[index + 1].split(' --> ')[0].trim();
        const endTime = lines[index + 1].split(' --> ')[1].trim();
        const text = lines[index + 2].trim();
        subtitles.push({
            start: convertToSeconds(startTime),
            end: convertToSeconds(endTime),
            text: text
        });
        index += 4; // Пропускаем индекс, время и текст
    }
    return subtitles;
}
function convertToSeconds(time) {
    const parts = time.split(':');
    return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2].replace(',', '.'));
}
        function syncSubtitles(subtitles) {
    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        const currentSubtitle = subtitles.find(sub => currentTime >= sub.start && currentTime <= sub.end);
        
        if (currentSubtitle) {
            displaySubtitle(currentSubtitle.text);
        } else {
            clearSubtitle();
        }
    });
}
function displaySubtitle(text) {
    const subtitleDisplay = document.getElementById('subtitleDisplay');
    subtitleDisplay.textContent = text;
}
function clearSubtitle() {
    const subtitleDisplay = document.getElementById('subtitleDisplay');
    subtitleDisplay.textContent = '';
    }