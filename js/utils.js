import { state } from './state.js';

export function typeMessage(element, message) {
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

export function showElement(element, useClass = false, displayType = 'block') {
    if (element) {
        if (useClass) element.classList.add('show');
        else element.style.display = displayType;
    }
}

export function hideElement(element, useClass = false) {
    if (element) {
        if (useClass) element.classList.remove('show');
        else element.style.display = 'none';
    }
}

// ДОБАВЬТЕ ЭТОТ ФРАГМЕНТ В КОНЕЦ ФАЙЛА utils.js

export function randomDelay(config) {
    return Math.random() * (config.max - config.min) + config.min;
}
