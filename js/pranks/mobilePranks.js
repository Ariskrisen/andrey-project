import { CONFIG } from '../config.js';

function handleDeviceMotion(event) {
    const { x, y, z } = event.accelerationIncludingGravity;
    if (x === null || y === null || z === null) return; // Проверка на наличие данных
    
    const acceleration = Math.sqrt(x*x + y*y + z*z);
    
    if (acceleration > CONFIG.SHAKE_THRESHOLD) {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 200,
                spread: 180,
                startVelocity: 40,
                gravity: 0.5
            });
        }
        // Временно убираем обработчик, чтобы избежать многократных срабатываний
        window.removeEventListener('devicemotion', handleDeviceMotion);
        // Возвращаем его через 5 секунд ("перезарядка")
        setTimeout(() => {
            window.addEventListener('devicemotion', handleDeviceMotion);
        }, 5000);
    }
}

function requestMotionPermission() {
    // Для iOS 13+
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleDeviceMotion);
                }
            })
            .catch(console.error);
    } else {
        // Для Android и других устройств, не требующих явного разрешения
        window.addEventListener('devicemotion', handleDeviceMotion);
    }
}

export function initMobilePranks() {
    // Проверяем, поддерживает ли браузер вообще это событие
    if ('DeviceMotionEvent' in window) {
        // Запрос разрешения сработает по первому клику/тапу пользователя на странице
        document.body.addEventListener('click', requestMotionPermission, { once: true });
    }
}