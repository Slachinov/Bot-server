const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map(); // ключ - clientId, значение - ws

wss.on('connection', (ws, req) => {
  // При подключении клиент должен отправить сообщение с id, чтобы зарегистрироваться
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'register' && data.clientId) {
        clients.set(data.clientId, ws);
        ws.clientId = data.clientId;
        ws.send(JSON.stringify({ type: 'registered', clientId: data.clientId }));
        return;
      }

      if (data.type === 'message' && data.to && data.content) {
        const dest = clients.get(data.to);
        if (dest && dest.readyState === WebSocket.OPEN) {
          dest.send(JSON.stringify({
            type: 'message',
            from: ws.clientId,
            content: data.content,
          }));
        }
        return;
      }
    } catch (e) {
      console.error('Ошибка разбора сообщения', e);
    }
  });

  ws.on('close', () => {
    if (ws.clientId) clients.delete(ws.clientId);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Сервер запущен');
});
