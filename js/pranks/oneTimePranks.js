import { CONFIG } from '../config.js';
import { elements } from '../dom.js';
import { showElement, hideElement, randomDelay, showPrankMessage } from '../utils.js';

function setupCookieBanner() {
    if (!localStorage.getItem('cookies_accepted')) {
        setTimeout(() => showElement(elements.cookieBanner, true), CONFIG.COOKIE_BANNER_DELAY);
    }
    if (elements.acceptCookies) {
        elements.acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookies_accepted', 'true');
            hideElement(elements.cookieBanner, true);
        });
    }
}

function setupFakeError() {
    if (elements.fakeError) {
        setTimeout(() => {
            if(elements.xpErrorSound) elements.xpErrorSound.play();
            showElement(elements.fakeError);
        }, randomDelay(CONFIG.FAKE_ERROR_DELAY));
        if (elements.closeErrorBtn) elements.closeErrorBtn.addEventListener('click', () => hideElement(elements.fakeError));
        if (elements.okErrorBtn) elements.okErrorBtn.addEventListener('click', () => hideElement(elements.fakeError));
    }
}

function setupUpdateNotification() {
    if(elements.updateNotification) {
        setTimeout(() => {
            showElement(elements.updateNotification, true);
            setTimeout(() => hideElement(elements.updateNotification, true), 10000);
        }, CONFIG.UPDATE_NOTIFICATION_DELAY);
        elements.updateNotification.addEventListener('click', () => hideElement(elements.updateNotification, true));
    }
}

function setupClippy() {
    if(elements.clippy) {
        setTimeout(() => showElement(elements.clippy, false, 'flex'), CONFIG.CLIPPY_DELAY);
        if(elements.closeClippyBtn) elements.closeClippyBtn.addEventListener('click', () => hideElement(elements.clippy));
    }
}

function setupPaywall() {
    if(elements.paywall) {
        setTimeout(() => showElement(elements.paywall), CONFIG.PAYWALL_DELAY);
        if(elements.closePaywall) elements.closePaywall.addEventListener('click', () => hideElement(elements.paywall));
    }
}

function setupFakeLoader() {
    if(elements.fakeLoader) {
        setTimeout(() => {
            showElement(elements.fakeLoader);
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 99) {
                    clearInterval(interval);
                    if(elements.fakeLoader) {
                        elements.fakeLoader.querySelector('p').textContent = 'Загрузка терпения... Ошибка.';
                        setTimeout(() => {
                            hideElement(elements.fakeLoader);
                        }, 3000);
                    }
                } else {
                    width++;
                    if(elements.loaderProgress) elements.loaderProgress.style.width = width + '%';
                }
            }, 50);
        }, CONFIG.FAKE_LOADER_DELAY);
    }
}

function setupUselessSwitch() {
    if (elements.uselessSwitch) {
        elements.uselessSwitch.addEventListener('click', () => {
            showPrankMessage("Этот переключатель ничего не делает. Но вы его нажали.");
        });
    }
}

function setupBSOD() {
    if (!elements.bsod) return;
    setTimeout(() => {
        showElement(elements.bsod);
        const progress = document.getElementById('bsodProgress');
        let percent = 0;
        const interval = setInterval(() => {
            if (percent >= 100) {
                clearInterval(interval);
                // Можно добавить перезагрузку страницы для полного эффекта
                // location.reload();
            } else {
                percent++;
                if(progress) progress.textContent = percent;
            }
        }, 100);
    }, 120000); // Появится через 2 минуты
}

function setupMemoryLeak() {
    setTimeout(() => {
        if(elements.container) elements.container.style.transition = "all 2s ease-in";
        const meltables = [elements.counter, elements.timer, elements.statusMessage, elements.resetButton, elements.fullResetButton, document.querySelector('.container')];
        meltables.forEach(el => {
            if (el) el.classList.add('melting');
        });
    }, 180000); // Начнется через 3 минуты
}


export function initOneTimePranks() {
    setupCookieBanner();
    setupFakeError();
    setupUpdateNotification();
    setupClippy();
    setupPaywall();
    setupFakeLoader();
    setupUselessSwitch();
    setupBSOD();
    setupMemoryLeak();
}