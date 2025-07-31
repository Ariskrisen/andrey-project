import { CONFIG } from '../config.js';
import { elements } from '../dom.js';
import { showElement, hideElement, randomDelay } from '../utils.js';
import { state } from '../state.js';

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
        setTimeout(() => showElement(elements.fakeError), randomDelay(CONFIG.FAKE_ERROR_DELAY));
        elements.closeErrorBtn.addEventListener('click', () => hideElement(elements.fakeError));
        elements.okErrorBtn.addEventListener('click', () => hideElement(elements.fakeError));
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
        elements.closeClippyBtn.addEventListener('click', () => hideElement(elements.clippy));
    }
}

function setupPaywall() {
    if(elements.paywall) {
        setTimeout(() => showElement(elements.paywall), CONFIG.PAYWALL_DELAY);
        elements.closePaywall.addEventListener('click', () => hideElement(elements.paywall));
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
                    if(elements.fakeLoader) elements.fakeLoader.querySelector('p').textContent = 'Загрузка терпения... Ошибка.';
                } else {
                    width++;
                    if(elements.loaderProgress) elements.loaderProgress.style.width = width + '%';
                }
            }, 50);
        }, CONFIG.FAKE_LOADER_DELAY);
    }
}

export function initOneTimePranks() {
    setupCookieBanner();
    setupFakeError();
    setupUpdateNotification();
    setupClippy();
    setupPaywall();
    setupFakeLoader();
}