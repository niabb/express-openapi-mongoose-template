const { createLogger, format, transports } = require('winston');

function customFormatter(info) {
  return `${info.timestamp} ${info.level}: ${typeof info.message === 'string' ? info.message : JSON.stringify(info.message)}`;
}

const logger = createLogger({
  level: process.env.LOG_LEVEL,
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(customFormatter),
  ),
  transports: [
    new transports.File({ filename: process.env.LOG_FILE }),
  ],
});

module.exports = logger;
