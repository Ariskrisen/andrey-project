export const elements = {};

export function findDOMElements() {
    const elementIds = ['counter', 'timer', 'resetButton', 'fullResetButton', 'statusMessage',
     'dramaticSound', 'matrixCanvas', 'cookieBanner', 'acceptCookies',
     'customContextMenu', 'fakeError', 'updateNotification', 'uselessSwitch',
     'clippy', 'paywall', 'closePaywall', 'fakeLoader', 'shatterContainer',
     'duck', 'quackSound', 'xpErrorSound'];
    
    elementIds.forEach(id => {
        elements[id] = document.getElementById(id);
    });
    // Находим кнопки по их новым ID
    elements.closeErrorBtn = document.getElementById('closeErrorBtn');
    elements.okErrorBtn = document.getElementById('okErrorBtn');
    elements.closeClippyBtn = document.getElementById('closeClippyBtn');
    elements.loaderProgress = document.querySelector('.loader-progress');
}