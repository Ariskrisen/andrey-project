// --- ВАЖНАЯ НАСТРОЙКА: Убедитесь, что здесь ваш правильный URL ---
const API_URL = 'https://andrey-project.onrender.com';

// --- Находим все-все-все элементы на странице ---
const elements = {};
['counter', 'timer', 'resetButton', 'fullResetButton', 'statusMessage',
 'dramaticSound', 'matrixCanvas', 'cookieBanner', 'acceptCookies',
 'customContextMenu', 'fakeError', 'updateNotification', 'uselessSwitch',
 'clippy', 'paywall', 'closePaywall', 'fakeLoader'].forEach(id => {
    elements[id] = document.getElementById(id);
});
elements.closeErrorBtn = document.querySelector('#fakeError .close-btn');
elements.okErrorBtn = document.querySelector('#fakeError .ok-btn');
elements.closeClippyBtn = document.querySelector('#clippy .close-btn');
elements.loaderProgress = document.querySelector('.loader-progress');

// --- Глобальные переменные ---
let lastResetTime = Date.now();
let lastDayCount = -1;
let isTyping = false;

// --- ФУНКЦИИ-ПРИКОЛЫ И ЛОГИКА ---

// Хакерский тайпинг
function typeMessage(element, message) {
    if (isTyping || !element) return;
    isTyping = true;
    let index = 0;
    element.textContent = '';
    const interval = setInterval(() => {
        if (index < message.length) {
            element.textContent += message.charAt(index);
            index++;
        } else {
            clearInterval(interval);
            isTyping = false;
        }
    }, 50);
}

// Загрузка данных и проверка "OVER 9000"
async function fetchDataAndUpdateDisplay() {
    try {
        const response = await fetch(`${API_URL}/api/data`);
        const data = await response.json();
        const isOver9000 = elements.counter.classList.contains('over9000');
        if (data.count === 10 && !isOver9000) {
            elements.counter.textContent = `Андрей пришел вовремя: OVER 9000!!!`;
            elements.counter.classList.add('over9000');
            setTimeout(() => {
                if (elements.counter.classList.contains('over9000')) {
                    elements.counter.textContent = `Андрей пришел вовремя: 10 раз`;
                    elements.counter.classList.remove('over9000');
                }
            }, 5000);
        } else if (data.count !== 10) {
            elements.counter.textContent = `Андрей пришел вовремя: ${data.count} раз`;
            elements.counter.classList.remove('over9000');
        }
        lastResetTime = data.lastResetTime;
        if (data.count === 0) { typeMessage(elements.statusMessage, "Андрей еще ни разу не пришел вовремя. Но мы верим."); }
    } catch (error) { console.error('Ошибка при загрузке данных:', error); elements.counter.textContent = 'Ошибка загрузки данных'; }
}

// Обновление таймера
function updateTimerDisplay() {
    const elapsedTime = Date.now() - lastResetTime;
    const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    if (days !== lastDayCount) {
        let message = "";
        if (days >= 30) { message = "Прошел месяц. Мы уже и забыли, как выглядит Андрей."; }
        else if (days >= 7) { message = "Прошла неделя. Пора высылать поисковую группу."; }
        else if (days >= 1) { message = `Прошло ${days} дня. Андрей, ты где?`; }
        else { message = "Ожидаем прибытия Андрея..."; }
        if (parseInt(elements.counter.textContent.split(': ')[1] || '1') > 0) { typeMessage(elements.statusMessage, message); }
        lastDayCount = days;
    }
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const formattedTime = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    elements.timer.textContent = formattedTime;
    document.title = `${formattedTime} | Андрей опаздывает`;
    if (days >= 2) { elements.timer.classList.add('glitch'); } else { elements.timer.classList.remove('glitch'); }
}

// --- ОБРАБОТЧИКИ СОБЫТИЙ ---

// Кнопки
elements.resetButton.addEventListener('click', async () => {
    elements.resetButton.disabled = true;
    try {
        elements.dramaticSound.currentTime = 0;
        elements.dramaticSound.play();
        const response = await fetch(`${API_URL}/api/reset`, { method: 'POST' });
        await fetchDataAndUpdateDisplay();
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    } catch (error) { console.error('Ошибка при сбросе таймера:', error); }
    finally { elements.resetButton.disabled = false; }
});
elements.fullResetButton.addEventListener('click', async () => {
    if (confirm('Вы уверены, что хотите отформатировать систему?')) {
        elements.fullResetButton.disabled = true;
        document.body.classList.add('shake');
        try { await fetch(`${API_URL}/api/full-reset`, { method: 'POST' }); await fetchDataAndUpdateDisplay(); }
        catch (error) { console.error('Ошибка при полном сбросе:', error); }
        finally { setTimeout(() => { document.body.classList.remove('shake'); elements.fullResetButton.disabled = false; }, 820); }
    }
});

// Кнопка-беглец (исправленная)
elements.resetButton.addEventListener('mouseover', () => {
    if (Math.random() > 0.75) {
        elements.resetButton.classList.add('runaway');
        const parentRect = elements.resetButton.parentElement.getBoundingClientRect();
        const buttonRect = elements.resetButton.getBoundingClientRect();
        const maxTop = parentRect.height - buttonRect.height;
        const maxLeft = parentRect.width - buttonRect.width;
        elements.resetButton.style.top = `${Math.random() * maxTop}px`;
        elements.resetButton.style.left = `${Math.random() * maxLeft}px`;
    }
});
elements.resetButton.addEventListener('mouseleave', () => {
    elements.resetButton.classList.remove('runaway');
    elements.resetButton.style.top = '';
    elements.resetButton.style.left = '';
});

// Остальные приколы
if (!localStorage.getItem('cookies_accepted')) { setTimeout(() => elements.cookieBanner.classList.add('show'), 2000); }
elements.acceptCookies.addEventListener('click', () => { localStorage.setItem('cookies_accepted', 'true'); elements.cookieBanner.classList.remove('show'); });
document.addEventListener('contextmenu', (e) => { e.preventDefault(); elements.customContextMenu.style.display = 'block'; elements.customContextMenu.style.top = `${e.pageY}px`; elements.customContextMenu.style.left = `${e.pageX}px`; });
document.addEventListener('click', () => { if (elements.customContextMenu) elements.customContextMenu.style.display = 'none'; });
setTimeout(() => { if (elements.fakeError) elements.fakeError.style.display = 'block'; }, Math.random() * 20000 + 10000);
elements.closeErrorBtn.addEventListener('click', () => elements.fakeError.style.display = 'none');
elements.okErrorBtn.addEventListener('click', () => elements.fakeError.style.display = 'none');
let isDragging = false, offsetX, offsetY;
const errorTitleBar = document.querySelector('.fake-error-titlebar');
if (errorTitleBar) {
    errorTitleBar.addEventListener('mousedown', (e) => { isDragging = true; offsetX = e.clientX - elements.fakeError.getBoundingClientRect().left; offsetY = e.clientY - elements.fakeError.getBoundingClientRect().top; });
    document.addEventListener('mousemove', (e) => { if (isDragging) { elements.fakeError.style.left = `${e.clientX - offsetX}px`; elements.fakeError.style.top = `${e.clientY - offsetY}px`; } });
    document.addEventListener('mouseup', () => isDragging = false);
}
setTimeout(() => { if(elements.updateNotification) { elements.updateNotification.classList.add('show'); setTimeout(() => elements.updateNotification.classList.remove('show'), 10000); } }, 25000);
if(elements.updateNotification) { elements.updateNotification.addEventListener('click', () => elements.updateNotification.classList.remove('show')); }
elements.uselessSwitch.addEventListener('click', () => { const originalText = elements.statusMessage.textContent; typeMessage(elements.statusMessage, "Этот переключатель ничего не делает. Но вы его нажали."); setTimeout(() => typeMessage(elements.statusMessage, originalText), 4000); });
setTimeout(() => { if(elements.clippy) elements.clippy.style.display = 'flex'; }, 45000);
elements.closeClippyBtn.addEventListener('click', () => elements.clippy.style.display = 'none');
setTimeout(() => { if(elements.paywall) elements.paywall.style.display = 'block'; }, 60000);
elements.closePaywall.addEventListener('click', () => elements.paywall.style.display = 'none');
setTimeout(() => {
    if(elements.fakeLoader) {
        elements.fakeLoader.style.display = 'block';
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 99) { clearInterval(interval); elements.fakeLoader.querySelector('p').textContent = 'Загрузка терпения... Ошибка.'; }
            else { width++; elements.loaderProgress.style.width = width + '%'; }
        }, 50);
    }
}, 90000);

// --- СЕКРЕТНЫЕ КОДЫ ---
let typedKeys = '';
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => {
    typedKeys = (typedKeys + e.key.toLowerCase()).slice(-8);
    if (typedKeys.endsWith('matrix')) { activateMatrix(); typedKeys = ''; }
    if (typedKeys.endsWith('chaos')) { document.body.classList.toggle('chaos'); typedKeys = ''; }
    if (typedKeys.endsWith('gravity')) { activateGravity(); typedKeys = ''; }
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            alert('Konami Activated!');
            const duration = 5 * 1000, end = Date.now() + duration;
            (function frame() { confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } }); confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } }); if (Date.now() < end) requestAnimationFrame(frame); }());
            konamiIndex = 0;
        }
    } else { konamiIndex = 0; }
});

// Функции для секретных кодов
function activateMatrix() { /* ... код без изменений ... */ }
function activateGravity() {
    const elements = Array.from(document.querySelector('.container').children);
    elements.forEach(el => {
        el.style.position = 'absolute'; el.style.transition = 'top 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        el.style.top = `${window.innerHeight - el.getBoundingClientRect().height}px`; el.style.left = `${el.getBoundingClientRect().left}px`;
    });
}
function activateMatrix() {
    elements.matrixCanvas.style.display = 'block';
    const ctx = elements.matrixCanvas.getContext('2d');
    elements.matrixCanvas.width = window.innerWidth; elements.matrixCanvas.height = window.innerHeight;
    const letters = 'AБBГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ123456789@#$%^&*()*&^%', fontSize = 16, columns = elements.matrixCanvas.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, elements.matrixCanvas.width, elements.matrixCanvas.height);
        ctx.fillStyle = '#0F0'; ctx.font = fontSize + 'px arial';
        for (let i = 0; i < drops.length; i++) {
            ctx.fillText(letters[Math.floor(Math.random() * letters.length)], i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > elements.matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 33);
}

// --- ПЕРИОДИЧЕСКИЕ ПРИКОЛЫ ---
setInterval(() => {
    if (Math.random() < 0.15) {
        const fakeAlerts = ["SYSTEM ALERT: Patience levels critical.", "WARNING: Hope module malfunctioning.", "QUERY: Is Andrey a myth?"];
        typeMessage(elements.statusMessage, fakeAlerts[Math.floor(Math.random() * fakeAlerts.length)]);
    }
}, 30000);

// --- ЗАПУСК ---
fetchDataAndUpdateDisplay();
setInterval(updateTimerDisplay, 1000);
