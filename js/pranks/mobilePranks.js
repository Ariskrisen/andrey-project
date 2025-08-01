import { CONFIG } from '../config.js';

let lastShakeTime = 0;

function handleDeviceMotion(event) {
    const now = Date.now();
    if (now - lastShakeTime < 5000) return; // 5 секунд "перезарядка"

    const { x, y, z } = event.accelerationIncludingGravity;
    if (x === null || y === null || z === null) return;
    
    const acceleration = Math.sqrt(x*x + y*y + z*z);
    
    if (acceleration > CONFIG.SHAKE_THRESHOLD) {
        lastShakeTime = now;
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 200,
                spread: 180,
                startVelocity: 40,
                gravity: 0.5
            });
        }
    }
}

function requestMotionPermission() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleDeviceMotion);
                }
            })
            .catch(console.error);
    } else {
        window.addEventListener('devicemotion', handleDeviceMotion);
    }
}

export function initMobilePranks() {
    if ('DeviceMotionEvent' in window) {
        document.body.addEventListener('click', requestMotionPermission, { once: true });
    }
}