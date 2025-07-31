(function () {
    'use strict';

    // (I) ЦЕНТР УПРАВЛЕНИЯ: Все настройки в одном месте
    const CONFIG = {
        API_URL: 'https://andrey-project.onrender.com',
        // Задержки для одноразовых приколов (в миллисекундах)
        COOKIE_BANNER_DELAY: 2000,
        FAKE_ERROR_DELAY: { min: 15000, max: 25000 },
        UPDATE_NOTIFICATION_DELAY: 30000,
        CLIPPY_DELAY: 45000,
        PAYWALL_DELAY: 60000,
        FAKE_LOADER_DELAY: 90000,
        // Периоды для повторяющихся приколов (в секундах)
        RANDOM_ALERTS_INTERVAL: 30,
        TILT_INTERVAL: 40,
        DUCK_INTERVAL: 50,
        XP_ERROR_SOUND_INTERVAL: 60,
    };

    // (II) РЕЕСТР ЭЛЕМЕНТОВ: Находим все элементы один раз
    const elements = {};
    const elementIds = ['counter', 'timer', 'resetButton', 'fullResetButton', 'statusMessage',
     'dramaticSound', 'matrixCanvas', 'cookieBanner', 'acceptCookies',
     'customContextMenu', 'fakeError', 'updateNotification', 'uselessSwitch',
     'clippy', 'paywall', 'closePaywall', 'fakeLoader', 'shatterContainer',
     'duck', 'quackSound', 'xpErrorSound'];
    
    elementIds.forEach(id => {
        elements[id] = document.getElementById(id);
    });
    elements.closeErrorBtn = document.querySelector('#fakeError .close-btn');
    elements.okErrorBtn = document.querySelector('#fakeError .ok-btn');
    elements.closeClippyBtn = document.querySelector('#clippy .close-btn');
    elements.loaderProgress = document.querySelector('.loader-progress');

    // (III) СОСТОЯНИЕ САЙТА: Все переменные в одном объекте
    const state = {
        lastResetTime: Date.now(),
        lastDayCount: -1,
        isTyping: false,
        godMode: false,
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        tick: 0,
        mainInterval: null,
        isTabActive: true,
        prankScheduler: []
    };

    // --- ОСНОВНЫЕ ФУНКЦИИ ---

    function typeMessage(element, message) {
        if (state.isTyping || !element) return;
        state.isTyping = true;
        let index = 0;
        element.textContent = '';
        const interval = setInterval(() => {
            if (index < message.length) {
                element.textContent += message.charAt(index);
                index++;
            } else {
                clearInterval(interval);
                state.isTyping = false;
            }
        }, 50);
    }

    async function fetchDataAndUpdateDisplay() {
        try {
            const response = await fetch(CONFIG.API_URL + '/api/data');
            const data = await response.json();
            state.lastResetTime = data.lastResetTime;
            updateCounter(data.count);
            if (data.count === 0) { typeMessage(elements.statusMessage, "Андрей еще ни разу не пришел вовремя. Но мы верим."); }
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            elements.counter.textContent = 'Ошибка загрузки данных';
        }
    }
    
    function updateCounter(count) {
        if (!elements.counter) return;
        const isOver9000 = elements.counter.classList.contains('over9000');
        if (count === 10 && !isOver9000) {
            elements.counter.textContent = `Андрей пришел вовремя: OVER 9000!!!`;
            elements.counter.classList.add('over9000');
            setTimeout(() => {
                if (elements.counter.classList.contains('over9000')) {
                    elements.counter.textContent = `Андрей пришел вовремя: 10 раз`;
                    elements.counter.classList.remove('over9000');
                }
            }, 5000);
        } else if (count !== 10) {
            elements.counter.textContent = `Андрей пришел вовремя: ${count} раз`;
            elements.counter.classList.remove('over9000');
        }
    }
    
    // (IV) ЕДИНЫЙ ИГРОВОЙ ЦИКЛ: Сердце сайта
    function gameLoop() {
        if (!state.isTabActive) return; // Экономим ресурсы
        state.tick++;
        updateTimerDisplay();
        
        if (state.tick % CONFIG.RANDOM_ALERTS_INTERVAL === 0 && Math.random() < 0.25) triggerRandomAlert();
        if (state.tick % CONFIG.TILT_INTERVAL === 0 && Math.random() < 0.2) triggerTilt();
        if (state.tick % CONFIG.DUCK_INTERVAL === 0 && Math.random() < 0.2) triggerDuck();
        if (state.tick % CONFIG.XP_ERROR_SOUND_INTERVAL === 0 && Math.random() < 0.15) triggerXpErrorSound();
    }

    function updateTimerDisplay() {
        const now = Date.now();
        const effectiveTime = state.godMode ? (state.lastResetTime - (now - state.lastResetTime)) : now;
        const elapsedTime = effectiveTime - state.lastResetTime;
        const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));

        if (days !== state.lastDayCount) {
            let message = "Ожидаем прибытия Андрея...";
            if (days >= 30) { message = "Прошел месяц. Мы уже и забыли, как выглядит Андрей."; }
            else if (days >= 7) { message = "Прошла неделя. Пора высылать поисковую группу."; }
            else if (days >= 1) { message = `Прошло ${days} дня. Андрей, ты где?`; }
            const currentCountText = elements.counter ? elements.counter.textContent.split(': ')[1] : '1';
            if (currentCountText !== "0 раз" && currentCountText) { typeMessage(elements.statusMessage, message); }
            state.lastDayCount = days;
        }

        const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        const seconds = Math.floor((elapsedTime / 1000) % 60);
        const formattedTime = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (elements.timer) elements.timer.textContent = formattedTime;
        document.title = `${formattedTime} | Андрей опаздывает`;
        
        if (elements.timer) {
            if (days >= 2) { elements.timer.classList.add('glitch'); } 
            else { elements.timer.classList.remove('glitch'); }
        }
    }

    // --- ФУНКЦИИ-ПРИКОЛЫ ---
    function triggerRandomAlert() { const alerts = ["SYSTEM ALERT: Patience levels critical.", "WARNING: Hope module malfunctioning.", "QUERY: Is Andrey a myth?", "LOADING... Still no sign of Andrey.", "ERROR 404: Andrey not found.", "Initiating Plan B: Keep waiting.", "Checking under the couch... No Andrey.", "Ищем Андрея в тени ожиданий.", "Андрей задерживается на неопределённое время.", "Андрей на паузе. Вернётся, когда захочет.", "Current status: Waiting for Andrey...", "Time since last Andrey sighting: ∞", "MISSION FAILED: No Andrey today.", "Он придёт... Наверное.", "Система скучает по Андрею.", "А может, Андрей — это ты?", "WARNING: Андрей испарился в киберпространстве.", "Пока вы ждёте, послушайте немного тишины.", "Уровень ожидания: Критический.", "Андрей снова вышел за хлебом.", "PINGING ANDREY... No response.", "CALCULATING ETA... Undefined.", "Зачем ждать, если можно ждать Андрея?", "Он обещал быть. Мы всё ещё верим.", "AI THINKS: Андрей прячется.", "System Task: Do not lose hope.", "Где-то там... бродит Андрей.", "Если видели Андрея — позвоните нам.", "Сайт живёт только ради него.", "Андрей задержался на уровне бытия.", "Поиск Андрея по альтернативной временной шкале...", "Андрей offline. Но мы надеемся.", "Rebooting reality... Андрей не загрузился.", "Is this Schrödinger’s Andrey?", "We’ve sent a search party. Again.", "Nothing new. Андрей всё ещё не с нами.", "Andrey has been delayed due to plot twists.", "Status: Пропал между строк.", "The prophecy spoke of his coming...", "Uploading... Андрей всё ещё загружается.", "Космос молчит. Андрей тоже.", "Recompiling patience.exe", "Терпение на пределе. Но мы держимся.", "Hope is a dangerous thing for a site like this.", "Андрей скоро? Спросите у звёзд.", "Last seen: в мечтах.", "Сайт создан, чтобы ждать Андрея. Всё остальное — вторично.", "Не паниковать. Просто Андрей забыл про нас.", "ANDREY DETECTED... False alarm.", "System Update: Still waiting.", "Сбой в линии Андрея. Повторите попытку позже.", "Андрей? Алло? Приём?", "We've checked the matrix. Андрей — вне зоны.", "Please insert Андрей to continue.", "Молитвы отправлены. Ответа нет.", "Chrono-syncing... No Андрей in this timeline.", "Пойду сварю чай. Может, к тому времени придёт.", "Андрей в пути. Скорость: 0.01 км/год.", "It's not a bug, it's Андрей.", "Zero Andrey. Maximum vibe.", "Have you tried turning Андрей off and on again?", "ERROR: Time loop detected. Андрей всё ещё не здесь.", "Это ожидание уже стало искусством.", "Ghost of Андрей haunts this server.", "Loading... Но Андрей не грузится.", "Are you Андрей? Please confirm.", "Андрей, ты где, родной?", "System forecast: Cloudy with a chance of Андрей.", "Андрей так и не зашёл в чат.", "Ждали час... Ждём дальше.", "А может, он в отпуске?", "Each second without Андрей — вечность.", "WARNING: User may develop dependency on Андрей.", "Server uptime: 99.99% — Андрей uptime: 0%", "The longer you wait, the stronger he returns.", "Может, он и не существует? Задумайся.", "This is fine. *всё горит*", "Still loading Андрей... Might take a while.", "Your Андрей is in another castle.", "Have faith. Or at least Wi-Fi.", "Time dilation detected: Андрей is late.", "404 Андрей not in this universe.", "Курс рубля стабильнее, чем приход Андрея.", "Всё спокойно... как перед приходом Андрея.", "Подозрительная тишина. Андрей где-то рядом?", "Запахло кофе... но не Андреем.", "Одинокий сервер в ожидании героя.", "Andrey.exe has stopped responding.", "Скоро будет. Наверное. Возможно. Нет.", "Проверка астрала: Андрей не замечен.", "The prophecy delays.", "Not all heroes wear capes. Некоторые просто опаздывают.", "Meanwhile... в мире без Андрея.", "Свет моргает. Может, это знак?", "Такое чувство, что Андрей был только сном.", "Waiting is temporary. Андрей — вечен.", "Андрей, если ты это читаешь — зайди уже."]; typeMessage(elements.statusMessage, alerts[Math.floor(Math.random() * alerts.length)]); }
    function triggerTilt() { document.body.classList.add('tilted'); setTimeout(() => document.body.classList.remove('tilted'), 2000); }
    function triggerDuck() { if (elements.duck) { elements.duck.classList.add('show'); elements.quackSound.play(); setTimeout(() => elements.duck.classList.remove('show'), 4000); } }
    function triggerXpErrorSound() { if(elements.xpErrorSound) elements.xpErrorSound.play(); }

    function shatterTimer(element) {
        if (!element || typeof html2canvas !== 'function' || typeof anime !== 'function') return;
        html2canvas(element, { backgroundColor: null }).then(canvas => {
            element.style.opacity = '0';
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            const particleSize = 4;
            for (let y = 0; y < canvas.height; y += particleSize) {
                for (let x = 0; x < canvas.width; x += particleSize) {
                    if (imageData[(y * canvas.width + x) * 4 + 3] > 128) {
                        const particle = document.createElement('div');
                        particle.className = 'particle';
                        particle.style.width = `${particleSize}px`; particle.style.height = `${particleSize}px`;
                        const rect = element.getBoundingClientRect();
                        particle.style.top = `${rect.top + y}px`; particle.style.left = `${rect.left + x}px`;
                        elements.shatterContainer.appendChild(particle);
                        anime({ targets: particle, translateX: (Math.random() - 0.5) * 30, translateY: [0, window.innerHeight - rect.top - y], opacity: [1, 0], duration: Math.random() * 1500 + 1000, easing: 'easeInQuad',
                            complete: () => particle.remove() });
                    }
                }
            }
            setTimeout(() => element.style.opacity = '1', 2500);
        });
    }
    
    // --- ОБРАБОТЧИКИ СОБЫТИЙ ---
    async function onReset() {
        elements.resetButton.disabled = true;
        try {
            if (elements.dramaticSound) { elements.dramaticSound.currentTime = 0; elements.dramaticSound.play(); }
            await fetch(CONFIG.API_URL + '/api/reset', { method: 'POST' });
            await fetchDataAndUpdateDisplay();
            if(typeof confetti === 'function') confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        } catch (error) { console.error('Ошибка при сбросе таймера:', error); }
        finally { elements.resetButton.disabled = false; }
    }
    
    async function onFullReset() {
        if (confirm('Вы уверены, что хотите отформатировать систему?')) {
            elements.fullResetButton.disabled = true;
            document.body.classList.add('shake');
            try { await fetch(CONFIG.API_URL + '/api/full-reset', { method: 'POST' }); await fetchDataAndUpdateDisplay(); }
            catch (error) { console.error('Ошибка при полном сбросе:', error); }
            finally { setTimeout(() => { document.body.classList.remove('shake'); elements.fullResetButton.disabled = false; }, 820); }
        }
    }
    
    function onRunawayButtonMouseOver(e) {
        if (Math.random() > 0.75) {
            const button = e.target;
            button.classList.add('runaway');
            const parentRect = button.parentElement.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();
            const maxTop = parentRect.height - buttonRect.height;
            const maxLeft = parentRect.width - buttonRect.width;
            button.style.top = `${Math.random() * maxTop}px`;
            button.style.left = `${Math.random() * maxLeft}px`;
        }
    }
    
    function onRunawayButtonMouseLeave(e) {
        const button = e.target;
        button.classList.remove('runaway');
        button.style.top = '';
        button.style.left = '';
    }

    // --- ИНИЦИАЛИЗАЦИЯ ---
    function init() {
        Object.keys(elements).forEach(key => {
            if (!elements[key]) console.warn(`Элемент "${key}" не найден. Некоторые приколы могут не работать.`);
        });
        
        setupEventListeners();
        setupOneTimePranks();
        
        fetchDataAndUpdateDisplay();
        state.mainInterval = setInterval(gameLoop, 1000);
    }

    function setupEventListeners() {
        if (elements.resetButton) {
            elements.resetButton.addEventListener('click', onReset);
            elements.resetButton.addEventListener('mouseover', onRunawayButtonMouseOver);
            elements.resetButton.addEventListener('mouseleave', onRunawayButtonMouseLeave);
        }
        if (elements.fullResetButton) elements.fullResetButton.addEventListener('click', onFullReset);
        if (elements.timer) elements.timer.addEventListener('click', () => shatterTimer(elements.timer));
        if (elements.acceptCookies) elements.acceptCookies.addEventListener('click', () => { localStorage.setItem('cookies_accepted', 'true'); elements.cookieBanner.classList.remove('show'); });
        if (elements.closeErrorBtn) elements.closeErrorBtn.addEventListener('click', () => elements.fakeError.style.display = 'none');
        if (elements.okErrorBtn) elements.okErrorBtn.addEventListener('click', () => elements.fakeError.style.display = 'none');
        if (elements.updateNotification) elements.updateNotification.addEventListener('click', () => elements.updateNotification.classList.remove('show'));
        if (elements.uselessSwitch) elements.uselessSwitch.addEventListener('click', () => { const originalText = elements.statusMessage.textContent; typeMessage(elements.statusMessage, "Этот переключатель ничего не делает. Но вы его нажали."); setTimeout(() => typeMessage(elements.statusMessage, originalText), 4000); });
        if (elements.closeClippyBtn) elements.closeClippyBtn.addEventListener('click', () => elements.clippy.style.display = 'none');
        if (elements.closePaywall) elements.closePaywall.addEventListener('click', () => elements.paywall.style.display = 'none');

        document.addEventListener('contextmenu', (e) => { e.preventDefault(); if (elements.customContextMenu) { elements.customContextMenu.style.display = 'block'; elements.customContextMenu.style.top = `${e.pageY}px`; elements.customContextMenu.style.left = `${e.pageX}px`; } });
        document.addEventListener('click', () => { if (elements.customContextMenu) elements.customContextMenu.style.display = 'none'; });
        const errorTitleBar = document.querySelector('.fake-error-titlebar');
        if (errorTitleBar) {
            errorTitleBar.addEventListener('mousedown', (e) => { state.isDragging = true; state.offsetX = e.clientX - elements.fakeError.getBoundingClientRect().left; state.offsetY = e.clientY - elements.fakeError.getBoundingClientRect().top; });
            document.addEventListener('mousemove', (e) => { if (state.isDragging) { elements.fakeError.style.left = `${e.clientX - state.offsetX}px`; elements.fakeError.style.top = `${e.clientY - state.offsetY}px`; } });
            document.addEventListener('mouseup', () => state.isDragging = false);
        }
        
        document.addEventListener('visibilitychange', () => {
            state.isTabActive = document.visibilityState === 'visible';
            if (state.isTabActive) fetchDataAndUpdateDisplay();
        });
        
        setupSecretCodes();
    }
    
    function setupOneTimePranks() {
        if (!localStorage.getItem('cookies_accepted')) {
            setTimeout(() => showElement(elements.cookieBanner, true), CONFIG.COOKIE_BANNER_DELAY);
        }
        const pranks = [
            { func: () => showElement(elements.fakeError), delay: Math.random() * (CONFIG.FAKE_ERROR_DELAY.max - CONFIG.FAKE_ERROR_DELAY.min) + CONFIG.FAKE_ERROR_DELAY.min },
            { func: () => { showElement(elements.updateNotification, true); setTimeout(() => hideElement(elements.updateNotification, true), 10000); }, delay: CONFIG.UPDATE_NOTIFICATION_DELAY },
            { func: () => showElement(elements.clippy, false, 'flex'), delay: CONFIG.CLIPPY_DELAY },
            { func: () => showElement(elements.paywall), delay: CONFIG.PAYWALL_DELAY },
            { func: () => {
                showElement(elements.fakeLoader);
                let width = 0;
                const interval = setInterval(() => {
                    if (width >= 99) { clearInterval(interval); if(elements.fakeLoader) elements.fakeLoader.querySelector('p').textContent = 'Загрузка терпения... Ошибка.'; }
                    else { width++; if(elements.loaderProgress) elements.loaderProgress.style.width = width + '%'; }
                }, 50);
            }, delay: CONFIG.FAKE_LOADER_DELAY },
        ];
        pranks.forEach(prank => state.prankScheduler.push(setTimeout(prank.func, prank.delay)));
    }

    function showElement(element, useClass = false, displayType = 'block') { if (element) { if (useClass) element.classList.add('show'); else element.style.display = displayType; } }
    function hideElement(element, useClass = false) { if (element) { if (useClass) element.classList.remove('show'); else element.style.display = 'none'; } }
    
    // --- СЕКРЕТНЫЕ КОДЫ ---
    function setupSecretCodes() {
        let typedKeys = '';
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;
        
        document.addEventListener('keydown', (e) => {
            typedKeys = (typedKeys + e.key.toLowerCase()).slice(-8);
            if (typedKeys.endsWith('matrix')) { activateMatrix(); typedKeys = ''; }
            if (typedKeys.endsWith('chaos')) { document.body.classList.toggle('chaos'); typedKeys = ''; }
            if (typedKeys.endsWith('gravity')) { activateGravity(); typedKeys = ''; }
            if (typedKeys.endsWith('iddqd')) {
                typeMessage(elements.statusMessage, 'GOD MODE ACTIVATED');
                state.godMode = true;
                setTimeout(() => { state.godMode = false; typeMessage(elements.statusMessage, 'GOD MODE DEACTIVATED'); }, 5000);
                typedKeys = '';
            }
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    if(typeof confetti === 'function') {
                        const duration = 5 * 1000, end = Date.now() + duration;
                        (function frame() { confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } }); confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } }); if (Date.now() < end) requestAnimationFrame(frame); }());
                    }
                    konamiIndex = 0;
                }
            } else { konamiIndex = 0; }
        });
    }

    function activateMatrix() {
        if (!elements.matrixCanvas) return;
        elements.matrixCanvas.style.display = 'block';
        const ctx = elements.matrixCanvas.getContext('2d');
        elements.matrixCanvas.width = window.innerWidth; elements.matrixCanvas.height = window.innerHeight;
        const letters = 'AБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ123456789@#$%^&*()*&^%', fontSize = 16, columns = elements.matrixCanvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
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
        setInterval(drawMatrix, 40);
    }

    function activateGravity() {
        const container = document.querySelector('.container');
        if (!container) return;
        const elems = Array.from(container.children);
        elems.forEach(el => {
            el.style.position = 'absolute';
            el.style.transition = 'top 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            el.style.top = `${window.innerHeight - el.getBoundingClientRect().height}px`;
            el.style.left = `${el.getBoundingClientRect().left}px`;
        });
    }
    
    // --- ЗАПУСК ---
    document.addEventListener('DOMContentLoaded', init);

})();
