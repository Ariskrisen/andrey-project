// НАСТРОЙКА: Убедитесь, что здесь ваш правильный URL с Render.com
const API_URL = 'https://andrey-project.onrender.com'; // Пример, используйте ваш URL!

// Находим все элементы на странице
const counterElement = document.getElementById('counter');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('resetButton');
const fullResetButton = document.getElementById('fullResetButton'); // <-- НОВАЯ кнопка

let lastResetTime = Date.now();

// Функция получения данных с сервера (без изменений)
async function fetchDataAndUpdateDisplay() {
    try {
        const response = await fetch(`${API_URL}/api/data`);
        const data = await response.json();
        counterElement.textContent = `Андрей пришел вовремя: ${data.count} раз`;
        lastResetTime = data.lastResetTime;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        counterElement.textContent = 'Ошибка загрузки данных';
    }
}

// Функция обновления таймера (без изменений)
function updateTimerDisplay() {
    const elapsedTime = Date.now() - lastResetTime;
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    const formattedTime = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerElement.textContent = formattedTime;
}

// --- Логика для ОСНОВНОЙ кнопки "Андрей пришел!" ---
resetButton.addEventListener('click', async () => {
    // Делаем кнопку неактивной, чтобы избежать двойных нажатий
    resetButton.disabled = true; 
    try {
        const response = await fetch(`${API_URL}/api/reset`, { method: 'POST' });
        const data = await response.json();

        // Обновляем данные на странице
        counterElement.textContent = `Андрей пришел вовремя: ${data.count} раз`;
        lastResetTime = data.lastResetTime;
        updateTimerDisplay();

        // --- ЗАПУСКАЕМ КОНФЕТТИ! ---
        confetti({
            particleCount: 150, // Количество частиц
            spread: 90,       // Разброс
            origin: { y: 0.6 }  // Откуда вылетают (чуть выше центра)
        });

    } catch (error) {
        console.error('Ошибка при сбросе таймера:', error);
    } finally {
        // Возвращаем кнопку в активное состояние
        resetButton.disabled = false; 
    }
});

// --- НОВАЯ ЛОГИКА для кнопки "Сбросить счетчик" ---
fullResetButton.addEventListener('click', async () => {
    // Спрашиваем подтверждение, так как действие необратимо
    const isConfirmed = confirm('Вы уверены, что хотите сбросить ВЕСЬ счетчик на 0?');

    if (isConfirmed) {
        fullResetButton.disabled = true; // Блокируем кнопку на время запроса
        try {
            // Отправляем запрос на новый маршрут /api/full-reset
            const response = await fetch(`${API_URL}/api/full-reset`, { method: 'POST' });
            const data = await response.json();

            // Обновляем данные на странице
            counterElement.textContent = `Андрей пришел вовремя: ${data.count} раз`;
            lastResetTime = data.lastResetTime;
            updateTimerDisplay();

        } catch (error) {
            console.error('Ошибка при полном сбросе:', error);
        } finally {
            fullResetButton.disabled = false; // Разблокируем кнопку
        }
    }
});


// --- Инициализация при загрузке страницы ---
fetchDataAndUpdateDisplay();
setInterval(updateTimerDisplay, 1000);
