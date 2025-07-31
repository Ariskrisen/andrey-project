// --- ВАЖНАЯ НАСТРОЙКА: Убедитесь, что здесь ваш правильный URL ---
const API_URL = 'https://andrey-project.onrender.com';

// --- Находим все-все-все элементы на странице ---
const elements = {};
['counter', 'timer', 'resetButton', 'fullResetButton', 'statusMessage',
 'dramaticSound', 'matrixCanvas', 'cookieBanner', 'acceptCookies',
 'customContextMenu', 'fakeError', 'updateNotification', 'uselessSwitch',
 'clippy', 'paywall', 'closePaywall', 'fakeLoader', 'shatterContainer',
 'duck', 'quackSound', 'xpErrorSound'].forEach(id => {
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
let godMode = false;

// --- ОСНОВНЫЕ ФУНКЦИИ ---
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

function updateTimerDisplay() {
    const now = Date.now();
    const effectiveTime = godMode ? (lastResetTime - (now - lastResetTime)) : now;
    const elapsedTime = effectiveTime - lastResetTime;
    const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    if (days !== lastDayCount) {
        let message = "Ожидаем прибытия Андрея...";
        if (days >= 30) { message = "Прошел месяц. Мы уже и забыли, как выглядит Андрей."; }
        else if (days >= 7) { message = "Прошла неделя. Пора высылать поисковую группу."; }
        else if (days >= 1) { message = `Прошло ${days} дня. Андрей, ты где?`; }
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
elements.resetButton.addEventListener('click', async () => {
    elements.resetButton.disabled = true;
    try {
        elements.dramaticSound.currentTime = 0;
        elements.dramaticSound.play();
        await fetch(`${API_URL}/api/reset`, { method: 'POST' });
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

elements.timer.addEventListener('click', () => {
    if (typeof html2canvas === 'function' && typeof anime === 'function') {
        shatterTimer(elements.timer);
    }
});

if (elements.acceptCookies) {
    if (!localStorage.getItem('cookies_accepted')) { setTimeout(() => elements.cookieBanner.classList.add('show'), 2000); }
    elements.acceptCookies.addEventListener('click', () => { localStorage.setItem('cookies_accepted', 'true'); elements.cookieBanner.classList.remove('show'); });
}

document.addEventListener('contextmenu', (e) => { e.preventDefault(); if (elements.customContextMenu) { elements.customContextMenu.style.display = 'block'; elements.customContextMenu.style.top = `${e.pageY}px`; elements.customContextMenu.style.left = `${e.pageX}px`; } });
document.addEventListener('click', () => { if (elements.customContextMenu) elements.customContextMenu.style.display = 'none'; });

if (elements.fakeError) {
    setTimeout(() => { elements.fakeError.style.display = 'block'; }, Math.random() * 20000 + 10000);
    elements.closeErrorBtn.addEventListener('click', () => elements.fakeError.style.display = 'none');
    elements.okErrorBtn.addEventListener('click', () => elements.fakeError.style.display = 'none');
    let isDragging = false, offsetX, offsetY;
    const errorTitleBar = document.querySelector('.fake-error-titlebar');
    if (errorTitleBar) {
        errorTitleBar.addEventListener('mousedown', (e) => { isDragging = true; offsetX = e.clientX - elements.fakeError.getBoundingClientRect().left; offsetY = e.clientY - elements.fakeError.getBoundingClientRect().top; });
        document.addEventListener('mousemove', (e) => { if (isDragging) { elements.fakeError.style.left = `${e.clientX - offsetX}px`; elements.fakeError.style.top = `${e.clientY - offsetY}px`; } });
        document.addEventListener('mouseup', () => isDragging = false);
    }
}

if (elements.updateNotification) {
    setTimeout(() => { elements.updateNotification.classList.add('show'); setTimeout(() => elements.updateNotification.classList.remove('show'), 10000); }, 25000);
    elements.updateNotification.addEventListener('click', () => elements.updateNotification.classList.remove('show'));
}

if (elements.uselessSwitch) {
    elements.uselessSwitch.addEventListener('click', () => { const originalText = elements.statusMessage.textContent; typeMessage(elements.statusMessage, "Этот переключатель ничего не делает. Но вы его нажали."); setTimeout(() => typeMessage(elements.statusMessage, originalText), 4000); });
}

if (elements.clippy) {
    setTimeout(() => { elements.clippy.style.display = 'flex'; }, 45000);
    elements.closeClippyBtn.addEventListener('click', () => elements.clippy.style.display = 'none');
}

if (elements.paywall) {
    setTimeout(() => { elements.paywall.style.display = 'block'; }, 60000);
    elements.closePaywall.addEventListener('click', () => elements.paywall.style.display = 'none');
}

if (elements.fakeLoader) {
    setTimeout(() => {
        elements.fakeLoader.style.display = 'block';
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 99) { clearInterval(interval); elements.fakeLoader.querySelector('p').textContent = 'Загрузка терпения... Ошибка.'; }
            else { width++; elements.loaderProgress.style.width = width + '%'; }
        }, 50);
    }, 90000);
}

// --- СЕКРЕТНЫЕ КОДЫ ---
let typedKeys = '';
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => {
    typedKeys = (typedKeys + e.key.toLowerCase()).slice(-8);
    if (typedKeys.endsWith('matrix')) { activateMatrix(); typedKeys = ''; }
    if (typedKeys.endsWith('chaos')) { document.body.classList.toggle('chaos'); typedKeys = ''; }
    if (typedKeys.endsWith('gravity')) { activateGravity(); typedKeys = ''; }
    if (typedKeys.endsWith('iddqd')) { typeMessage(elements.statusMessage, 'GOD MODE ACTIVATED'); godMode = true; setTimeout(() => { godMode = false; typeMessage(elements.statusMessage, 'GOD MODE DEACTIVATED'); }, 5000); typedKeys = ''; }
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

// Функции для секретных кодов и приколов
function shatterTimer(element) { /* ... */ } // Сокращено для краткости, код тот же
function activateMatrix() { /* ... */ }
function activateGravity() { /* ... */ }

// --- ПЕРИОДИЧЕСКИЕ ПРИКОЛЫ ---
setInterval(() => { if (Math.random() < 0.1) { const fakeAlerts = ["SYSTEM ALERT: Patience levels critical.", "WARNING: Hope module malfunctioning.", "QUERY: Is Andrey a myth?", "LOADING... Still no sign of Andrey.", "ERROR 404: Andrey not found.", "Initiating Plan B: Keep waiting.", "Checking under the couch... No Andrey.", "Ищем Андрея в тени ожиданий.", "Андрей задерживается на неопределённое время.", "Андрей на паузе. Вернётся, когда захочет.", "Current status: Waiting for Andrey...", "Time since last Andrey sighting: ∞", "MISSION FAILED: No Andrey today.", "Он придёт... Наверное.", "Система скучает по Андрею.", "А может, Андрей — это ты?", "WARNING: Андрей испарился в киберпространстве.", "Пока вы ждёте, послушайте немного тишины.", "Уровень ожидания: Критический.", "Андрей снова вышел за хлебом.", "PINGING ANDREY... No response.", "CALCULATING ETA... Undefined.", "Зачем ждать, если можно ждать Андрея?", "Он обещал быть. Мы всё ещё верим.", "AI THINKS: Андрей прячется.", "System Task: Do not lose hope.", "Где-то там... бродит Андрей.", "Если видели Андрея — позвоните нам.", "Сайт живёт только ради него.", "Андрей задержался на уровне бытия.", "Поиск Андрея по альтернативной временной шкале...", "Андрей offline. Но мы надеемся.", "Rebooting reality... Андрей не загрузился.", "Is this Schrödinger’s Andrey?", "We’ve sent a search party. Again.", "Nothing new. Андрей всё ещё не с нами.", "Andrey has been delayed due to plot twists.", "Status: Пропал между строк.", "The prophecy spoke of his coming...", "Uploading... Андрей всё ещё загружается.", "Космос молчит. Андрей тоже.", "Recompiling patience.exe", "Терпение на пределе. Но мы держимся.", "Hope is a dangerous thing for a site like this.", "Андрей скоро? Спросите у звёзд.", "Last seen: в мечтах.", "Сайт создан, чтобы ждать Андрея. Всё остальное — вторично.", "Не паниковать. Просто Андрей забыл про нас.", "ANDREY DETECTED... False alarm.", "System Update: Still waiting.", "Сбой в линии Андрея. Повторите попытку позже.", "Андрей? Алло? Приём?", "We've checked the matrix. Андрей — вне зоны.", "Please insert Андрей to continue.", "Молитвы отправлены. Ответа нет.", "Chrono-syncing... No Андрей in this timeline.", "Пойду сварю чай. Может, к тому времени придёт.", "Андрей в пути. Скорость: 0.01 км/год.", "It's not a bug, it's Андрей.", "Zero Andrey. Maximum vibe.", "Have you tried turning Андрей off and on again?", "ERROR: Time loop detected. Андрей всё ещё не здесь.", "Это ожидание уже стало искусством.", "Ghost of Андрей haunts this server.", "Loading... Но Андрей не грузится.", "Are you Андрей? Please confirm.", "Андрей, ты где, родной?", "System forecast: Cloudy with a chance of Андрей.", "Андрей так и не зашёл в чат.", "Ждали час... Ждём дальше.", "А может, он в отпуске?", "Each second without Андрей — вечность.", "WARNING: User may develop dependency on Андрей.", "Server uptime: 99.99% — Андрей uptime: 0%", "The longer you wait, the stronger he returns.", "Может, он и не существует? Задумайся.", "This is fine. *всё горит*", "Still loading Андрей... Might take a while.", "Your Андрей is in another castle.", "Have faith. Or at least Wi-Fi.", "Time dilation detected: Андрей is late.", "404 Андрей not in this universe.", "Курс рубля стабильнее, чем приход Андрея.", "Всё спокойно... как перед приходом Андрея.", "Подозрительная тишина. Андрей где-то рядом?", "Запахло кофе... но не Андреем.", "Одинокий сервер в ожидании героя.", "Andrey.exe has stopped responding.", "Скоро будет. Наверное. Возможно. Нет.", "Проверка астрала: Андрей не замечен.", "The prophecy delays.", "Not all heroes wear capes. Некоторые просто опаздывают.", "Meanwhile... в мире без Андрея.", "Свет моргает. Может, это знак?", "Такое чувство, что Андрей был только сном.", "Waiting is temporary. Андрей — вечен.", "Андрей, если ты это читаешь — зайди уже."]; typeMessage(elements.statusMessage, fakeAlerts[Math.floor(Math.random() * fakeAlerts.length)]); } }, 30000);
setInterval(() => { if (Math.random() < 0.1) { document.body.classList.add('tilted'); setTimeout(() => document.body.classList.remove('tilted'), 2000); } }, 40000);
setInterval(() => { if (Math.random() < 0.15 && elements.duck) { elements.duck.classList.add('show'); elements.quackSound.play(); setTimeout(() => elements.duck.classList.remove('show'), 4000); } }, 50000);
setInterval(() => { if (Math.random() < 0.05) { elements.xpErrorSound.play(); } }, 60000);

// --- ЗАПУСК ---
fetchDataAndUpdateDisplay();
setInterval(updateTimerDisplay, 1000);
