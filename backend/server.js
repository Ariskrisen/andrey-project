const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ВАЖНО: Добавляем middleware для чтения JSON-тел запросов
app.use(cors());
app.use(express.json()); // <--- ЭТА СТРОКА ОЧЕНЬ ВАЖНА

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

// --- НОВЫЙ СЕКРЕТНЫЙ МАРШРУТ ДЛЯ АНТИ-НАКРУТКИ ---
app.post('/api/force-state', async (req, res) => {
    try {
        const { count, lastResetTime } = req.body; // Получаем "правильное" состояние из тела запроса
        
        // Проверяем, что нам прислали корректные данные
        if (typeof count !== 'number' || typeof lastResetTime !== 'number') {
            return res.status(400).json({ error: 'Неверный формат данных' });
        }

        const forceUpdatedTimer = await Timer.findOneAndUpdate(
            { identifier: 'andrey_timer' },
            { 
                count: count, // Устанавливаем счетчик в правильное значение
                lastResetTime: new Date(lastResetTime) // Устанавливаем время в правильное значение
            },
            { new: true, upsert: true }
        );
        res.json(forceUpdatedTimer);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера при принудительном обновлении' });
    }
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});