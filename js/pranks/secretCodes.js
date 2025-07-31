import { elements } from '../dom.js';
import { state } from '../state.js';
import { typeMessage } from '../utils.js';

function activateMatrix() {
    if (!elements.matrixCanvas) return;
    elements.matrixCanvas.style.display = 'block';
    const ctx = elements.matrixCanvas.getContext('2d');
    elements.matrixCanvas.width = window.innerWidth;
    elements.matrixCanvas.height = window.innerHeight;
    const letters = 'AБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ123456789@#$%^&*()*&^%';
    const fontSize = 16;
    const columns = elements.matrixCanvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, elements.matrixCanvas.width, elements.matrixCanvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px arial';
        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > elements.matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 40);
}

function activateGravity() {
    const container = document.querySelector('.container');
    if (!container) return;
    const elems = Array.from(container.children);
    elems.forEach(el => {
        // Делаем копию, чтобы не ломать основной элемент
        const clone = el.cloneNode(true);
        const rect = el.getBoundingClientRect();
        clone.style.position = 'absolute';
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;
        clone.style.margin = '0';
        document.body.appendChild(clone);
        
        anime({
            targets: clone,
            top: window.innerHeight,
            rotate: (Math.random() - 0.5) * 720,
            easing: 'easeInQuad',
            duration: 2000,
            complete: () => clone.remove()
        });
    });
}

export function initSecretCodes() {
    let typedKeys = '';
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        typedKeys = (typedKeys + e.key.toLowerCase()).slice(-8);
        if (typedKeys.endsWith('matrix')) { activateMatrix(); typedKeys = ''; }
        if (typedKeys.endsWith('chaos')) { document.body.classList.toggle('chaos'); typedKeys = ''; }
        if (typedKeys.endsWith('gravity')) { activateGravity(); typedKeys = ''; }
        if (typedKeys.endsWith('iddqd')) {
            typeMessage(elements.statusMessage, 'GOD MODE ACTIVATED');
            state.godMode = true;
            setTimeout(() => {
                state.godMode = false;
                typeMessage(elements.statusMessage, 'GOD MODE DEACTIVATED');
            }, 5000);
            typedKeys = '';
        }

        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                if(typeof confetti === 'function') {
                    const duration = 5 * 1000, end = Date.now() + duration;
                    (function frame() {
                        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
                        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
                        if (Date.now() < end) requestAnimationFrame(frame);
                    }());
                }
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}