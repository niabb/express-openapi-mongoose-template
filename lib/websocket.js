const ws = require('ws');

const logger = require('./logger');
const app = require('../app');

const wsServer = new ws.Server({ server: app.server });

wsServer.on('connection', (socket, req) => {
  logger.info(`Websocket connection from ${req.connection.remoteAddress}`);
  socket.on('message', (message) => {
    logger.info('received: %s', message);
    socket.send(`Hello, you sent -> ${message}`);
  });
  socket.send('Hi there, I am a WebSocket server');
});


wsServer.broadcast = function broadcast(data) {
  wsServer.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(data);
    }
  });
};


module.exports = wsServer;
