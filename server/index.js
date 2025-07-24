const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;
const WSPORT = 3001;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`HTTP server running at http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ port: WSPORT }, () => {
  console.log(`WebSocket server running at ws://localhost:${WSPORT}`);
});

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    console.log("Forwarding:", message.toString());
    // Broadcast to all
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});
