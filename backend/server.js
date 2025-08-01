const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Для загрузки переменных окружения

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// --- ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB подключена успешно!"))
    .catch(err => console.error("Ошибка подключения к MongoDB:", err));

// --- МОДЕЛЬ ДАННЫХ ---
// Это схема, по которой данные будут храниться в базе
const TimerSchema = new mongoose.Schema({
    // Уникальный идентификатор, чтобы у нас всегда была только одна запись
    identifier: { type: String, default: 'andrey_timer', unique: true }, 
    count: { type: Number, default: 0 },
    lastResetTime: { type: Date, default: Date.now }
});
const Timer = mongoose.model('Timer', TimerSchema);

// --- МАРШРУТЫ API ---

// Получение данных
app.get('/api/data', async (req, res) => {
    try {
        // Ищем нашу единственную запись. Если ее нет, создаем.
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
            { 
                $inc: { count: 1 }, // Увеличиваем count на 1
                lastResetTime: Date.now() 
            },
            { new: true, upsert: true } // new: true - вернуть обновленный документ, upsert: true - создать, если не найден
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


app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});