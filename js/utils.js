import { state } from './state.js';
import { elements } from './dom.js';

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

export function randomDelay(config) {
    return Math.random() * (config.max - config.min) + config.min;
}

// Новая утилита для временных сообщений
export function showPrankMessage(message, duration = 4000) {
    if (state.isPrankMessageActive || !elements.statusMessage) return; 
    
    state.isPrankMessageActive = true;
    const originalText = elements.statusMessage.textContent;
    typeMessage(elements.statusMessage, message);
    
    setTimeout(() => {
        typeMessage(elements.statusMessage, originalText);
        state.isPrankMessageActive = false;
    }, duration);
}

// НОВАЯ УЛУЧШЕННАЯ ФУНКЦИЯ для Скрепыша
export function showClippyWithMessage(message, duration = null) {
    if (!elements.clippy) return;
    
    const bubble = elements.clippy.querySelector('.clippy-bubble');
    if (bubble) bubble.textContent = message;
    
    showElement(elements.clippy, false, 'flex');
    
    // Если указана длительность, Скрепыш сам исчезнет
    if (duration) {
        setTimeout(() => {
            hideElement(elements.clippy);
        }, duration);
    }
}