const socketIo = require('socket.io');

const app = require('../app');
const logger = require('./logger');
const protectedHandler = require('../ws-handlers/protected');
const unprotectedHandler = require('../ws-handlers/unprotected');


const io = socketIo(app.server);

function broadcast(type, data) {
  io.sockets.emit(type, data);
}

io.of('/protected').on('connect', (socket) => {
  const ip = socket.request.connection.remoteAddress;
  if (socket.request.headers && socket.request.headers.authorization) {
    const parts = socket.request.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const token = parts[1];
      app.bearerAuth({ token }).then((decodedToken) => {
        const socketWithToken = socket;
        socketWithToken.decodedToken = decodedToken;
        logger.info(`Web socket [protected]: connection from user ${decodedToken.username} at ${ip}`);
        protectedHandler(socketWithToken);
      }).catch((err) => {
        logger.error(`Web socket [protected]: connection attempt from ${ip} with invalid token.`);
        logger.error(err);
        socket.disconnect(true);
      });
    } else {
      logger.error(`Web socket [protected]: connection attempt from ${ip} without proper token format.`);
      socket.disconnect(true);
    }
  } else {
    logger.error(`Web socket [protected]: connection attempt from ${ip} without proper header.`);
    socket.disconnect(true);
  }
});

io.of('/open').on('connect', (socket) => {
  const ip = socket.request.connection.remoteAddress;
  logger.info(`Web socket [open]: connection from ${ip}`);
  unprotectedHandler(socket);
});

io.broadcast = broadcast;

module.exports = io;
