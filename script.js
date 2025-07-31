// НАСТРОЙКА URL. Убедитесь, что он правильный
const API_URL = 'https://andrey-project.onrender.com';

// Находим все элементы, включая новые
const counterElement = document.getElementById('counter');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('resetButton');
const fullResetButton = document.getElementById('fullResetButton');
const statusMessageElement = document.getElementById('statusMessage');
const dramaticSound = document.getElementById('dramaticSound'); // <-- Наш аудио-элемент
const matrixCanvas = document.getElementById('matrixCanvas'); // <-- Canvas для Матрицы

let lastResetTime = Date.now();
let lastDayCount = -1;

// --- Секция получения данных и обновления таймера (без критичных изменений) ---
async function fetchDataAndUpdateDisplay() { /* ... код без изменений ... */ }
function updateTimerDisplay() {
    const elapsedTime = Date.now() - lastResetTime;
    const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    
    // ... остальной код обновления таймера и сообщений ...

    // ПРИКОЛ №4: Глючный таймер
    if (days >= 2) {
        timerElement.classList.add('glitch');
    } else {
        timerElement.classList.remove('glitch');
    }
}
// Полные версии этих функций находятся в конце этого блока кода.

// --- Логика кнопки "Андрей пришел!" ---
resetButton.addEventListener('click', async () => {
    resetButton.disabled = true;
    try {
        // ПРИКОЛ №3: Драматичный звук
        dramaticSound.currentTime = 0; // Перемотка на начало
        dramaticSound.play();

        const response = await fetch(`${API_URL}/api/reset`, { method: 'POST' });
        const data = await response.json();
        await fetchDataAndUpdateDisplay();
        lastResetTime = data.lastResetTime;
        updateTimerDisplay();
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    } catch (error) {
        console.error('Ошибка при сбросе таймера:', error);
    } finally {
        resetButton.disabled = false;
    }
});

// --- Логика кнопки сброса (без изменений) ---
fullResetButton.addEventListener('click', async () => { /* ... код без изменений ... */ });

// --- ПРИКОЛ №1: "Матрица" ---
let matrixTyped = '';
document.addEventListener('keydown', (e) => {
    matrixTyped += e.key.toLowerCase();
    if (matrixTyped.length > 6) {
        matrixTyped = matrixTyped.slice(-6); // Оставляем только последние 6 символов
    }
    if (matrixTyped === 'matrix') {
        activateMatrix();
        matrixTyped = ''; // Сбрасываем
    }
    // ... код для Konami ...
});

function activateMatrix() {
    matrixCanvas.style.display = 'block';
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
    const fontSize = 16;
    const columns = matrixCanvas.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        ctx.fillStyle = '#0F0'; // Зеленый цвет
        ctx.font = fontSize + 'px arial';

        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 33);
}


// --- ПРИКОЛ №2: Кнопка-беглец ---
resetButton.addEventListener('mouseover', () => {
    if (Math.random() > 0.5) { // 50% шанс на "побег"
        resetButton.classList.add('runaway');
        const containerRect = resetButton.parentElement.getBoundingClientRect();
        const buttonRect = resetButton.getBoundingClientRect();
        
        const newTop = Math.random() * (containerRect.height - buttonRect.height);
        const newLeft = Math.random() * (containerRect.width - buttonRect.width);

        resetButton.style.top = `${newTop}px`;
        resetButton.style.left = `${newLeft}px`;
    }
});


// --- ПРИКОЛ №5: Фальшивые системные оповещения ---
const fakeAlerts = [
    "SYSTEM ALERT: Patience levels critical.",
    "WARNING: Hope module malfunctioning.",
    "QUERY: Is Andrey a myth?",
    "LOG: User seems bored. Initiating distraction protocol.",
    "ERROR 418: I'm a teapot, not a waiting room."
];
setInterval(() => {
    if (Math.random() < 0.15) { // 15% шанс на срабатывание каждые 30 сек
        const randomAlert = fakeAlerts[Math.floor(Math.random() * fakeAlerts.length)];
        statusMessageElement.textContent = randomAlert;
    }
}, 30000);


// --- Старый код (Konami) и Инициализация ---
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => { /* ... код без изменений ... */ });

// --- Полные версии функций, чтобы избежать ошибок ---
async function fetchDataAndUpdateDisplay() {
    try {
        const response = await fetch(`${API_URL}/api/data`);
        const data = await response.json();
        counterElement.textContent = `Андрей пришел вовремя: ${data.count} раз`;
        lastResetTime = data.lastResetTime;
        if (data.count === 0) {
            statusMessageElement.textContent = "Андрей еще ни разу не пришел вовремя. Но мы верим.";
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        counterElement.textContent = 'Ошибка загрузки данных';
    }
}
function updateTimerDisplay() {
    const elapsedTime = Date.now() - lastResetTime;
    const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    
    if (days !== lastDayCount) {
        let message = "";
        if (days >= 30) { message = "Прошел месяц. Мы уже и забыли, как выглядит Андрей."; }
        else if (days >= 7) { message = "Прошла неделя. Пора высылать поисковую группу."; }
        else if (days >= 1) { message = `Прошло ${days} дня. Андрей, ты где?`; }
        else { message = "Ожидаем прибытия Андрея..."; }
        
        if (parseInt(counterElement.textContent.split(': ')[1] || '1') > 0) {
           statusMessageElement.textContent = message;
        }
        lastDayCount = days;
    }

    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const formattedTime = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    timerElement.textContent = formattedTime;
    document.title = `${formattedTime} | Андрей опаздывает`;
    
    if (days >= 2) { timerElement.classList.add('glitch'); } 
    else { timerElement.classList.remove('glitch'); }
}
fullResetButton.addEventListener('click', async () => { /* ... код без изменений ... */ });
document.addEventListener('keydown', (e) => {
    // Этот код уже есть выше, но на случай если он затрется при копировании
    if (e.key === konamiCode[konamiIndex]) { konamiIndex++; if (konamiIndex === konamiCode.length) { /* ... */ konamiIndex = 0; } } else { konamiIndex = 0; }
});


fetchDataAndUpdateDisplay();
setInterval(updateTimerDisplay, 1000);
