const socketIo = require('socket.io');

const app = require('../app');
const logger = require('./logger');


const io = socketIo(app.server);

function broadcast(type, data) {
  io.sockets.emit(type, data);
}

io.of('/protected').on('connect', (socket) => {
  // TODO: validated the JWT
  const ip = socket.request.connection.remoteAddress;
  logger.info(`Web socket [protected]: connection from ${ip}`);
});

io.of('/open').on('connect', (socket) => {
  const ip = socket.request.connection.remoteAddress;
  logger.info(`Web socket [open]: connection from ${ip}`);
});

io.broadcast = broadcast;

module.exports = io;
