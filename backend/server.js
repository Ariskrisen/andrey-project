const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ЯВНОЕ ПОДКЛЮЧЕНИЕ MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: '1mb' })); // Убеждаемся, что JSON парсится правильно
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// --- ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB подключена успешно!"))
    .catch(err => console.error("Ошибка подключения к MongoDB:", err));

// --- МОДЕЛЬ ДАННЫХ ---
const TimerSchema = new mongoose.Schema({
    identifier: { type: String, default: 'andrey_timer', unique: true },
    count: { type: Number, default: 0 },
    lastResetTime: { type: Date, default: Date.now }
});
const Timer = mongoose.model('Timer', TimerSchema);

// --- МАРШРУТЫ API ---

// Получение данных
app.get('/api/data', async (req, res) => {
    try {
        let timerData = await Timer.findOne({ identifier: 'andrey_timer' });
        if (!timerData) {
            timerData = new Timer();
            await timerData.save();
        }
        res.json(timerData);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера при получении данных' });
    }
});

// Сброс таймера (увеличение счетчика)
app.post('/api/reset', async (req, res) => {
    try {
        const updatedTimer = await Timer.findOneAndUpdate(
            { identifier: 'andrey_timer' },
            { $inc: { count: 1 }, lastResetTime: Date.now() },
            { new: true, upsert: true }
        );
        res.json(updatedTimer);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера при сбросе' });
    }
});

// Полный сброс
app.post('/api/full-reset', async (req, res) => {
    try {
        const resetTimer = await Timer.findOneAndUpdate(
            { identifier: 'andrey_timer' },
            { count: 0, lastResetTime: Date.now() },
            { new: true, upsert: true }
        );
        res.json(resetTimer);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера при полном сбросе' });
    }
});

app.post('/api/force-state', async (req, res) => {
    // ЛОГИРУЕМ ТО, ЧТО ПРИШЛО
    console.log("Получен запрос на /api/force-state. Тело запроса:", req.body);

    try {
        const { count, time } = req.body; // ИЗМЕНЕНО: принимаем поле 'time', а не 'lastResetTime'
        
        // ОБНОВЛЕННАЯ, БОЛЕЕ НАДЕЖНАЯ ПРОВЕРКА
        if (typeof count !== 'number' || time === undefined) {
            console.error("Ошибка валидации. count:", count, "time:", time);
            return res.status(400).json({ error: 'Неверный формат данных' });
        }

        const forceUpdatedTimer = await Timer.findOneAndUpdate(
            { identifier: 'andrey_timer' },
            {
                count: count,
                lastResetTime: new Date(time) // Используем 'time'
            },
            { new: true, upsert: true }
        );
        console.log("Состояние успешно отменено:", forceUpdatedTimer);
        res.json(forceUpdatedTimer);
    } catch (error) {
        console.error("Ошибка сервера при принудительном обновлении:", error);
        res.status(500).json({ error: 'Ошибка сервера при принудительном обновлении' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});