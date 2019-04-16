const mongoose = require('mongoose');

const config = require('../config');
const logger = require('./logger');


mongoose.connection.on('open', () => {
  logger.info('DB connection opened.');
});
mongoose.connection.on('error', (err) => {
  logger.error('DB error:', err);
});
mongoose.connection.on('disconnected', (err) => {
  logger.warn('Disconnected from Mongo:', err);
});

module.exports = mongoose.connect(
  config.mongoUri, { useNewUrlParser: true, useFindAndModify: false },
);
