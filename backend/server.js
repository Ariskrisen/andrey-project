// Подключаем нужные библиотеки
const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Для разрешения запросов с другого домена (с GitHub Pages на Render)

const app = express();
const PORT = process.env.PORT || 3000; // Render сам подставит нужный порт
const dataFilePath = './data.json';

app.use(cors()); // Включаем CORS

// Маршрут для получения текущих данных (счетчик и время)
// Сработает, когда фронтенд попросит данные
app.get('/api/data', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not read data file.' });
        }
        res.json(JSON.parse(data));
    });
});

// Маршрут для сброса таймера и увеличения счетчика
// Сработает, когда пользователь нажмет кнопку
app.post('/api/reset', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not read data file.' });
        }
        
        const stats = JSON.parse(data);
        
        // Увеличиваем счетчик и обновляем время
        stats.count++;
        stats.lastResetTime = Date.now();
        
        // Записываем обновленные данные обратно в файл
        fs.writeFile(dataFilePath, JSON.stringify(stats, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'Could not write data file.' });
            }
            res.json(stats); // Отправляем обновленные данные обратно на сайт
        });
    });
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});```

#### 📄 Файл `package.json`
Этот файл нужен, чтобы Render понял, как запустить наш сервер. В папке `backend` откройте терминал (или командную строку) и выполните две команды:

1.  `npm init -y` (создаст `package.json`)
2.  `npm install express cors` (установит нужные библиотеки)

Ваш `package.json` должен выглядеть примерно так:```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  }
}