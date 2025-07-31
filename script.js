// --- Находим все элементы, старые и новые ---
const API_URL = 'https://andrey-project.onrender.com';
const counterElement = document.getElementById('counter');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('resetButton');
const fullResetButton = document.getElementById('fullResetButton');
const statusMessageElement = document.getElementById('statusMessage');
const dramaticSound = document.getElementById('dramaticSound');
const matrixCanvas = document.getElementById('matrixCanvas');
// Новые элементы
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesBtn = document.getElementById('acceptCookies');
const customContextMenu = document.getElementById('customContextMenu');
const fakeError = document.getElementById('fakeError');
const closeErrorBtn = document.getElementById('closeError');
const okErrorBtn = document.getElementById('okError');

// --- Старые функции (без изменений) ---
async function fetchDataAndUpdateDisplay() { /* ... */ }
function updateTimerDisplay() { /* ... */ }
function activateMatrix() { /* ... */ }
resetButton.addEventListener('click', async () => { /* ... */ });
fullResetButton.addEventListener('click', async () => { /* ... */ });
resetButton.addEventListener('mouseover', () => { /* ... */ });
setInterval(() => { /* ...фальшивые алерты... */ }, 30000);

// --- ПРИКОЛ №1: Логика баннера Cookie ---
// Показываем баннер, если пользователь его еще не "принял"
if (!localStorage.getItem('cookies_accepted')) {
    setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 2000); // Появляется через 2 секунды
}
acceptCookiesBtn.addEventListener('click', () => {
    localStorage.setItem('cookies_accepted', 'true');
    cookieBanner.classList.remove('show');
});


// --- ПРИКОЛ №2: Логика кастомного меню ---
document.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Отменяем стандартное меню
    customContextMenu.style.top = `${e.pageY}px`;
    customContextMenu.style.left = `${e.pageX}px`;
    customContextMenu.style.display = 'block';
});
// Скрываем меню при обычном клике
document.addEventListener('click', () => {
    customContextMenu.style.display = 'none';
});


// --- ПРИКОЛ №4: Логика фальшивого окна ошибки ---
// Появление окна через случайное время
setTimeout(() => {
    fakeError.style.display = 'block';
}, Math.random() * 20000 + 10000); // Появится через 10-30 секунд

// Закрытие окна
closeErrorBtn.addEventListener('click', () => fakeError.style.display = 'none');
okErrorBtn.addEventListener('click', () => fakeError.style.display = 'none');

// Логика перетаскивания окна
let isDragging = false;
let offsetX, offsetY;
const errorTitleBar = fakeError.querySelector('.fake-error-titlebar');

errorTitleBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - fakeError.getBoundingClientRect().left;
    offsetY = e.clientY - fakeError.getBoundingClientRect().top;
    fakeError.style.opacity = '0.8'; // Делаем полупрозрачным при перетаскивании
});
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        fakeError.style.left = `${e.clientX - offsetX}px`;
        fakeError.style.top = `${e.clientY - offsetY}px`;
    }
});
document.addEventListener('mouseup', () => {
    isDragging = false;
    fakeError.style.opacity = '1';
});


// --- Секретные коды (Matrix и Konami) ---
let matrixTyped = '';
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => {
    // Код для Matrix
    matrixTyped = (matrixTyped + e.key.toLowerCase()).slice(-6);
    if (matrixTyped === 'matrix') { activateMatrix(); matrixTyped = ''; }
    // Код для Konami
    if (e.key === konamiCode[konamiIndex]) { konamiIndex++; if (konamiIndex === konamiCode.length) { /* ...логика конфетти... */ konamiIndex = 0; } } else { konamiIndex = 0; }
});


// --- Копируем сюда полные версии старых функций, чтобы ничего не сломалось ---
async function fetchDataAndUpdateDisplay() { try { const response = await fetch(`${API_URL}/api/data`); const data = await response.json(); counterElement.textContent = `Андрей пришел вовремя: ${data.count} раз`; lastResetTime = data.lastResetTime; if (data.count === 0) { statusMessageElement.textContent = "Андрей еще ни разу не пришел вовремя. Но мы верим."; } } catch (error) { console.error('Ошибка при загрузке данных:', error); counterElement.textContent = 'Ошибка загрузки данных'; } }
function updateTimerDisplay() { const elapsedTime = Date.now() - lastResetTime; const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24)); if (days !== lastDayCount) { let message = ""; if (days >= 30) { message = "Прошел месяц. Мы уже и забыли, как выглядит Андрей."; } else if (days >= 7) { message = "Прошла неделя. Пора высылать поисковую группу."; } else if (days >= 1) { message = `Прошло ${days} дня. Андрей, ты где?`; } else { message = "Ожидаем прибытия Андрея..."; } if (parseInt(counterElement.textContent.split(': ')[1] || '1') > 0) { statusMessageElement.textContent = message; } lastDayCount = days; } const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24); const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60); const seconds = Math.floor((elapsedTime / 1000) % 60); const formattedTime = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; timerElement.textContent = formattedTime; document.title = `${formattedTime} | Андрей опаздывает`; if (days >= 2) { timerElement.classList.add('glitch'); } else { timerElement.classList.remove('glitch'); } }
resetButton.addEventListener('click', async () => { resetButton.disabled = true; try { dramaticSound.currentTime = 0; dramaticSound.play(); const response = await fetch(`${API_URL}/api/reset`, { method: 'POST' }); const data = await response.json(); await fetchDataAndUpdateDisplay(); lastResetTime = data.lastResetTime; updateTimerDisplay(); confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } }); } catch (error) { console.error('Ошибка при сбросе таймера:', error); } finally { resetButton.disabled = false; } });
fullResetButton.addEventListener('click', async () => { const isConfirmed = confirm('Вы уверены, что хотите отформатировать систему и сбросить ВЕСЬ счетчик на 0?'); if (isConfirmed) { fullResetButton.disabled = true; document.body.classList.add('shake'); try { const response = await fetch(`${API_URL}/api/full-reset`, { method: 'POST' }); const data = await response.json(); await fetchDataAndUpdateDisplay(); lastResetTime = data.lastResetTime; updateTimerDisplay(); } catch (error) { console.error('Ошибка при полном сбросе:', error); } finally { setTimeout(() => { document.body.classList.remove('shake'); fullResetButton.disabled = false; }, 820); } } });
resetButton.addEventListener('mouseover', () => { if (Math.random() > 0.5) { resetButton.classList.add('runaway'); const containerRect = resetButton.parentElement.getBoundingClientRect(); const buttonRect = resetButton.getBoundingClientRect(); const newTop = Math.random() * (containerRect.height - buttonRect.height); const newLeft = Math.random() * (containerRect.width - buttonRect.width); resetButton.style.top = `${newTop}px`; resetButton.style.left = `${newLeft}px`; } });
const fakeAlerts = ["SYSTEM ALERT: Patience levels critical.", "WARNING: Hope module malfunctioning.", "QUERY: Is Andrey a myth?", "LOG: User seems bored. Initiating distraction protocol.", "ERROR 418: I'm a teapot, not a waiting room."]; setInterval(() => { if (Math.random() < 0.15) { const randomAlert = fakeAlerts[Math.floor(Math.random() * fakeAlerts.length)]; statusMessageElement.textContent = randomAlert; } }, 30000);
document.addEventListener('keydown', (e) => { if (e.key === konamiCode[konamiIndex]) { konamiIndex++; if (konamiIndex === konamiCode.length) { alert('Секретный код активирован!'); const duration = 5 * 1000; const end = Date.now() + duration; (function frame() { confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } }); confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } }); if (Date.now() < end) { requestAnimationFrame(frame); } }()); konamiIndex = 0; } } else { konamiIndex = 0; } });

// --- Запускаем всё! ---
fetchDataAndUpdateDisplay();
setInterval(updateTimerDisplay, 1000);
