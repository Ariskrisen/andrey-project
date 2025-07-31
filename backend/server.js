// Подключаем нужные библиотеки
const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const dataFilePath = './data.json';

app.use(cors());

// Маршрут для получения данных (остается без изменений)
app.get('/api/data', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not read data file.' });
        }
        res.json(JSON.parse(data));
    });
});

// Маршрут для увеличения счетчика (остается без изменений)
app.post('/api/reset', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) { return res.status(500).json({ error: 'Could not read data file.' }); }
        
        const stats = JSON.parse(data);
        stats.count++;
        stats.lastResetTime = Date.now();
        
        fs.writeFile(dataFilePath, JSON.stringify(stats, null, 2), (writeErr) => {
            if (writeErr) { return res.status(500).json({ error: 'Could not write data file.' }); }
            res.json(stats);
        });
    });
});

// --- НОВЫЙ МАРШРУТ для полного сброса счетчика ---
app.post('/api/full-reset', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) { return res.status(500).json({ error: 'Could not read data file.' }); }

        const stats = JSON.parse(data);
        // Сбрасываем счетчик на 0 и обновляем таймер
        stats.count = 0;
        stats.lastResetTime = Date.now();

        fs.writeFile(dataFilePath, JSON.stringify(stats, null, 2), (writeErr) => {
            if (writeErr) { return res.status(500).json({ error: 'Could not write data file.' }); }
            res.json(stats); // Отправляем обновленные данные
        });
    });
});


// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
