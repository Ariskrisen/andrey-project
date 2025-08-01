import { elements } from '../dom.js';
import { state } from '../state.js';
import { CONFIG } from '../config.js';
import { showElement, hideElement, showPrankMessage } from '../utils.js';

let fetchDataAndUpdateDisplay;

export function setFetchDataAndUpdateDisplay(fn) {
    fetchDataAndUpdateDisplay = fn;
}

// --- Прикол №1: Анти-накрутка (ИСПРАВЛЕННАЯ ВЕРСИЯ) ---
const antiCheat = {
    clicks: 0,
    time: Date.now(),
    limit: 5,
    duration: 10000,
    isActive: false,
    lastGoodState: { count: 0, time: 0 }
};

async function onReset() {
    if (antiCheat.isActive) return;

    const now = Date.now();
    if (now - antiCheat.time > antiCheat.duration) {
        antiCheat.clicks = 0;
        antiCheat.time = now;
        const countText = elements.counter ? elements.counter.textContent.split(': ')[1] : '0';
        antiCheat.lastGoodState.count = parseInt(countText, 10) || 0;
        antiCheat.lastGoodState.time = state.lastResetTime;
    }
    
    antiCheat.clicks++;

    if (antiCheat.clicks >= antiCheat.limit) {
        triggerAntiCheat();
        return;
    }

    elements.resetButton.disabled = true;
    try {
        if (elements.dramaticSound) { elements.dramaticSound.currentTime = 0; elements.dramaticSound.play(); }
        // Отправляем запрос как обычно
        await fetch(CONFIG.API_URL + '/api/reset', { method: 'POST' });
        // Просим main.js обновить данные с сервера
        document.dispatchEvent(new CustomEvent('updateData')); 
        if(typeof confetti === 'function') confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    } catch (error) { console.error('Ошибка при сбросе таймера:', error); }
    finally { elements.resetButton.disabled = false; }
}

function triggerAntiCheat() {
    antiCheat.isActive = true;
    const overlay = document.createElement('div');
    overlay.className = 'anti-cheat-overlay';
    overlay.innerHTML = '<h1>ХВАТИТ НАКРУЧИВАТЬ!</h1>';
    document.body.appendChild(overlay);

    setTimeout(() => overlay.classList.add('show'), 10);
    document.body.classList.add('shake');

    // 1. Откатываем UI немедленно
    if(elements.counter) elements.counter.textContent = `Андрей пришел вовремя: ${antiCheat.lastGoodState.count} раз`;
    state.lastResetTime = antiCheat.lastGoodState.time;

    // 2. ИСПРАВЛЕНО: Отправляем команду на сервер, чтобы откатить базу данных
    fetch(CONFIG.API_URL + '/api/force-state', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(antiCheat.lastGoodState) // Отправляем "хорошее" состояние
    }).catch(err => console.error("Не удалось откатить состояние на сервере:", err));

    // 3. Убираем оверлей
    setTimeout(() => {
        overlay.classList.remove('show');
        document.body.classList.remove('shake');
        setTimeout(() => {
            overlay.remove();
            antiCheat.clicks = 0;
            antiCheat.isActive = false;
        }, 500);
    }, 3000);
}

async function onFullReset() {
    if (confirm('Вы уверены, что хотите отформатировать систему?')) {
        elements.fullResetButton.disabled = true;
        document.body.classList.add('shake');
        try {
            await fetch(CONFIG.API_URL + '/api/full-reset', { method: 'POST' });
            // Отправляем событие для обновления данных
            document.dispatchEvent(new CustomEvent('updateData'));
        }
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

let isShattering = false;
function shatterTimer(element) {
    if (isShattering || !element || typeof html2canvas !== 'function' || typeof anime !== 'function' || element.style.opacity === '0') return;
    isShattering = true;
    const rect = element.getBoundingClientRect();
    html2canvas(element, { backgroundColor: null }).then(canvas => {
        element.style.opacity = '0';
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const particleSize = 8;
        for (let y = 0; y < canvas.height; y += particleSize) {
            for (let x = 0; x < canvas.width; x += particleSize) {
                if (imageData[(y * canvas.width + x) * 4 + 3] > 128) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.width = `${particleSize}px`; particle.style.height = `${particleSize}px`;
                    particle.style.position = 'fixed';
                    particle.style.top = `${rect.top + y}px`; particle.style.left = `${rect.left + x}px`;
                    elements.shatterContainer.appendChild(particle);
                    anime({ targets: particle, translateX: (Math.random() - 0.5) * 40, translateY: [0, window.innerHeight - rect.top - y + 50], opacity: [1, 0], duration: Math.random() * 1500 + 1000, easing: 'easeInQuad',
                        complete: () => particle.remove() });
                }
            }
        }
        setTimeout(() => { element.style.opacity = '1'; isShattering = false; }, 2500);
    });
}

function setupDragAndDrop() {
    const errorTitleBar = document.querySelector('.fake-error-titlebar');
    if (errorTitleBar) {
        errorTitleBar.addEventListener('mousedown', (e) => {
            state.isDragging = true;
            state.offsetX = e.clientX - elements.fakeError.getBoundingClientRect().left;
            state.offsetY = e.clientY - elements.fakeError.getBoundingClientRect().top;
            elements.fakeError.style.opacity = '0.8';
        });
        document.addEventListener('mousemove', (e) => {
            if (state.isDragging) {
                elements.fakeError.style.left = `${e.clientX - state.offsetX}px`;
                elements.fakeError.style.top = `${e.clientY - state.offsetY}px`;
            }
        });
        document.addEventListener('mouseup', () => {
            state.isDragging = false;
            if (elements.fakeError) elements.fakeError.style.opacity = '1';
        });
    }
}

function setupVirusCursor() {
    if (!elements.virusCursor) return;
    document.addEventListener('mousemove', (e) => {
        if (elements.virusCursor.style.display !== 'block') {
            elements.virusCursor.style.display = 'block';
        }
        elements.virusCursor.style.transform = `translate(${e.clientX + 10}px, ${e.clientY + 10}px)`;
    }, { once: true });
}

function setupScrollResistance() {
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        document.body.classList.add('shake');
        showPrankMessage("Скролл не является валидной командой.");
        setTimeout(() => document.body.classList.remove('shake'), 820);
    }, { passive: false });
}

function setupGlitchedText() {
    const glitchables = [elements.counter, elements.statusMessage];
    glitchables.forEach(el => {
        if (el) {
            el.addEventListener('click', () => {
                el.classList.add('text-glitch');
                setTimeout(() => el.classList.remove('text-glitch'), 300);
            });
        }
    });
}

function setupHackerInput() {
    document.addEventListener('keydown', (e) => {
        if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== 'Enter') return;
        const keyEl = document.createElement('span');
        keyEl.className = 'hacker-key';
        keyEl.textContent = e.key === ' ' ? '_' : e.key;
        keyEl.style.top = `${Math.random() * 90}vh`;
        keyEl.style.left = `${Math.random() * 90}vw`;
        document.body.appendChild(keyEl);
        anime({ targets: keyEl, opacity: [1, 0], translateY: [0, -50], duration: 1500, easing: 'easeOutExpo',
            complete: () => keyEl.remove() });
    });
}

function setupInteractiveClippy() {
    if (!elements.clippy) return;
    const eyeLeft = document.createElement('div');
    const eyeRight = document.createElement('div');
    eyeLeft.className = 'eye left';
    eyeRight.className = 'eye right';
    elements.clippy.appendChild(eyeLeft);
    elements.clippy.appendChild(eyeRight);

    document.addEventListener('mousemove', (e) => {
        if (getComputedStyle(elements.clippy).display === 'none') return;
        const eyeRect = eyeLeft.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        const moveX = Math.cos(angle) * 2;
        const moveY = Math.sin(angle) * 2;
        eyeLeft.style.transform = `translate(${moveX}px, ${moveY}px)`;
        eyeRight.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
}

export function initInteractivePranks(fetchDataFn) {
    // ВАЖНО: Убедитесь, что эта функция вызывается в main.js!
    // setFetchDataAndUpdateDisplay(fetchDataFn); - эта строка больше не нужна
    
    if (elements.resetButton) {
        elements.resetButton.addEventListener('click', onReset);
        elements.resetButton.addEventListener('mouseover', onRunawayButtonMouseOver);
        elements.resetButton.addEventListener('mouseleave', onRunawayButtonMouseLeave);
    }
    if (elements.fullResetButton) elements.fullResetButton.addEventListener('click', onFullReset);
    if (elements.timer) elements.timer.addEventListener('click', () => shatterTimer(elements.timer));
    
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (elements.customContextMenu) {
            showElement(elements.customContextMenu, false, 'block');
            elements.customContextMenu.style.top = `${e.pageY}px`;
            elements.customContextMenu.style.left = `${e.pageX}px`;
        }
    });
    document.addEventListener('click', () => { if (elements.customContextMenu) hideElement(elements.customContextMenu); });
    
    setupDragAndDrop();
    setupVirusCursor();
    setupScrollResistance();
    setupGlitchedText();
    setupHackerInput();
    setupInteractiveClippy();
}