// --- ВАЖНАЯ НАСТРОЙКА: Вставьте сюда ваш правильный URL ---
const API_URL = 'https://andrey-project.onrender.com';

// --- Находим все-все-все элементы на странице ---
const counterElement = document.getElementById('counter');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('resetButton');
const fullResetButton = document.getElementById('fullResetButton');
const statusMessageElement = document.getElementById('statusMessage');
const dramaticSound = document.getElementById('dramaticSound');
const matrixCanvas = document.getElementById('matrixCanvas');
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesBtn = document.getElementById('acceptCookies');
const customContextMenu = document.getElementById('customContextMenu');
const fakeError = document.getElementById('fakeError');
const closeErrorBtn = document.getElementById('closeError');
const okErrorBtn = document.getElementById('okError');
const uselessSwitch = document.getElementById('uselessSwitch');
const updateNotification = document.getElementById('updateNotification');
const clippy = document.getElementById('clippy');
const closeClippyBtn = document.getElementById('closeClippy');

// --- Глобальные переменные ---
let lastResetTime = Date.now();
let lastDayCount = -1;

// --- ФУНКЦИИ-ПРИКОЛЫ И ЛОГИКА ---

// ПРИКОЛ №1 (ИСПРАВЛЕННАЯ ВЕРСИЯ): "Сломанный" счетчик
async function fetchDataAndUpdateDisplay() {
    try {
        const response = await fetch(`${API_URL}/api/data`);
        const data = await response.json();
        const isOver9000 = counterElement.classList.contains('over9000');

        if (data.count === 10 && !isOver9000) {
            counterElement.textContent = `Андрей пришел вовремя: OVER 9000!!!`;
            counterElement.classList.add('over9000');
            setTimeout(() => {
                if (counterElement.classList.contains('over9000')) {
                    counterElement.textContent = `Андрей пришел вовремя: 10 раз`;
                    counterElement.classList.remove('over9000');
                }
            }, 5000);
        } else if (data.count !== 10) {
            counterElement.textContent = `Андрей пришел вовремя: ${data.count} раз`;
            counterElement.classList.remove('over9000');
        }

        lastResetTime = data.lastResetTime;
        if (data.count === 0) {
            statusMessageElement.textContent = "Андрей еще ни разу не пришел вовремя. Но мы верим.";
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        counterElement.textContent = 'Ошибка загрузки данных';
    }
}

// Обновление таймера и зависимых приколов
function updateTimerDisplay() {
    const elapsedTime = Date.now() - lastResetTime;
    const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));

    // Динамические сообщения
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
    document.title = `${formattedTime} | Андрей опаздывает`; // "Живой" заголовок вкладки
    
    // Глючный таймер
    if (days >= 2) { timerElement.classList.add('glitch'); } 
    else { timerElement.classList.remove('glitch'); }
}

// --- ОБРАБОТЧИКИ СОБЫТИЙ ---

// Основная кнопка
resetButton.addEventListener('click', async () => {
    resetButton.disabled = true;
    try {
        dramaticSound.currentTime = 0;
        dramaticSound.play();
        const response = await fetch(`${API_URL}/api/reset`, { method: 'POST' });
        const data = await response.json();
        await fetchDataAndUpdateDisplay();
        lastResetTime = data.lastResetTime;
        updateTimerDisplay();
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    } catch (error) { console.error('Ошибка при сбросе таймера:', error); }
    finally { resetButton.disabled = false; }
});

// Кнопка полного сброса
fullResetButton.addEventListener('click', async () => {
    if (confirm('Вы уверены, что хотите отформатировать систему и сбросить ВЕСЬ счетчик на 0?')) {
        fullResetButton.disabled = true;
        document.body.classList.add('shake');
        try {
            const response = await fetch(`${API_URL}/api/full-reset`, { method: 'POST' });
            await fetchDataAndUpdateDisplay();
        } catch (error) { console.error('Ошибка при полном сбросе:', error); }
        finally { setTimeout(() => { document.body.classList.remove('shake'); fullResetButton.disabled = false; }, 820); }
    }
});

// ИСПРАВЛЕННАЯ Кнопка-беглец
resetButton.addEventListener('mouseover', () => {
    if (Math.random() > 0.75) {
        resetButton.classList.add('runaway');
        const containerRect = resetButton.parentElement.getBoundingClientRect();
        const buttonRect = resetButton.getBoundingClientRect();
        const maxTop = containerRect.height - buttonRect.height;
        const maxLeft = containerRect.width - buttonRect.width;
        resetButton.style.top = `${Math.random() * maxTop}px`;
        resetButton.style.left = `${Math.random() * maxLeft}px`;
    }
});

// Баннер Cookie
if (!localStorage.getItem('cookies_accepted')) {
    setTimeout(() => cookieBanner.classList.add('show'), 2000);
}
acceptCookiesBtn.addEventListener('click', () => {
    localStorage.setItem('cookies_accepted', 'true');
    cookieBanner.classList.remove('show');
});

// Кастомное меню
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    customContextMenu.style.top = `${e.pageY}px`;
    customContextMenu.style.left = `${e.pageX}px`;
    customContextMenu.style.display = 'block';
});
document.addEventListener('click', () => customContextMenu.style.display = 'none');

// Фальшивое окно ошибки (появление и перетаскивание)
setTimeout(() => fakeError.style.display = 'block', Math.random() * 20000 + 10000);
closeErrorBtn.addEventListener('click', () => fakeError.style.display = 'none');
okErrorBtn.addEventListener('click', () => fakeError.style.display = 'none');
let isDragging = false, offsetX, offsetY;
const errorTitleBar = fakeError.querySelector('.fake-error-titlebar');
errorTitleBar.addEventListener('mousedown', (e) => { isDragging = true; offsetX = e.clientX - fakeError.getBoundingClientRect().left; offsetY = e.clientY - fakeError.getBoundingClientRect().top; });
document.addEventListener('mousemove', (e) => { if (isDragging) { fakeError.style.left = `${e.clientX - offsetX}px`; fakeError.style.top = `${e.clientY - offsetY}px`; } });
document.addEventListener('mouseup', () => isDragging = false);

// Фальшивое уведомление
setTimeout(() => {
    updateNotification.classList.add('show');
    setTimeout(() => updateNotification.classList.remove('show'), 10000);
}, 25000);
updateNotification.addEventListener('click', () => updateNotification.classList.remove('show'));

// Бесполезный переключатель
uselessSwitch.addEventListener('click', () => {
    const originalText = statusMessageElement.textContent;
    statusMessageElement.textContent = "Этот переключатель ничего не делает. Но вы его нажали.";
    setTimeout(() => statusMessageElement.textContent = originalText, 4000);
});

// Помощник-Скрепыш
setTimeout(() => clippy.style.display = 'flex', 45000);
closeClippyBtn.addEventListener('click', () => clippy.style.display = 'none');

// --- СЕКРЕТНЫЕ КОДЫ ---
let typedKeys = '';
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => {
    typedKeys = (typedKeys + e.key.toLowerCase()).slice(-6);
    if (typedKeys.endsWith('matrix')) { activateMatrix(); typedKeys = ''; }
    if (typedKeys.endsWith('chaos')) { document.body.classList.toggle('chaos'); typedKeys = ''; }
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            alert('Секретный код активирован!');
            const duration = 5 * 1000, end = Date.now() + duration;
            (function frame() {
                confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
                confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
            konamiIndex = 0;
        }
    } else { konamiIndex = 0; }
});

function activateMatrix() {
    matrixCanvas.style.display = 'block';
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth; matrixCanvas.height = window.innerHeight;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%', fontSize = 16, columns = matrixCanvas.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        ctx.fillStyle = '#0F0'; ctx.font = fontSize + 'px arial';
        for (let i = 0; i < drops.length; i++) {
            ctx.fillText(letters[Math.floor(Math.random() * letters.length)], i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 33);
}

// --- ПЕРИОДИЧЕСКИЕ ПРИКОЛЫ ---
// Фальшивые системные оповещения
setInterval(() => {
    if (Math.random() < 0.15) {
        const fakeAlerts = ["SYSTEM ALERT: Patience levels critical.", "WARNING: Hope module malfunctioning.", "QUERY: Is Andrey a myth?"];
        statusMessageElement.textContent = fakeAlerts[Math.floor(Math.random() * fakeAlerts.length)];
    }
}, 30000);

// --- ЗАПУСК ---
fetchDataAndUpdateDisplay();
setInterval(updateTimerDisplay, 1000);
