const mongoose = require('mongoose');

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

(async function init() {
  await mongoose.connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  );
}());

module.exports = mongoose;
