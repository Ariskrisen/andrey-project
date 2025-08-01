import { elements } from '../dom.js';
import { state } from '../state.js';
import { CONFIG } from '../config.js';
import { showElement, hideElement, showPrankMessage } from '../utils.js';

let fetchDataAndUpdateDisplay;

export function setFetchDataAndUpdateDisplay(fn) {
    fetchDataAndUpdateDisplay = fn;
}

// --- Старые интерактивные приколы ---
async function onReset() { /* ... код без изменений ... */ }
async function onFullReset() { /* ... код без изменений ... */ }
function onRunawayButtonMouseOver(e) { /* ... код без изменений ... */ }
function onRunawayButtonMouseLeave(e) { /* ... код без изменений ... */ }
let isShattering = false;
function shatterTimer(element) { /* ... код без изменений ... */ }
function setupDragAndDrop() { /* ... код без изменений ... */ }


// --- НОВЫЕ ИНТЕРАКТИВНЫЕ ПРИКОЛЫ ---

// Прикол №1: Курсор-вирус
function setupVirusCursor() {
    if (!elements.virusCursor) return;
    document.addEventListener('mousemove', (e) => {
        // Показываем вирус только после первого движения
        if (elements.virusCursor.style.display !== 'block') {
            elements.virusCursor.style.display = 'block';
        }
        elements.virusCursor.style.transform = `translate(${e.clientX + 10}px, ${e.clientY + 10}px)`;
    });
}

// Прикол №2: Скролл-сопротивление
function setupScrollResistance() {
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        document.body.classList.add('shake');
        showPrankMessage("Скролл не является валидной командой.");
        setTimeout(() => document.body.classList.remove('shake'), 820);
    }, { passive: false });
}

// Прикол №3: Глючный текст
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

// Прикол №4: Хакерский ввод
function setupHackerInput() {
    document.addEventListener('keydown', (e) => {
        // Игнорируем служебные клавиши, чтобы не засорять экран
        if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== 'Enter') return;
        
        const keyEl = document.createElement('span');
        keyEl.className = 'hacker-key';
        keyEl.textContent = e.key === ' ' ? '_' : e.key;
        
        // Позиционируем в случайном месте
        keyEl.style.top = `${Math.random() * 90}vh`;
        keyEl.style.left = `${Math.random() * 90}vw`;
        
        document.body.appendChild(keyEl);
        
        // Анимируем и удаляем
        anime({
            targets: keyEl,
            opacity: [1, 0],
            translateY: [0, -50],
            duration: 1500,
            easing: 'easeOutExpo',
            complete: () => keyEl.remove()
        });
    });
}


// --- Главная функция инициализации ---

export function initInteractivePranks(fetchDataFn) {
    fetchDataAndUpdateDisplay = fetchDataFn;
    
    // Старые обработчики
    if (elements.resetButton) { /* ... */ }
    if (elements.fullResetButton) { /* ... */ }
    if (elements.timer) { /* ... */ }
    document.addEventListener('contextmenu', (e) => { /* ... */ });
    document.addEventListener('click', () => { /* ... */ });
    setupDragAndDrop();

    // Запускаем новые приколы
    setupVirusCursor();
    setupScrollResistance();
    setupGlitchedText();
    setupHackerInput();
}