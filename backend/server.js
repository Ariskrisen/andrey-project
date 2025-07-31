// Подключаем нужные библиотеки
const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Для разрешения запросов с другого домена

const app = express();
const PORT = process.env.PORT || 3000;
const dataFilePath = './data.json';

app.use(cors()); // Включаем CORS

// Маршрут для получения текущих данных (счетчик и время)
app.get('/api/data', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Could not read data file:", err);
            return res.status(500).json({ error: 'Could not read data file.' });
        }
        res.json(JSON.parse(data));
    });
});

// Маршрут для сброса таймера и увеличения счетчика
app.post('/api/reset', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Could not read data file on reset:", err);
            return res.status(500).json({ error: 'Could not read data file.' });
        }
        
        const stats = JSON.parse(data);
        
        // Увеличиваем счетчик и обновляем время
        stats.count++;
        stats.lastResetTime = Date.now();
        
        // Записываем обновленные данные обратно в файл
        fs.writeFile(dataFilePath, JSON.stringify(stats, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Could not write data file:", writeErr);
                return res.status(500).json({ error: 'Could not write data file.' });
            }
            res.json(stats); // Отправляем обновленные данные обратно на сайт
        });
    });
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
