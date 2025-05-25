document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audioPlayer');
    const progress = document.getElementById('progress');
    const currentTime = document.getElementById('currentTime');
    const duration = document.getElementById('duration');
    const playButton = document.getElementById('playButton');
    const subtitlesDiv = document.getElementById('subtitles');
    const subtitleFileInput = document.getElementById('subtitleFile');
    const fontSizeInput = document.getElementById('fontSize');
    const fontColorInput = document.getElementById('fontColor');

    let subtitles = [];
    let currentSubtitleIndex = -1;

    // Инициализация плеера
    function initPlayer() {
        audio.addEventListener('loadedmetadata', () => {
            duration.textContent = formatTime(audio.duration);
            progress.max = audio.duration;
        });
        
        playButton.addEventListener('click', togglePlay);
        audio.addEventListener('timeupdate', updateProgress);
        progress.addEventListener('input', seekAudio);
        
        // Обработка загрузки субтитров
        subtitleFileInput.addEventListener('change', loadSubtitles);
        
        // Настройки шрифта
        fontSizeInput.addEventListener('input', updateSubtitleStyle);
        fontColorInput.addEventListener('input', updateSubtitleStyle);
    }

    // Функция для воспроизведения/паузы
    function togglePlay() {
        if (audio.paused) {
            audio.play();
            playButton.textContent = '⏸️ Пауза';
        } else {
            audio.pause();
            playButton.textContent = '▶️ Воспроизвести';
        }
            // Обновление прогресса
    function updateProgress() {
        progress.value = audio.currentTime;
        currentTime.textContent = formatTime(audio.currentTime);
        updateSubtitles();
    }

    // Перемотка аудио
    function seekAudio() {
        audio.currentTime = progress.value;
    }

    // Форматирование времени в MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return ${minutes}:${secs < 10 ? '0' : ''}${secs};
    }

    // Загрузка субтитров
    function loadSubtitles(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const content = e.target.result;
            parseSubtitles(content, file.name);
        };
        
        reader.readAsText(file);
    }

    // Парсинг субтитров
    function parseSubtitles(data, filename) {
        try {
            if (filename.endsWith('.srt')) {
                subtitles = parseSRT(data);
            } else if (filename.endsWith('.vtt')) {
                subtitles = parseVTT(data);
            }
            currentSubtitleIndex = -1; // сброс индекса субтитров
            console.log(subtitles); // Для отладки
        } catch (error) {
            console.error("Ошибка при парсинге субтитров:", error);
        }
    }

    // Пример парсинга SRT
    function parseSRT(data) {
        const regex = /(d+)\n([d:,]+) --> ([d:,]+)\n([^\n]+(?:\n[^\n]+)*)/g;
        let result = [];
        let match;

        while ((match = regex.exec(data)) !== null) {
            const startTime = parseTime(match[2]);
            const endTime = parseTime(match[3]);
            const text = match[4].replace(/\n/g, ' '); // Убираем переносы строк

            result.push({ start: startTime, end: endTime, text });
        }
        return result;
    }

    // Пример парсинга VTT
    function parseVTT(data) {
        const regex = /([d:.]+) --> ([d:.]+)\n([^\n]+(?:\n[^\n]+)*)/g;
        let result = [];
        let match;

        while ((match = regex.exec(data)) !== null) {
            const startTime = parseTime(match[1]);
            const endTime = parseTime(match[2]);
            const text = match[3].replace(/\n/g, ' '); // Убираем переносы строк

            result.push({ start: startTime, end: endTime, text });
        }
        return result;
    }

    // Преобразование времени в секунды
    function parseTime(timeString) {
        const parts = timeString.split(':');
        let seconds = 0;

        if (parts.length === 3) { // ЧЧ:ММ:СС.mmm
            seconds += parseInt(parts[0]) * 3600; // Часы
            seconds += parseInt(parts[1]) * 60;   // Минуты
            seconds += parseFloat(parts[2]);       // Секунды
        } else if (parts.length === 2) { // ММ:СС.mmm
            seconds += parseInt(parts[0]) * 60;   // Минуты
            seconds += parseFloat(parts[1]);       // Секунды
        }

        return seconds;
    }

    // Обновление субтитров
    function updateSubtitles() {
        const currentTimeValue = audio.currentTime;

        if (subtitles.length > 0) {
            for (let i = 0; i < subtitles.length; i++) {
                if (currentTimeValue >= subtitles[i].start && currentTimeValue <= subtitles[i].end) {
                    if (i !== currentSubtitleIndex) {
                        currentSubtitleIndex = i;
                        subtitlesDiv.textContent = subtitles[i].text;
                    }
                    return;
                }
            }

            // Если нет подходящих субтитров, очищаем
            if (currentSubtitleIndex !== -1) {
                currentSubtitleIndex = -1;
                subtitlesDiv.textContent = '';
            }
        }
    }

    // Обновление стиля субтитров
    function updateSubtitleStyle() {
        subtitlesDiv.style.fontSize = fontSizeInput.value + 'px';
        subtitlesDiv.style.color = fontColorInput.value;
    }

    initPlayer();
});