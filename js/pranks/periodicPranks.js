import { CONFIG } from '../config.js';
import { elements } from '../dom.js';
import { typeMessage } from '../utils.js';
import { state } from '../state.js';

function triggerRandomAlert() {
    const alerts = ["SYSTEM ALERT: Patience levels critical.", "WARNING: Hope module malfunctioning.", "QUERY: Is Andrey a myth?"];
    typeMessage(elements.statusMessage, alerts[Math.floor(Math.random() * alerts.length)]);
}
function triggerTilt() {
    document.body.classList.add('tilted');
    setTimeout(() => document.body.classList.remove('tilted'), 2000);
}
function triggerDuck() {
    if (elements.duck && elements.quackSound) {
        elements.duck.classList.add('show');
        elements.quackSound.play();
        setTimeout(() => elements.duck.classList.remove('show'), 4000);
    }
}
function triggerXpErrorSound() {
    if(elements.xpErrorSound) elements.xpErrorSound.play();
}

export function runPeriodicPranks() {
    if (state.tick % CONFIG.RANDOM_ALERTS_INTERVAL === 0 && Math.random() < 0.25) triggerRandomAlert();
    if (state.tick % CONFIG.TILT_INTERVAL === 0 && Math.random() < 0.2) triggerTilt();
    if (state.tick % CONFIG.DUCK_INTERVAL === 0 && Math.random() < 0.2) triggerDuck();
    if (state.tick % CONFIG.XP_ERROR_SOUND_INTERVAL === 0 && Math.random() < 0.15) triggerXpErrorSound();
}