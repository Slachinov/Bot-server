const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const FILES_DIR = path.join(__dirname, 'files');

// Создаём папку files, если нет
if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR);
}

// Чтение файла
app.get('/read/:filename', (req, res) => {
  const filePath = path.join(FILES_DIR, req.params.filename);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.json({ error: 'Файл не найден или ошибка чтения' });
    res.json({ content: data });
  });
});

// Запись файла
app.post('/write/:filename', (req, res) => {
  const filePath = path.join(FILES_DIR, req.params.filename);
  fs.writeFile(filePath, req.body.content || '', 'utf8', (err) => {
    if (err) return res.json({ error: 'Ошибка записи файла' });
    res.json({ message: 'Файл успешно сохранён' });
  });
});

// Простой тест корневого маршрута
app.get('/', (req, res) => {
  res.send('Привет с сервера на Render!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
