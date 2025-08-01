import { CONFIG } from '../config.js';
import { elements } from '../dom.js';
import { showPrankMessage } from '../utils.js';
import { state } from '../state.js';

function triggerRandomAlert() {
    const alerts = ["SYSTEM ALERT: Patience levels critical.", "WARNING: Hope module malfunctioning.", "QUERY: Is Andrey a myth?", "LOADING... Still no sign of Andrey.", "ERROR 404: Andrey not found.", "Initiating Plan B: Keep waiting.", "Checking under the couch... No Andrey.", "Ищем Андрея в тени ожиданий.", "Андрей задерживается на неопределённое время.", "Андрей на паузе. Вернётся, когда захочет.", "Current status: Waiting for Andrey...", "Time since last Andrey sighting: ∞", "MISSION FAILED: No Andrey today.", "Он придёт... Наверное.", "Система скучает по Андрею.", "А может, Андрей — это ты?", "WARNING: Андрей испарился в киберпространстве.", "Пока вы ждёте, послушайте немного тишины.", "Уровень ожидания: Критический.", "Андрей снова вышел за хлебом.", "PINGING ANDREY... No response.", "CALCULATING ETA... Undefined.", "Зачем ждать, если можно ждать Андрея?", "Он обещал быть. Мы всё ещё верим.", "AI THINKS: Андрей прячется.", "System Task: Do not lose hope.", "Где-то там... бродит Андрей.", "Если видели Андрея — позвоните нам.", "Сайт живёт только ради него.", "Андрей задержался на уровне бытия.", "Поиск Андрея по альтернативной временной шкале...", "Андрей offline. Но мы надеемся.", "Rebooting reality... Андрей не загрузился.", "Is this Schrödinger’s Andrey?", "We’ve sent a search party. Again.", "Nothing new. Андрей всё ещё не с нами.", "Andrey has been delayed due to plot twists.", "Status: Пропал между строк.", "The prophecy spoke of his coming...", "Uploading... Андрей всё ещё загружается.", "Космос молчит. Андрей тоже.", "Recompiling patience.exe", "Терпение на пределе. Но мы держимся.", "Hope is a dangerous thing for a site like this.", "Андрей скоро? Спросите у звёзд.", "Last seen: в мечтах.", "Сайт создан, чтобы ждать Андрея. Всё остальное — вторично.", "Не паниковать. Просто Андрей забыл про нас.", "ANDREY DETECTED... False alarm.", "System Update: Still waiting.", "Сбой в линии Андрея. Повторите попытку позже.", "Андрей? Алло? Приём?", "We've checked the matrix. Андрей — вне зоны.", "Please insert Андрей to continue.", "Молитвы отправлены. Ответа нет.", "Chrono-syncing... No Андрей in this timeline.", "Пойду сварю чай. Может, к тому времени придёт.", "Андрей в пути. Скорость: 0.01 км/год.", "It's not a bug, it's Андрей.", "Zero Andrey. Maximum vibe.", "Have you tried turning Андрей off and on again?", "ERROR: Time loop detected. Андрей всё ещё не здесь.", "Это ожидание уже стало искусством.", "Ghost of Андрей haunts this server.", "Loading... Но Андрей не грузится.", "Are you Андрей? Please confirm.", "Андрей, ты где, родной?", "System forecast: Cloudy with a chance of Андрей.", "Андрей так и не зашёл в чат.", "Ждали час... Ждём дальше.", "А может, он в отпуске?", "Each second without Андрей — вечность.", "WARNING: User may develop dependency on Андрей.", "Server uptime: 99.99% — Андрей uptime: 0%", "The longer you wait, the stronger he returns.", "Может, он и не существует? Задумайся.", "This is fine. *всё горит*", "Still loading Андрей... Might take a while.", "Your Андрей is in another castle.", "Have faith. Or at least Wi-Fi.", "Time dilation detected: Андрей is late.", "404 Андрей not in this universe.", "Курс рубля стабильнее, чем приход Андрея.", "Всё спокойно... как перед приходом Андрея.", "Подозрительная тишина. Андрей где-то рядом?", "Запахло кофе... но не Андреем.", "Одинокий сервер в ожидании героя.", "Andrey.exe has stopped responding.", "Скоро будет. Наверное. Возможно. Нет.", "Проверка астрала: Андрей не замечен.", "The prophecy delays.", "Not all heroes wear capes. Некоторые просто опаздывают.", "Meanwhile... в мире без Андрея.", "Свет моргает. Может, это знак?", "Такое чувство, что Андрей был только сном.", "Waiting is temporary. Андрей — вечен.", "Андрей, если ты это читаешь — зайди уже."];
    showPrankMessage(alerts[Math.floor(Math.random() * alerts.length)]);
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
    // Проверяем, что окно ошибки не отображается в данный момент, чтобы звук не играл дважды
    const isErrorVisible = elements.fakeError && getComputedStyle(elements.fakeError).display !== 'none';
    if(elements.xpErrorSound && !isErrorVisible) {
        elements.xpErrorSound.play();
    }
}

export function runPeriodicPranks() {
    if (!state.isTabActive) return; // Не запускаем приколы, если вкладка не активна

    // Проверяем каждую секунду, но срабатываем с определенной вероятностью
    if (state.tick % CONFIG.RANDOM_ALERTS_INTERVAL === 0 && Math.random() < 0.25) {
        triggerRandomAlert();
    }
    if (state.tick % CONFIG.TILT_INTERVAL === 0 && Math.random() < 0.2) {
        triggerTilt();
    }
    if (state.tick % CONFIG.DUCK_INTERVAL === 0 && Math.random() < 0.2) {
        triggerDuck();
    }
    if (state.tick % CONFIG.XP_ERROR_SOUND_INTERVAL === 0 && Math.random() < 0.15) {
        triggerXpErrorSound();
    }
}