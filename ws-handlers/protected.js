const logger = require('../lib/logger');

function addProtectedHandlers(socket) {
  const ip = socket.request.connection.remoteAddress;
  socket.on('testProtected', (data) => {
    logger.info(`Web socket [protected]: received testProtected from user ${socket.decodedToken.username} on ${ip}: `, data);
  });
}

module.exports = addProtectedHandlers;
