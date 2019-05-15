const logger = require('../lib/logger');

function addUnprotectedHandlers(socket) {
  const ip = socket.request.connection.remoteAddress;
  socket.on('testOpen', (data) => {
    logger.info(`Web socket [open]: received testOpen from ${ip}: `, data);
  });
}

module.exports = addUnprotectedHandlers;
