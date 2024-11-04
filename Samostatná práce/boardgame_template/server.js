// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));


// https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender#answer-10099325
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('JMENO_CLIENT_TO_SERVER_EVENTU', (data) => {
    socket.broadcast.emit('JMENO_SERVER_TO_CLIENT_EVENTU', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
