import { elements } from '../dom.js';
import { state } from '../state.js';
import { CONFIG } from '../config.js';
import { showElement, hideElement } from '../utils.js';

let fetchDataAndUpdateDisplay;

export function setFetchDataAndUpdateDisplay(fn) {
    fetchDataAndUpdateDisplay = fn;
}

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
        try {
            await fetch(CONFIG.API_URL + '/api/full-reset', { method: 'POST' });
            await fetchDataAndUpdateDisplay();
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
    
    // ИСПРАВЛЕНО: Получаем точные координаты таймера на странице
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
                    particle.style.width = `${particleSize}px`;
                    particle.style.height = `${particleSize}px`;
                    // ИСПРАВЛЕНО: Позиционируем осколки точно там, где был таймер
                    particle.style.position = 'fixed';
                    particle.style.top = `${rect.top + y}px`;
                    particle.style.left = `${rect.left + x}px`;
                    elements.shatterContainer.appendChild(particle);
                    
                    anime({
                        targets: particle,
                        translateX: (Math.random() - 0.5) * 40,
                        translateY: [0, window.innerHeight - rect.top - y + 50], // Падают чуть ниже экрана
                        opacity: [1, 0],
                        duration: Math.random() * 1500 + 1000,
                        easing: 'easeInQuad',
                        complete: () => particle.remove()
                    });
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

export function initInteractivePranks(fetchDataFn) {
    fetchDataAndUpdateDisplay = fetchDataFn;
    
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
}