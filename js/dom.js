export const elements = {};
const elementIds = ['counter', 'timer', 'resetButton', 'fullResetButton', 'statusMessage',
 'dramaticSound', 'matrixCanvas', 'cookieBanner', 'acceptCookies',
 'customContextMenu', 'fakeError', 'updateNotification', 'uselessSwitch',
 'clippy', 'paywall', 'closePaywall', 'fakeLoader', 'shatterContainer',
 'duck', 'quackSound', 'xpErrorSound'];

export function findDOMElements() {
    elementIds.forEach(id => {
        elements[id] = document.getElementById(id);
    });
    elements.closeErrorBtn = document.querySelector('#fakeError .close-btn');
    elements.okErrorBtn = document.querySelector('#fakeError .ok-btn');
    elements.closeClippyBtn = document.querySelector('#clippy .close-btn');
    elements.loaderProgress = document.querySelector('.loader-progress');
}