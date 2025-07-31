// НАСТРОЙКА: Сюда вы вставите URL вашего сервера после его загрузки на Render
const API_URL = 'https://your-backend-url.onrender.com'; // <-- ЗАМЕНИТЬ ПОЗЖЕ

// Находим наши элементы на странице
const counterElement = document.getElementById('counter');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('resetButton');

let lastResetTime = Date.now(); // Локальная переменная для таймера

// Функция для получения данных с сервера и обновления страницы
async function fetchDataAndUpdateDisplay() {
    try {
        const response = await fetch(`${API_URL}/api/data`);
        const data = await response.json();

        // Обновляем счетчик
        counterElement.textContent = `Андрей пришел вовремя: ${data.count} раз`;
        
        // Сохраняем время последнего сброса с сервера
        lastResetTime = data.lastResetTime;
        
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        counterElement.textContent = 'Ошибка загрузки данных';
    }
}

// Функция, которая просто обновляет таймер на экране каждую секунду
function updateTimerDisplay() {
    const elapsedTime = Date.now() - lastResetTime;

    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));

    const formattedTime = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    timerElement.textContent = formattedTime;
}

// --- Логика при нажатии на кнопку ---
resetButton.addEventListener('click', async () => {
    try {
        // Отправляем POST-запрос на сервер для сброса
        const response = await fetch(`${API_URL}/api/reset`, {
            method: 'POST',
        });
        const data = await response.json();

        // После успешного сброса, обновляем данные на странице
        counterElement.textContent = `Андрей пришел вовремя: ${data.count} раз`;
        lastResetTime = data.lastResetTime; // Обновляем локальное время
        updateTimerDisplay(); // Сразу показываем 00:00:00

    } catch (error) {
        console.error('Ошибка при сбросе таймера:', error);
    }
});


// --- Инициализация при загрузке страницы ---

// 1. Сначала получаем актуальные данные с сервера
fetchDataAndUpdateDisplay();

// 2. Запускаем тиканье таймера каждую секунду
setInterval(updateTimerDisplay, 1000);