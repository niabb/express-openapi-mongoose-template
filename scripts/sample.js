/**
 * The purpose of the scripts folder is to provide a way to run standalone scripts on the back-end
 * side (i.e. periodically), to call methods at the service level.
 */
require('dotenv').config();

const logger = require('../lib/logger');
const userService = require('../services/user');
require('../lib/mongoose');

(async function run() {
  logger.info('Sample script running.');
  try {
    await userService.createUser('test', 'P4ssword', ['testRole']);
    logger.info('Sample script finished.');
    process.exit(0);
  } catch (error) {
    logger.error('Error while running sample script: ', error);
    process.exit(1);
  }
}());
