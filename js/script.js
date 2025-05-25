document.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM
    const audio = document.getElementById('audioPlayer');
    const progress = document.getElementById('progress');
    const currentTime = document.getElementById('currentTime');
    const duration = document.getElementById('duration');
    const speedControl = document.getElementById('speedControl');
    const playButton = document.querySelector('button');
    const lyricsContainer = document.getElementById('lyrics');
    // Проверка элементов
    if (!audio || !progress || !playButton) {
        console.error('Не найдены ключевые элементы!');
        return;
    }
    // Форматирование времени
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    // Данные субтитров
    const lyricsData = [
        // Intro (первые 18 секунд - инструментал)
        { start: 0.0, end: 18.9, text: "♪ Инструментал ♪" },
        // Первый куплет
        { start: 19.2, end: 22.1, text: "We're no strangers to love" },
        { start: 22.1, end: 25.8, text: "You know the rules and so do I" },
        { start: 25.8, end: 30.3, text: "A full commitment's what I'm thinking of" },
        { start: 30.3, end: 34.5, text: "You wouldn't get this from any other guy" },
        { start: 34.5, end: 39.0, text: "I just wanna tell you how I'm feeling" },
        { start: 39.0, end: 42.5, text: "Gotta make you understand" },
        // Припев
        { start: 42.5, end: 45.0, text: "Never gonna give you up" },
        { start: 45.0, end: 47.1, text: "Never gonna let you down" },
        { start: 47.12, end: 51.2, text: "Never gonna run around and desert you" },
        { start: 51.2, end: 53.8, text: "Never gonna make you cry" },
        { start: 53.8, end: 55.4, text: "Never gonna say goodbye" },
        { start: 55.4, end: 59.0, text: "Never gonna tell a lie and hurt you" },
        // Инструментальный проигрыш (64.0-80.0)
        { start: 59.0, end: 60.7, text: "♪ Инструментал ♪" },
        // Второй куплет
        { start: 60.8, end: 65.0, text: "We've known each other for so long" },
        { start: 65.0, end: 69.2, text: "Your heart's been aching but you're too shy to say it" },
        { start: 69.2, end: 74.0, text: "Inside we both know what's been going on" },
        { start: 74.0, end: 76.5, text: "We know the game and we're gonna play it" },
        { start: 76.5, end: 82.1, text: "And if you ask me how I'm feeling" },
        { start: 82.1, end: 85.5, text: "Don't tell me you're too blind to see" },
        // Повтор припева
        { start: 85.5, end: 87.7, text: "Never gonna give you up" },
        { start: 87.7, end: 89.5, text: "Never gonna let you down" },
        { start: 89.5, end: 92.6, text: "Never gonna run around and desert you" },
        { start: 92.6, end: 96.1, text: "Never gonna make you cry" },
        { start: 96.1, end: 98.4, text: "Never gonna say goodbye" },
        { start: 98.4, end: 101.4, text: "Never gonna tell a lie and hurt you" },
        // Бридж (124.0-140.0)
        { start: 101.4, end: 116.0, text: "♪ Инструментал ♪" },
        // Финальный припев
        { start: 100.0, end: 103.5, text: "Never gonna give you up" },
        { start: 103.5, end: 107.0, text: "Never gonna let you down" },
        { start: 107.0, end: 110.5, text: "Never gonna run around and desert you" },
        { start: 110.5, end: 112.0, text: "Never gonna make you cry" },
        { start: 112.0, end: 114.5, text: "Never gonna say goodbye" },
        { start: 114.5, end: 116.0, text: "Never gonna tell a lie and hurt you" },
        // Аутро (163.0-213.0)
        { start: 116.0, end: 213.0, text: "♪ Конец ♪" }
    ];
    // Инициализация текста
    const initLyrics = () => {
        if (!lyricsContainer) return;
        lyricsData.forEach(line => {
            const div = document.createElement('div');
            div.className = 'lyric-line';
            div.textContent = line.text;
            div.dataset.start = line.start;
            div.dataset.end = line.end;
            lyricsContainer.appendChild(div);
        });
    };
    // Обновление субтитров
    const updateLyrics = () => {
        const current = audio.currentTime;
        document.querySelectorAll('.lyric-line').forEach(line => {
            const start = parseFloat(line.dataset.start);
            const end = parseFloat(line.dataset.end);
            line.classList.toggle('active', current >= start && current < end);
            if (current >= start && current < end) {
                line.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        });
    };
    // Управление воспроизведением
    const togglePlay = () => {
        if (audio.paused) {
            audio.play().catch(console.error);
            playButton.textContent = '⏸ Пауза';
        } else {
            audio.pause();
            playButton.textContent = '▶ Воспроизвести';
        }
    };
    // Основная инициализация плеера
    const initPlayer = () => {
        initLyrics();
        audio.addEventListener('loadedmetadata', () => {
            progress.max = Math.floor(audio.duration);
            duration.textContent = formatTime(audio.duration);
        });
        audio.addEventListener('timeupdate', () => {
            progress.value = audio.currentTime;
            currentTime.textContent = formatTime(audio.currentTime);
            updateLyrics();
        });
        playButton.addEventListener('click', togglePlay);
        speedControl.addEventListener('change', (e) => {
            audio.playbackRate = e.target.value;
            localStorage.setItem('playbackSpeed', e.target.value);
        });
        progress.addEventListener('input', (e) => {
            audio.currentTime = e.target.value;
        });
        // Восстановление скорости
        const savedSpeed = localStorage.getItem('playbackSpeed') || 1;
        audio.playbackRate = savedSpeed;
        speedControl.value = savedSpeed;
    };
    // Запуск инициализации
    initPlayer(); // <-- Вызов после объявления
});