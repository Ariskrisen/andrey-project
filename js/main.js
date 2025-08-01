import { CONFIG } from './config.js';
import { elements, findDOMElements } from './dom.js';
import { state } from './state.js';
import { typeMessage } from './utils.js';

import { initOneTimePranks } from './pranks/oneTimePranks.js';
import { runPeriodicPranks } from './pranks/periodicPranks.js';
import { initInteractivePranks, setFetchDataAndUpdateDisplay } from './pranks/interactivePranks.js';
import { initSecretCodes } from './pranks/secretCodes.js';
import { initMobilePranks } from './pranks/mobilePranks.js';

async function fetchDataAndUpdateDisplay() {
    try {
        const response = await fetch(CONFIG.API_URL + '/api/data');
        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
        const data = await response.json();
        state.lastResetTime = new Date(data.lastResetTime).getTime();
        updateCounter(data.count);
        // Убрали отсюда обновление сообщения, чтобы оно не конфликтовало с приколами
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        if(elements.counter) elements.counter.textContent = 'Ошибка загрузки данных';
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

function updateTimerDisplay() {
    const now = Date.now();
    const effectiveTime = state.godMode ? (state.lastResetTime - (now - state.lastResetTime)) : now;
    const elapsedTime = Math.max(0, effectiveTime - state.lastResetTime);
    const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));

    if (days !== state.lastDayCount) {
        let message = "Ожидаем прибытия Андрея...";
        if (days >= 30) { message = "Прошел месяц. Мы уже и забыли, как выглядит Андрей."; }
        else if (days >= 7) { message = "Прошла неделя. Пора высылать поисковую группу."; }
        else if (days >= 1) { message = `Прошло ${days} дня. Андрей, ты где?`; }
        
        const currentCountText = elements.counter ? elements.counter.textContent.split(': ')[1] : '1';
        if (currentCountText && currentCountText.includes("раз") && !state.isPrankMessageActive) {
            typeMessage(elements.statusMessage, message);
        }
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

function gameLoop() {
    if (!state.isTabActive) return;
    state.tick++;
    updateTimerDisplay();
    runPeriodicPranks();
}

function init() {
    findDOMElements();
    setFetchDataAndUpdateDisplay(fetchDataAndUpdateDisplay);
    
    initInteractivePranks();
    initOneTimePranks();
    initSecretCodes();
    initMobilePranks();

    document.addEventListener('visibilitychange', () => {
        state.isTabActive = document.visibilityState === 'visible';
        if (state.isTabActive) {
            console.log("Tab is active, fetching data...");
            fetchDataAndUpdateDisplay();
        }
    });

    fetchDataAndUpdateDisplay();
    setInterval(gameLoop, 1000);
}

document.addEventListener('DOMContentLoaded', init);```