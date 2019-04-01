const { createLogger, format, transports } = require('winston');
const config = require('./config');

function customFormatter(info) {
  return `${info.timestamp} ${info.level}: ${typeof info.message === 'string' ? info.message : JSON.stringify(info.message)}`;
}

const logger = createLogger({
  level: config.log.level,
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(customFormatter),
  ),
  transports: [
    new transports.File({ filename: config.log.file }),
  ],
});

module.exports = logger;
