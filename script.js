// УБЕДИТЕСЬ, ЧТО ЗДЕСЬ ВАШ ПРАВИЛЬНЫЙ URL С RENDER.COM
const API_URL = 'https://andrey-project.onrender.com'; // Используйте ваш URL!

// Находим все элементы на странице
const counterElement = document.getElementById('counter');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('resetButton');
const fullResetButton = document.getElementById('fullResetButton');
const statusMessageElement = document.getElementById('statusMessage'); // <-- Наш новый элемент

let lastResetTime = Date.now();
let lastDayCount = -1; // Для отслеживания смены дня

// Функция получения данных (без изменений)
async function fetchDataAndUpdateDisplay() {
    try {
        const response = await fetch(`${API_URL}/api/data`);
        const data = await response.json();
        counterElement.textContent = `Андрей пришел вовремя: ${data.count} раз`;
        lastResetTime = data.lastResetTime;
        // Если счетчик 0, покажем особое сообщение
        if (data.count === 0) {
            statusMessageElement.textContent = "Андрей еще ни разу не пришел вовремя. Но мы верим.";
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        counterElement.textContent = 'Ошибка загрузки данных';
    }
}

// Обновленная функция обновления таймера и сообщений
function updateTimerDisplay() {
    const elapsedTime = Date.now() - lastResetTime;
    const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    
    // ФИШКА №1: Динамические сообщения
    // Проверяем, изменился ли день, чтобы не обновлять DOM постоянно
    if (days !== lastDayCount) {
        let message = "";
        if (days >= 30) {
            message = "Прошел месяц. Мы уже и забыли, как выглядит Андрей.";
        } else if (days >= 7) {
            message = "Прошла неделя. Пора высылать поисковую группу.";
        } else if (days >= 1) {
            message = `Прошло ${days} дня. Андрей, ты где?`;
        } else {
            message = "Ожидаем прибытия Андрея...";
        }
        // Не трогаем сообщение, если счетчик на нуле
        if (parseInt(counterElement.textContent.split(': ')[1] || '1') > 0) {
           statusMessageElement.textContent = message;
        }
        lastDayCount = days;
    }

    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const formattedTime = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    timerElement.textContent = formattedTime;

    // ФИШКА №2: "Живой" заголовок вкладки
    document.title = `${formattedTime} | Андрей опаздывает`;
}


// Логика кнопки "Андрей пришел!" (без изменений, кроме confetti)
resetButton.addEventListener('click', async () => {
    resetButton.disabled = true;
    try {
        const response = await fetch(`${API_URL}/api/reset`, { method: 'POST' });
        const data = await response.json();
        await fetchDataAndUpdateDisplay(); // Обновляем данные и сообщение
        lastResetTime = data.lastResetTime;
        updateTimerDisplay();
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    } catch (error) {
        console.error('Ошибка при сбросе таймера:', error);
    } finally {
        resetButton.disabled = false;
    }
});

// Логика кнопки "Сбросить счетчик" (с эффектом тряски)
fullResetButton.addEventListener('click', async () => {
    const isConfirmed = confirm('Вы уверены, что хотите отформатировать систему и сбросить ВЕСЬ счетчик на 0?');
    if (isConfirmed) {
        fullResetButton.disabled = true;

        // ФИШКА №3: Эффект тряски
        document.body.classList.add('shake');

        try {
            const response = await fetch(`${API_URL}/api/full-reset`, { method: 'POST' });
            const data = await response.json();
            await fetchDataAndUpdateDisplay();
            lastResetTime = data.lastResetTime;
            updateTimerDisplay();
        } catch (error) {
            console.error('Ошибка при полном сбросе:', error);
        } finally {
            // Убираем класс тряски после анимации
            setTimeout(() => {
                document.body.classList.remove('shake');
                fullResetButton.disabled = false;
            }, 820); // 820ms - длительность анимации
        }
    }
});

// --- ФИШКА №4: СЕКРЕТНЫЙ КОД ---
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Код введен верно! Устраиваем вечеринку!
            alert('Секретный код активирован!');
            const duration = 5 * 1000;
            const end = Date.now() + duration;
            (function frame() {
                confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
                confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
            konamiIndex = 0; // Сбрасываем для повторного ввода
        }
    } else {
        konamiIndex = 0; // Неверная клавиша, сброс
    }
});


// --- Инициализация при загрузке страницы ---
fetchDataAndUpdateDisplay();
setInterval(updateTimerDisplay, 1000);
